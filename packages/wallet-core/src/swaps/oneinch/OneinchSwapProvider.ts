import { Client, HttpClient } from '@chainify/client';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { Transaction, TxStatus } from '@chainify/types';
import { ChainId, chains, currencyToUnit, isMultiLayeredChain, unitToCurrency } from '@liquality/cryptoassets';
import ERC20 from '@uniswap/v2-core/build/ERC20.json';
import BN, { BigNumber } from 'bignumber.js';
import * as ethers from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { Asset, Network, SwapHistoryItem } from '../../store/types';
import { isERC20, isEthereumChain } from '../../utils/asset';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { ChainNetworks } from '../../utils/networks';
import { SwapProvider } from '../SwapProvider';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapRequest,
  SwapStatus,
} from '../types';

const NATIVE_ASSET_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const SLIPPAGE_PERCENTAGE = 0.5;

// TODO: this should not be defined here, instead we need a "supportedChains" interface
const supportedChains: { [chainId: number]: boolean } = {
  1: true,
  10: true,
  56: true,
  137: true,
  43114: true,
  42161: true,
};

// TODO: this should not be defined here, but rather than as a global configuration for each chain
// No swap provider should have such kind of specific configuration
const chainToGasMultiplier: { [chainId: number]: number } = {
  1: 1.5,
  10: 1.5,
  56: 1.5,
  137: 1.5,
  43114: 1.5,
  42161: 10,
};

export interface OneinchSwapHistoryItem extends SwapHistoryItem {
  approveTxHash: string;
  swapTxHash: string;
  approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
  swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
  slippagePercentage: number;
}

export interface OneinchSwapProviderConfig extends BaseSwapProviderConfig {
  agent: string;
  routerAddress: string;
  referrerAddress: { [key in ChainId]?: string };
  referrerFee: number;
}

// approve: ~54_000 * 120%
// send: >100_000
const optimismL1GasLimits = {
  approve: 6500,
  send: 100000,
};

class OneinchSwapProvider extends SwapProvider {
  public config: OneinchSwapProviderConfig;
  private _httpClient: HttpClient;

  constructor(config: OneinchSwapProviderConfig) {
    super(config);
    this._httpClient = new HttpClient({ baseURL: this.config.agent });
  }

  async getSupportedPairs() {
    return [];
  }

  public getClient(network: Network, walletId: string, asset: string, accountId: string) {
    return super.getClient(network, walletId, asset, accountId) as Client<EvmChainProvider>;
  }

  async getQuote({ network, from, to, amount }: QuoteRequest) {
    if (!isEthereumChain(from) || !isEthereumChain(to) || new BigNumber(amount).lte(0)) return null;
    const fromAmountInUnit = new BN(currencyToUnit(cryptoassets[from], new BN(amount)));
    // @ts-ignore TODO: Fix chain networks
    const chainIdFrom: number = ChainNetworks[cryptoassets[from].chain][network].chainId;
    // @ts-ignore TODO: Fix chain networks
    const chainIdTo: number = ChainNetworks[cryptoassets[to].chain][network].chainId;
    if (chainIdFrom !== chainIdTo || !supportedChains[chainIdFrom]) {
      return null;
    }

    const trade = await this._getQuote(chainIdFrom, from, to, fromAmountInUnit.toNumber());

    const toAmountInUnit = new BN(trade?.toTokenAmount);
    return {
      fromAmount: fromAmountInUnit.toFixed(),
      toAmount: toAmountInUnit.toFixed(),
    };
  }

  async approveTokens({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>) {
    const approvalData = await this._buildApproval({ network, walletId, quote });
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

    const approveTx = await client.wallet.sendTransaction({
      to: approvalData?.to,
      value: approvalData?.value,
      data: approvalData?.data,
      fee: quote.fee,
    });

    return {
      status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
      approveTx,
      approveTxHash: approveTx.hash,
    };
  }

  async sendSwap({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>) {
    const swapData = await this._buildSwap({ network, walletId, quote });
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

    const swapTx = await client.wallet.sendTransaction({
      to: swapData?.tx?.to,
      value: swapData?.tx?.value,
      data: swapData?.tx?.data,
      fee: quote.fee,
    });
    return {
      status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
      swapTx,
      swapTxHash: swapTx.hash,
    };
  }

  async newSwap({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>) {
    const approvalRequired = isERC20(quote.from);
    const updates = approvalRequired
      ? await this.approveTokens({ network, walletId, quote })
      : await this.sendSwap({ network, walletId, quote });

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: 50,
      ...updates,
    };
  }

  async estimateFees({
    network,
    txType,
    quote,
    feePrices,
    feePricesL1,
  }: EstimateFeeRequest<string, OneinchSwapHistoryItem>) {
    const chain = cryptoassets[quote.from].chain;

    // @ts-ignore TODO: Fix chain networks
    const chainId: number = ChainNetworks[chain][network].chainId;
    const nativeAsset = chains[chain].nativeAsset;

    if (txType in this._txTypes()) {
      const fees: EstimateFeeResponse = {};
      const tradeData = await this._getQuote(chainId, quote.from, quote.to, new BigNumber(quote.fromAmount).toNumber());

      const isMultiLayered = feePricesL1 && isMultiLayeredChain(chain);
      const l1GasLimit = isMultiLayered
        ? isERC20(quote.from)
          ? new BN(optimismL1GasLimits.approve + optimismL1GasLimits.send)
          : new BN(optimismL1GasLimits.send)
        : new BN(0);
      const multiplier = chainToGasMultiplier[chainId] || 1.5;

      feePrices.forEach((feePrice, index) => {
        let fee = new BN(0);

        if (isMultiLayered) {
          const gasPriceL1 = new BN((feePricesL1 as number[])[index]).times(1e9);
          // fee += l1_gas_estimation * multiplier * l1_gas_price
          fee = fee.plus(new BN(l1GasLimit).times(multiplier).times(gasPriceL1));
        }

        const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
        // fee += l2_gas_estimation * muliplier * l2_gas_price
        fee = fee.plus(new BN(tradeData?.estimatedGas).times(multiplier).times(gasPrice));

        fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset], fee);
      });

      return fees;
    }

    return null;
  }

  async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0);
  }

  /*
   * PRIVATE HELPER METHODS
   */
  private async _getQuote(chainIdFrom: number, from: Asset, to: Asset, amount: number) {
    const fromToken = cryptoassets[from].contractAddress;
    const toToken = cryptoassets[to].contractAddress;
    const referrerAddress = this.config.referrerAddress?.[cryptoassets[from].chain];
    const fee = referrerAddress && this.config.referrerFee;

    return await this._httpClient.nodeGet(`/${chainIdFrom}/quote`, {
      fromTokenAddress: fromToken || NATIVE_ASSET_ADDRESS,
      toTokenAddress: toToken || NATIVE_ASSET_ADDRESS,
      amount,
      fee,
    });
  }

  private async _buildApproval({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>) {
    const fromChain = cryptoassets[quote.from].chain;
    const toChain = cryptoassets[quote.to].chain;
    // @ts-ignore TODO: Fix chain networks
    const chainId = ChainNetworks[fromChain][network].chainId;
    if (fromChain !== toChain || !supportedChains[Number(chainId)]) {
      return null;
    }

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const provider = client.chain.getProvider();

    const erc20 = new ethers.Contract(cryptoassets[quote.from].contractAddress!, ERC20.abi, provider);
    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
    const fromAddress = chains[fromChain].formatAddress(fromAddressRaw);
    const allowance = await erc20.allowance(fromAddress, this.config.routerAddress);
    const inputAmount = ethers.BigNumber.from(new BN(quote.fromAmount).toFixed());
    if (allowance.gte(inputAmount)) {
      return {
        status: 'APPROVE_CONFIRMED',
      };
    }

    const callData = await this._httpClient.nodeGet(`/${chainId}/approve/transaction`, {
      tokenAddress: cryptoassets[quote.from].contractAddress,
      amount: inputAmount.toString(),
    });

    return callData;
  }

  private async _buildSwap({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>) {
    const toChain = cryptoassets[quote.to].chain;
    const fromChain = cryptoassets[quote.from].chain;
    // @ts-ignore TODO: Fix chain networks
    const chainId = ChainNetworks[toChain][network].chainId;
    if (toChain !== fromChain || !supportedChains[Number(chainId)]) {
      throw new Error(`Route ${fromChain} - ${toChain} not supported`);
    }

    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
    const fromAddress = chains[toChain].formatAddress(fromAddressRaw);

    // TODO: type
    const swapParams: any = {
      fromTokenAddress: cryptoassets[quote.from].contractAddress || NATIVE_ASSET_ADDRESS,
      toTokenAddress: cryptoassets[quote.to].contractAddress || NATIVE_ASSET_ADDRESS,
      amount: quote.fromAmount,
      fromAddress: fromAddress,
      slippage: quote.slippagePercentage ? quote.slippagePercentage : SLIPPAGE_PERCENTAGE,
    };

    const referrerAddress = this.config.referrerAddress?.[cryptoassets[quote.from].chain];
    if (referrerAddress) {
      swapParams.referrerAddress = referrerAddress;
      swapParams.fee = this.config.referrerFee;
    }

    const swap = await this._httpClient.nodeGet(`/${chainId}/swap`, swapParams);

    if (new BN(quote.toAmount).times(1 - swapParams.slippage / 100).gt(swap?.toTokenAmount)) {
      throw new Error(
        `Slippage is too high. You expect ${quote.toAmount} but you are going to receive ${swap?.toTokenAmount} ${quote.to}`
      );
    }

    return swap;
  }

  /*
   * STATE TRANSITIONS
   */
  async waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<OneinchSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.approveTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        return {
          endTime: Date.now(),
          status: 'APPROVE_CONFIRMED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  async waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<OneinchSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        // Check transaction status - it may fail due to slippage
        const { status } = tx;
        this.updateBalances(network, walletId, [swap.fromAccountId]);
        return {
          endTime: Date.now(),
          status: status === TxStatus.Success ? 'SUCCESS' : 'FAILED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<OneinchSwapHistoryItem>
  ) {
    switch (swap.status) {
      case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
        return withInterval(async () => this.waitForApproveConfirmations({ swap, network, walletId }));
      case 'APPROVE_CONFIRMED':
        return withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          this.sendSwap({ quote: swap, network, walletId })
        );
      case 'WAITING_FOR_SWAP_CONFIRMATIONS':
        return withInterval(async () => this.waitForSwapConfirmations({ swap, network, walletId }));
    }
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_APPROVE_CONFIRMATIONS: {
        step: 0,
        label: 'Approving {from}',
        filterStatus: 'PENDING',
        notification(swap: any) {
          return {
            message: `Approving ${swap.from}`,
          };
        },
      },
      APPROVE_CONFIRMED: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
      },
      WAITING_FOR_SWAP_CONFIRMATIONS: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Engaging oneinch',
          };
        },
      },
      SUCCESS: {
        step: 2,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: any) {
          return {
            message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
          };
        },
      },
      FAILED: {
        step: 2,
        label: 'Swap Failed',
        filterStatus: 'REFUNDED',
        notification() {
          return {
            message: 'Swap failed',
          };
        },
      },
    };
  }

  protected _txTypes() {
    return {
      SWAP: 'SWAP',
    };
  }

  protected _fromTxType(): string | null {
    return this._txTypes().SWAP;
  }

  protected _toTxType(): string | null {
    return null;
  }

  protected _timelineDiagramSteps(): string[] {
    return ['APPROVE', 'SWAP'];
  }

  protected _totalSteps(): number {
    return 3;
  }
}

export { OneinchSwapProvider };
