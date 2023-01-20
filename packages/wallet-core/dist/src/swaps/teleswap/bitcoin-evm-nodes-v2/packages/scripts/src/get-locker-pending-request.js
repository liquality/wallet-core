"use strict";
const tslib_1 = require("tslib");
const { getWeb3Eth } = require("./helper");
const { CcTransferRouter, CcExchangeRouter, LendingRouter, BitcoinRelay } = require("@sinatdt/contracts-helper").contracts;
const { BitcoinInterface } = require("@sinatdt/bitcoin");
let { contractsInfo } = require("@sinatdt/configs").teleswap;
const polygonContracts = contractsInfo.polygon;
function getLockerPendingRequests(lockerBtcAddress, targetNetworkConnectionInfo, testnet = false) {
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
        const ccTransfer = new CcTransferRouter(connectionConfig, contracts.ccTransferAddress);
        const ccExchange = new CcExchangeRouter(connectionConfig, contracts.ccExchangeAddress);
        const lending = new LendingRouter(connectionConfig, contracts.lendingAddress);
        let lockerAddresses = [lockerBtcAddress];
        let numberOfConfirmations = yield relay.getNumberOfConfirmations();
        let lastBlock = yield relay.lastSubmittedHeight();
        const btcInterface = new BitcoinInterface(sourceNetworkConnection, sourceNetworkName);
        let confirmedRequests = yield btcInterface.getTeleporterRequests(lockerAddresses, +lastBlock - 10 * +numberOfConfirmations);
        let pendingRequests = yield btcInterface.getTeleporterRequests(lockerAddresses, undefined, undefined, true);
        let isUsed = [];
        confirmedRequests.forEach((data, index) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (data.request.data.requestType) {
                case "transfer":
                    isUsed[index] = ccTransfer.isUsed(data.transaction.txId);
                    break;
                case "exchange":
                    isUsed[index] = ccExchange.isUsed(data.transaction.txId);
                    break;
                case "lend":
                case "borrow":
                    isUsed[index] = lending.isUsed(data.transaction.txId);
                    break;
                default: {
                    console.error(data);
                }
            }
        }));
        isUsed = yield Promise.all(isUsed);
        confirmedRequests = confirmedRequests.filter((rs, index) => !isUsed[index]);
        return {
            confirmedRequests,
            pendingRequests,
            numberOfUnsubmittedRequests: pendingRequests.length + confirmedRequests.length,
            unsubmittedAmount: pendingRequests.reduce((a, c) => { var _a; return a + Number(((_a = c.request) === null || _a === void 0 ? void 0 : _a.value) || 0); }, 0) +
                confirmedRequests.reduce((a, c) => { var _a; return a + Number(((_a = c.request) === null || _a === void 0 ? void 0 : _a.value) || 0); }, 0),
        };
    });
}
module.exports = getLockerPendingRequests;
//# sourceMappingURL=get-locker-pending-request.js.map