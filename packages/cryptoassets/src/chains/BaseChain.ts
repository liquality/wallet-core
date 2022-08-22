import { ensure0x } from '@chainify/utils';
import { getAddress, isAddress } from '@ethersproject/address';
import { IAsset } from '../interfaces/IAsset';
import { IChain } from '../interfaces/IChain';
import { IFees } from '../interfaces/IFees';
import { IGasLimits } from '../interfaces/IGasLimit';
import { INetwork } from '../interfaces/INetwork';
import { ChainId, ExplorerView, FeeMultiplier } from '../types';

export abstract class BaseChain implements IChain {
  constructor(chain: IChain) {
    Object.assign(this, chain);
  }

  public id: ChainId;
  public name: string;

  public code: string;
  public color: string;

  public nativeAsset: IAsset;

  public isEVM: boolean;
  public hasTokens: boolean;

  public averageBlockTime: number;
  public safeConfirmations: number;
  public txFailureTimeoutMs: number;

  public network: INetwork;
  public explorerViews: ExplorerView[];
  public faucetUrl: string;

  public multicallSupport: boolean;

  public EIP1559: boolean;
  public feeMultiplier: FeeMultiplier;
  public gasLimit: IGasLimits;
  public fees: IFees;
  public supportCustomFees: boolean;

  public isValidAddress(address: string) {
    return isAddress(address);
  }

  public formatAddress(address: string) {
    return getAddress(address);
  }

  public isValidTransactionHash(hash: string) {
    return /^(0x)?([A-Fa-f0-9]{64})$/.test(hash);
  }

  public formatTransactionHash(hash: string) {
    return ensure0x(hash).toLowerCase();
  }
}
