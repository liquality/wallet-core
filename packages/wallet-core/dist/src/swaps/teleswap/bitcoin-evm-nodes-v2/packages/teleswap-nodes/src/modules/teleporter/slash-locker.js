"use strict";
const tslib_1 = require("tslib");
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { BitcoinRelay, LockerContract, CcBurnRouter } = require('@sinatdt/contracts-helper').contracts;
const { BitcoinInterface } = require('@sinatdt/bitcoin');
const { logger } = require('../../config/logger');
const { handleError } = require('../../error/error-handler');
const { sleep } = require('../../utils/tools');
const teleporterDb = require('../../database').teleporter;
class SlashLocker {
    constructor({ sourceNetwork, targetNetwork, mnemonic, ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, lockerAddresses, }) {
        this.workId = 'slash-locker';
        this.sourceNetworkName = sourceNetwork.name;
        this.mnemonic = mnemonic;
        this.baseEthWeb3 = new EthBase({ connectionInfo: targetNetwork.connection.web3 });
        this.btcInterface = new BitcoinInterface(sourceNetwork.connection, sourceNetwork.name);
        this.setContractsInterfaces({
            ccBurnContractAddress,
            lockerContractAddress,
            bitcoinRelayContractAddress,
        });
        this.lastReceivedBitcoinBlock = 0;
        this.submittingRequests = false;
        this.lockerAddresses = lockerAddresses;
    }
    setContractsInterfaces({ ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, }) {
        const connectionConfig = {
            web3Eth: this.baseEthWeb3.web3Eth,
        };
        this.ccBurnInterface = new CcBurnRouter(connectionConfig, ccBurnContractAddress);
        this.lockerInterface = new LockerContract(connectionConfig, lockerContractAddress);
        this.relayInterface = new BitcoinRelay(connectionConfig, bitcoinRelayContractAddress);
    }
    setAccount(index = 0) {
        let address = this.baseEthWeb3.addAccountByMnemonic({
            mnemonic: this.mnemonic,
            index,
            walletNumber: 2,
        });
        this.baseEthWeb3.setCurrentAccount(address);
        this.lockerInterface.setCurrentAccount(address);
        this.ccBurnInterface.setCurrentAccount(address);
        this.ethClientAddress = address;
        return address;
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.burnTransferDeadline = yield this.ccBurnInterface.getBurnTransferDeadline();
            logger.debug(`burnTransferDeadline: ${this.burnTransferDeadline}`);
        });
    }
    setValidLockerAddresses(validAddresses) {
        this.lockerAddresses = validAddresses;
    }
    validateAndSetLockerAddresses(allLockerAddresses = []) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let validAddresses = [];
            for (let locker of allLockerAddresses) {
                const [lockerAddress, lockerTargetAddress] = locker.split(':');
                let lockerScript = this.btcInterface
                    .convertAddressToScript(lockerAddress)
                    .script.toString('hex');
                const isValidLocker = yield this.lockerInterface.isValidLocker(lockerScript, lockerTargetAddress);
                if (isValidLocker)
                    validAddresses.push(lockerAddress);
            }
            this.setValidLockerAddresses(validAddresses);
            return validAddresses;
        });
    }
    listenForBurnEvents() {
        this.ccBurnInterface.contract.events
            .allEvents({})
            .on('connected', (subscriptionId) => {
            logger.verbose(`BurnEvents subscriptionId: ${subscriptionId}`);
        })
            .on('data', (event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (event.event === 'CCBurn') {
                    let burnEvent = CcBurnRouter.parseCcBurnEvent(event, this.sourceNetworkName);
                    yield teleporterDb.methods.slashLocker.addBurnRequestForLocker(burnEvent);
                }
                if (event.event === 'PaidCCBurn') {
                    let paidBurnEvent = CcBurnRouter.parsePaidBurnEvent(event);
                    yield teleporterDb.methods.slashLocker.deleteBurnRequest(paidBurnEvent.lockerTargetAddress, paidBurnEvent.requestIndex);
                }
                if (event.event === 'BurnDispute') {
                    let parsedEvent = CcBurnRouter.parseBurnDisputeEvent(event);
                    yield teleporterDb.methods.slashLocker.deleteBurnRequest(parsedEvent.lockerTargetAddress, parsedEvent.requestIndex);
                }
                if (event.event === 'LockerDispute') {
                    let parsedEvent = CcBurnRouter.parseLockerDisputeEvent(event);
                    yield teleporterDb.methods.slashLocker.deleteBurnTransaction(parsedEvent.txId);
                }
                yield teleporterDb.methods.general.setLastCheckedEthBlock(+event.blockNumber - 1, this.workId);
            }
            catch (error) {
                handleError(error);
            }
        }))
            .on('error', (err) => logger.error(`event error${err}`));
    }
    getOldBurnEvent() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lastCheckedEthBlock = yield teleporterDb.methods.general.getLastCheckedEthBlock(this.workId);
            let burnEvents = yield this.ccBurnInterface.getBurnEvents(lastCheckedEthBlock);
            let paidBurnEvents = yield this.ccBurnInterface.getPaidBurnEvents(lastCheckedEthBlock);
            let burnDisputeEvents = yield this.ccBurnInterface.getBurnDisputeEvents(lastCheckedEthBlock);
            console.log('burnEvents Length', burnEvents.length);
            console.log('paidBurnEvents Length', paidBurnEvents.length);
            console.log('burnDisputeEvents Length', burnDisputeEvents.length);
            for (let dbe of burnDisputeEvents) {
                yield teleporterDb.methods.slashLocker.deleteBurnRequest(dbe.lockerTargetAddress, dbe.requestIndex);
            }
            let events = burnEvents
                .filter((e) => paidBurnEvents.findIndex((pe) => pe.lockerTargetAddress === e.lockerTargetAddress &&
                pe.requestIndex === e.requestIndex) < 0)
                .filter((e) => burnDisputeEvents.findIndex((bde) => bde.lockerTargetAddress === e.lockerTargetAddress &&
                bde.requestIndex === e.requestIndex) < 0);
            console.log('events', events.length);
            let lastEthBlock = lastCheckedEthBlock;
            for (let event of events) {
                yield teleporterDb.methods.slashLocker.addBurnRequestForLocker(event);
                lastEthBlock = event.txInfo.blockNumber;
            }
            yield teleporterDb.methods.general.setLastCheckedEthBlock(lastEthBlock, this.workId);
        });
    }
    slashIfBurnRequestsNotPaid(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.submittingRequests) {
                let error = new Error('older request is not submitted yet');
                error.priority = 2;
                throw error;
            }
            try {
                this.submittingRequests = true;
                let passedDeadlineRequestEvents = yield teleporterDb.methods.slashLocker.getPassedDeadlineRequestsEvent(+blockNumber);
                console.log('passedDeadlineRequestEvents', passedDeadlineRequestEvents);
                let isPaid = [];
                passedDeadlineRequestEvents.forEach((e, index) => {
                    isPaid[index] = this.ccBurnInterface.isTransferred(e.lockerTargetAddress, e.requestIndex);
                });
                isPaid = yield Promise.all(isPaid);
                console.log('isPaid', isPaid);
                let notPaidRequests = passedDeadlineRequestEvents.filter((_, index) => !isPaid[index]);
                let slashedRequests = passedDeadlineRequestEvents.filter((_, index) => isPaid[index]);
                let requestsGroupByLocker = {};
                notPaidRequests.forEach((rs) => {
                    if (requestsGroupByLocker[rs.lockerTargetAddress]) {
                        requestsGroupByLocker[rs.lockerTargetAddress].push(rs);
                    }
                    else {
                        requestsGroupByLocker[rs.lockerTargetAddress] = [rs];
                    }
                });
                for (let lockerTargetAddress in requestsGroupByLocker) {
                    let lockerNotPaidRequests = requestsGroupByLocker[lockerTargetAddress];
                    let lockerScript = yield this.lockerInterface.getLockerLockingScript(lockerTargetAddress);
                    let response = yield this.ccBurnInterface.disputeBurn(lockerScript, lockerNotPaidRequests.map((rs) => rs.requestIndex));
                    console.log('slash not paid', response);
                }
                for (let dbe of slashedRequests) {
                    yield teleporterDb.methods.slashLocker.deleteBurnRequest(dbe.lockerTargetAddress, dbe.requestIndex);
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
    slashIncorrectLockerPayments(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.submittingRequests) {
                let error = new Error('older request is not submitted yet');
                error.priority = 2;
                throw error;
            }
            try {
                let passedDeadlineBurnTxs = yield teleporterDb.methods.slashLocker.getBurnTransactions(blockNumber, +this.burnTransferDeadline + 1);
                console.log('passedDeadlineBurnTxs', passedDeadlineBurnTxs);
                let isUsedAsBurnProof = [];
                passedDeadlineBurnTxs.forEach((e, index) => {
                    isUsedAsBurnProof[index] = this.ccBurnInterface.isUsedAsBurnProof(e.transaction.txId);
                });
                isUsedAsBurnProof = yield Promise.all(isUsedAsBurnProof);
                console.log('isUsedAsBurnProof', isUsedAsBurnProof);
                let notUsedAsBurnProofTxs = passedDeadlineBurnTxs.filter((_, index) => !isUsedAsBurnProof[index]);
                let UsedAsBurnProofTxs = passedDeadlineBurnTxs.filter((_, index) => isUsedAsBurnProof[index]);
                console.log('notUsedAsBurnProofTxs', notUsedAsBurnProofTxs);
                for (let tx of notUsedAsBurnProofTxs) {
                    let lockerScript = `0x${tx.lockerLockingScript}`;
                    let lockerVin = tx.burnInfo.lockerVin;
                    let outputTxProof = yield this.btcInterface.getRequestProof({
                        txId: lockerVin.txId,
                    });
                    let blockFee = yield this.btcRelayInterface.getBlockHeaderFee(tx.blockNumber, 0);
                    let inputTxProof = yield this.btcInterface.getRequestProof(tx.transaction);
                    let response = yield this.ccBurnInterface.disputeLocker(lockerScript, inputTxProof, Object.assign(Object.assign({}, outputTxProof), { index: lockerVin.index, txId: lockerVin.txId }), blockFee);
                    console.log('slash incorrect', response);
                }
                for (let usedTx of UsedAsBurnProofTxs) {
                    yield teleporterDb.methods.slashLocker.deleteBurnTransaction(usedTx.transaction.txId);
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
    getAndSaveLockerTransactions(blockHeight) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logger.debug(`get new transactions- block: ${+blockHeight} - lockerAddresses: ${this.lockerAddresses}`);
            let newLockerTxs = yield this.btcInterface.getLockersBurnTransactions(this.lockerAddresses, +blockHeight);
            console.log('newLockerTxs', newLockerTxs);
            for (let tx of newLockerTxs)
                yield teleporterDb.methods.slashLocker.saveBurnTransactions(tx);
        });
    }
    processOldRequests(lastBtcBlockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getOldBurnEvent();
                let lastBlock = yield teleporterDb.methods.general.getLastCheckedBitcoinBlock(this.workId);
                yield this.getAndSaveLockerTransactions(lastBlock);
                yield this.slashIfBurnRequestsNotPaid(lastBtcBlockNumber);
                yield this.slashIncorrectLockerPayments(+lastBtcBlockNumber);
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
                this.lastReceivedBitcoinBlock = Math.max(this.lastReceivedBitcoinBlock || 0, +blockEvent.height);
                yield this.slashIfBurnRequestsNotPaid(+blockEvent.height);
                yield this.slashIncorrectLockerPayments(+blockEvent.height);
                yield this.getAndSaveLockerTransactions(+blockEvent.height);
                yield teleporterDb.methods.general.setLastCheckedBitcoinBlock(this.lastReceivedBitcoinBlock, this.workId);
                yield teleporterDb.methods.general.setLastCheckedEthBlock(blockEvent.txInfo.blockNumber, this.workId);
                yield this.baseEthWeb3.checkCurrentAccountBalanceForContractCall({});
            }
            catch (error) {
                handleError(error);
            }
        });
    }
}
module.exports = SlashLocker;
//# sourceMappingURL=slash-locker.js.map