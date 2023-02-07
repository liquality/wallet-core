export = BlockStreamProvider;
declare class BlockStreamProvider {
    constructor({ timeout }: {
        timeout?: number | undefined;
    }, testnet?: boolean);
    baseURL: string;
    axios: any;
    getLatestBlockNumber(): Promise<any>;
    getBlockHash(blockNumber: any): Promise<any>;
    getBlockHeaderHex(blockNumber: any): Promise<any>;
    getConfirmedTransactions(userAddress: any, lastReceivedTxId?: string): Promise<any>;
    getMempoolTransactions(userAddress: any): Promise<any>;
    getTransaction(txId: any): Promise<{
        txId: any;
        version: any;
        locktime: any;
        blockTime: any;
        blockNumber: any;
        blockHash: any;
        vout: any;
    }>;
    getRawTransaction(txId: any): Promise<any>;
    getTransactionHistory(userAddress: any, blockNumber?: number, lastSeenTxId?: null): Promise<{
        address: any;
        txId: any;
        version: any;
        locktime: any;
        blockNumber: any;
        blockHash: any;
        vout: any;
        vin: any;
    }[]>;
    getMempoolTransactionHistory(userAddress: any): Promise<any>;
    getMempoolTransactionHistoryForMultipleAddresses(userAddresses: any, blockNumber?: number): Promise<any[]>;
    getTransactionHistoryForMultipleAddresses(userAddresses: any, blockNumber?: number): Promise<{
        address: any;
        txId: any;
        version: any;
        locktime: any;
        blockNumber: any;
        blockHash: any;
        vout: any;
        vin: any;
    }[][]>;
    getUtxos(userAddress: any): Promise<any>;
    getBalance(address: any): Promise<any>;
    getBlockTransactionIds(blockHash: any): Promise<any>;
    getFeeRate(speed?: string): Promise<any>;
    sendRawTransaction(rawTransaction: any): Promise<any>;
    getMerkleProof(txId: any): Promise<{
        intermediateNodes: any;
        transactionIndex: any;
    }>;
    getLatestBlock(): Promise<any>;
    getBlock(blockNumber: any): Promise<any>;
}
