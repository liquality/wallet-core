export = getUserPendingBurns;
declare function getUserPendingBurns({ userBurnRequests, lockerAddresses, targetNetworkConnectionInfo, testnet, }: {
    userBurnRequests: {
        amount: number;
        address: string;
    };
    lockerAddresses: string;
    targetNetworkConnectionInfo: any;
    testnet: boolean;
}): Promise<{
    processedBurns: any[];
    unprocessedBurns: any[];
}>;
