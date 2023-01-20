export = SlashLocker;
declare class SlashLocker {
    constructor({ sourceNetwork, targetNetwork, mnemonic, ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, lockerAddresses, }: {
        sourceNetwork: any;
        targetNetwork: any;
        mnemonic: any;
        ccBurnContractAddress: any;
        lockerContractAddress: any;
        bitcoinRelayContractAddress: any;
        lockerAddresses: any;
    });
    workId: string;
    sourceNetworkName: any;
    mnemonic: any;
    baseEthWeb3: any;
    btcInterface: any;
    lastReceivedBitcoinBlock: number;
    submittingRequests: boolean;
    lockerAddresses: any;
    setContractsInterfaces({ ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, }: {
        ccBurnContractAddress: any;
        lockerContractAddress: any;
        bitcoinRelayContractAddress: any;
    }): void;
    ccBurnInterface: any;
    lockerInterface: any;
    relayInterface: any;
    setAccount(index?: number): any;
    ethClientAddress: any;
    init(): Promise<void>;
    burnTransferDeadline: any;
    setValidLockerAddresses(validAddresses: any): void;
    validateAndSetLockerAddresses(allLockerAddresses?: any[]): Promise<any[]>;
    listenForBurnEvents(): void;
    getOldBurnEvent(): Promise<void>;
    slashIfBurnRequestsNotPaid(blockNumber: any): Promise<void>;
    slashIncorrectLockerPayments(blockNumber: any): Promise<void>;
    getAndSaveLockerTransactions(blockHeight: any): Promise<void>;
    processOldRequests(lastBtcBlockNumber: any): Promise<void>;
    newBlockReceived(blockEvent: any): Promise<void>;
}
