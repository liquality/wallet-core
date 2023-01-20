"use strict";
const tslib_1 = require("tslib");
const { sleep, getRandomInteger } = require('@sinatdt/utils').tools;
const BurnRequest = require('../actions/burn-request');
const TransferAndExchange = require('../actions/cc-transfer-exchange');
const { targetNetwork, tokens, service } = require('../../config/blockchain.config');
const { handleError } = require('../../error/error-handler');
const { logger } = require('../../config/logger');
class User {
    constructor({ userPrefix = 'user', mnemonic, index, targetNetworkConnectionConfig = { connectionInfo: targetNetwork.connection.web3 }, bitcoinAddressType = undefined, lockerLists, }) {
        this.lockerLists = lockerLists;
        this.userId = userPrefix + index;
        this.burn = new BurnRequest({
            mnemonic,
            index,
            targetNetworkConnectionConfig,
        });
        this.transferExchange = new TransferAndExchange({
            mnemonic,
            index,
            bitcoinAddressType,
        });
        this.minBtc = 50000;
        this.maxBtc = 200000;
        this.numberOfBurnAndExchangeRequest = 2;
        this.period = 1 * 60 * 60 * 1000;
        this.isRunning = false;
    }
    static getSleepTime(numberOfRequest, period = 24 * 60 * 60 * 1000) {
        let baseSleep = period / numberOfRequest;
        return getRandomInteger(0, 2 * baseSleep);
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logger.info('*****************************************');
            logger.info(`User: ${this.userId}
    Bitcoin Address: ${this.burn.bitcoinAddress}
    Eth Address: ${this.transferExchange.clientAddress}`);
            logger.info('*****************************************');
        });
    }
    simulateCcTransferAndExchange() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (this.isRunning) {
                try {
                    let lockerAddress = this.lockerLists[0];
                    let amount = Number((getRandomInteger(this.minBtc, this.maxBtc) / 1e8).toFixed(8));
                    let bitcoinBalance = yield this.transferExchange.getBtcBalance();
                    logger.verbose(`user ${this.userId} -  btc address ${this.burn.bitcoinAddress} - btc balance: ${bitcoinBalance} - transfer ${amount}`);
                    if (bitcoinBalance > amount) {
                        yield this.transferExchange.send(lockerAddress, amount, {}, 10);
                    }
                }
                catch (error) {
                    handleError(error);
                }
                let sleepTime = User.getSleepTime(this.numberOfBurnAndExchangeRequest, this.period);
                logger.verbose(`transfer sleep: ${sleepTime}`);
                yield sleep(sleepTime);
            }
        });
    }
    simulateCcBurn() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (this.isRunning) {
                try {
                    let lockerAddress = this.lockerLists[0];
                    let amount = Number((getRandomInteger(this.minBtc, this.maxBtc) / 1e8).toFixed(8));
                    let teleBtcBalance = yield this.burn.getTeleBtcBalanceAndMintIfNeeded();
                    logger.verbose(`user ${this.userId} -  eth address ${this.transferExchange.clientAddress}-teleBtc balance: ${teleBtcBalance} -  burn ${amount}`);
                    if (teleBtcBalance > amount) {
                        yield this.burn.sendBurnRequest(lockerAddress, amount);
                    }
                    let hasEnoughBalance = yield this.burn.burnContract.checkCurrentAccountBalanceForContractCall({});
                    if (!hasEnoughBalance)
                        this.isRunning = false;
                }
                catch (error) {
                    handleError(error);
                }
                let sleepTime = User.getSleepTime(this.numberOfBurnAndExchangeRequest, this.period);
                logger.verbose(`burn sleep: ${sleepTime}`);
                yield sleep(sleepTime);
            }
        });
    }
    simulate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.isRunning = true;
            this.simulateCcTransferAndExchange();
            this.simulateCcBurn();
        });
    }
}
module.exports = User;
//# sourceMappingURL=user.js.map