export = BitcoinRelay;
declare class BitcoinRelay extends EthereumBase {
    constructor(connectionConfig: any, contractAddress: any);
    contractAddress: any;
    contract: any;
    firstSubmittedHeight(): Promise<any>;
    isBlockHashSubmitted(blockHash: any, blockHeight: any): Promise<boolean>;
    lastSubmittedHeight(): Promise<any>;
    getNumberOfSubmittedHeaders(height: any): Promise<any>;
    getSubmittedHeaderHash(height: any, index: any): Promise<any>;
    getBlockHeaderFee(height: any, index: any): Promise<any>;
    submitBlockHeadersWithRetarget(oldPeriodStartHeader: any, oldPeriodEndHeader: any, newBlockHeaders: any): Promise<{
        status: any;
        txId: any;
        gasUsed: any;
        gasPrice: any;
    }>;
    submitBlockHeaders(anchorBlockHeader: any, newBlockHeaders: any): Promise<{
        status: any;
        txId: any;
        gasUsed: any;
        gasPrice: any;
        message: any;
    }>;
    getNumberOfConfirmations(): Promise<any>;
    getPastEventBlockHeight(fromBlock?: number): Promise<any>;
    parseBlockAddedEvent(BlockAddedEvent: any): {
        height: any;
        selfHash: any;
        parentHash: any;
        relayer: any;
        txInfo: {
            blockNumber: any;
            logIndex: any;
            transactionHash: any;
            eventName: any;
            signature: any;
        };
    };
    getLastBlockFee(): Promise<any>;
}
import EthereumBase = require("../ethereum-base");
