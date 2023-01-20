"use strict";
const tslib_1 = require("tslib");
const { CCBurnRouterABI } = require("@sinatdt/configs").teleswap.ABI;
const { addressTypes } = require("@sinatdt/configs").teleswap.bitcoinAddressTypes;
const { bitcoinUtils } = require("@sinatdt/bitcoin");
const EthereumBase = require("../ethereum-base");
const { createAddressObjectByHash, networks } = bitcoinUtils;
class CcBurnRouter extends EthereumBase {
    constructor(connectionInfo, contractAddress) {
        super(connectionInfo);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(CCBurnRouterABI, contractAddress);
    }
    static parseCcBurnEvent(event, sourceNetworkName = "bitcoin") {
        let network = networks[sourceNetworkName];
        const txInfo = this.extractEventTxInfo(event);
        const { userTargetAddress, userScript, scriptType, amount, burntAmount, lockerTargetAddress, lockerLockingScript, requestIdOfLocker, deadline, } = event.returnValues;
        let address = createAddressObjectByHash({
            addressType: addressTypes[scriptType],
            hash: Buffer.from(userScript.replace("0x", ""), "hex"),
        }, network).address;
        return {
            addressType: addressTypes[scriptType],
            addressScript: userScript.replace("0x", ""),
            address,
            requestIndex: requestIdOfLocker,
            amount,
            burntAmount,
            lockerTargetAddress,
            lockerLockingScript: lockerLockingScript.replace("0x", ""),
            userTargetAddress,
            deadline,
            txInfo,
        };
    }
    static parsePaidBurnEvent(event) {
        const { bitcoinTxId, bitcoinTxOutputIndex, lockerTargetAddress, requestIdOfLocker } = event.returnValues;
        return {
            bitcoinTxId: bitcoinTxId.replace("0x", ""),
            bitcoinTxOutputIndex,
            lockerTargetAddress,
            requestIndex: requestIdOfLocker,
        };
    }
    static parseBurnDisputeEvent(event) {
        const { userTargetAddress, _lockerTargetAddress, lockerLockingScript, requestIdOfLocker } = event.returnValues;
        return {
            lockerLockingScript,
            userTargetAddress,
            lockerTargetAddress: _lockerTargetAddress,
            requestIndex: requestIdOfLocker,
        };
    }
    static parseLockerDisputeEvent(event) {
        const { _lockerTargetAddress, lockerLockingScript, _blockNumber, txId, amount } = event.returnValues;
        return {
            txId: txId.replace("0x", ""),
            amount,
            lockerLockingScript,
            blockNumber: _blockNumber,
            lockerTargetAddress: _lockerTargetAddress,
        };
    }
    getProtocolPercentageFee() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.protocolPercentageFee().call();
        });
    }
    getBitcoinFee() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.bitcoinFee().call();
        });
    }
    isTransferred(lockerTargetAddress, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.isTransferred(lockerTargetAddress, index).call();
        });
    }
    isUsedAsBurnProof(bitcoinTxId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let txIdWith0x = `0x${Buffer.from(bitcoinTxId, "hex").reverse().toString("hex")}`;
            return this.contract.methods.isUsedAsBurnProof(txIdWith0x).call();
        });
    }
    getBurnTransferDeadline() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.transferDeadline().call();
        });
    }
    getBurnEvents(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("CCBurn", {
                fromBlock,
            });
            return events.map((event) => CcBurnRouter.parseCcBurnEvent(event));
        });
    }
    getPaidBurnEvents(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("PaidCCBurn", {
                fromBlock,
            });
            return events.map((event) => CcBurnRouter.parsePaidBurnEvent(event));
        });
    }
    getBurnDisputeEvents(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("BurnDispute", {
                fromBlock,
            });
            return events.map((event) => CcBurnRouter.parseBurnDisputeEvent(event));
        });
    }
    getLockerDisputeEvents(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("LockerDispute", {
                fromBlock,
            });
            return events.map((event) => CcBurnRouter.parseLockerDisputeEvent(event));
        });
    }
    sendBurnProof(parsedTx, merkleProof, blockNumber, requestIndexes, voutIndexes, lockerLockingScript, blockFee, nonce = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let value = blockFee ? (+blockFee * 1.3).toFixed() : "100000000000000000";
                const gasAmount = yield this.contract.methods
                    .burnProof(parsedTx.version, parsedTx.vin, parsedTx.vout, parsedTx.locktime, blockNumber, merkleProof.intermediateNodes, merkleProof.transactionIndex, lockerLockingScript, requestIndexes, voutIndexes)
                    .estimateGas({ from: this.currentAccount, value });
                let response = yield this.contract.methods
                    .burnProof(parsedTx.version, parsedTx.vin, parsedTx.vout, parsedTx.locktime, blockNumber, merkleProof.intermediateNodes, merkleProof.transactionIndex, lockerLockingScript, requestIndexes, voutIndexes)
                    .send({ from: this.currentAccount, gas: gasAmount, value });
                return {
                    success: response.status,
                    txId: response.transactionHash,
                };
            }
            catch (error) {
                console.log("***********error******", JSON.stringify(error));
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    disputeBurn(lockerLockingScript, arrayOfRequestIndexes, nonce = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const gasAmount = yield this.contract.methods
                    .disputeBurn(lockerLockingScript, arrayOfRequestIndexes)
                    .estimateGas({ from: this.currentAccount });
                let response = yield this.contract.methods
                    .disputeBurn(lockerLockingScript, arrayOfRequestIndexes)
                    .send({ from: this.currentAccount, gas: gasAmount });
                return {
                    success: response.status,
                    txId: response.transactionHash,
                };
            }
            catch (error) {
                console.log("***********error******", JSON.stringify(error));
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    disputeLocker(lockerLockingScript, input, output, blockFee, nonce = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let value = blockFee ? (+blockFee * 1.3).toFixed() : "100000000000000000";
                console.log(JSON.stringify({
                    lockerLockingScript,
                    ver: [input.parsedTx.version, output.parsedTx.version],
                    i_vin: input.parsedTx.vin,
                    i_vout: input.parsedTx.vout,
                    o_vin: output.parsedTx.vin,
                    o_vout: output.parsedTx.vout,
                    locktime: [input.parsedTx.locktime, output.parsedTx.locktime],
                    intermediateNodes: input.merkleProof.intermediateNodes,
                    numbers: [output.index, input.merkleProof.transactionIndex, input.blockNumber],
                }, null, 2));
                const gasAmount = yield this.contract.methods
                    .disputeLocker(lockerLockingScript, [input.parsedTx.version, output.parsedTx.version], input.parsedTx.vin, input.parsedTx.vout, output.parsedTx.vin, output.parsedTx.vout, [input.parsedTx.locktime, output.parsedTx.locktime], input.merkleProof.intermediateNodes, [output.index, input.merkleProof.transactionIndex, input.blockNumber])
                    .estimateGas({ from: this.currentAccount, value });
                let response = yield this.contract.methods
                    .disputeLocker(lockerLockingScript, [input.parsedTx.version, output.parsedTx.version], input.parsedTx.vin, input.parsedTx.vout, output.parsedTx.vin, output.parsedTx.vout, [input.parsedTx.locktime, output.parsedTx.locktime], input.merkleProof.intermediateNodes, [output.index, input.merkleProof.transactionIndex, input.blockNumber])
                    .send({ from: this.currentAccount, gas: gasAmount, value });
                return {
                    success: response.status,
                    txId: response.transactionHash,
                };
            }
            catch (error) {
                console.log("***********error******", JSON.stringify(error));
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
}
module.exports = CcBurnRouter;
//# sourceMappingURL=cc-burn-router-contract-interface.js.map