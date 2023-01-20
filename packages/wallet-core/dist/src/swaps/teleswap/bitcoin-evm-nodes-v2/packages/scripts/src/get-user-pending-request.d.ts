export = getUserPendingRequests;
declare function getUserPendingRequests({ ethClientAddress, lockerAddresses, targetNetworkConnectionInfo, testnet, }: {
    ethClientAddress: any;
    lockerAddresses: any;
    targetNetworkConnectionInfo: any;
    testnet?: boolean | undefined;
}): Promise<{
    confirmedRequests: any;
    pendingRequests: any;
}>;
