import { EvmChain } from './EvmChain';
export declare abstract class NonEvmChain extends EvmChain {
    formatAddress(address: string): string;
    formatTransactionHash(hash: string): string;
}
export declare class SolanaChain extends NonEvmChain {
    isValidAddress(address: string): boolean;
    isValidTransactionHash(_hash: string): boolean;
}
export declare class NearChain extends NonEvmChain {
    isValidAddress(address: string): boolean;
    isValidTransactionHash(hash: string): boolean;
}
export declare class TerraChain extends NonEvmChain {
    isValidAddress(address: string): boolean;
    isValidTransactionHash(hash: string): boolean;
}
