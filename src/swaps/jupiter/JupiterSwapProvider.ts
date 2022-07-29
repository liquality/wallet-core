import { TxStatus } from '@chainify/types';
import { ChainId, chains, currencyToUnit, unitToCurrency } from '@liquality/cryptoassets';
import { Connection, Transaction } from '@solana/web3.js';
import axios from 'axios';
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

export interface JupiterSwapHistoryItem extends SwapHistoryItem {
  info: object;
  swapTxHash: string;
}
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
        notification(swap: SwapHistoryItem) {
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

    const fromAmountInUnit = currencyToUnit(fromInfo, new BN(amount)).toFixed();

    const { data } = await axios.get(
      `https://quote-api.jup.ag/v1/quote?inputMint=${fromAddress}&outputMint=${toAddress}&amount=${fromAmountInUnit}&slippage=0.5&`
    );

    if (!data.data?.[0]) {
      return null;
    }

    const info = data.data[0];

    return {
      from,
      to,
      fromAmount: fromAmountInUnit.toString(),
      toAmount: info.outAmount.toString(),
      info: {
        ...info,
        toAddress,
      },
    };
  }

  public async newSwap(quoteInput: SwapRequest<JupiterSwapHistoryItem>) {
    const connection = new Connection(
      'https://solana--mainnet.datahub.figment.io/apikey/d7d9844ccf72ad4fef9bc5caaa957a50',
      'confirmed'
    );
    const { network, walletId, quote } = quoteInput;
    const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
    const [{ address }] = await client.wallet.getAddresses();

    const transactions = await this._getTransactions(quote.info, address);

    let swapTx;
    const txTypes = Object.keys(transactions);

    /* Full swap flow might be constructed from 3 different transactions:
      1. Setup transaction  - used to handle creating ATA or Serum open order accounts
      2. Swap transaction  - performing the actual swaps
      3. Clean up transaction - unwrap SOL if a SOL swap.
      You must send each transaction sequentially in the order:
      setupTransaction -> swapTransaction -> cleanupTransaction and wait for each to be 'confirmed' before sending the next one.
    */

    for (let i = 0; i < txTypes.length; i++) {
      const tx = Transaction.from(Buffer.from(transactions[txTypes[i]], 'base64'));

      if (txTypes[i] === 'swapTransaction') {
        // @ts-ignore TODO: CAL should allow `any` for data
        swapTx = await client.wallet.sendTransaction({ transaction: tx, value: new BN(quote.fromAmount) });
        await connection.confirmTransaction(swapTx.hash);
      } else {
        // @ts-ignore TODO: CAL should allow `any` for data
        const transaction = await client.wallet.sendTransaction({ transaction: tx, value: new BN(0) });
        await connection.confirmTransaction(transaction.hash);
      }
    }

    const updates = {
      status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
      swapTx,
      swapTxHash: swapTx?.hash,
    };

    return {
      id: uuidv4(),
      fee: quote.fee,
      slippage: 50,
      ...updates,
    };
  }

  public async estimateFees({
    txType,
    feePrices,
    asset,
  }: EstimateFeeRequest<string, JupiterSwapHistoryItem>): Promise<EstimateFeeResponse | null> {
    if (txType != this.fromTxType) {
      throw new Error(`Invalid tx type ${txType}`);
    }

    const nativeAsset = chains[cryptoassets[asset].chain].nativeAsset;

    const gasLimit = 1000000000;
    const fees: EstimateFeeResponse = {};

    for (const feePrice of feePrices) {
      const fee = new BN(gasLimit).times(feePrice);
      fees[feePrice] = new BN(unitToCurrency(cryptoassets[nativeAsset], fee).toFixed());
    }

    return fees;
  }

  // Jupiter on their site before performing swap are recommending:
  // "We recommend having at least 0.05 SOL for any transaction"
  // https://jup.ag/swap/SOL-USDT

  // Here we are returning `33333333` Lamports because in wallet we multiply by 1.5 which
  // output exactly 0.05 SOL
  getExtraAmountToExtractFromBalance() {
    return 33333333;
  }

  async performNextSwapAction(
    _store: ActionContext,
    { network, walletId, swap }: NextSwapActionRequest<JupiterSwapHistoryItem>
  ) {
    if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
      return withInterval(async () => this.waitForSwapConfirmations({ swap, network, walletId }));
    }
  }

  async getMin(_quoteRequest: QuoteRequest) {
    return new BN(0);
  }

  async waitForSwapConfirmations({ swap, network, walletId }: NextSwapActionRequest<JupiterSwapHistoryItem>) {
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
  private async _getTransactions(route: object, userPublicKey: string) {
    const { data: transactions } = await axios.post('https://quote-api.jup.ag/v1/swap', {
      route,
      userPublicKey,
      wrapUnwrapSOL: true,
    });

    return transactions;
  }
}

export { JupiterSwapProvider };
