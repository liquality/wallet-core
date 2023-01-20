export = LendingRouter;
declare class LendingRouter extends EthereumBase {
    constructor(connectionInfo: any, contractAddress: any);
    contractAddress: any;
    contract: any;
    isUsed(txId: any): Promise<any>;
    sendLendingRequest(lockerScript: any, parsedTx: any, merkleProof: any, blockNumber: any, blockFee: any, nonce?: undefined): Promise<any>;
}
import EthereumBase = require("../ethereum-base");
