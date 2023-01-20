export = getLockersList;
declare function getLockersList({ targetNetworkConnectionInfo, testnet, lockerTargetAddress, }: {
    targetNetworkConnectionInfo: any;
    testnet?: boolean | undefined;
    lockerTargetAddress?: any[] | undefined;
}): Promise<{
    bitcoinAddress: any;
    targetAddress: any;
}[]>;
