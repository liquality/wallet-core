import { currencyToUnit } from '@liquality/cryptoassets';
import BN from 'bignumber.js';
import { BigNumber, ContractTransaction, Signer } from 'ethers';
import { Execute, SwapExactIn, Symbiosis, Token, TokenAmount } from 'symbiosis-js-sdk';
import { v4 as uuidv4 } from 'uuid';
import store, { ActionContext } from '../../store';
import { withInterval, withLock } from '../../store/actions/performNextAction/utils';

import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { Network, SwapHistoryItem } from '../../store/types';
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
import {
  ADDRESS_ZERO,
  APPROVE_ABI,
  DEFAULT_DEADLINE,
  DEFAULT_SLIPPAGE,
  FEE_UNITS,
  getSymbiosisToken,
  LIQUALITY_CLIENT_ID,
} from './utils';

export enum SymbiosisTxTypes {
  SWAP = 'SWAP',
}

interface SymbiosisSwapProviderConfig extends BaseSwapProviderConfig {
  network: Network;
  minSwapAmountInUsd: number;
}

interface SymbiosisSwapHistoryItem extends SwapHistoryItem {
  approveResponse: ContractTransaction;
  from: string;
  fromFundHash: string;
  fromFundTx: string;
  to: string;
  execute: (signer: Signer) => Execute;
  signer: Signer;
  response: TransactionResponse;
  receipt: TransactionReceipt;
}

export interface SymbiosisSwapQuote extends SwapQuote {
  receiveFee: string;
  slippage: number;
}

class SymbiosisSwapProvider extends SwapProvider {
  public config: SymbiosisSwapProviderConfig;

  private _swapping;

  constructor(config: SymbiosisSwapProviderConfig) {
    super(config);
    const symbiosis = new Symbiosis(config.network, LIQUALITY_CLIENT_ID);

    // Create new Swapping instance
    this._swapping = symbiosis.newSwapping();
  }

  private async _exactIn(tokenAmountIn: TokenAmount, tokenOut: Token, account: string): SwapExactIn {
    // Calculates fee for swapping between networks and get execute function
    return await this._swapping.exactIn(
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

  private async _approveToken(address: string, fromAmount: string, approveTo: string, signer: Signer) {
    const tokenContract = new Contract(address, JSON.stringify(APPROVE_ABI), signer);

    const allowance = await tokenContract.allowance(address, approveTo);
    const inputAmount = BigNumber.from(new BN(fromAmount).toFixed());

    if (allowance.gte(inputAmount)) {
      return { status: 'APPROVE_CONFIRMED' };
    }

    const approveResponse: ContractTransaction = await tokenContract.approve(approveTo, MaxUint256);

    return {
      status: 'WAITING_FOR_APPROVE',
      approveResponse,
    };
  }

  private async _waitForApproveConfirmations(approveResponse: ContractTransaction) {
    await approveResponse.wait(1);

    return { endTime: Date.now(), status: 'APPROVE_CONFIRMED' };
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

    const tokenIn = getSymbiosisToken(network, from);
    const tokenOut = getSymbiosisToken(network, to);

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
    const signer: Signer = client.wallet.getSigner();

    // user address
    const account = await this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);

    const tokenIn = getSymbiosisToken(network, quote.from);
    const tokenOut = getSymbiosisToken(network, quote.to);

    if (!tokenIn || !tokenOut) {
      throw new Error('Symbiosis asset does not exist');
    }

    const tokenAmountIn = new TokenAmount(tokenIn, quote.fromAmount);

    // @ts-ignore
    const { execute, approveTo } = await this._exactIn(tokenAmountIn, tokenOut, account);

    let updates;
    if (tokenIn.isNative) {
      const { response } = await execute(signer);
      updates = {
        response,
        status: 'WAITING_FOR_SEND',
      };
    } else {
      updates = await this._approveToken(account, quote.fromAmount, approveTo, signer);
    }

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: quote.slippage,
      execute,
      signer,
      ...updates,
    };
  }

  public async performNextSwapAction(
    store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<SymbiosisSwapHistoryItem>
  ) {
    let updates;

    switch (swap.status) {
      case 'WAITING_FOR_APPROVE':
        updates = await withInterval(async () => this._waitForApproveConfirmations(swap.approveResponse));
        break;
      case 'APPROVE_CONFIRMED':
        updates = await withLock(store, { item: swap, network, walletId, asset: swap.from }, async () => {
          try {
            const { response } = await swap.execute(swap.signer);

            return {
              response,
              status: 'WAITING_FOR_SEND',
            };
          } catch (error) {
            throw new Error(error);
          }
        });
        break;
      case 'WAITING_FOR_SEND':
        updates = await withInterval(async () => {
          try {
            const receipt = await swap.response.wait(1);

            return {
              status: 'WAITING_FOR_RECEIVE',
              receipt,
            };
          } catch (error) {
            throw new Error(error);
          }
        });
        break;
      case 'WAITING_FOR_RECEIVE':
        updates = await withInterval(async () => {
          try {
            await this._swapping.waitForComplete(swap.receipt);

            return {
              status: 'SUCCESS',
            };
          } catch (error) {
            throw new Error(error);
          }
        });
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
