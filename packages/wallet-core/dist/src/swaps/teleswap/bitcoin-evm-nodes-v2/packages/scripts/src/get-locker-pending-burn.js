"use strict";
const tslib_1 = require("tslib");
const { CcBurnRouter, BitcoinRelay } = require("@sinatdt/contracts-helper").contracts;
const { BitcoinInterface } = require("@sinatdt/bitcoin");
let { contractsInfo } = require("@sinatdt/configs").teleswap;
const polygonContracts = contractsInfo.polygon;
const { getWeb3Eth } = require("./helper");
function getLockerPendingBurns({ lockerBtcAddress, targetNetworkConnectionInfo, testnet = false, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let sourceNetworkConnection = {
            api: {
                enabled: true,
                provider: "BlockStream",
            },
        };
        let sourceNetworkName = testnet ? "bitcoin_testnet" : "bitcoin";
        let contracts = testnet ? polygonContracts.testnet : polygonContracts.mainnet;
        let { connectionConfig } = getWeb3Eth(targetNetworkConnectionInfo);
        const relay = new BitcoinRelay(connectionConfig, contracts.relayAddress);
        const ccBurn = new CcBurnRouter(connectionConfig, contracts.ccBurnAddress);
        let lockerAddresses = [lockerBtcAddress];
        console.log(lockerAddresses);
        let numberOfConfirmations = yield relay.getNumberOfConfirmations();
        let lastBlock = yield relay.lastSubmittedHeight();
        const btcInterface = new BitcoinInterface(sourceNetworkConnection, sourceNetworkName);
        let confirmedTxs = yield btcInterface.getLockersBurnTransactions(lockerAddresses, +lastBlock - 10 * +numberOfConfirmations);
        let pendingTxs = yield btcInterface.getLockersBurnTransactions(lockerAddresses, undefined, undefined, true);
        let isUsed = [];
        confirmedTxs.forEach((data, index) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            isUsed[index] = ccBurn.isUsedAsBurnProof(data.transaction.txId);
        }));
        isUsed = yield Promise.all(isUsed);
        confirmedTxs = confirmedTxs.filter((rs, index) => !isUsed[index]);
        console.log(pendingTxs, lockerBtcAddress);
        return {
            confirmedTxs,
            pendingTxs,
            numberOfUnsubmittedTxs: pendingTxs.length + confirmedTxs.length,
            unsubmittedAmount: pendingTxs.reduce((a, c) => a +
                c.transaction.vin.reduce((s, t) => s + Number(t.value || 0), 0) -
                c.burnInfo.changes.reduce((s, t) => s + Number(t.value || 0), 0), 0) +
                confirmedTxs.reduce((a, c) => a +
                    c.transaction.vin.reduce((s, t) => s + Number(t.value || 0), 0) -
                    c.burnInfo.changes.reduce((s, t) => s + Number(t.value || 0), 0), 0),
        };
    });
}
module.exports = getLockerPendingBurns;
//# sourceMappingURL=get-locker-pending-burn.js.map