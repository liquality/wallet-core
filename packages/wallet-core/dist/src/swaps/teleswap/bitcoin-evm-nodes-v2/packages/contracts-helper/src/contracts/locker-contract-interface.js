"use strict";
const tslib_1 = require("tslib");
const EthereumBase = require("../ethereum-base");
const { LockersLogicABI } = require("@sinatdt/configs").teleswap.ABI;
const { addressTypesNumber, addressTypes } = require("@sinatdt/configs").teleswap.bitcoinAddressTypes;
class LockerContract extends EthereumBase {
    constructor(connectionInfo, contractAddress) {
        super(connectionInfo);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(LockersLogicABI, this.contractAddress);
    }
    isLocker(lockingScript) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.isLocker(lockingScript).call();
        });
    }
    getLockerTargetAddress(lockingScript) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getLockerTargetAddress(lockingScript).call();
        });
    }
    getLockerLockingScript(targetAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getLockerLockingScript(targetAddress).call();
        });
    }
    getLockerPercentageFee() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.lockerPercentageFee().call();
        });
    }
    isValidLocker(lockingScript, targetAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let hexLockerScript = `0x${lockingScript.replace("0x", "")}`;
            let address = yield this.getLockerTargetAddress(hexLockerScript);
            let isLocker = yield this.isLocker(hexLockerScript);
            console.log("isLocker", isLocker);
            return isLocker && address === targetAddress;
        });
    }
    getLockerCapacity(targetAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getLockerCapacity(targetAddress).call();
        });
    }
    getLockerInfo(targetAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { lockerLockingScript, lockerRescueType, lockerRescueScript, TDTLockedAmount, nativeTokenLockedAmount, netMinted, slashingTeleBTCAmount, reservedNativeTokenForSlash, isLocker, isCandidate, isScriptHash, isActive, } = yield this.contract.methods.lockersMapping(targetAddress).call();
            return {
                lockerLockingScript,
                lockerRescueType: addressTypes[+lockerRescueType],
                lockerRescueScript,
                TDTLockedAmount,
                nativeTokenLockedAmount,
                netMinted,
                slashingTeleBTCAmount,
                reservedNativeTokenForSlash,
                isLocker,
                isCandidate,
                isScriptHash,
                isActive,
            };
        });
    }
    requestToBecomeLocker({ lockerLockingScript, lockedTDTAmount, lockedNativeTokenAmount, lockerRescueType, lockerRescueScript, nonce = undefined, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const gasAmount = yield this.contract.methods
                    .requestToBecomeLocker(lockerLockingScript, lockedTDTAmount, lockedNativeTokenAmount, addressTypesNumber[lockerRescueType], lockerRescueScript)
                    .estimateGas({
                    from: this.currentAccount,
                    value: lockedNativeTokenAmount,
                    nonce,
                });
                let response = yield this.contract.methods
                    .requestToBecomeLocker(lockerLockingScript, lockedTDTAmount, lockedNativeTokenAmount, addressTypesNumber[lockerRescueType], lockerRescueScript)
                    .send({
                    from: this.currentAccount,
                    value: lockedNativeTokenAmount,
                    gas: gasAmount,
                    nonce,
                })
                    .then((recipient) => ({
                    success: recipient.status,
                    txId: recipient.transactionHash,
                }));
                return response;
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    addCollateral({ targetAddress = this.currentAccount, nativeTokenAmount, nonce = undefined, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const gasAmount = yield this.contract.methods
                    .addCollateral(targetAddress, nativeTokenAmount)
                    .estimateGas({
                    from: this.currentAccount,
                    value: nativeTokenAmount,
                    nonce,
                });
                let response = yield this.contract.methods
                    .addCollateral(targetAddress, nativeTokenAmount)
                    .send({
                    from: this.currentAccount,
                    value: nativeTokenAmount,
                    gas: gasAmount,
                    nonce,
                })
                    .then((recipient) => ({
                    success: recipient.status,
                    txId: recipient.transactionHash,
                }));
                return response;
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
}
module.exports = LockerContract;
//# sourceMappingURL=locker-contract-interface.js.map