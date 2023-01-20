import { IChain } from '../interfaces/IChain';
export declare abstract class BaseChain implements IChain {
    constructor(chain: IChain);
    formatAddressUI(address: string): string;
    abstract isValidAddress(address: string): boolean;
    abstract formatAddress(address: string): string;
    abstract isValidTransactionHash(hash: string): boolean;
    abstract formatTransactionHash(hash: string): string;
}
export interface BaseChain extends IChain {
}
