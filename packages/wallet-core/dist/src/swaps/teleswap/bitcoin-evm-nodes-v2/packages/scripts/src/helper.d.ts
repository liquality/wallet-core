export function getWeb3Eth(targetNetworkConnectionInfo: {
    provider: any | null;
    web3: Object | null;
}): {
    baseEth: any;
    connectionConfig: {
        web3Eth: any;
    };
};
