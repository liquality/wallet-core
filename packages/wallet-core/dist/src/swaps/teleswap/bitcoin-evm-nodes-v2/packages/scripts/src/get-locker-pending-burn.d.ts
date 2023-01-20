export = getLockerPendingBurns;
declare function getLockerPendingBurns({ lockerBtcAddress, targetNetworkConnectionInfo, testnet, }: {
    lockerBtcAddress: any;
    targetNetworkConnectionInfo: any;
    testnet?: boolean | undefined;
}): Promise<{
    confirmedTxs: any;
    pendingTxs: any;
    numberOfUnsubmittedTxs: any;
    unsubmittedAmount: any;
}>;
