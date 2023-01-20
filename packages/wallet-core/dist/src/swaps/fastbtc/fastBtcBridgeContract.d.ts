export declare enum BitcoinTransferStatus {
    NOT_APPLICABLE = 0,
    NEW = 1,
    SENDING = 2,
    MINED = 3,
    REFUNDED = 4,
    RECLAIMED = 5
}
export interface BitcoinTransfer {
    rskAddress: string;
    status: BitcoinTransferStatus;
    nonce: number;
    feeStructureIndex: number;
    blockNumber: number;
    totalAmountSatoshi: number;
    btcAddress: string;
}
export declare const BitcoinTransferStruct = "(address rskAddress, uint8 status, uint8 nonce, uint8 feeStructureIndex, uint32 blockNumber, uint40 totalAmountSatoshi, string btcAddress)";
export declare const BRIDGE_CONTRACT_ABI: string[];
