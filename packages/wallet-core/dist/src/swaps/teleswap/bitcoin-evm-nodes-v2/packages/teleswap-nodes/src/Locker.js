"use strict";
const tslib_1 = require("tslib");
const { sleep } = require('@sinatdt/utils').tools;
const { BitcoinInterface, TeleportDaoPayment: LockerPayment } = require('@sinatdt/bitcoin');
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { CcBurnRouter, BitcoinRelay, LockerContract } = require('@sinatdt/contracts-helper').contracts;
const lockerDb = require('./database').locker;
const { getLogger } = require('./config/logger');
const { handleError, handleErrorAndExit } = require('./error/error-handler');
const { sendNotificationToAdmin } = require('./utils/notify-admin');
const { PRIORITY } = require('./error/error-constant');
const logger = getLogger('LOCKER');
class Locker {
    constructor({ sourceNetwork, targetNetwork, mnemonic, ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, processIntervalMs = 5 * 60 * 1000, checkPendingIntervalMs = 10 * 60 * 1000, }) {
        this.sourceNetworkName = sourceNetwork.name;
        this.mnemonic = mnemonic;
        this.baseEthWeb3 = new EthBase({ connectionInfo: targetNetwork.connection.web3 });
        this.btcInterface = new BitcoinInterface(sourceNetwork.connection, sourceNetwork.name);
        this.lockerBtcTx = new LockerPayment(sourceNetwork.connection, sourceNetwork.name);
        this.rescueBtcTx = new LockerPayment(sourceNetwork.connection, sourceNetwork.name);
        this.bitcoinAddress = '';
        this.bitcoinLockingScript = '';
        this.rescueBitcoinAddress = '';
        this.pendingRequest = [];
        this.numberOfConfirmations = 1;
        this.isProcessing = false;
        this.isChecking = false;
        this.maximumNumberOfRequestPerRound = 50;
        this.processIntervalMs = processIntervalMs;
        this.checkPendingIntervalMs = checkPendingIntervalMs;
        this.startEthBlockNumber = 12956765;
        this.setContractsInterfaces({
            ccBurnContractAddress,
            lockerContractAddress,
            bitcoinRelayContractAddress,
        });
    }
    setContractsInterfaces({ ccBurnContractAddress, lockerContractAddress, bitcoinRelayContractAddress, }) {
        const connectionConfig = {
            web3Eth: this.baseEthWeb3.web3Eth,
        };
        this.ccBurnInterface = new CcBurnRouter(connectionConfig, ccBurnContractAddress);
        this.relayInterface = new BitcoinRelay(connectionConfig, bitcoinRelayContractAddress);
        this.lockerInterface = new LockerContract(connectionConfig, lockerContractAddress);
    }
    setAccount(index = 0) {
        let bitcoinAddress = this.setBitcoinAccount(index);
        let ethereumAddress = this.setEthAccount(index);
        return { bitcoinAddress, ethereumAddress };
    }
    setBitcoinAccount(index = 0) {
        let addressType = 'p2sh-p2wpkh';
        this.lockerBtcTx.setAccountPrivateKeyByMnemonic({
            mnemonic: this.mnemonic,
            index,
            walletNumber: 0,
            addressType,
        });
        let address = this.lockerBtcTx.setAccount(addressType);
        this.bitcoinAddress = address;
        this.bitcoinLockingScript = `0x${this.lockerBtcTx.addressObj.output.toString('hex')}`;
        this.rescueBtcTx.setAccountPrivateKeyByMnemonic({
            mnemonic: this.mnemonic,
            index,
            walletNumber: 1,
            addressType,
        });
        let rescueAddress = this.rescueBtcTx.setAccount(addressType);
        this.rescueBitcoinAddress = rescueAddress;
        return address;
    }
    setEthAccount(index = 0) {
        let ethAddress = this.baseEthWeb3.addAccountByMnemonic({
            mnemonic: this.mnemonic,
            index,
        });
        this.baseEthWeb3.setCurrentAccount(ethAddress);
        this.ccBurnInterface.setCurrentAccount(ethAddress);
        this.ethClientAddress = ethAddress;
        return ethAddress;
    }
    setLockerTargetAddress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lockerTargetAddress = yield this.lockerInterface.getLockerTargetAddress(this.bitcoinLockingScript);
            logger.verbose(`lockerTargetAddress: ${lockerTargetAddress}`);
            this.lockerTargetAddress = lockerTargetAddress;
            return lockerTargetAddress;
        });
    }
    setNumberOfConfirmations() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.numberOfConfirmations = Number(yield this.relayInterface.getNumberOfConfirmations());
        });
    }
    handleBurnEvent(parsedEventRequests) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let currentBlock = yield this.relayInterface.lastSubmittedHeight();
            let invalidRequest = parsedEventRequests
                .filter((rs) => +currentBlock >= rs.deadline)
                .map((rs) => (Object.assign(Object.assign({}, rs), { response: 'deadline passed' })));
            if (invalidRequest.length > 0) {
                logger.warn(`there is invalid requests : ${JSON.stringify(invalidRequest.map((rs) => ({
                    response: rs.response,
                    requestIndex: rs.requestIndex,
                })), null, 2)}`);
            }
            let validRequests = parsedEventRequests.filter((rs) => +currentBlock < rs.deadline);
            for (let i in validRequests) {
                let rs = validRequests[i];
                const isConfirmed = yield this.ccBurnInterface.isTransferred(this.lockerTargetAddress, rs.requestIndex);
                if (isConfirmed) {
                    logger.warn(`request is confirmed before. it should not be happened. request : ${JSON.stringify(rs, null, 2)}`);
                    validRequests.splice(i, 1);
                    invalidRequest.push(Object.assign(Object.assign({}, rs), { response: 'confirmed before' }));
                }
            }
            let requests = validRequests.map((rs) => ({
                address: this.btcInterface.convertHashToAddress(rs.addressScript, rs.addressType),
                value: +rs.burntAmount,
                requestIndex: rs.requestIndex,
            }));
            logger.debug(`burn requests for process: ${JSON.stringify(requests, null, 2)}`);
            if (requests.length > 0) {
                let txId = yield this.lockerBtcTx.payBurnRequest(requests);
                sendNotificationToAdmin(`burn requests processed: ${requests.map((rs) => rs.requestIndex)}. txId :${txId} 
        `);
                lockerDb.methods.deleteRequestAndAddPendingTxId(txId, requests);
                this.checkPendingRequests();
            }
            for (let rs of invalidRequest) {
                logger.warn(`delete invalid request index: ${JSON.stringify(rs.requestIndex)}`);
                lockerDb.methods.removeInvalidRequestFromQueue(rs.requestIndex);
            }
        });
    }
    checkNotPaidEvent() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pendingRequestsIndex = yield lockerDb.methods.getPendingRequestsIndex();
            let lastCheckedEthBlock = yield lockerDb.methods.getLastCheckedEthBlock();
            let burnRequests = (yield this.ccBurnInterface.getBurnEvents(lastCheckedEthBlock || this.startEthBlockNumber)).filter((rs) => rs.lockerTargetAddress === this.lockerTargetAddress);
            let paidBurnRequests = (yield this.ccBurnInterface.getPaidBurnEvents(lastCheckedEthBlock || this.startEthBlockNumber)).filter((rs) => rs.lockerTargetAddress === this.lockerTargetAddress);
            let burnDisputeRequests = (yield this.ccBurnInterface.getBurnDisputeEvents(lastCheckedEthBlock || this.startEthBlockNumber)).filter((rs) => rs.lockerTargetAddress === this.lockerTargetAddress);
            let notPaidRequests = burnRequests
                .filter((ccBurnRequest) => burnDisputeRequests.findIndex((paidElement) => paidElement.requestIndex === ccBurnRequest.requestIndex) < 0)
                .filter((ccBurnRequest) => paidBurnRequests.findIndex((paidElement) => paidElement.requestIndex === ccBurnRequest.requestIndex) < 0)
                .filter((ccBurnRequest) => pendingRequestsIndex.findIndex((rsIndex) => rsIndex === ccBurnRequest.requestIndex) < 0)
                .filter((ccBurnRequest) => Number(ccBurnRequest.burntAmount) > 0);
            logger.debug(`notPaidRequests: ${JSON.stringify(notPaidRequests, null, 2)}`);
            for (let request of notPaidRequests) {
                yield lockerDb.methods.addBurnRequestToQueue(request);
            }
        });
    }
    checkPendingRequests() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.isChecking)
                return;
            this.isChecking = true;
            let pendingRequests = yield lockerDb.methods.getPendingTransactions();
            const requestWithBurnProofError = [];
            logger.verbose('checking pending requests');
            while (pendingRequests.length > 0) {
                try {
                    logger.debug(`check pending tx. number of requests: ${pendingRequests.length}`);
                    let currentBlock = yield this.relayInterface.lastSubmittedHeight();
                    for (let transactionAndRequests of pendingRequests) {
                        let requestWithError = requestWithBurnProofError.find((rs) => rs.transactionAndRequests.txId === transactionAndRequests.txId);
                        if (requestWithError) {
                            handleError('old request with burn proof error', requestWithError);
                            continue;
                        }
                        let { txId, requests } = transactionAndRequests;
                        let tx = yield this.btcInterface.provider.getTransaction(txId);
                        let blockNumber = +tx.blockNumber || currentBlock;
                        logger.debug(`currentBlock: ${currentBlock} blockNumber: ${blockNumber} numberOfConfirmations: ${this.numberOfConfirmations}`);
                        if (currentBlock - blockNumber >= this.numberOfConfirmations) {
                            logger.verbose(`submit burn proof: ${requests.map((rs) => rs.requestIndex)}. txId :${txId} `);
                            sendNotificationToAdmin(`submitting burn proof for requests: ${requests.map((rs) => rs.requestIndex)}. txId :${txId} 
              `);
                            let { parsedTx, merkleProof } = yield this.btcInterface.getRequestProof(tx);
                            let blockFee = yield this.relayInterface.getBlockHeaderFee(tx.blockNumber, 0);
                            let response = yield this.ccBurnInterface.sendBurnProof(parsedTx, merkleProof, blockNumber, requests.map((rs) => rs.requestIndex), requests.map((_rs, index) => index), this.bitcoinLockingScript, blockFee);
                            logger.verbose(`submit bur proof response: ${JSON.stringify(response, null, 2)}`);
                            if (response.success) {
                                lockerDb.methods.deletePendingTxAndUpdateLastTx(transactionAndRequests);
                            }
                            if (!response.success) {
                                handleError('sending burn proof error', { transactionAndRequests, response });
                                requestWithBurnProofError.push({ transactionAndRequests, response });
                                this.isProcessing = false;
                            }
                        }
                    }
                    lockerDb.methods.setLastCheckedBitcoinBlock(currentBlock);
                }
                catch (error) {
                    handleError(error);
                }
                yield sleep(this.checkPendingIntervalMs);
                pendingRequests = yield lockerDb.methods.getPendingTransactions();
            }
            this.isChecking = false;
        });
    }
    checkNearDeadlineRequest() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            while (true) {
                try {
                    let requests = yield lockerDb.methods.getNotProcessedRequests(this.maximumNumberOfRequestPerRound);
                    logger.debug(`check near deadline. number of not processed requests: ${requests.length}`);
                    if (!this.isProcessing) {
                        sendNotificationToAdmin(`something is wrong, process is disabled`, PRIORITY.IMPORTANT);
                    }
                    if (requests.length > 0) {
                        let currentBlock = yield this.relayInterface.lastSubmittedHeight();
                        requests = requests.filter((rs) => +rs.deadline - +currentBlock <= 6);
                        if (requests.length > 0) {
                            sendNotificationToAdmin(`there is an unprocessed request with near deadline: 
            requests : ${JSON.stringify(requests, null, 2)}`, PRIORITY.WARNING);
                        }
                    }
                }
                catch (error) {
                    handleError(error);
                }
                yield sleep(this.checkPendingIntervalMs / 2);
            }
        });
    }
    listenForNewRequest() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.ccBurnInterface.contract.events
                .CCBurn({})
                .on('connected', (subscriptionId) => {
                logger.verbose(`subscriptionId: ${subscriptionId}`);
            })
                .on('data', (event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    let parsedEvent = CcBurnRouter.parseCcBurnEvent(event, this.sourceNetworkName);
                    yield lockerDb.methods.addBurnRequestToQueue(parsedEvent);
                    yield lockerDb.methods.setLastCheckedEthBlock(+parsedEvent.txInfo.blockNumber - 1);
                    logger.verbose(`new burn request saved. txId: ${parsedEvent.txInfo.transactionHash}`);
                    sendNotificationToAdmin(`new burn request saved. 
            destination address: ${parsedEvent.address}
            amount: ${parsedEvent.amount}
            burntAmount: ${parsedEvent.burntAmount}
            requestIndex: ${parsedEvent.requestIndex}
            `);
                }
                catch (error) {
                    handleError(error);
                    yield sleep(60 * 1000);
                    yield this.checkNotPaidEvent();
                }
            }))
                .on('error', (err) => logger.error(`event error${err}`));
        });
    }
    processRequests() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.isProcessing = true;
            while (this.isProcessing) {
                try {
                    let requests = yield lockerDb.methods.getNotProcessedRequests(this.maximumNumberOfRequestPerRound);
                    yield this.handleBurnEvent(requests);
                }
                catch (error) {
                    handleError(error);
                }
                yield this.baseEthWeb3.checkCurrentAccountBalanceForContractCall({});
                yield sleep(this.processIntervalMs);
            }
        });
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.setLockerTargetAddress();
                const isValidLocker = yield this.lockerInterface.isValidLocker(this.bitcoinLockingScript, this.lockerTargetAddress);
                if (!isValidLocker) {
                    let error = new Error('invalid locker');
                    error.moreInfo = {
                        bitcoinLockingScript: this.bitcoinLockingScript,
                        lockerTargetAddress: this.lockerTargetAddress,
                    };
                    throw error;
                }
                let enoughBalance = yield this.ccBurnInterface.checkCurrentAccountBalanceForContractCall({});
                if (!enoughBalance) {
                    handleErrorAndExit('');
                }
                this.checkPendingRequests();
                yield this.checkNotPaidEvent();
                this.checkNearDeadlineRequest();
                this.listenForNewRequest();
                this.processRequests();
            }
            catch (error) {
                handleErrorAndExit(error);
            }
        });
    }
}
module.exports = Locker;
//# sourceMappingURL=Locker.js.map