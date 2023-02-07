export = SlashUser;
declare class SlashUser {
    constructor({ targetNetwork, mnemonic, instantRouterContractAddress, }: {
        targetNetwork: any;
        mnemonic: any;
        instantRouterContractAddress: any;
    });
    workId: string;
    mnemonic: any;
    baseEthWeb3: any;
    submittingRequests: boolean;
    setContractsInterfaces({ instantRouterContractAddress }: {
        instantRouterContractAddress: any;
    }): void;
    instantRouterInterface: any;
    setAccount(index?: number): any;
    ethClientAddress: any;
    getOldInstantEvent(): Promise<void>;
    handlePunishUser(lastBlockNumber?: number): Promise<void>;
    checkPaidRequests(nexBlockNumber: any): Promise<void>;
    listenForInstantEvents(): void;
    processOldRequests(lastBtcBlockNumber: any): Promise<void>;
    newBlockReceived(blockEvent: any): Promise<void>;
    lastCheckedBitcoinBlock: number | undefined;
}
