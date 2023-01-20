"use strict";
const { EthereumBase: EthBase } = require("@sinatdt/contracts-helper");
function getWeb3Eth(targetNetworkConnectionInfo) {
    let baseEth;
    if (targetNetworkConnectionInfo.provider) {
        baseEth = new EthBase({});
        baseEth.setWeb3EthProvider(targetNetworkConnectionInfo.provider);
    }
    else {
        baseEth = new EthBase({
            connectionInfo: targetNetworkConnectionInfo.web3,
        });
    }
    const connectionConfig = {
        web3Eth: baseEth.web3Eth,
    };
    return { baseEth, connectionConfig };
}
module.exports = {
    getWeb3Eth,
};
//# sourceMappingURL=helper.js.map