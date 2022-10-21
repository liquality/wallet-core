import { BitcoinBaseWalletProvider, BitcoinEsploraApiProvider, BitcoinTypes } from '@chainify/bitcoin';
import { Client } from '@chainify/client';
import { EvmChainProvider, EvmTypes, EvmWalletProvider } from '@chainify/evm';
import { Transaction } from '@chainify/types';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ChainId, currencyToUnit, getChain, unitToCurrency } from '@liquality/cryptoassets';
import { isTransactionNotFoundError } from '../../utils/isTransactionNotFoundError';
import BN from 'bignumber.js';
import * as ethers from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval } from '../../store/actions/performNextAction/utils';
import { Network, SwapHistoryItem, WalletId } from '../../store/types';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { SwapProvider } from '../SwapProvider';
import {
  BaseSwapProviderConfig,
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapQuote,
  SwapRequest,
  SwapStatus,
} from '../types';
import { BitcoinTransferStatus, BRIDGE_CONTRACT_ABI } from './fastBtcBridgeContract';
import { CUSTOM_ERRORS, createInternalError } from '@liquality/error-parser';

export interface FastBtcWithdrawSwapHistoryItem extends SwapHistoryItem {
  transferId: string;
  swapTxHash: string;
  swapTx: Transaction<EvmTypes.EthersTransactionResponse>;
  receiveTxHash: string;
  receiveTx: Transaction<BitcoinTypes.Transaction>;
}

export interface FastBtcWithdrawSwapProviderConfig extends BaseSwapProviderConfig {
  network: Network;
  routerAddress: string;
}

export interface BuildSwapOptions {
  network: Network;
  walletId: WalletId;
  quote: SwapQuote;
}

class FastBTCWithdrawSwapProvider extends SwapProvider {
  config: FastBtcWithdrawSwapProviderConfig;
  private _provider: JsonRpcProvider;

  constructor(config: FastBtcWithdrawSwapProviderConfig) {
    super(config);
    const rskChain = getChain(this.config.network, ChainId.Rootstock);
    this._provider = new ethers.providers.StaticJsonRpcProvider(
      rskChain.network.rpcUrls[0],
      Number(rskChain.network.chainId)
    );
  }

  getFastBtcBridge(provider: JsonRpcProvider) {
    const fastBtcBridge = new ethers.Contract(this.config.routerAddress, BRIDGE_CONTRACT_ABI, provider);
    return fastBtcBridge;
  }

  async getLimits() {
    const fastBtcBridge = this.getFastBtcBridge(this._provider);
    const minInSatoshi = await fastBtcBridge.minTransferSatoshi();
    const maxInSatosih = await fastBtcBridge.maxTransferSatoshi();
    const min = unitToCurrency(cryptoassets.BTC, minInSatoshi);
    const max = unitToCurrency(cryptoassets.BTC, maxInSatosih);

    return { min, max };
  }

  public getClient(network: Network, walletId: string, asset: string, accountId: string) {
    return super.getClient(network, walletId, asset, accountId) as Client<EvmChainProvider, EvmWalletProvider>;
  }

  public getReceiveClient(network: Network, walletId: string, asset: string, accountId: string) {
    return super.getClient(network, walletId, asset, accountId) as Client<
      BitcoinEsploraApiProvider,
      BitcoinBaseWalletProvider
    >;
  }

  async getSupportedPairs() {
    const { min, max } = await this.getLimits();
    return [
      {
        from: 'RBTC',
        to: 'BTC',
        rate: '0.998',
        min: min.toFixed(),
        max: max.toFixed(),
      },
    ];
  }

  async getQuote(quoteRequest: QuoteRequest) {
    const { from, to, amount } = quoteRequest;
    if (from !== 'RBTC' || to !== 'BTC') {
      return null;
    }

    const { min, max } = await this.getLimits();
    const isQuoteAmountInTheRange = amount.gte(min) && amount.lte(max);
    if (!isQuoteAmountInTheRange) {
      return null;
    }

    const fastBtcBridge = this.getFastBtcBridge(this._provider);
    const fromAmountInSatoshi = new BN(currencyToUnit(cryptoassets.BTC, new BN(amount)));
    const feeSatoshi: ethers.BigNumber = await fastBtcBridge.calculateCurrentFeeSatoshi(
      ethers.BigNumber.from(fromAmountInSatoshi.toFixed())
    );
    const fromAmountInUnit = currencyToUnit(cryptoassets[from], new BN(amount));
    const toAmountInUnit = fromAmountInSatoshi.minus(new BN(feeSatoshi.toString()));

    return {
      // TODO: Why is from amount being set in every quote call? It should be in one place only (getQuotes action)
      fromAmount: fromAmountInUnit.toFixed(),
      toAmount: toAmountInUnit.toFixed(),
    };
  }

  async buildSwapTx({ network, walletId, quote }: BuildSwapOptions) {
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const fastBtcBridge = this.getFastBtcBridge(client.chain.getProvider());
    // Assuming valid bitcoin address
    const fromAddressRaw = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
    const fromAddress = getChain(network, cryptoassets.RBTC.chain).formatAddress(fromAddressRaw);
    const toAddress = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);

    const data = await fastBtcBridge.interface.encodeFunctionData('transferToBtc', [toAddress]);
    const swapTx = {
      from: fromAddress,
      to: fastBtcBridge.address,
      value: ethers.BigNumber.from(quote.fromAmount),
      data,
    };

    return swapTx;
  }

  async sendSwap({ network, walletId, quote }: SwapRequest) {
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const fastBtcBridge = this.getFastBtcBridge(client.chain.getProvider());
    // Assuming valid bitcoin address
    const toAddress = await this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
    const data = await fastBtcBridge.interface.encodeFunctionData('transferToBtc', [toAddress]);
    const swapTx = await client.wallet.sendTransaction({
      to: fastBtcBridge.address,
      value: new BN(quote.fromAmount),
      data,
    });

    return {
      status: 'WAITING_FOR_SEND_CONFIRMATIONS',
      swapTx,
      swapTxHash: swapTx.hash,
    };
  }

  async newSwap({ network, walletId, quote }: SwapRequest) {
    const updates = await this.sendSwap({ network, walletId, quote });

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: 50,
      ...updates,
    };
  }

  async estimateFees({ network, walletId, quote, feePrices }: EstimateFeeRequest) {
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const swapTx = await this.buildSwapTx({ network, walletId, quote });
    const gasLimit = await client.chain.getProvider().estimateGas(swapTx);
    const fees: EstimateFeeResponse = {};
    for (const feePrice of feePrices) {
      const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
      const fee = new BN(gasLimit.toString()).times(1.1).times(gasPrice);
      fees[feePrice] = unitToCurrency(cryptoassets.RBTC, fee);
    }

    return fees;
  }

  /**
   * TODO: this is called very often from clients, so making a network call each time will be very intensive
   * The same case for other providers
   */
  async getMin() {
    const { min } = await this.getLimits();
    return min;
  }

  async waitForSendConfirmations({ swap, network, walletId }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        if (!tx.logs) {
          throw createInternalError(CUSTOM_ERRORS.NotFound.FastBTC.Logs);
        }
        const receipt = await client.chain.getProvider().getTransactionReceipt(swap.swapTxHash);
        const fastBtcBridge = this.getFastBtcBridge(client.chain.getProvider());
        const events = receipt.logs.map((log) => fastBtcBridge.interface.parseLog(log));
        const event = events.find((event) => event.name === 'NewBitcoinTransfer');
        if (!event) {
          throw createInternalError(CUSTOM_ERRORS.NotFound.FastBTC.NewBitcoinTransferEvent);
        }
        const transferId: string = event.args.transferId;

        return {
          transferId,
          status: 'WAITING_FOR_RECEIVE',
        };
      }
    } catch (e) {
      if (isTransactionNotFoundError(e)) console.warn(e);
      else throw e;
    }
  }

  async waitForReceive({ swap, network, walletId }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>) {
    try {
      const fastBtcBridge = this.getFastBtcBridge(this._provider);
      const statusUpdateFilter = fastBtcBridge.filters.BitcoinTransferStatusUpdated(swap.transferId);
      const stausUpdateEvents = await fastBtcBridge.queryFilter(statusUpdateFilter, swap.swapTx.blockNumber);
      if (stausUpdateEvents.length > 0) {
        for (const statusUpdateEvent of stausUpdateEvents) {
          if (statusUpdateEvent.args!.newStatus === BitcoinTransferStatus.SENDING) {
            const transferBlockNumber = statusUpdateEvent.blockNumber;
            const transferFilter = fastBtcBridge.filters.BitcoinTransferBatchSending();
            const transferEvents = await fastBtcBridge.queryFilter(
              transferFilter,
              transferBlockNumber,
              transferBlockNumber
            );
            const transferEvent = transferEvents[0];
            const receiveTxHash = transferEvent.args!.bitcoinTxHash.replace('0x', '');
            const receiveClient = this.getReceiveClient(network, walletId, 'BTC', swap.toAccountId);
            const receiveTx = await receiveClient.chain.getTransactionByHash(receiveTxHash);
            if (receiveTx && receiveTx.confirmations && receiveTx.confirmations > 0) {
              return {
                receiveTxHash,
                receiveTx,
                endTime: Date.now(),
                status: 'SUCCESS',
              };
            }
            return {
              receiveTxHash,
              receiveTx,
              status: 'WAITING_FOR_RECEIVE_CONFIRMATIONS',
            };
          }
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  async waitForReceiveConfirmations({
    swap,
    network,
    walletId,
  }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>) {
    const client = this.getReceiveClient(network, walletId, 'BTC', swap.toAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.receiveTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        return {
          receiveTx: tx,
          endTime: Date.now(),
          status: 'SUCCESS',
        };
      }
    } catch (e) {
      if (isTransactionNotFoundError(e)) console.warn(e);
      else throw e;
    }
  }

  async performNextSwapAction(
    _store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<FastBtcWithdrawSwapHistoryItem>
  ) {
    switch (swap.status) {
      case 'WAITING_FOR_SEND_CONFIRMATIONS':
        return withInterval(async () => this.waitForSendConfirmations({ swap, network, walletId }));
      case 'WAITING_FOR_RECEIVE':
        return withInterval(async () => this.waitForReceive({ swap, network, walletId }));
      case 'WAITING_FOR_RECEIVE_CONFIRMATIONS':
        return withInterval(async () => this.waitForReceiveConfirmations({ swap, network, walletId }));
    }
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_SEND_CONFIRMATIONS: {
        step: 0,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Swap initiated',
          };
        },
      },
      WAITING_FOR_RECEIVE: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
      },
      WAITING_FOR_RECEIVE_CONFIRMATIONS: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
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
    return ['SWAP', 'RECEIVE'];
  }

  protected _totalSteps(): number {
    return 3;
  }
}

export { FastBTCWithdrawSwapProvider };
