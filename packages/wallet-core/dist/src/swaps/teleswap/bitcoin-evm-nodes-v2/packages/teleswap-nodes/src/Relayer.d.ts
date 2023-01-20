export = BitcoinRelayer;
declare class BitcoinRelayer {
    static calculateBitcoinSleep(numberOfCheck: any): number;
    constructor({ sourceNetwork, targetNetwork, bitcoinRelayContractAddress, mnemonic }: {
        sourceNetwork: {
            connection: object;
            name: object;
        };
        targetNetwork: {
            name: object;
            connection: {
                web3: object;
            };
        };
        bitcoinRelayContractAddress: string;
        mnemonic: string;
    });
    mnemonic: string;
    btcInterface: any;
    bitcoinRelayContract: any;
    run: boolean;
    testnet: any;
    numberOfSuccessfulTxs: number;
    totalSuccessfulTxsGasUsed: number;
    totalSuccessfulTxsEthPaid: number;
    numberOfFailedTxs: number;
    totalFailedTxsGasUsed: number;
    totalFailedTxsEthPaid: number;
    totalNumberOfBlockSubmitted: number;
    logData(): void;
    setAccount(index: any): Promise<any>;
    startRelaying(): Promise<void>;
    relaying(anchorBlockNumber: any, lastSeenBlockHeight: any, maxBlockBatchSize?: number): any;
}
