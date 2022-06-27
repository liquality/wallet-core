import { EIP1559Fee } from '@chainify/types';
import { Chain, Hop, HopBridge, TToken } from '@hop-protocol/sdk';
import { Asset, ChainId, chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { ethers, Wallet } from 'ethers';
import { createClient } from 'urql';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';
import { Network, SwapHistoryItem } from '../../store/types';
import { isERC20 } from '../../utils/asset';
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
import { getDestinationTxGQL, getTransferIdByTxHash } from './queries';

export interface HopSwapProviderConfig extends BaseSwapProviderConfig {
  graphqlBaseURL: string;
}

export interface HopSwapQuote extends SwapQuote {
  hopChainFrom: Chain;
}

export enum HopTxTypes {
  SWAP = 'SWAP',
}

export interface HopSwapHistoryItem extends SwapHistoryItem {
  hopAsset: TToken;
  hopChainFrom: Chain;
  hopChainTo: Chain;
  approveTxHash: string;
  fromFundHash: string;
}

class HopSwapProvider extends SwapProvider {
  config: HopSwapProviderConfig;
  graphqlURLs: { [key: string]: string };

  constructor(config: HopSwapProviderConfig) {
    super(config);
    this.graphqlURLs = {
      url: this.config.graphqlBaseURL,
      ethereum: 'hop-mainnet',
      xdai: 'hop-xdai',
      arbitrum: 'hop-arbitrum',
      polygon: 'hop-polygon',
      optimism: 'hop-optimism',
    };
  }
  /**
   * Get the supported pairs of this provider for this network
   * @param {{ network }} network
   */
  // eslint-disable-next-line no-unused-vars
  async getSupportedPairs() {
    return [];
  }

  gasLimit(networkName: string) {
    const networkToGasLimit: { [key: string]: { [key: string]: number } } = {
      arbitrum: {
        send: 900000,
        approve: 1000000,
      },
      polygon: {
        send: 300000,
        approve: 300000,
      },
      ethereum: {
        send: 300000,
        approve: 300000,
      },
    };
    return networkToGasLimit[networkName];
  }

  getChain(chainName: string) {
    const slugToChain: { [key: string]: Chain } = {
      [Hop.Chain.Ethereum.slug]: Hop.Chain.Ethereum,
      [Hop.Chain.Arbitrum.slug]: Hop.Chain.Arbitrum,
      [Hop.Chain.Gnosis.slug]: Hop.Chain.Gnosis,
      [Hop.Chain.Optimism.slug]: Hop.Chain.Optimism,
      [Hop.Chain.Polygon.slug]: Hop.Chain.Polygon,
    };
    return slugToChain[chainName];
  }

  _getHop(network: Network, signer = undefined) {
    return new Hop(network === 'mainnet' ? 'mainnet' : 'kovan', signer);
  }

  _getAllTokens(hop: Hop) {
    const bridge = hop.bridge('ETH');
    const token: Record<string, any> = bridge.getCanonicalToken(Chain.Ethereum);
    return token.addresses;
  }

  _getClient(network: Network, walletId: string, from: string, fromAccountId: string) {
    return this.getClient(network, walletId, from, fromAccountId);
  }

  async _getSigner(
    network: Network,
    walletId: string,
    from: string,
    fromAccountId: string,
    provider: ethers.providers.Provider
  ) {
    const client = this._getClient(network, walletId, from, fromAccountId);
    const privKey = await client.wallet.exportPrivateKey();
    return new Wallet(privKey, provider);
  }

  async _getBridgeWithSigner(
    hopAsset: TToken,
    hopChainFrom: Chain,
    network: Network,
    walletId: string,
    from: string,
    fromAccountId: string
  ) {
    try {
      const chainFrom = this.getChain(hopChainFrom.slug);
      const client = this._getClient(network, walletId, from, fromAccountId);
      const privKey = await client.wallet.exportPrivateKey();
      const hop = this._getHop(network);
      const signer = new Wallet(privKey, hop.getChainProvider(chainFrom));
      const bridge = hop.connect(signer).bridge(hopAsset);
      return bridge;
    } catch (err) {
      console.warn('Hop network or Hop assets is invalid');
      throw err;
    }
  }

  _findAsset(asset: Asset, chain: string, tokens: Record<string, any>, tokenName: string) {
    if (asset.type === 'native') {
      if (asset.code === tokenName || asset.matchingAsset === tokenName) {
        return tokenName;
      }
    } else {
      if (
        asset.contractAddress &&
        tokens[chain] &&
        (tokens[chain].l1CanonicalToken?.toLowerCase() === asset.contractAddress.toLowerCase() ||
          tokens[chain].l2CanonicalToken?.toLowerCase() === asset.contractAddress.toLowerCase())
      ) {
        return tokenName;
      }
    }
  }

  _getSendInfo(assetFrom: Asset, assetTo: Asset, hop: Hop) {
    if (!assetFrom || !assetTo) return null;
    const _chainFrom = this.getChain(assetFrom.chain);
    const _chainTo = this.getChain(assetTo.chain);
    if (!_chainFrom || !_chainTo) return null;
    const availableTokens = this._getAllTokens(hop);
    let _from, _to;
    for (const token in availableTokens) {
      if (!_from) _from = this._findAsset(assetFrom, _chainFrom.slug, availableTokens[token], token);
      if (!_to) _to = this._findAsset(assetTo, _chainTo.slug, availableTokens[token], token);
    }
    if (!_from || !_to || _from !== _to) return null;
    const supportedAssetsFrom = hop.getSupportedAssetsForChain(_chainFrom.slug);
    const supportedAssetsTo = hop.getSupportedAssetsForChain(_chainTo.slug);
    if (!supportedAssetsFrom[_from] || !supportedAssetsTo[_to]) return null;
    return { bridgeAsset: _from, chainFrom: _chainFrom, chainTo: _chainTo };
  }

  // eslint-disable-next-line no-unused-vars
  public async getQuote({ network, from, to, amount }: QuoteRequest) {
    if (amount <= new BN(0)) return null;
    const assetFrom = cryptoassets[from];
    const assetTo = cryptoassets[to];
    const fromAmountInUnit = currencyToUnit(cryptoassets[from], new BN(amount));
    const hop = this._getHop(network);
    const info = this._getSendInfo(assetFrom, assetTo, hop);
    if (!info) return null;
    const { bridgeAsset, chainFrom, chainTo } = info;
    const bridge = hop.bridge(bridgeAsset);
    const sendData = await bridge.getSendData(fromAmountInUnit.toString(), chainFrom, chainTo);
    if (!sendData) return null;
    return {
      from,
      to,
      fromAmount: fromAmountInUnit.toFixed(),
      toAmount: new BN(sendData.amountOut.toString()).toFixed(),
      hopAsset: bridgeAsset,
      hopChainFrom: chainFrom,
      hopChainTo: chainTo,
      receiveFee: new BN(sendData.adjustedBonderFee.toString())
        .plus(new BN(sendData.adjustedDestinationTxFee.toString()))
        .toString(),
    };
  }

  _formatFee(fee: EIP1559Fee | number, networkName: string, type: string) {
    if (typeof fee === 'number') {
      return {
        gasPrice: '0x' + new BN(fee).times(1e9).decimalPlaces(0).toString(16),
        gasLimit: this.gasLimit(networkName)[type],
      };
    }
    return {
      maxFeePerGas: '0x' + new BN(fee.maxFeePerGas).times(1e9).decimalPlaces(0).toString(16),
      maxPriorityFeePerGas: '0x' + new BN(fee.maxPriorityFeePerGas).times(1e9).decimalPlaces(0).toString(16),
      gasLimit: this.gasLimit(networkName)[type],
    };
  }

  async _approveToken(bridge: HopBridge, chainFrom: Chain, fromAmount: string, signer: Wallet, fee: number) {
    const txData = await bridge.populateSendApprovalTx(fromAmount, chainFrom);
    const feeFormated = this._formatFee(fee, chainFrom.name.toLowerCase(), 'approve');
    const approveTx = await signer.sendTransaction({
      ...txData,
      ...feeFormated,
    });
    approveTx.hash = approveTx?.hash?.substring(2);
    return {
      status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
      approveTx,
      approveTxHash: approveTx?.hash,
    };
  }

  async sendSwap({ network, walletId, quote }: SwapRequest<HopSwapHistoryItem>) {
    const { hopAsset, hopChainFrom, hopChainTo, from, fromAccountId, fromAmount } = quote;
    const chainFrom = this.getChain(hopChainFrom.slug);
    const chainTo = this.getChain(hopChainTo.slug);
    const bridge = await this._getBridgeWithSigner(hopAsset, hopChainFrom, network, walletId, from, fromAccountId);
    const hop = this._getHop(network);
    const signer = await this._getSigner(network, walletId, from, fromAccountId, hop?.getChainProvider(chainFrom));
    const txData = await bridge?.populateSendTx(fromAmount, chainFrom, chainTo);
    const feeFormated = this._formatFee(quote.fee, chainFrom.name.toLowerCase(), 'send');
    const fromFundTx = await signer.sendTransaction({
      ...txData,
      ...feeFormated,
    });
    fromFundTx.hash = fromFundTx?.hash?.substring(2);
    return {
      status: 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS',
      fromFundTx,
      fromFundHash: fromFundTx.hash,
    };
  }

  /**
   * Create a new swap for the given quote
   * @param {{ network, walletId, quote }} options
   */
  // eslint-disable-next-line no-unused-vars
  async newSwap({ network, walletId, quote }: SwapRequest<HopSwapHistoryItem>) {
    const { hopAsset, hopChainFrom, hopChainTo, from, fromAccountId, fromAmount } = quote;
    const chainFrom = this.getChain(hopChainFrom.slug);
    const chainTo = this.getChain(hopChainTo.slug);
    const bridge = await this._getBridgeWithSigner(hopAsset, hopChainFrom, network, walletId, from, fromAccountId);
    const hop = this._getHop(network);
    const signer = await this._getSigner(network, walletId, from, fromAccountId, hop?.getChainProvider(chainFrom));
    let updates;
    if (isERC20(quote.from)) {
      updates = await this._approveToken(bridge, chainFrom, fromAmount, signer, quote.fee);
    } else {
      updates = {
        endTime: Date.now(),
        status: 'APPROVE_CONFIRMED',
      };
    }
    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: 50,
      hopAsset: hopAsset,
      hopChainFrom: chainFrom,
      hopChainTo: chainTo,
      ...updates,
    };
  }

  /**
   * Estimate the fees for the given parameters
   * @param {{ network, walletId, asset, fromAccountId, toAccountId, txType, amount, feePrices[], max }} options
   * @return Object of key feePrice and value fee
   */
  // eslint-disable-next-line no-unused-vars
  async estimateFees({ asset, txType, quote, feePrices }: EstimateFeeRequest<HopTxTypes, HopSwapQuote>) {
    if (txType !== this.fromTxType) {
      throw new Error(`Invalid tx type ${txType}`);
    }

    const nativeAsset = chains[cryptoassets[asset].chain].nativeAsset;
    const quoteFromStr: string = quote.hopChainFrom.slug || '';
    let gasLimit: number = this.gasLimit(quoteFromStr).send;
    if (isERC20(quote.from)) {
      gasLimit += this.gasLimit(quoteFromStr).approve;
    }

    const fees: EstimateFeeResponse = {};
    for (const feePrice of feePrices) {
      const gasPrice = new BN(feePrice).times(1e9); // ETH fee price is in gwei
      const fee = new BN(gasLimit).times(1.1).times(gasPrice);
      fees[feePrice] = unitToCurrency(cryptoassets[nativeAsset], fee);
    }
    return fees;
  }

  async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0)
  }

  async waitForApproveConfirmations({ swap, network, walletId }: NextSwapActionRequest<HopSwapHistoryItem>) {
    const client = this._getClient(network, walletId, swap.from, swap.fromAccountId);
    try {
      const tx = await client.chain.getTransactionByHash(swap.approveTxHash);
      if (tx && tx.confirmations && tx.confirmations >= 1) {
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

  async waitForSendSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<HopSwapHistoryItem>) {
    const client = this._getClient(network, walletId, swap.from, swap.fromAccountId);
    try {
      const tx = await client.chain.getTransactionByHash(swap.fromFundHash);
      const chainId: ChainId = <ChainId>swap.hopChainFrom.slug.toString();
      if (tx && tx.confirmations && tx.confirmations >= chains[chainId].safeConfirmations) {
        this.updateBalances(network, walletId, [swap.fromAccountId]);
        return {
          endTime: Date.now(),
          status:
            tx.status === 'SUCCESS' || Number(tx.status) === 1 ? 'WAITING_FOR_RECIEVE_SWAP_CONFIRMATIONS' : 'FAILED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  async waitForRecieveSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<HopSwapHistoryItem>) {
    const { hopChainFrom, hopChainTo, fromFundHash, from, to, fromAccountId, toAccountId } = swap;
    const client = this._getClient(network, walletId, from, fromAccountId);
    const privKey = await client.wallet.exportPrivateKey();
    const signer = new Wallet(privKey);
    const chainFrom = this.getChain(hopChainFrom.slug);
    const chainTo = this.getChain(hopChainTo.slug);
    const isFromL1Source = chainFrom.isL1 && !chainTo.isL1;
    try {
      let clientGQL;
      let transferId = '';
      if (!isFromL1Source) {
        clientGQL = createClient({
          url: `${this.graphqlURLs.url}/${this.graphqlURLs[chainFrom.slug]}`,
        });
        const { data } = await clientGQL.query(getTransferIdByTxHash('0x' + fromFundHash)).toPromise();
        transferId = data.transferSents?.[0]?.transferId;
        if (!transferId) return;
      }
      clientGQL = createClient({
        url: `${this.graphqlURLs.url}/${this.graphqlURLs[chainTo.slug]}`,
      });
      const { data } = await clientGQL
        .query(getDestinationTxGQL(transferId, signer.address.toLowerCase(), isFromL1Source))
        .toPromise();
      const methodName = !isFromL1Source ? 'withdrawalBondeds' : 'transferFromL1Completeds';
      const destinationTxHash = data[methodName]?.[0]?.transactionHash;

      if (!destinationTxHash) return;
      const client = this._getClient(network, walletId, to, toAccountId);
      const tx = await client.chain.getTransactionByHash(data[methodName]?.[0]?.transactionHash);
      if (tx && tx.confirmations && tx.confirmations >= 1) {
        return {
          receiveTxHash: tx.hash,
          receiveTx: tx,
          endTime: Date.now(),
          status: tx.status === 'SUCCESS' || Number(tx.status) === 1 ? 'SUCCESS' : 'FAILED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  /**
   * This hook is called when state updates are required
   * @param {object} store
   * @param {{ network, walletId, swap }}
   * @return updates An object representing updates to the current swap in the history
   */
  // eslint-disable-next-line no-unused-vars
  async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<HopSwapHistoryItem>
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
        updates = await withInterval(async () => this.waitForSendSwapConfirmations({ swap, network, walletId }));
        break;
      case 'WAITING_FOR_RECIEVE_SWAP_CONFIRMATIONS':
        updates = await withInterval(async () => this.waitForRecieveSwapConfirmations({ swap, network, walletId }));
        break;
    }
    return updates;
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_APPROVE_CONFIRMATIONS: {
        step: 0,
        label: 'Approving {from}',
        filterStatus: 'PENDING',
        notification(swap: { from: string }) {
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
            message: 'Engaging the hop.exchange',
          };
        },
      },
      WAITING_FOR_RECIEVE_SWAP_CONFIRMATIONS: {
        step: 2,
        label: 'Swapping {to}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Engaging the hop.exchange',
          };
        },
      },
      SUCCESS: {
        step: 3,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: { from: string; toAmount: number; to: string }) {
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
  protected _txTypes(): Record<string, string | null> {
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
}

export { HopSwapProvider };
