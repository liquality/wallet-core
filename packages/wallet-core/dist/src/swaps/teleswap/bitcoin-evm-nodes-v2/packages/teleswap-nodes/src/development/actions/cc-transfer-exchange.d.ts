export = TransferAndExchange;
declare class TransferAndExchange {
    constructor({ mnemonic, index, bitcoinAddressType }: {
        mnemonic: any;
        index: any;
        bitcoinAddressType?: string | undefined;
    });
    clientAddress: any;
    targetNetworkChainId: any;
    btcTransaction: any;
    bitcoinAddress: any;
    btcInterface: any;
    send(lockerAddress: any, amount: any, { isExchange, outputAmount, isFixedToken, exchangeTokenAddress }: {
        isExchange?: boolean | undefined;
        outputAmount?: number | undefined;
        isFixedToken?: boolean | undefined;
        exchangeTokenAddress: any;
    }, constantFee?: null, clientAddress?: null): Promise<any>;
    getBtcBalance(): Promise<number>;
}
