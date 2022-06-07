import { TxStatus } from '@chainify/types';
import { ChainId, currencyToUnit } from '@liquality/cryptoassets';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import BN, { BigNumber } from 'bignumber.js';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from '../../store';
import { withInterval } from '../../store/actions/performNextAction/utils';
import { prettyBalance } from '../../utils/coinFormatter';
import cryptoassets from '../../utils/cryptoassets';
import { SwapProvider } from '../SwapProvider';
import { EstimateFeeResponse, NextSwapActionRequest, QuoteRequest, SwapStatus } from '../types';

class JupiterSwapProvider extends SwapProvider {
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
        notification(swap: any) {
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
    return 2;
  }
  protected _timelineDiagramSteps(): string[] {
    return ['SWAP'];
  }

  public async getSupportedPairs() {
    return [];
  }
  public async getQuote(quoteRequest: QuoteRequest) {
    const { from, to, amount } = quoteRequest;
    const fromInfo = cryptoassets[from];
    const toInfo = cryptoassets[to];

    // only for Solana network swaps
    if (fromInfo.chain !== ChainId.Solana || toInfo.chain !== ChainId.Solana || amount.lt(0)) {
      return null;
    }

    const solMintAddress = 'So11111111111111111111111111111111111111112';

    const fromAddress = fromInfo.contractAddress || solMintAddress;
    const toAddress = toInfo.contractAddress || solMintAddress;

    const fromAmountInUnit = currencyToUnit(
      fromInfo,
      new BN(amount).decimalPlaces(fromInfo.decimals, BN.ROUND_DOWN) // ignore all decimals after nth
    );

    console.log(fromAddress);
    console.log(toAddress);
    console.log('amount', fromAmountInUnit.toString());

    const { data } = await axios.get(
      `https://quote-api.jup.ag/v1/quote?inputMint=${fromAddress}&outputMint=${toAddress}&amount=${new BN(
        100
      )}&slippage=0.5&`
    );

    const info = data.data[0];

    return {
      from,
      to,
      fromAmount: fromAmountInUnit.toString(),
      toAmount: info.outAmount.toString(),
      info,
    };
  }

  public async newSwap(quoteInput: any): Promise<any> {
    console.log('quote input', quoteInput);
    const { network, walletId, quote } = quoteInput;

    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const [{ address }] = await client.wallet.getAddresses();

    const transactions = await this._getTransactions(quote.info, address);

    const { setupTransaction, swapTransaction, cleanupTransaction } = transactions;

    let swapTx: any;

    for (let serializedTransaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

      // @ts-ignore TODO: CAL should allow `any` for data
      swapTx = await client.wallet.sendTransaction({ transaction, value: new BN(quote.fromAmount) });
    }

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

  public estimateFees(): // estimateFeeRequest: EstimateFeeRequest<string, SwapQuote>
  Promise<EstimateFeeResponse | null> {
    throw new Error('Method not implemented.');
  }

  async performNextSwapAction(_store: ActionContext, { network, walletId, swap }: NextSwapActionRequest<any>) {
    if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
      return withInterval(async () => this.waitForSwapConfirmations({ swap, network, walletId }));
    }
  }

  async waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<any>) {
    const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);

    try {
      const tx = await client.chain.getTransactionByHash(swap.swapTxHash);
      if (tx && tx.confirmations && tx.confirmations > 0) {
        const { status } = tx;
        this.updateBalances(network, walletId, [swap.from]);

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
  private async _getTransactions(route: any, userPublicKey: any) {
    const { data: transactions } = await axios.post('https://quote-api.jup.ag/v1/swap', {
      route,
      userPublicKey,
      // to make sure it doesnt close the sol account
      wrapUnwrapSOL: false,
    });

    return transactions;
  }
}

export { JupiterSwapProvider };
