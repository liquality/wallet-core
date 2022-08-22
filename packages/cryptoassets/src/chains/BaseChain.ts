import { ensure0x } from '@chainify/utils';
import { getAddress, isAddress } from '@ethersproject/address';
import { IAsset } from '../interfaces/IAsset';
import { IChain } from '../interfaces/IChain';
import { IFees } from '../interfaces/IFees';
import { IGasLimits } from '../interfaces/IGasLimit';
import { INetwork } from '../interfaces/INetwork';
import { ChainId } from '../types';
import { ExplorerView, FeeMultiplier } from './types';

export abstract class BaseChain implements IChain {
  constructor(chain: {
    id: ChainId;
    name: string;
    code: string;
    color: string;
    nativeAsset: IAsset;
    isEVM: boolean;
    hasTokens: boolean;
    averageBlockTime: number;
    safeConfirmations: number;
    txFailureTimeoutMs: number;
    network: INetwork;
    explorerViews: ExplorerView[];
    multicallSupport: boolean;
    EIP1559: boolean;
    gasLimit: IGasLimits;
    fees: IFees;
    supportCustomFees: boolean;
    faucetUrl?: string;
    feeMultiplier?: FeeMultiplier;
  }) {
    this.id = chain.id;
    this.name = chain.name;

    this.code = chain.code;
    this.color = chain.color;

    this.nativeAsset = chain.nativeAsset;

    this.isEVM = chain.isEVM;
    this.hasTokens = chain.hasTokens;

    this.averageBlockTime = chain.averageBlockTime;
    this.safeConfirmations = chain.safeConfirmations;
    this.txFailureTimeoutMs = chain.txFailureTimeoutMs;

    this.network = chain.network;
    this.explorerViews = chain.explorerViews;

    this.multicallSupport = chain.multicallSupport;

    this.EIP1559 = chain.EIP1559;
    this.gasLimit = chain.gasLimit;
    this.fees = chain.fees;
    this.supportCustomFees = chain.supportCustomFees;

    if (chain.faucetUrl) {
      this.faucetUrl = chain.faucetUrl;
    }

    if (chain.feeMultiplier) {
      this.feeMultiplier = chain.feeMultiplier;
    }
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
