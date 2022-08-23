import { IChain } from '../interfaces/IChain';

export abstract class BaseChain implements IChain {
  constructor(chain: IChain) {
    Object.assign(this, chain);
  }

  public abstract isValidAddress(address: string): boolean;

  public abstract formatAddress(address: string): string;

  public abstract isValidTransactionHash(hash: string): boolean;

  public abstract formatTransactionHash(hash: string): string;
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
