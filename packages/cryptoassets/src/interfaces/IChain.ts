import { ChainId, ExplorerView, FeeMultiplier } from '../types';
import { IAsset } from './IAsset';
import { IFees } from './IFees';
import { IGasLimits } from './IGasLimit';
import { INetwork } from './INetwork';

export interface IChain {
  id: ChainId;
  name: string;
  code: string;
  color: string;
  nativeAsset: IAsset[];

  isEVM: boolean;
  hasTokens: boolean;

  averageBlockTime: number;
  safeConfirmations: number;
  txFailureTimeoutMs: number;

  network: INetwork;

  faucetUrl?: string;
  explorerViews: ExplorerView[];

  multicallSupport: boolean;
  ledgerSupport: boolean;

  fees: IFees;
  EIP1559: boolean;
  gasLimit: IGasLimits;
  supportCustomFees: boolean;
  feeMultiplier?: FeeMultiplier;
}
