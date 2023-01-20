"use strict";
const tslib_1 = require("tslib");
const { getWeb3Eth } = require("./helper");
const { LockerContract } = require("@sinatdt/contracts-helper").contracts;
let { contractsInfo } = require("@sinatdt/configs").teleswap;
const polygonContracts = contractsInfo.polygon;
const { createAddressObjectByScript } = require("@sinatdt/bitcoin").bitcoinUtils;
const networks = require("@sinatdt/bitcoin").bitcoinUtils.networks;
function getLockersList({ targetNetworkConnectionInfo, testnet = false, lockerTargetAddress = [], }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let contracts = testnet ? polygonContracts.testnet : polygonContracts.mainnet;
        let { connectionConfig } = getWeb3Eth(targetNetworkConnectionInfo);
        let sourceNetworkName = testnet ? "bitcoin_testnet" : "bitcoin";
        let lockerEthAddresses = lockerTargetAddress;
        let lockerInterface = new LockerContract(connectionConfig, contracts.lockerAddress);
        let network = networks[sourceNetworkName];
        let lockersInfo = yield Promise.all(lockerEthAddresses.map((lockerTgAddress) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lockerInfo = yield lockerInterface.getLockerInfo(lockerTgAddress);
            let bitcoinAddress = createAddressObjectByScript({
                addressType: "p2sh",
                script: Buffer.from(lockerInfo.lockerLockingScript.replace("0x", ""), "hex"),
            }, network).address;
            return {
                bitcoinAddress,
                targetAddress: lockerTgAddress,
            };
        })));
        let allLockers = lockersInfo;
        return allLockers;
    });
}
module.exports = getLockersList;
//# sourceMappingURL=get-lockers-list.js.map