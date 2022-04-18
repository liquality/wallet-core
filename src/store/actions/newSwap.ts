import { ActionContext, rootActionContext } from '..';
import { SwapQuote } from '../../swaps/types';
import { Network, SwapHistoryItem, TransactionType, WalletId } from '../types';

export const newSwap = async (
  context: ActionContext,
  {
    network,
    walletId,
    quote,
    fee,
    claimFee,
    feeLabel,
    claimFeeLabel,
  }: {
    network: Network;
    walletId: WalletId;
    quote: SwapQuote;
    fee: number;
    claimFee: number;
    feeLabel: string;
    claimFeeLabel: string;
  }
): Promise<SwapHistoryItem> => {
  const { commit, dispatch, getters } = rootActionContext(context);
  // @ts-ignore TODO: States should always be in string? Results are retuninrg BignNmber but storage is storing as string
  const swap: Partial<SwapHistoryItem> = { ...quote };

  swap.type = TransactionType.Swap;
  swap.network = network;
  swap.startTime = Date.now();
  swap.walletId = walletId;
  swap.fee = fee;
  swap.claimFee = claimFee;

  const swapProvider = getters.swapProvider(network, swap.provider!);
  const initiationParams = await swapProvider.newSwap({
    network,
    walletId,
    quote: swap,
  });

  const createdSwap = {
    ...swap,
    ...initiationParams, // TODO: Maybe move provider specific params to an inner property?
    feeLabel,
    claimFeeLabel,
  };

  commit.NEW_SWAP({
    network,
    walletId,
    swap: createdSwap,
  });

  dispatch.performNextAction({
    network,
    walletId,
    id: createdSwap.id,
  });

  return createdSwap;
};
