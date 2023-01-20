import { BaseChain } from './BaseChain';
export declare class EvmChain extends BaseChain {
    isValidAddress(address: string): boolean;
    formatAddress(address: string): string;
    isValidTransactionHash(hash: string): boolean;
    formatTransactionHash(hash: string): string;
}
export declare class RskChain extends EvmChain {
    formatAddressUI(address: string): string;
}
