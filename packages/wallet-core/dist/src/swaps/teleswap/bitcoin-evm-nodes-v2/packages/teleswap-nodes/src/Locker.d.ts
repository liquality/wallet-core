export = Locker;
declare class Locker {
    constructor({ sourceNetwork, targetNetwork, mnemonic, ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, processIntervalMs, checkPendingIntervalMs, }: {
        sourceNetwork: any;
        targetNetwork: any;
        mnemonic: any;
        ccBurnContractAddress: any;
        lockerContractAddress: any;
        bitcoinRelayContractAddress: any;
        processIntervalMs?: number | undefined;
        checkPendingIntervalMs?: number | undefined;
    });
    sourceNetworkName: any;
    mnemonic: any;
    baseEthWeb3: any;
    btcInterface: any;
    lockerBtcTx: any;
    rescueBtcTx: any;
    bitcoinAddress: string;
    bitcoinLockingScript: string;
    rescueBitcoinAddress: string;
    pendingRequest: any[];
    numberOfConfirmations: number;
    isProcessing: boolean;
    isChecking: boolean;
    maximumNumberOfRequestPerRound: number;
    processIntervalMs: number;
    checkPendingIntervalMs: number;
    startEthBlockNumber: number;
    setContractsInterfaces({ ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, }: {
        ccBurnContractAddress: any;
        lockerContractAddress: any;
        bitcoinRelayContractAddress: any;
    }): void;
    ccBurnInterface: any;
    relayInterface: any;
    lockerInterface: any;
    setAccount(index?: number): {
        bitcoinAddress: any;
        ethereumAddress: any;
    };
    setBitcoinAccount(index?: number): any;
    setEthAccount(index?: number): any;
    ethClientAddress: any;
    setLockerTargetAddress(): Promise<any>;
    lockerTargetAddress: any;
    setNumberOfConfirmations(): Promise<void>;
    handleBurnEvent(parsedEventRequests: any): Promise<void>;
    checkNotPaidEvent(): Promise<void>;
    checkPendingRequests(): Promise<void>;
    checkNearDeadlineRequest(): Promise<void>;
    listenForNewRequest(): Promise<any>;
    processRequests(): Promise<void>;
    start(): Promise<void>;
}
