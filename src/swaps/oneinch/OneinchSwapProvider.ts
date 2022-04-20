import { ChainId, chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import { ethereum, Transaction } from '@liquality/types';
import ERC20 from '@uniswap/v2-core/build/ERC20.json';
import axios from 'axios';
import BN, { BigNumber } from 'bignumber.js';
import * as ethers from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import buildConfig from '../../build.config';
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { Asset, HistoryItem, SwapHistoryItem } from '../../store/types';
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
const chainToRpcProviders: { [chainId: number]: string } = {
  1: `https://mainnet.infura.io/v3/${buildConfig.infuraApiKey}`,
  56: 'https://bsc-dataseed.binance.org',
  137: 'https://polygon-rpc.com',
  43114: 'https://api.avax.network/ext/bc/C/rpc',
};

export interface OneinchSwapHistoryItem extends SwapHistoryItem {
  approveTxHash: string;
  swapTxHash: string;
  approveTx: Transaction<ethereum.Transaction>;
  swapTx: Transaction<ethereum.Transaction>;
  slippagePercentage: number;
}

export interface OneinchSwapProviderConfig extends BaseSwapProviderConfig {
  agent: string;
  routerAddress: string;
  referrerAddress: { [key in ChainId]?: string };
  referrerFee: number;
}

class OneinchSwapProvider extends SwapProvider {
  config: OneinchSwapProviderConfig;

  async getSupportedPairs() {
    return [];
  }

  async _getQuote(chainIdFrom: number, from: Asset, to: Asset, amount: number) {
    const fromToken = cryptoassets[from].contractAddress;
    const toToken = cryptoassets[to].contractAddress;
    const referrerAddress = this.config.referrerAddress?.[cryptoassets[from].chain];
    const fee = referrerAddress && this.config.referrerFee;

    return await axios({
      url: this.config.agent + `/${chainIdFrom}/quote`,
      method: 'get',
      params: {
        fromTokenAddress: fromToken || NATIVE_ASSET_ADDRESS,
        toTokenAddress: toToken || NATIVE_ASSET_ADDRESS,
        amount,
        fee,
      },
    });
  }

  async getQuote({ network, from, to, amount }: QuoteRequest) {
    if (!isEthereumChain(from) || !isEthereumChain(to) || new BigNumber(amount).lte(0)) return null;
    const fromAmountInUnit = new BN(currencyToUnit(cryptoassets[from], new BN(amount)));
    // @ts-ignore TODO: Fix chain networks
    const chainIdFrom: number = ChainNetworks[cryptoassets[from].chain][network].chainId;
    // @ts-ignore TODO: Fix chain networks
    const chainIdTo: number = ChainNetworks[cryptoassets[to].chain][network].chainId;
    if (chainIdFrom !== chainIdTo || !chainToRpcProviders[chainIdFrom]) return null;

    const trade = await this._getQuote(chainIdFrom, from, to, fromAmountInUnit.toNumber());
    const toAmountInUnit = new BN(trade.data.toTokenAmount);
    return {
      from,
      to,
      fromAmount: fromAmountInUnit.toFixed(),
      toAmount: toAmountInUnit.toFixed(),
    };
  }

  async approveTokens({ network, walletId, quote }: SwapRequest) {
    const fromChain = cryptoassets[quote.from].chain;
    const toChain = cryptoassets[quote.to].chain;
    // @ts-ignore TODO: Fix chain networks
    const chainId = ChainNetworks[fromChain][network].chainId;
    if (fromChain !== toChain || !chainToRpcProviders[chainId]) return null;

    const api = new ethers.providers.StaticJsonRpcProvider(chainToRpcProviders[chainId]);
    const erc20 = new ethers.Contract(cryptoassets[quote.from].contractAddress!, ERC20.abi, api);
    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.toAccountId);
    const fromAddress = chains[fromChain].formatAddress(fromAddressRaw, network);
    const allowance = await erc20.allowance(fromAddress, this.config.routerAddress);
    const inputAmount = ethers.BigNumber.from(new BN(quote.fromAmount).toFixed());
    if (allowance.gte(inputAmount)) {
      return {
        status: 'APPROVE_CONFIRMED',
      };
    }

    const callData = await axios({
      url: this.config.agent + `/${chainId}/approve/transaction`,
      method: 'get',
      params: {
        tokenAddress: cryptoassets[quote.from].contractAddress,
        amount: inputAmount.toString(),
      },
    });

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const approveTx = await client.chain.sendTransaction({
      to: callData.data?.to,
      value: callData.data?.value,
      data: callData.data?.data,
      fee: quote.fee,
    });

    return {
      status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
      approveTx,
      approveTxHash: approveTx.hash,
    };
  }

  async sendSwap({ network, walletId, quote }: SwapRequest<OneinchSwapHistoryItem>) {
    const toChain = cryptoassets[quote.to].chain;
    const fromChain = cryptoassets[quote.from].chain;
    // @ts-ignore TODO: Fix chain networks
    const chainId = ChainNetworks[toChain][network].chainId;
    if (toChain !== fromChain || !chainToRpcProviders[chainId])
      throw new Error(`Route ${fromChain} - ${toChain} not supported`);

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
    const fromAddress = chains[toChain].formatAddress(fromAddressRaw, network);

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

    const trade = await axios({
      url: this.config.agent + `/${chainId}/swap`,
      method: 'get',
      params: swapParams,
    });

    if (new BN(quote.toAmount).times(1 - swapParams.slippage / 100).gt(trade.data.toTokenAmount)) {
      throw new Error(
        `Slippage is too high. You expect ${quote.toAmount} but you are going to receive ${trade.data.toTokenAmount} ${quote.to}`
      );
    }

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
    const swapTx = await client.chain.sendTransaction({
      to: trade.data.tx?.to,
      value: trade.data.tx?.value,
      data: trade.data.tx?.data,
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

  async estimateFees({ network, txType, quote, feePrices }: EstimateFeeRequest) {
    const chain = cryptoassets[quote.from].chain;

    // @ts-ignore TODO: Fix chain networks
    const chainId = ChainNetworks[chain][network].chainId;
    const nativeAsset = chains[chain].nativeAsset;

    if (txType in this._txTypes()) {
      const fees: EstimateFeeResponse = {};
      const tradeData = await this._getQuote(chainId, quote.from, quote.to, new BigNumber(quote.fromAmount).toNumber());
      for (const feePrice of feePrices) {
        const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
        const fee = new BN(tradeData.data?.estimatedGas).times(1.5).times(gasPrice);
        fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset], fee);
      }
      return fees;
    }

    return null;
  }

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
        const { status } = await client.getMethod('getTransactionReceipt')(swap.swapTxHash);
        this.updateBalances(network, walletId, [swap.from]);
        return {
          endTime: Date.now(),
          status: Number(status) === 1 ? 'SUCCESS' : 'FAILED',
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
    let updates: Partial<HistoryItem> = {};

    switch (swap.status) {
      case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
        updates = await withInterval(async () => this.waitForApproveConfirmations({ swap, network, walletId }));
        break;
      case 'APPROVE_CONFIRMED':
        updates = await withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          this.sendSwap({ quote: swap, network, walletId })
        );
        break;
      case 'WAITING_FOR_SWAP_CONFIRMATIONS':
        updates = await withInterval(async () => this.waitForSwapConfirmations({ swap, network, walletId }));
        break;
    }

    return updates as SwapHistoryItem;
  }

  protected _txTypes() {
    return {
      SWAP: 'SWAP',
    };
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
