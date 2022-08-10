import { Transaction } from '@chainify/types';
import { Asset } from '../../store/types';
import { ThorchainSwapHistoryItem, ThorchainSwapProviderConfig, ThorchainSwapQuote } from '../thorchain/ThorchainSwapProvider';
import { NextSwapActionRequest } from '../types';
import { Chain, TToken } from '@hop-protocol/sdk';
import { EvmSwapHistoryItem } from '../EvmSwapProvider';
import { HopSwapHistoryItem } from '../hop/HopSwapProvider';
import { TransactionResponse } from '@ethersproject/providers';

export interface BoostHistoryItem extends EvmSwapHistoryItem {
  approveTx: Transaction;
  approveTxOnHop: TransactionResponse;
  hopAsset: TToken;
  hopChainFrom: Chain;
  hopChainTo: Chain;
  fromFundHash: string;
  receiveFee: string;
  maxFeeSlippageMultiplier: number;
  fromFundTx: Transaction;
  receiveTxHash: string;
  receiveTx: Transaction;
  bridgeAsset: Asset;
  bridgeAssetAmount: string;
  currentSwapLeg: BoostStage; 
}

export interface BoostNextSwapActionRequest extends Partial<NextSwapActionRequest> {
  swapThor: ThorchainSwapHistoryItem;
  swapHop?: HopSwapHistoryItem;
}

// Boost config
export interface ThorHopSwapProviderConfig extends ThorchainSwapProviderConfig {
  graphqlBaseURL: string;
}
export interface ThorHopBoostSwapQuote extends ThorchainSwapQuote {
  from: string;
  to: string;
  fromAmount: string;
  toAmount: string;
  hopAsset: string;
  hopChainFrom: Chain;
  hopChainTo: Chain;
  thorchainReceiveFee: string;
  hopReceiveFee: string;
  maxFeeSlippageMultiplier: number
}


export enum BoostStage {
  FirstLeg = 'firstLeg',
  SecondLeg = 'secondLeg',
}