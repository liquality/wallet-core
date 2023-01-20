"use strict";
const tslib_1 = require("tslib");
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { InstantRouter } = require('@sinatdt/contracts-helper').contracts;
const { logger } = require('../../config/logger');
const { handleError } = require('../../error/error-handler');
const teleporterDb = require('../../database').teleporter;
const { sleep } = require('../../utils/tools');
class SlashUser {
    constructor({ targetNetwork, mnemonic, instantRouterContractAddress, }) {
        this.workId = 'slash-user';
        this.mnemonic = mnemonic;
        this.baseEthWeb3 = new EthBase({ connectionInfo: targetNetwork.connection.web3 });
        this.setContractsInterfaces({
            instantRouterContractAddress,
        });
        this.submittingRequests = false;
    }
    setContractsInterfaces({ instantRouterContractAddress }) {
        const connectionConfig = {
            web3Eth: this.baseEthWeb3.web3Eth,
        };
        this.instantRouterInterface = new InstantRouter(connectionConfig, instantRouterContractAddress);
    }
    setAccount(index = 0) {
        let address = this.baseEthWeb3.addAccountByMnemonic({
            mnemonic: this.mnemonic,
            index,
            walletNumber: 1,
        });
        this.baseEthWeb3.setCurrentAccount(address);
        this.instantRouterInterface.setCurrentAccount(address);
        this.ethClientAddress = address;
        return address;
    }
    getOldInstantEvent() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lastCheckedEthBlock = yield teleporterDb.methods.general.getLastCheckedEthBlock(this.workId);
            let transferEvents = yield this.instantRouterInterface.getInstantTransferEvents(lastCheckedEthBlock);
            let exchangeEvents = yield this.instantRouterInterface.getInstantExchangeEvents(lastCheckedEthBlock);
            console.log('transferEvents', transferEvents.length);
            console.log('exchangeEvents', exchangeEvents.length);
            let events = transferEvents.concat(exchangeEvents);
            let lastEthBlock = lastCheckedEthBlock;
            for (let event of events) {
                yield teleporterDb.methods.slashUser.setOrUpdateUserDeadline(event.user, event.deadline);
                lastEthBlock = event.txInfo.blockNumber;
            }
            yield teleporterDb.methods.general.setLastCheckedEthBlock(lastEthBlock, this.workId);
        });
    }
    handlePunishUser(lastBlockNumber = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.submittingRequests) {
                let error = new Error('older request is not submitted yet');
                error.priority = 2;
                throw error;
            }
            try {
                let users = yield teleporterDb.methods.slashUser.getUsersWithPassedDeadline(lastBlockNumber);
                console.log('handlePunishUser users', users);
                for (let userAddress of users) {
                    let { debts, lastDebt } = yield this.instantRouterInterface.getInstantDebts(userAddress, lastBlockNumber);
                    let passedDeadlineDebts = debts.filter((d) => lastBlockNumber >= +d.deadline);
                    console.log('lastBlockNumber', lastBlockNumber);
                    console.log('passedDeadlineDebts', passedDeadlineDebts);
                    for (let pd of passedDeadlineDebts) {
                        let response = yield this.instantRouterInterface.slashUser(pd.user, 0);
                        console.log(response);
                    }
                    let nearestDeadline = lastDebt === null || lastDebt === void 0 ? void 0 : lastDebt.deadline;
                    if (!nearestDeadline) {
                        yield teleporterDb.methods.slashUser.deleteUser(userAddress);
                    }
                    else {
                        yield teleporterDb.methods.slashUser.setOrUpdateUserDeadline(userAddress, nearestDeadline);
                    }
                }
                this.submittingRequests = false;
            }
            catch (error) {
                yield sleep(10000);
                this.submittingRequests = false;
                throw error;
            }
        });
    }
    checkPaidRequests(nexBlockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let users = yield teleporterDb.methods.slashUser.getUsersWithPassedDeadline(nexBlockNumber);
            console.log('checkPaidRequests users', users);
            for (let userAddress of users) {
                let userRequestLength = this.instantRouterInterface.getUserInstantRequestsLength(userAddress);
                if (userRequestLength === 0) {
                    yield teleporterDb.methods.slashUser.deleteUser(userAddress);
                }
            }
        });
    }
    listenForInstantEvents() {
        this.instantRouterInterface.contract.events
            .allEvents({})
            .on('connected', (subscriptionId) => {
            logger.verbose(`InstantEvents subscriptionId: ${subscriptionId}`);
        })
            .on('data', (event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (event.event === 'InstantTransfer') {
                    let instantEvent = InstantRouter.parseInstantTransferEvent(event);
                    yield teleporterDb.methods.slashUser.checkCurrentDeadlineAndUpdateNearestDeadline(instantEvent.user, instantEvent.deadline);
                }
                if (event.event === 'InstantExchange') {
                    let instantEvent = InstantRouter.parseInstantExchangeEvent(event);
                    yield teleporterDb.methods.slashUser.checkCurrentDeadlineAndUpdateNearestDeadline(instantEvent.user, instantEvent.deadline);
                }
                yield teleporterDb.methods.general.setLastCheckedEthBlock(event.blockNumber, this.workId);
            }
            catch (error) {
                handleError(error);
            }
        }))
            .on('error', (err) => logger.error(`event error${err}`));
    }
    processOldRequests(lastBtcBlockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getOldInstantEvent();
                yield this.checkPaidRequests(lastBtcBlockNumber + 1);
                yield this.handlePunishUser(lastBtcBlockNumber);
                yield teleporterDb.methods.general.setLastCheckedBitcoinBlock(lastBtcBlockNumber, this.workId);
            }
            catch (error) {
                handleError(error);
            }
        });
    }
    newBlockReceived(blockEvent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                logger.debug(`new block received. block: ${JSON.stringify(blockEvent, null, 2)}`);
                yield this.handlePunishUser(+blockEvent.height);
                this.lastCheckedBitcoinBlock = +blockEvent.height;
                yield this.checkPaidRequests(+blockEvent.height + 1);
                yield teleporterDb.methods.general.setLastCheckedBitcoinBlock(this.lastCheckedBitcoinBlock, this.workId);
                yield teleporterDb.methods.general.setLastCheckedEthBlock(blockEvent.txInfo.blockNumber, this.workId);
                yield this.baseEthWeb3.checkCurrentAccountBalanceForContractCall({});
            }
            catch (error) {
                handleError(error);
            }
        });
    }
}
module.exports = SlashUser;
//# sourceMappingURL=slash-user.js.map