"use strict";
const tslib_1 = require("tslib");
const { LockerContract } = require("@sinatdt/contracts-helper").contracts;
let { contractsInfo } = require("@sinatdt/configs").teleswap;
const polygonContracts = contractsInfo.polygon;
const { createAddressObjectByScript } = require("@sinatdt/bitcoin").bitcoinUtils;
const networks = require("@sinatdt/bitcoin").bitcoinUtils.networks;
const getLockerPendingRequest = require("./get-locker-pending-request");
const getLockerPendingBurn = require("./get-locker-pending-burn");
const { getWeb3Eth } = require("./helper");
function getLockersForBurn({ amount, targetNetworkConnectionInfo, testnet = false, lockerTargetAddress = [], }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let contracts = testnet ? polygonContracts.testnet : polygonContracts.mainnet;
        let { connectionConfig } = getWeb3Eth(targetNetworkConnectionInfo);
        let sourceNetworkName = testnet ? "bitcoin_testnet" : "bitcoin";
        let lockerEthAddresses = lockerTargetAddress;
        let lockerInterface = new LockerContract(connectionConfig, contracts.lockerAddress);
        let network = networks[sourceNetworkName];
        let lockersInfo = yield Promise.all(lockerEthAddresses.map((L) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lockerInfo = yield lockerInterface.getLockerInfo(L);
            let capacity = yield lockerInterface.getLockerCapacity(L);
            let bitcoinAddress = createAddressObjectByScript({
                addressType: "p2sh",
                script: Buffer.from(lockerInfo.lockerLockingScript.replace("0x", ""), "hex"),
            }, network).address;
            let unsubmittedAmount = (yield getLockerPendingBurn(bitcoinAddress)).unsubmittedAmount;
            return {
                bitcoinAddress,
                targetAddress: L,
                capacity,
                unsubmittedAmount,
                warning: +lockerInfo.netMinted - unsubmittedAmount < 2 * amount * 1e8,
                lockerInfo,
            };
        })));
        let availableLockers = lockersInfo
            .filter((l) => l.lockerInfo.isLocker && l.lockerInfo.isActive)
            .filter((l) => +l.lockerInfo.netMinted > amount * 1e8)
            .sort((a, b) => +b.lockerInfo.netMinted - +a.lockerInfo.netMinted);
        return {
            availableLockers,
            preferredLocker: availableLockers.find((l) => l.warning === false),
        };
    });
}
function getLockersForTransfer({ amount, targetNetworkConnectionInfo, testnet = false, lockerTargetAddress = [], }) {
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
        let lockerEthAddresses = lockerTargetAddress;
        let lockerInterface = new LockerContract(connectionConfig, contracts.lockerAddress);
        let network = networks[sourceNetworkName];
        let lockersInfo = yield Promise.all(lockerEthAddresses.map((L) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lockerInfo = yield lockerInterface.getLockerInfo(L);
            let capacity = yield lockerInterface.getLockerCapacity(L);
            let bitcoinAddress = createAddressObjectByScript({
                addressType: "p2sh",
                script: Buffer.from(lockerInfo.lockerLockingScript.replace("0x", ""), "hex"),
            }, network).address;
            let unsubmittedAmount = (yield getLockerPendingRequest(bitcoinAddress)).unsubmittedAmount;
            return {
                bitcoinAddress,
                targetAddress: L,
                capacity,
                unsubmittedAmount,
                warning: capacity - unsubmittedAmount < 2 * amount * 1e8,
                lockerInfo,
            };
        })));
        let availableLockers = lockersInfo
            .filter((l) => l.lockerInfo.isLocker && l.lockerInfo.isActive)
            .filter((l) => +l.capacity > amount * 1e8)
            .sort((a, b) => +b.capacity - +a.capacity);
        return {
            availableLockers,
            preferredLocker: availableLockers.find((l) => l.warning === false),
        };
    });
}
function getLockers({ amount, type = "transfer", targetNetworkConnectionInfo, testnet = false, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        switch (type) {
            case "transfer":
                return getLockersForTransfer({
                    amount,
                    targetNetworkConnectionInfo,
                    testnet,
                });
            case "burn":
                return getLockersForBurn({
                    amount,
                    targetNetworkConnectionInfo,
                    testnet,
                });
            default:
                throw new Error("incorrect type");
        }
    });
}
module.exports = getLockers;
//# sourceMappingURL=get-lockers.js.map