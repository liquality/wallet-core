import { ActionContext } from '..';
import { SwapQuote } from '../../swaps/types';
import { FeeLabel, Network, SwapHistoryItem, WalletId } from '../types';
export declare const newSwap: (context: ActionContext, { network, walletId, quote, fee, claimFee, feeLabel, claimFeeLabel, }: {
    network: Network;
    walletId: WalletId;
    quote: SwapQuote;
    fee: number;
    claimFee: number;
    feeLabel: FeeLabel;
    claimFeeLabel: FeeLabel;
}) => Promise<SwapHistoryItem>;
