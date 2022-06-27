import { TerraNetworks, TerraTypes } from '@chainify/terra';
import { Transaction, TxStatus } from '@chainify/types';
import { Asset, AssetTypes, ChainId, chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import { LCDClient } from '@terra-money/terra.js';
import BN, { BigNumber } from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval } from '../../store/actions/performNextAction/utils';
import { SwapHistoryItem } from '../../store/types';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { SwapProvider } from '../SwapProvider';
import {
  EstimateFeeRequest,
  EstimateFeeResponse,
  NextSwapActionRequest,
  QuoteRequest,
  SwapRequest,
  SwapStatus,
} from '../types';
import {
  buildSwapFromContractTokenMsg,
  buildSwapFromContractTokenToUSTMsg,
  buildSwapFromNativeTokenMsg,
  getPairAddressQuery,
  getRateERC20ToERC20,
  getRateNativeToAsset,
} from './queries';

interface RateResponse {
  amount: number;
  return_amount: number;
}

interface AstroportSwapHistoryItem extends SwapHistoryItem {
  swapTxHash: string;
  swapTx: Transaction<TerraTypes.TerraTxRequest>;
  fromTokenAddress: string;
  toTokenAddress: string;
  pairAddress: string;
}

class AstroportSwapProvider extends SwapProvider {
  async getSupportedPairs() {
    return [];
  }

  async getQuote(quoteRequest: QuoteRequest) {
    const { from, to, amount } = quoteRequest;
    const fromInfo = cryptoassets[from];
    const toInfo = cryptoassets[to];

    // only for Terra network swaps
    if (fromInfo.chain !== ChainId.Terra || toInfo.chain !== ChainId.Terra || amount.lt(0)) {
      return null;
    }

    const fromAmountInUnit = currencyToUnit(
      fromInfo,
      new BN(amount).decimalPlaces(fromInfo.decimals, BN.ROUND_DOWN) // ignore all decimals after nth
    ).toFixed();

    const { rate, fromTokenAddress, toTokenAddress, pairAddress } = await this._getSwapRate(
      fromAmountInUnit,
      fromInfo,
      toInfo
    );

    if (rate.amount === 0 || rate.return_amount === 0) {
      return null;
    }

    return {
      from,
      to,
      fromAmount: fromAmountInUnit,
      toAmount: rate.amount?.toString() || rate.return_amount?.toString(),
      fromTokenAddress,
      toTokenAddress,
      pairAddress,
    };
  }

  async newSwap({ network, walletId, quote }: SwapRequest<AstroportSwapHistoryItem>) {
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const [{ address }] = await client.wallet.getAddresses();

    const denom = this._getDenom(quote.from);

    const { fromTokenAddress, toTokenAddress, pairAddress } = quote;

    const isFromNative = quote.from === 'UST' || (quote.from === 'LUNA' && quote.to === 'UST');
    const isFromERC20ToUST = fromTokenAddress && quote.to === 'UST';

    let txData;

    if (isFromNative) {
      if (!denom) {
        throw new Error('AstroportSwapProvider: denom unresolved but required for swaps from native');
      }
      txData = buildSwapFromNativeTokenMsg(quote, denom, address, pairAddress);
    } else if (isFromERC20ToUST) {
      txData = buildSwapFromContractTokenToUSTMsg(quote, address, fromTokenAddress, pairAddress);
    } else {
      txData = buildSwapFromContractTokenMsg(quote, address, fromTokenAddress, toTokenAddress);
    }

    await this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');

    // @ts-ignore TODO: CAL should allow `any` for data
    const swapTx = await client.chain.sendTransaction({
      to: '',
      value: new BigNumber(0),
      ...txData,
    });

    const updates = {
      status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
      swapTx,
      swapTxHash: swapTx.hash,
    };

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: 50,
      ...updates,
    };
  }

  // ======== STATE TRANSITIONS ========

  async waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<AstroportSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
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
    _store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<AstroportSwapHistoryItem>
  ) {
    if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
      return withInterval(async () => this.waitForSwapConfirmations({ swap, network, walletId }));
    }
  }

  // ======== MIN AMOUNT =======

  getSwapLimit() {
    return 2; // Min swap amount in USD
  }

  // ========= FEES ========

  async estimateFees({ asset, txType, quote, feePrices }: EstimateFeeRequest) {
    if (txType !== this.fromTxType) {
      throw new Error(`Invalid tx type ${txType}`);
    }

    const nativeAsset = chains[cryptoassets[asset].chain].nativeAsset;

    const gasLimit = quote.from === 'UST' || (quote.from === 'LUNA' && quote.to === 'UST') ? 400_000 : 1_500_000;

    const fees: EstimateFeeResponse = {};

    for (const feePrice of feePrices) {
      const fee = new BN(gasLimit).times(feePrice);
      fees[feePrice] = new BN(unitToCurrency(cryptoassets[nativeAsset], fee).toFixed());
    }

    return fees;
  }

  async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0)
  }

  // ======== UTILS ========

  _getRPC() {
    const { chainId, rpcUrl } = TerraNetworks.terra_mainnet;
    return new LCDClient({ chainID: String(chainId), URL: String(rpcUrl) });
  }

  _getDenom(asset: string) {
    return {
      LUNA: 'uluna',
      UST: 'uusd',
    }[asset];
  }

  async _getSwapRate(fromAmount: string, fromInfo: Asset, toInfo: Asset) {
    const rpc = this._getRPC();

    // Check coin types
    const nativeToNative = fromInfo.type === AssetTypes.native && toInfo.type === AssetTypes.native;
    const erc20ToErc20 = fromInfo.type === AssetTypes.erc20 && toInfo.type === AssetTypes.erc20;
    const nativeToErc20 = fromInfo.type === AssetTypes.native && toInfo.type === AssetTypes.erc20;
    const erc20ToNative = fromInfo.type === AssetTypes.erc20 && toInfo.type === AssetTypes.native;

    // Select correct query and address depending on coin types
    let contractData;

    let fromTokenAddress, toTokenAddress;

    if (nativeToNative) {
      const fromDenom = this._getDenom(fromInfo.code);

      contractData = getRateNativeToAsset(fromAmount, fromDenom);
    } else if (erc20ToErc20) {
      fromTokenAddress = fromInfo.contractAddress;
      toTokenAddress = toInfo.contractAddress;
      if (!fromTokenAddress || !toTokenAddress) {
        throw new Error('AstroportSwapProvider: erc20ToErc20 swap but tokens missing contract address');
      }

      contractData = getRateERC20ToERC20(fromAmount, fromTokenAddress, toTokenAddress);
    } else if (nativeToErc20) {
      toTokenAddress = toInfo.contractAddress;
      if (!toTokenAddress) {
        throw new Error('AstroportSwapProvider: nativeToErc20 swap but toToken missing contract address');
      }

      const fromDenom = this._getDenom(fromInfo.code);

      const pairAddress = await this._getPairAddress(toTokenAddress);

      contractData =
        fromInfo.code === 'LUNA'
          ? getRateERC20ToERC20(fromAmount, fromDenom, toTokenAddress)
          : getRateNativeToAsset(fromAmount, fromDenom, pairAddress);
    } else if (erc20ToNative) {
      fromTokenAddress = fromInfo.contractAddress;
      if (!fromTokenAddress) {
        throw new Error('AstroportSwapProvider: erc20ToNative swap but fromToken missing contract address');
      }

      const toDenom = this._getDenom(toInfo.code);

      const pairAddress = await this._getPairAddress(fromTokenAddress);

      contractData =
        toInfo.code === 'LUNA'
          ? getRateERC20ToERC20(fromAmount, fromTokenAddress, toDenom)
          : getRateNativeToAsset(fromAmount, fromTokenAddress, pairAddress);
    } else {
      throw new Error(`AstroportSwapProvider: Invalid swap pair From: ${fromInfo.type} To: ${toInfo.type}`);
    }

    const { address, query } = contractData;

    const pairAddress = address;

    const rate: RateResponse = await rpc.wasm.contractQuery(address, query);

    return { rate, fromTokenAddress, toTokenAddress, pairAddress };
  }

  async _getPairAddress(tokenAddress: string): Promise<string> {
    const rpc = this._getRPC();

    const query = getPairAddressQuery(tokenAddress);

    // TODO: fully define this type?
    const resp: { contract_addr: string } = await rpc.wasm.contractQuery(
      'terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g',
      query
    );

    return resp.contract_addr;
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_SWAP_CONFIRMATIONS: {
        step: 0,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return { message: 'Engaging Astroport' };
        },
      },
      SUCCESS: {
        step: 1,
        label: 'Completed',
        filterStatus: 'COMPLETED',
        notification(swap: AstroportSwapHistoryItem) {
          return {
            message: `Swap completed, ${prettyBalance(new BigNumber(swap.toAmount), swap.to)} ${swap.to} ready to use`,
          };
        },
      },
      FAILED: {
        step: 1,
        label: 'Swap Failed',
        filterStatus: 'REFUNDED',
        notification() {
          return { message: 'Swap failed' };
        },
      },
    };
  }

  protected _txTypes() {
    return {
      SWAP: 'SWAP',
    };
  }

  protected _fromTxType() {
    return this._txTypes().SWAP;
  }

  protected _toTxType() {
    return null;
  }

  protected _timelineDiagramSteps() {
    return ['SWAP'];
  }

  protected _totalSteps() {
    return 2;
  }
}

export { AstroportSwapProvider };
