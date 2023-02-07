"use strict";
const tslib_1 = require("tslib");
const EthereumBase = require("../ethereum-base");
const { CCTransferRouterABI } = require("@sinatdt/configs").teleswap.ABI;
class CcTransferRouter extends EthereumBase {
    constructor(connectionInfo, contractAddress) {
        super(connectionInfo);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(CCTransferRouterABI, contractAddress);
        this.contract.handleRevert = true;
    }
    getNeededConfirmations() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let confirmations = yield this.contract.methods
                .normalConfirmationParameter()
                .call();
            return confirmations;
        });
    }
    getProtocolPercentageFee() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.protocolPercentageFee().call();
        });
    }
    isUsed(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let txIdWith0x = `0x${Buffer.from(txId, "hex").reverse().toString("hex")}`;
            let isUsed = yield this.contract.methods.isRequestUsed(txIdWith0x).call();
            return isUsed;
        });
    }
    sendTransferRequest(lockerScript, parsedTx, merkleProof, blockNumber, blockFee, nonce = undefined) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let value = blockFee ? (+blockFee * 1.3).toFixed() : "100000000000000000";
                const gasAmount = yield this.contract.methods
                    .ccTransfer(parsedTx.version, parsedTx.vin, parsedTx.vout, parsedTx.locktime, blockNumber, merkleProof.intermediateNodes, merkleProof.transactionIndex, `0x${lockerScript}`)
                    .estimateGas({ from: this.currentAccount, value, nonce });
                let response = yield this.contract.methods
                    .ccTransfer(parsedTx.version, parsedTx.vin, parsedTx.vout, parsedTx.locktime, blockNumber, merkleProof.intermediateNodes, merkleProof.transactionIndex, `0x${lockerScript}`)
                    .send({ from: this.currentAccount, gas: gasAmount, value, nonce })
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
module.exports = CcTransferRouter;
//# sourceMappingURL=cc-transfer-router-contract-interface.js.map