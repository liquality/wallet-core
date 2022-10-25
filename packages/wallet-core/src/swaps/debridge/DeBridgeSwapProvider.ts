import axios from 'axios';
import BN, { BigNumber } from 'bignumber.js';
import { SwapProvider } from '../SwapProvider';
import { v4 as uuidv4 } from 'uuid';
import { currencyToUnit, getChain, unitToCurrency } from '@liquality/cryptoassets';
import { withLock, withInterval } from '../../store/actions/performNextAction/utils';
import { prettyBalance } from '../../utils/coinFormatter';
import * as ethers from 'ethers';
import ERC20 from '@uniswap/v2-core/build/ERC20.json';
import SignatureVerifier from './abi/SignatureVerifier.json';
import DeBridgeGate from './abi/DeBridgeGate.json';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapQuote,
  SwapStatus,
} from '../types';
import cryptoassets from '../../utils/cryptoassets';
import { Asset, Network, SwapHistoryItem, WalletId } from '../../store/types';
import { isChainEvmCompatible, isERC20 } from '../../utils/asset';
import { ChainNetworks } from '../../utils/networks';
import { Transaction } from '@chainify/types';
import { EvmChainProvider, EvmTypes } from '@chainify/evm';
import { ActionContext } from '../../store';
import { Client } from '@chainify/client';

interface BuildSwapQuote extends SwapQuote {
  fee?: number;
}

interface BuildSwapRequest {
  network: Network;
  walletId: WalletId;
  quote: BuildSwapQuote;
}

interface FullSubmissionInfo {
  claim: {
    transactionHash: string;
  };
  send: {
    isExecuted: boolean;
  };
}

export interface DebridgeSwapHistoryItem extends SwapHistoryItem {
  approveTxHash: string;
  swapTxHash: string;
  approveTx: Transaction<EvmTypes.EthersTransactionResponse>;
  swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
}

export interface DebridgeSwapProviderConfig extends BaseSwapProviderConfig {
  routerAddress: string;
  chains: {
    [key in number]: {
      deBridgeGateAddress: string;
      signatureVerifier: string;
      minBlockConfirmation: number;
    };
  };
}

const zeroAddress = '0x0000000000000000000000000000000000000000';
const slippagePercentage = 3;
const slippageBps = slippagePercentage * 100;
const chainIds = [1, 56, 137, 42161, 43114];

class DeBridgeSwapProvider extends SwapProvider {
  public config: DebridgeSwapProviderConfig;

  constructor(config: DebridgeSwapProviderConfig) {
    super(config);
  }

  public async getQuote({ network, from, to, amount }: QuoteRequest) {
    if (!isChainEvmCompatible(from, network) || !isChainEvmCompatible(to, network) || new BigNumber(amount).lte(0)) {
      return null;
    }

    const chainIdFrom = ChainNetworks[cryptoassets[from].chain][network].chainId as number;
    const chainIdTo = ChainNetworks[cryptoassets[to].chain][network].chainId as number;

    if (chainIdTo === chainIdFrom) {
      return null;
    }

    if (!chainIds.includes(chainIdFrom) || !chainIds.includes(chainIdTo as number)) {
      return null;
    }

    const fromAmountInUnit = new BN(currencyToUnit(cryptoassets[from], new BN(amount)));

    try {
      const fromToken = cryptoassets[from].contractAddress || zeroAddress;
      const toToken = cryptoassets[to].contractAddress || zeroAddress;
      const trade = await axios({
        url: this.config.url + 'estimation',
        method: 'get',
        params: {
          srcChainId: chainIdFrom,
          srcChainTokenIn: fromToken,
          srcChainTokenInAmount: fromAmountInUnit.toFixed(),
          slippage: slippagePercentage,
          dstChainId: chainIdTo,
          dstChainTokenOut: toToken,
        },
      });
      return {
        from,
        to,
        fromAmount: fromAmountInUnit.toFixed(),
        toAmount: BN(trade.data.estimation.dstChainTokenOut.amount).toFixed(),
      };
    } catch (e) {
      return null;
    }
  }

  public async estimateFees({ network, walletId, asset, quote, feePrices }: EstimateFeeRequest) {
    try {
      const nativeAsset = getChain(network, cryptoassets[asset].chain).nativeAsset;
      const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
      let gasLimit = 0;
      if (await this.requiresApproval({ network, walletId, quote })) {
        const approvalTx = await this.buildApprovalTx({
          network,
          walletId,
          quote,
        });
        const rawApprovalTx = {
          from: approvalTx.from,
          to: approvalTx.to,
          data: approvalTx.data,
          value: '0x' + approvalTx.value!.toString(16),
        };

        gasLimit += (await client.chain.getProvider().estimateGas(rawApprovalTx)).toNumber();
      }

      const swapTx = await this.loadSwapTx({ network, walletId, quote });
      if (!swapTx) return null;
      const toChain = cryptoassets[quote.to].chain;
      const fromChain = cryptoassets[quote.from].chain;
      if (toChain === fromChain) return null;
      const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
      const fromAddress = getChain(network, toChain).formatAddress(fromAddressRaw);

      const rawSwapTx = {
        from: fromAddress,
        to: swapTx.to,
        value: '0x' + Number(swapTx.value).toString(16),
        data: swapTx.data,
      };

      try {
        gasLimit += (await client.chain.getProvider().estimateGas(rawSwapTx)).toNumber();
      } catch (e) {
        const estimateGas = await this.getGasLimit(
          network,
          quote.from,
          cryptoassets[quote.from].contractAddress || zeroAddress
        );
        gasLimit += estimateGas;
      }

      let globalFee = BN(0);
      const fromToken = cryptoassets[quote.from].contractAddress || zeroAddress;
      if (fromToken === zeroAddress) {
        const provider = client.chain.getProvider();
        const chainIdFrom = ChainNetworks[cryptoassets[quote.from].chain][network].chainId;
        const debridgeGate = new ethers.Contract(
          this.config.chains[chainIdFrom as number].deBridgeGateAddress,
          DeBridgeGate.abi,
          provider
        );
        globalFee = (await debridgeGate.globalFixedNativeFee()) || 0;
      }

      const fees: EstimateFeeResponse = {};
      for (const feePrice of feePrices) {
        const gasPrice = BN(feePrice).times(1e9);
        const fee = BN(gasLimit).times(1.3).times(gasPrice).plus(globalFee.toString());
        fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset[0].code], fee);
      }

      return fees;
    } catch (e) {
      console.warn(e);
    }
    return null;
  }

  public async newSwap({ network, walletId, quote }: BuildSwapRequest) {
    const approvalRequired = isERC20(quote.from);
    const updates = approvalRequired
      ? await this.approveTokens({ network, walletId, quote })
      : await this.sendSwap({ network, walletId, quote });

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: slippageBps,
      ...updates,
    };
  }

  public async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<DebridgeSwapHistoryItem>
  ) {
    let updates;
    switch (swap.status) {
      case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
        updates = await withInterval(async () => this.waitForApproveConfirmations({ swap, network, walletId }));
        break;
      case 'APPROVE_CONFIRMED':
        updates = await withLock(store, { item: swap, network, walletId, asset: swap.from }, async () =>
          this.sendSwap({ quote: swap, network, walletId })
        );
        break;
      case 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS':
        updates = await withInterval(async () => this.waitForSwapConfirmations({ swap, network, walletId }));
        break;
      case 'WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS':
        updates = await withInterval(async () => this.waitForSwapExecution({ swap, network, walletId }));
        break;
    }

    return updates;
  }

  public async waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<DebridgeSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
      const chainIdFrom = ChainNetworks[cryptoassets[swap.from].chain][network].chainId;
      if (
        chainIdFrom &&
        tx &&
        tx.confirmations &&
        tx.confirmations > this.config.chains[chainIdFrom as number].minBlockConfirmation
      ) {
        const { status } = await client.chain.getProvider().getTransactionReceipt(swap.swapTxHash);
        this.updateBalances(network, walletId, [swap.fromAccountId]);
        if (Number(status) === 1) {
          const provider = client.chain.getProvider();
          const signatureVerifier = new ethers.Contract(
            this.config.chains[chainIdFrom as number].signatureVerifier,
            SignatureVerifier.abi,
            provider
          );
          const minConfirmations = await signatureVerifier.minConfirmations();
          const count = await this.getConfirmationsCount(swap.swapTxHash);
          if (count >= minConfirmations) {
            return {
              endTime: Date.now(),
              status: 'WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS',
            };
          }
        } else {
          return {
            endTime: Date.now(),
            status: 'FAILED',
          };
        }
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  private async getConfirmationsCount(swapTxHash: string): Promise<number> {
    try {
      const submissionId = await this.getSubmissionId(swapTxHash);
      if (submissionId) {
        const result = await axios({
          url: this.config.api + 'SubmissionConfirmations/getForSubmission',
          method: 'get',
          params: {
            submissionId: submissionId,
          },
        });
        if (Array.isArray(result?.data)) {
          return result.data.length;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return 0;
  }

  public async getSupportedPairs() {
    return [];
  }

  public async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0);
  }

  public getClient(network: Network, walletId: string, asset: string, accountId: string) {
    return super.getClient(network, walletId, asset, accountId) as Client<EvmChainProvider>;
  }

  private async buildApprovalTx({ network, walletId, quote }: BuildSwapRequest): Promise<any> {
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const provider = client.chain.getProvider();
    cryptoassets[quote.from].contractAddress;
    const erc20 = new ethers.Contract(cryptoassets[quote.from].contractAddress!, ERC20.abi, provider);

    const inputAmount = ethers.BigNumber.from(BN(quote.fromAmount).toFixed());
    const inputAmountHex = inputAmount.toHexString();
    const encodedData = erc20.interface.encodeFunctionData('approve', [this.config.routerAddress, inputAmountHex]);

    const fromChain = cryptoassets[quote.from].chain;
    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);

    const fromAddress = getChain(network, fromChain).formatAddress(fromAddressRaw);

    return {
      from: fromAddress,
      to: cryptoassets[quote.from].contractAddress,
      value: new BigNumber(0).toFixed(),
      data: encodedData,
      fee: quote.fee,
    };
  }

  private async requiresApproval({ network, walletId, quote }: BuildSwapRequest): Promise<boolean> {
    if (!isERC20(quote.from)) return false;
    const fromChain = cryptoassets[quote.from].chain;
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const provider = client.chain.getProvider();
    const erc20 = new ethers.Contract(cryptoassets[quote.from].contractAddress!, ERC20.abi, provider);
    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);

    const fromAddress = getChain(network, fromChain).formatAddress(fromAddressRaw);
    const allowance = await erc20.allowance(fromAddress, this.config.routerAddress);
    const inputAmount = ethers.BigNumber.from(BN(quote.fromAmount).toFixed());
    return !allowance.gte(inputAmount);
  }

  private async approveTokens({ network, walletId, quote }: BuildSwapRequest) {
    if (!(await this.requiresApproval({ network, walletId, quote }))) {
      return {
        status: 'APPROVE_CONFIRMED',
      };
    }

    const txData = await this.buildApprovalTx({ network, walletId, quote });
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const approveTx = await client.wallet.sendTransaction(txData);

    return {
      status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
      approveTx,
      approveTxHash: approveTx.hash,
    };
  }

  private async loadSwapTx({ network, walletId, quote }: BuildSwapRequest) {
    const toChain = cryptoassets[quote.to].chain;
    const fromChain = cryptoassets[quote.from].chain;
    if (toChain === fromChain) return null;

    const toAddress = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
    const chainIdFrom = ChainNetworks[cryptoassets[quote.from].chain][network].chainId;
    const chainIdTo = ChainNetworks[cryptoassets[quote.to].chain][network].chainId;
    const fromToken = cryptoassets[quote.from].contractAddress || zeroAddress;
    const toToken = cryptoassets[quote.to].contractAddress || zeroAddress;
    try {
      const result = await axios({
        url: this.config.url + 'transaction',
        method: 'get',
        params: {
          srcChainId: chainIdFrom,
          srcChainTokenIn: fromToken,
          srcChainTokenInAmount: quote.fromAmount,
          slippage: slippagePercentage,
          dstChainId: chainIdTo,
          dstChainTokenOut: toToken,
          dstChainTokenOutRecipient: toAddress,
          dstChainFallbackAddress: toAddress,
        },
      });

      if (result?.data?.tx) {
        const estimation = result?.data?.estimation;
        const txInfo = {
          ...result.data.tx,
          amount: estimation?.dstChainTokenOut.amount,
        };
        if (estimation?.srcChainTokenIn && estimation?.srcChainTokenOut) {
          txInfo.preSwap = {
            toAddress: estimation?.srcChainTokenOut.address,
            fromAddress: estimation?.srcChainTokenIn.address,
          };
        }
        return txInfo;
      }
    } catch (e) {
      console.warn(e);
    }
    return null;
  }

  private async sendSwap({ network, walletId, quote }: BuildSwapRequest) {
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const trade = await this.loadSwapTx({ network, walletId, quote });
    if (trade === null) {
      throw new Error(`Couldn't load swap tx`);
    }
    if (
      BN(quote.toAmount)
        .times(1 - slippagePercentage / 100)
        .gt(trade.amount)
    ) {
      throw new Error(
        `Slippage is too high. You expect ${quote.toAmount} but you are going to receive ${trade.amount} ${quote.to}`
      );
    }

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
    try {
      const swapTx = await client.wallet.sendTransaction({
        to: trade.to,
        value: trade.value,
        data: trade.data,
        fee: quote.fee,
      });
      return {
        status: 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS',
        swapTx,
        swapTxHash: swapTx.hash,
      };
    } catch (e) {
      console.warn(e);
      if (e.reason) {
        throw new Error(e.reason);
      }
      throw e;
    }
  }

  private async waitForApproveConfirmations({
    swap,
    network,
    walletId,
  }: NextSwapActionRequest<DebridgeSwapHistoryItem>) {
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

  private async waitForSwapExecution({ swap, network, walletId }: NextSwapActionRequest<DebridgeSwapHistoryItem>) {
    try {
      const submissionInfo = await this.getFullSubmissionInfo(swap.swapTxHash);

      if (submissionInfo?.send?.isExecuted && submissionInfo?.claim) {
        const client = this.getClient(network, walletId, swap.to, swap.toAccountId);
        const tx = await client.chain.getTransactionByHash(submissionInfo?.claim.transactionHash);
        this.updateBalances(network, walletId, [swap.fromAccountId]);
        return {
          receiveTxHash: tx.hash,
          receiveTx: tx,
          endTime: Date.now(),
          status: tx.status,
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  private async getFullSubmissionInfo(swapTxHash: string): Promise<FullSubmissionInfo | null> {
    try {
      const result = await axios({
        url: this.config.api + 'Transactions/GetFullSubmissionInfo',
        method: 'get',
        params: {
          filter: swapTxHash,
          filterType: 1,
        },
      });
      return result?.data || null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  private async getSubmissionId(swapTxHash: string): Promise<string | null> {
    try {
      const result = await axios({
        url: this.config.api + 'Transactions/GetFullSubmissionInfo',
        method: 'get',
        params: {
          filter: swapTxHash,
          filterType: 1,
        },
      });
      return result?.data?.send?.submissionId || null;
    } catch (e) {
      console.warn(e);
      return null;
    }
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

  protected _totalSteps(): number {
    return 4;
  }

  protected _timelineDiagramSteps(): string[] {
    return ['APPROVE', 'INITIATION', 'RECEIVE'];
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_APPROVE_CONFIRMATIONS: {
        step: 0,
        label: 'Approving {from} http',
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
      WAITING_FOR_SEND_SWAP_CONFIRMATIONS: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Engaging deBridge',
          };
        },
      },
      WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS: {
        step: 2,
        label: 'Swapping {to}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Awaiting Execution',
          };
        },
      },
      SUCCESS: {
        step: 3,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: any) {
          return {
            message: `Swap completed, ${prettyBalance(swap.toAmount, swap.to)} ${swap.to} ready to use`,
          };
        },
      },
      FAILED: {
        step: 3,
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

  private async getGasLimit(network: Network, from: Asset, toAddress: string): Promise<number> {
    const chainIdFrom = ChainNetworks[cryptoassets[from].chain][network].chainId;
    try {
      const result = await axios({
        url: this.config.url + 'srcTxOptimisticGasConsumption',
        method: 'get',
        params: {
          srcChainId: chainIdFrom,
          srcChainTokenIn: toAddress,
        },
      });
      return result?.data?.srcTxOptimisticGasConsumption || 0;
    } catch (e) {
      return 0;
    }
  }
}

export { DeBridgeSwapProvider };
