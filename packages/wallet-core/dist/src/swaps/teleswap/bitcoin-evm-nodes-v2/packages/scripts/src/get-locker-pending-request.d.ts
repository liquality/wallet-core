export = getLockerPendingRequests;
declare function getLockerPendingRequests(lockerBtcAddress: any, targetNetworkConnectionInfo: any, testnet?: boolean): Promise<{
    confirmedRequests: any;
    pendingRequests: any;
    numberOfUnsubmittedRequests: any;
    unsubmittedAmount: any;
}>;
