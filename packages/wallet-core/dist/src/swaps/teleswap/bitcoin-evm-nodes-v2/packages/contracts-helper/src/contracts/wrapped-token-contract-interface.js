"use strict";
const tslib_1 = require("tslib");
const EthereumBase = require("../ethereum-base");
const { WrappedTokenABI } = require("@sinatdt/configs").teleswap.ABI;
class WrappedToken extends EthereumBase {
    constructor(connectionConfig, contractAddress, unit) {
        super(connectionConfig);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(WrappedTokenABI, contractAddress);
        this.unit = unit;
    }
    setDecimal() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let decimal = yield this.contract.methods.decimals().call();
            this.unit = decimal;
        });
    }
    getDecimal() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.unit)
                yield this.setDecimal();
            return this.unit;
        });
    }
    mintTestToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const gasAmount = yield this.contract.methods
                .mintTestToken()
                .estimateGas({ from: this.currentAccount });
            return this.contract.methods
                .mintTestToken()
                .send({ from: this.currentAccount, gas: gasAmount });
        });
    }
    approve(address, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const gasAmount = yield this.contract.methods
                .approve(address, amount)
                .estimateGas({ from: this.currentAccount });
            return this.contract.methods
                .approve(address, amount)
                .send({ from: this.currentAccount, gas: gasAmount });
        });
    }
    getBalance(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let balance = yield this.contract.methods
                .balanceOf(address || this.currentAccount)
                .call();
            return balance;
        });
    }
    getApprovedBalanceForAddress(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let balance = yield this.contract.methods
                .allowance(this.currentAccount, address)
                .call();
            return balance;
        });
    }
}
module.exports = WrappedToken;
//# sourceMappingURL=wrapped-token-contract-interface.js.map