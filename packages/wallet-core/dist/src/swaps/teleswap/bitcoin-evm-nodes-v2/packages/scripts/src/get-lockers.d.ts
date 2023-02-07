export = getLockers;
declare function getLockers({ amount, type, targetNetworkConnectionInfo, testnet, }: {
    amount: any;
    type?: string | undefined;
    targetNetworkConnectionInfo: any;
    testnet?: boolean | undefined;
}): Promise<{
    availableLockers: {
        bitcoinAddress: any;
        targetAddress: any;
        capacity: any;
        unsubmittedAmount: any;
        warning: boolean;
        lockerInfo: any;
    }[];
    preferredLocker: {
        bitcoinAddress: any;
        targetAddress: any;
        capacity: any;
        unsubmittedAmount: any;
        warning: boolean;
        lockerInfo: any;
    } | undefined;
}>;
