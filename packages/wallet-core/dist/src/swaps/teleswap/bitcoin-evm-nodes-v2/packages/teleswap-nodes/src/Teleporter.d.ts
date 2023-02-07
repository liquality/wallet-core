export = Teleporter;
declare class Teleporter {
    constructor({ allLockerAddresses, sourceNetwork, targetNetwork, mnemonic, ccBurnContractAddress, bitcoinRelayContractAddress, lendingContractAddress, ccTransferContractAddress, ccExchangeContractAddress, instantRouterContractAddress, lockerContractAddress, isTeleportActivated, isSlashLockerActivated, isSlashUserActivated, isLendingActivated, }: {
        allLockerAddresses?: any[] | undefined;
        sourceNetwork: any;
        targetNetwork: any;
        mnemonic: any;
        ccBurnContractAddress: any;
        bitcoinRelayContractAddress: any;
        lendingContractAddress: any;
        ccTransferContractAddress: any;
        ccExchangeContractAddress: any;
        instantRouterContractAddress: any;
        lockerContractAddress: any;
        isTeleportActivated: any;
        isSlashLockerActivated: any;
        isSlashUserActivated: any;
        isLendingActivated: any;
    });
    allLockerAddresses: any[];
    validLockerAddresses: any;
    isWsProvider: any;
    teleport: any;
    slashUser: any;
    slashLocker: any;
    isTeleportActivated: any;
    isSlashLockerActivated: any;
    isSlashUserActivated: any;
    setContractsInterfaces({ connectionConfig, bitcoinRelayContractAddress }: {
        connectionConfig: any;
        bitcoinRelayContractAddress: any;
    }): void;
    btcRelayInterface: any;
    init(index?: number): Promise<void>;
    listenForNewBlock(): Promise<void>;
    startTeleporter(): Promise<void>;
}
