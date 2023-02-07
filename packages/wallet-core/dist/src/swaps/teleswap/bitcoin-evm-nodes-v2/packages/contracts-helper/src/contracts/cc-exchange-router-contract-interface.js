"use strict";
const tslib_1 = require("tslib");
const EthereumBase = require("../ethereum-base");
const { CCExchangeRouterABI } = require("@sinatdt/configs").teleswap.ABI;
class CcExchangeRouter extends EthereumBase {
    constructor(connectionInfo, contractAddress) {
        super(connectionInfo);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(CCExchangeRouterABI, contractAddress);
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
    sendExchangeRequest(lockerScript, parsedTx, merkleProof, blockNumber, blockFee, nonce = undefined) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let value = blockFee ? (+blockFee * 1.3).toFixed() : "100000000000000000";
            const gasAmount = yield this.contract.methods
                .ccExchange(parsedTx.version, parsedTx.vin, parsedTx.vout, parsedTx.locktime, blockNumber, merkleProof.intermediateNodes, merkleProof.transactionIndex, `0x${lockerScript}`)
                .estimateGas({ from: this.currentAccount, value });
            let response = yield this.contract.methods
                .ccExchange(parsedTx.version, parsedTx.vin, parsedTx.vout, parsedTx.locktime, blockNumber, merkleProof.intermediateNodes, merkleProof.transactionIndex, `0x${lockerScript}`)
                .send({ from: this.currentAccount, gas: gasAmount, value, nonce })
                .then((recipient) => ({
                success: recipient.status,
                txId: recipient.transactionHash,
            }));
            return response;
        });
    }
}
module.exports = CcExchangeRouter;
//# sourceMappingURL=cc-exchange-router-contract-interface.js.map