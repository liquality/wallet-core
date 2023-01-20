"use strict";
const RPC = require('./rpc');
const ApiProviders = require('./api');
function getRpcProvider(connectionInfo) {
    const { url, headers, auth } = connectionInfo;
    return new RpcProvider({
        url,
        headers,
        auth,
    });
}
function getApiProvider(connectionInfo, networkName) {
    let Provider = ApiProviders[connectionInfo.provider];
    if (!Provider)
        throw new Error('provider not supported');
    let testnet = networkName.includes('_testnet');
    return new Provider({
        token: connectionInfo.token,
    }, testnet);
}
module.exports = {
    RPC,
    ApiProviders,
    getRpcProvider,
    getApiProvider,
};
//# sourceMappingURL=index.js.map