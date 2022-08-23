import { ensure0x } from '@chainify/utils';
import { getAddress, isAddress } from '@ethersproject/address';
import { IChain } from '../interfaces/IChain';

export abstract class BaseChain implements IChain {
  constructor(chain: IChain) {
    Object.assign(this, chain);
  }

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

/**
 * Use declaration merging to avoid defining all properties from IChain
 * The BaseChain interface and the BaseChain abstract class are merged into one.
 * Read more: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseChain extends IChain {
  //
}
