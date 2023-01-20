export = BurnRequest;
declare class BurnRequest {
    constructor({ mnemonic, index, targetNetworkConnectionConfig, bitcoinAddressType }: {
        mnemonic: any;
        index: any;
        targetNetworkConnectionConfig: any;
        bitcoinAddressType?: string | undefined;
    });
    burnContract: any;
    teleBTC: any;
    ethClientAddress: any;
    btcInterface: any;
    bitcoinAddress: any;
    isInitialize: boolean;
    init(): Promise<void>;
    sendBurnRequest(lockerAddress: any, amount: any, receiverAddress?: null, mintIfNeeded?: boolean): Promise<any>;
    getTeleBtcBalanceAndMintIfNeeded(mint?: boolean): Promise<number>;
    mintTestToken(): Promise<void>;
}
