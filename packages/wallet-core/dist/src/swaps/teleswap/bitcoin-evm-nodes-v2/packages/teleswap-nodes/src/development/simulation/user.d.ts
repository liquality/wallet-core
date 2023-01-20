export = User;
declare class User {
    static getSleepTime(numberOfRequest: any, period?: number): any;
    constructor({ userPrefix, mnemonic, index, targetNetworkConnectionConfig, bitcoinAddressType, lockerLists, }: {
        userPrefix?: string | undefined;
        mnemonic: any;
        index: any;
        targetNetworkConnectionConfig?: {
            connectionInfo: {
                url: any;
                headers: any;
            };
        } | undefined;
        bitcoinAddressType?: undefined;
        lockerLists: any;
    });
    lockerLists: any;
    userId: string;
    burn: BurnRequest;
    transferExchange: TransferAndExchange;
    minBtc: number;
    maxBtc: number;
    numberOfBurnAndExchangeRequest: number;
    period: number;
    isRunning: boolean;
    init(): Promise<void>;
    simulateCcTransferAndExchange(): Promise<void>;
    simulateCcBurn(): Promise<void>;
    simulate(): Promise<void>;
}
import BurnRequest = require("../actions/burn-request");
import TransferAndExchange = require("../actions/cc-transfer-exchange");
