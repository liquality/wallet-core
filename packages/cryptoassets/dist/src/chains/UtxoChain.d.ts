import { BaseChain } from './BaseChain';
export declare abstract class UtxoChain extends BaseChain {
    formatAddress(address: string): string;
    isValidTransactionHash(hash: string): boolean;
    formatTransactionHash(hash: string): string;
}
export declare class BitcoinChain extends UtxoChain {
    isValidAddress(address: string): boolean;
}
