"use strict";
const tslib_1 = require("tslib");
const { getWeb3Eth } = require('./helper');
const { BitcoinRelay } = require('@sinatdt/contracts-helper').contracts;
const { BitcoinInterface } = require('@sinatdt/bitcoin');
let { contractsInfo } = require('@sinatdt/configs').teleswap;
const polygonContracts = contractsInfo.polygon;
function getUserPendingBurns({ userBurnRequests, lockerAddresses, targetNetworkConnectionInfo, testnet = false, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let sourceNetworkConnection = {
            api: {
                enabled: true,
                provider: 'BlockStream',
            },
        };
        let sourceNetworkName = testnet ? 'bitcoin_testnet' : 'bitcoin';
        const btcInterface = new BitcoinInterface(sourceNetworkConnection, sourceNetworkName);
        let contracts = testnet ? polygonContracts.testnet : polygonContracts.mainnet;
        let { connectionConfig } = getWeb3Eth(targetNetworkConnectionInfo);
        let userAddresses = new Set(userBurnRequests.map((r) => r.address));
        const relay = new BitcoinRelay(connectionConfig, contracts.relayAddress);
        let numberOfConfirmations = yield relay.getNumberOfConfirmations();
        let lastBlock = yield relay.lastSubmittedHeight();
        let confirmedTxs = yield btcInterface.getLockersBurnTransactions(lockerAddresses, +lastBlock - 10 * +numberOfConfirmations);
        confirmedTxs = confirmedTxs.filter((rs) => rs.burnInfo.receivers.find((r) => userAddresses.has(r.address)));
        let processedBurns = [];
        let unprocessedBurns = [];
        userBurnRequests.forEach((br) => {
            let receiver;
            let txIndex = confirmedTxs.findIndex((rs) => {
                receiver = rs.burnInfo.receivers.find((r) => br.address === r.address);
                return receiver;
            });
            if (receiver && +receiver.value === br.amount) {
                confirmedTxs.splice(txIndex, 1);
                processedBurns.push(Object.assign(Object.assign({}, br), { requests: confirmedTxs[txIndex] }));
            }
            else {
                unprocessedBurns.push(br);
            }
        });
        return {
            processedBurns,
            unprocessedBurns,
        };
    });
}
module.exports = getUserPendingBurns;
//# sourceMappingURL=get-user-pending-burn.js.map