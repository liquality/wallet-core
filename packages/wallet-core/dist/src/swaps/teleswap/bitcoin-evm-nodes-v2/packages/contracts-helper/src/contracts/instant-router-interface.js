"use strict";
const tslib_1 = require("tslib");
const EthereumBase = require("../ethereum-base");
const { InstantRouterABI } = require("@sinatdt/configs").teleswap.ABI;
class InstantRouter extends EthereumBase {
    constructor(connectionInfo, contractAddress) {
        super(connectionInfo);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(InstantRouterABI, contractAddress);
    }
    getInstantDebts(userAddress, lastBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let debts = [];
            let lastDebt = null;
            let i = 0;
            let debt;
            do {
                debt = yield this.contract.methods
                    .instantRequests(userAddress, i)
                    .call()
                    .catch((err) => {
                    if (err.message !== "Returned error: execution reverted")
                        throw err;
                    return null;
                });
                if (debt && +debt.deadline <= lastBlock) {
                    debts.push({
                        user: debt.user,
                        collateralPool: debt.collateralPool,
                        collateralToken: debt.collateralToken,
                        paybackAmount: debt.paybackAmount,
                        lockedCollateralPoolTokenAmount: debt.lockedCollateralPoolTokenAmount,
                        deadline: debt.deadline,
                        index: i,
                    });
                }
                lastDebt = debt;
                i += 1;
            } while (debt && +debt.deadline <= lastBlock);
            return { debts, lastDebt };
        });
    }
    getInstantTransferEvents(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("InstantTransfer", {
                fromBlock,
            });
            return events.map((event) => InstantRouter.parseInstantTransferEvent(event));
        });
    }
    getInstantExchangeEvents(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("InstantExchange", {
                fromBlock,
            });
            return events.map((event) => InstantRouter.parseInstantExchangeEvent(event));
        });
    }
    getUserInstantRequestsLength(userAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getUserRequestsLength(userAddress).call();
        });
    }
    slashUser(userAddress, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("userAddress, index", userAddress, index);
            const gasAmount = yield this.contract.methods
                .slashUser(userAddress, index)
                .estimateGas({ from: this.currentAccount });
            return this.contract.methods
                .slashUser(userAddress, index)
                .send({ from: this.currentAccount, gas: gasAmount });
        });
    }
    static parseInstantTransferEvent(event) {
        const txInfo = this.extractEventTxInfo(event);
        const { user, receiver, loanAmount, instantFee, deadline, collateralToken, lockedCollateralPoolToken, } = event.returnValues;
        return {
            user,
            receiver,
            loanAmount,
            instantFee,
            deadline,
            collateralToken,
            lockedCollateralPoolToken,
            txInfo,
        };
    }
    static parseInstantExchangeEvent(event) {
        const txInfo = this.extractEventTxInfo(event);
        const { user, receiver, loanAmount, instantFee, amountOut, path, isFixed, deadline, collateralToken, lockedCollateralPoolToken, } = event.returnValues;
        return {
            user,
            receiver,
            loanAmount,
            instantFee,
            amountOut,
            path,
            isFixed,
            deadline,
            collateralToken,
            lockedCollateralPoolToken,
            txInfo,
        };
    }
}
module.exports = InstantRouter;
//# sourceMappingURL=instant-router-interface.js.map