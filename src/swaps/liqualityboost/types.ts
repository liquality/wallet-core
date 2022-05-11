import { ethereum, Transaction } from '@liquality/types';
import { Asset, SwapHistoryItem } from '../../store/types';
import { LiqualitySwapHistoryItem } from '../liquality/LiqualitySwapProvider';
import { NextSwapActionRequest } from '../types';

export interface BoostHistoryItem extends LiqualitySwapHistoryItem {
  approveTxHash: string;
  swapTxHash: string;
  approveTx: Transaction<ethereum.Transaction>;
  swapTx: Transaction<ethereum.Transaction>;
  bridgeAsset: Asset;
  bridgeAssetAmount: string;
}
export interface BoostNextSwapActionRequest extends Partial<NextSwapActionRequest> {
  swapLSP: LiqualitySwapHistoryItem;
  swapAMM?: SwapHistoryItem;
}
