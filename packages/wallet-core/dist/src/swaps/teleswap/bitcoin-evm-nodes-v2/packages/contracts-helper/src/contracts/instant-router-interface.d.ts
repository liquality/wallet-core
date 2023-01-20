export = InstantRouter;
declare class InstantRouter extends EthereumBase {
    static parseInstantTransferEvent(event: any): {
        user: any;
        receiver: any;
        loanAmount: any;
        instantFee: any;
        deadline: any;
        collateralToken: any;
        lockedCollateralPoolToken: any;
        txInfo: {
            blockNumber: any;
            logIndex: any;
            transactionHash: any;
            eventName: any;
            signature: any;
        };
    };
    static parseInstantExchangeEvent(event: any): {
        user: any;
        receiver: any;
        loanAmount: any;
        instantFee: any;
        amountOut: any;
        path: any;
        isFixed: any;
        deadline: any;
        collateralToken: any;
        lockedCollateralPoolToken: any;
        txInfo: {
            blockNumber: any;
            logIndex: any;
            transactionHash: any;
            eventName: any;
            signature: any;
        };
    };
    constructor(connectionInfo: any, contractAddress: any);
    contractAddress: any;
    contract: any;
    getInstantDebts(userAddress: any, lastBlock?: number): Promise<{
        debts: {
            user: any;
            collateralPool: any;
            collateralToken: any;
            paybackAmount: any;
            lockedCollateralPoolTokenAmount: any;
            deadline: any;
            index: number;
        }[];
        lastDebt: any;
    }>;
    getInstantTransferEvents(fromBlock?: number): Promise<any>;
    getInstantExchangeEvents(fromBlock?: number): Promise<any>;
    getUserInstantRequestsLength(userAddress: any): Promise<any>;
    slashUser(userAddress: any, index: any): Promise<any>;
}
import EthereumBase = require("../ethereum-base");
