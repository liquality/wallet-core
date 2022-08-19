import { ChainId, chains, currencyToUnit } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import {
  Chain as SymbiosisChain,
  ChainId as SymbiosisChainId,
  getChainById,
  SwapExactIn,
  Symbiosis,
  Token,
  TokenAmount,
} from 'symbiosis-js-sdk';
import { v4 as uuidv4 } from 'uuid';
import store, { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';

import { Asset, Network, SwapHistoryItem } from '../../store/types';
import { isERC20, isEthereumNativeAsset } from '../../utils/asset';
import { fiatToCrypto, prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { getTxFee } from '../../utils/fees';
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

export enum SymbiosisTxTypes {
  SWAP = 'SWAP',
}

interface SymbiosisSwapProviderConfig extends BaseSwapProviderConfig {
  network: Network;
  minSwapAmountInUsd: number;
}

interface SymbiosisSwapHistoryItem extends SwapHistoryItem {
  from: string;
  to: string;
  fromFundHash: string;
  fromFundTx: string;
}

export interface SymbiosisSwapQuote extends SwapQuote {
  receiveFee: string;
  slippage: number;
}

const ADDRESS_ZERO = '0x1111111111111111111111111111111111111111';

const DEFAULT_DEADLINE = Math.floor(Date.now() / 1000) * 20 * 60;

const DEFAULT_SLIPPAGE = 300;

const LIQUALITY_CLIENT_ID = 'liquality';

const FEE_UNITS = {
  ETH: 200000,
  BNB: 200000,
  MATIC: 200000,
  AVAX: 200000,
  ERC20: 300000,
};

class SymbiosisSwapProvider extends SwapProvider {
  public config: SymbiosisSwapProviderConfig;

  private _symbiosis: Symbiosis;

  constructor(config: SymbiosisSwapProviderConfig) {
    super(config);
    this._symbiosis = new Symbiosis(config.network, LIQUALITY_CLIENT_ID);
  }

  private _getSymbiosisChain(network: Network, chainName: ChainId): SymbiosisChain | undefined {
    const isMainnet = network === Network.Mainnet;
    const chains: { [key: string]: SymbiosisChainId } = {
      [ChainId.Ethereum]: isMainnet ? SymbiosisChainId.ETH_MAINNET : SymbiosisChainId.ETH_RINKEBY,
      [ChainId.Avalanche]: isMainnet ? SymbiosisChainId.AVAX_MAINNET : SymbiosisChainId.AVAX_TESTNET,
      [ChainId.BinanceSmartChain]: isMainnet ? SymbiosisChainId.BSC_MAINNET : SymbiosisChainId.BSC_TESTNET,
      [ChainId.Polygon]: isMainnet ? SymbiosisChainId.MATIC_MAINNET : SymbiosisChainId.MATIC_MUMBAI,
    };

    const chainId = chains[chainName];
    if (!chainId) {
      return;
    }

    return getChainById(chainId);
  }

  private _getSymbiosisToken(network: Network, asset: Asset): Token | null {
    const cryptoAsset = cryptoassets[asset];
    const chain = this._getSymbiosisChain(network, cryptoAsset.chain);

    if (!chain) {
      return null;
    }

    let address;
    let isNative;
    if (isEthereumNativeAsset(asset)) {
      address = '';
      isNative = true;
    } else if (isERC20(asset)) {
      address = cryptoAsset.contractAddress;
    }

    if (address === undefined) {
      return null;
    }

    return new Token({
      address,
      chainId: chain.id,
      decimals: cryptoAsset.decimals,
      isNative,
      symbol: asset,
    });
  }

  private async _waitForSendSwap({ swap, network, walletId }: NextSwapActionRequest<SymbiosisSwapHistoryItem>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.fromFundHash);
      const chainId = cryptoassets[swap.from].chain;
      if (tx && tx.confirmations && tx.confirmations >= chains[chainId].safeConfirmations) {
        this.updateBalances(network, walletId, [swap.fromAccountId]);
        return {
          endTime: Date.now(),
          status: tx.status === 'SUCCESS' || Number(tx.status) === 1 ? 'WAITING_FOR_RECEIVE' : 'FAILED',
        };
      }
    } catch (e) {
      if (e.name === 'TxNotFoundError') console.warn(e);
      else throw e;
    }
  }

  private _waitForReceiveSwap({ swap, network, walletId }: NextSwapActionRequest<SymbiosisSwapHistoryItem>) {
    console.log({ swap, network, walletId });

    return {
      status: 'SUCCESS',
    };
  }

  private async _exactIn(tokenAmountIn: TokenAmount, tokenOut: Token, account: string): SwapExactIn {
    // Create new Swapping instance
    const swapping = this._symbiosis.newSwapping();

    // Calculates fee for swapping between networks and get execute function
    return await swapping.exactIn(
      tokenAmountIn,
      tokenOut,
      account,
      account,
      account,
      DEFAULT_SLIPPAGE, // Symbiosis default slippage
      DEFAULT_DEADLINE, // Symbiosis default deadline - 20 min
      true
    );
  }

  public async getMin(quoteRequest: QuoteRequest) {
    const fiatRates = store.state.fiatRates;

    if (!fiatRates || !fiatRates[quoteRequest.from]) {
      throw new Error('Fiat rate not found');
    }

    return new BN(fiatToCrypto(this.config.minSwapAmountInUsd, fiatRates[quoteRequest.from]));
  }

  public async getSupportedPairs() {
    return [];
  }

  public async estimateFees({ asset, feePrices }: EstimateFeeRequest<SymbiosisTxTypes, SymbiosisSwapQuote>) {
    const fees: EstimateFeeResponse = {};
    for (const feePrice of feePrices) {
      fees[feePrice] = getTxFee(FEE_UNITS, asset, feePrice);
    }

    return fees;
  }

  public async getQuote({ network, from, to, amount }: QuoteRequest) {
    if (amount.lte(0)) {
      return null;
    }

    const assetFrom = cryptoassets[from];
    const assetTo = cryptoassets[to];

    const tokenIn = this._getSymbiosisToken(network, from);
    const tokenOut = this._getSymbiosisToken(network, to);

    if (!tokenIn || !tokenOut || tokenIn.chainId === tokenOut.chainId) {
      return null;
    }

    const fromUnit = currencyToUnit(assetFrom, amount);
    const tokenAmountIn = new TokenAmount(tokenIn, fromUnit.toString());

    const { tokenAmountOut } = await this._exactIn(tokenAmountIn, tokenOut, ADDRESS_ZERO);

    const toUnit = currencyToUnit(assetTo, new BN(tokenAmountOut.toExact()));

    return {
      fromAmount: fromUnit.toString(),
      toAmount: toUnit.toString(),
      from,
      to,
    };
  }

  public async newSwap({ network, walletId, quote }: SwapRequest<SymbiosisSwapHistoryItem>) {
    // @@ approve

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const signer = client.wallet.getSigner();

    // user address
    const account = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);

    const tokenIn = this._getSymbiosisToken(network, quote.from);
    const tokenOut = this._getSymbiosisToken(network, quote.to);

    if (!tokenIn || !tokenOut) {
      throw new Error('Symbiosis asset does not exist');
    }

    const tokenAmountIn = new TokenAmount(tokenIn, quote.fromAmount);

    const { execute } = await this._exactIn(tokenAmountIn, tokenOut, account);

    const { response } = await execute(signer);

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: quote.slippage,
      status: 'WAITING_FOR_SEND',
      fromFundTx: response.from,
      fromFundHash: response.hash,
    };
  }

  // getTransactionExplorerLink

  public async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<SymbiosisSwapHistoryItem>
  ) {
    let updates;

    switch (swap.status) {
      case 'WAITING_FOR_APPROVE':
        updates = await withInterval(async () => {
          // approve confirmation

          return { status: 'APPROVE_CONFIRMED' };
        });
        break;
      case 'APPROVE_CONFIRMED':
        updates = await withLock(store, { item: swap, network, walletId, asset: swap.from }, async () => {
          return {
            status: 'WAITING_FOR_SEND',
          };
        });
        break;
      case 'WAITING_FOR_SEND':
        updates = await withInterval(async () => this._waitForSendSwap({ swap, network, walletId }));
        break;
      case 'WAITING_FOR_RECEIVE':
        updates = await withInterval(async () => this._waitForReceiveSwap({ swap, network, walletId }));
        break;
    }
    return updates;
  }

  protected _getStatuses(): Record<string, SwapStatus> {
    return {
      WAITING_FOR_APPROVE: {
        step: 0,
        label: 'Approving {from}',
        filterStatus: 'PENDING',
        notification(swap: { from: string; toAmount: number; to: string }) {
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
      WAITING_FOR_SEND: {
        step: 1,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
        notification() {
          return {
            message: 'Swap initiated',
          };
        },
      },
      WAITING_FOR_RECEIVE: {
        step: 2,
        label: 'Swapping {from}',
        filterStatus: 'PENDING',
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
            message: 'Swap refunded',
          };
        },
      },
    };
  }

  protected _txTypes() {
    return SymbiosisTxTypes;
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

export { SymbiosisSwapProvider };
