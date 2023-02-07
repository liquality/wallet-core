"use strict";
const tslib_1 = require("tslib");
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { BitcoinRelay, CcTransferRouter, CcExchangeRouter, LendingRouter, LockerContract } = require('@sinatdt/contracts-helper').contracts;
const { BitcoinInterface } = require('@sinatdt/bitcoin');
const { handleError } = require('../../error/error-handler');
const teleporterDb = require('../../database').teleporter;
const { getLogger } = require('../../config/logger');
const { sendNotificationToAdmin } = require('../../utils/notify-admin');
const { sleep } = require('../../utils/tools');
const logger = getLogger('TELEPORT');
class Teleport {
    constructor({ sourceNetwork, targetNetwork, mnemonic, bitcoinRelayContractAddress, ccTransferContractAddress, ccExchangeContractAddress, lendingContractAddress, lockerContractAddress, isLendingActivated, }) {
        this.workId = 'teleport';
        this.lockerAddresses = null;
        this.mnemonic = mnemonic;
        this.baseEthWeb3 = new EthBase({ connectionInfo: targetNetwork.connection.web3 });
        this.btcInterface = new BitcoinInterface(sourceNetwork.connection, sourceNetwork.name);
        this.setContractsInterfaces({
            bitcoinRelayContractAddress,
            ccTransferContractAddress,
            ccExchangeContractAddress,
            lendingContractAddress,
            lockerContractAddress,
        });
        this.pendingRequests = [];
        this.pendingTx = [];
        this.numberOfConfirmations = 0;
        this.lastReceivedBitcoinBlock = 0;
        this.isLendingActivated = isLendingActivated;
    }
    setContractsInterfaces({ bitcoinRelayContractAddress, ccTransferContractAddress, ccExchangeContractAddress, lendingContractAddress, lockerContractAddress, }) {
        const connectionConfig = {
            web3Eth: this.baseEthWeb3.web3Eth,
        };
        this.btcRelayInterface = new BitcoinRelay(connectionConfig, bitcoinRelayContractAddress);
        this.ccTransferInterface = new CcTransferRouter(connectionConfig, ccTransferContractAddress);
        this.ccExchangeInterface = new CcExchangeRouter(connectionConfig, ccExchangeContractAddress);
        this.lockerInterface = new LockerContract(connectionConfig, lockerContractAddress);
        if (this.isLendingActivated) {
            this.lendingInterface = new LendingRouter(connectionConfig, lendingContractAddress);
        }
    }
    setAccount(index = 0) {
        let address = this.baseEthWeb3.addAccountByMnemonic({
            mnemonic: this.mnemonic,
            index,
            walletNumber: 0,
        });
        this.baseEthWeb3.setCurrentAccount(address);
        this.ccTransferInterface.setCurrentAccount(address);
        this.ccExchangeInterface.setCurrentAccount(address);
        this.ethClientAddress = address;
        return address;
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.numberOfConfirmations = yield this.btcRelayInterface.getNumberOfConfirmations();
            logger.debug(`number of confirmations: ${this.numberOfConfirmations}`);
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
    checkPendingTxAndResetNonce() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let numberOfPendingTx = yield this.baseEthWeb3.getNumberOfMemPoolTransactions(this.ethClientAddress);
            logger.debug(`numberOfPendingTx: ${numberOfPendingTx}`);
            if (numberOfPendingTx > 0)
                return false;
            yield Promise.allSettled(this.pendingTx);
            this.pendingTx = [];
            this.startNonce = yield this.baseEthWeb3.getNumberOfConfirmedTransactions(this.ethClientAddress);
            return true;
        });
    }
    addNewRequestsToQueue(requests) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let newRequests = requests.filter((rs) => this.pendingRequests.findIndex((prs) => rs.transaction.txId === prs.transaction.txId) < 0);
            logger.debug(`addNewRequestsToQueue: ${JSON.stringify(newRequests, null, 2)}`);
            if (newRequests.length > 0) {
                sendNotificationToAdmin(`new requests received: 
      ${JSON.stringify(requests.map((rs) => ({
                    txId: rs.transaction.txId,
                    lockerAddress: rs.address,
                    request: rs.request,
                })), null, 2)}`);
                this.pendingRequests = this.pendingRequests.concat(requests);
            }
        });
    }
    handleTeleportRequests() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.submittingRequests) {
                let error = new Error('older request is not submitted yet');
                error.priority = 2;
                throw error;
            }
            try {
                this.submittingRequests = true;
                let lastSubmittedBlock = yield this.btcRelayInterface.lastSubmittedHeight();
                let confirmedRequests = this.pendingRequests.filter((rs) => +lastSubmittedBlock >= +rs.transaction.blockNumber + +this.numberOfConfirmations);
                let isUsed = [];
                confirmedRequests.forEach((data, index) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    switch (data.request.data.requestType) {
                        case 'transfer':
                            isUsed[index] = this.ccTransferInterface.isUsed(data.transaction.txId);
                            break;
                        case 'exchange':
                            isUsed[index] = this.ccExchangeInterface.isUsed(data.transaction.txId);
                            break;
                        case 'lend':
                        case 'borrow':
                            isUsed[index] = this.lendingInterface.isUsed(data.transaction.txId);
                            break;
                        default:
                            handleError('invalid request type', data.request);
                    }
                }));
                isUsed = yield Promise.all(isUsed);
                console.log('isUsed', isUsed);
                confirmedRequests = confirmedRequests.filter((rs, index) => !isUsed[index]);
                console.log('lastSubmittedBlock-numberOfConfirmations-confirmedRequests', lastSubmittedBlock, +this.numberOfConfirmations, confirmedRequests);
                for (let index in confirmedRequests) {
                    let data = confirmedRequests[index];
                    let txProof = yield this.btcInterface.getRequestProof(data.transaction);
                    let result = yield this.sendTeleportRequest(data, txProof);
                    let message = `request processed.
        result: 
        ${JSON.stringify({
                        bitcoinTxId: data.transaction.txId,
                        requestType: data.request.data.requestType,
                        result,
                    })}`;
                    sendNotificationToAdmin(message, result.success ? 1 : 2);
                    logger.info(message);
                    this.pendingTx.push(result);
                }
                this.startNonce += confirmedRequests.length;
                this.pendingRequests = this.pendingRequests.filter((rs) => +lastSubmittedBlock < +rs.transaction.blockNumber + +this.numberOfConfirmations);
                this.submittingRequests = false;
            }
            catch (error) {
                while (!(yield this.checkPendingTxAndResetNonce())) {
                    yield sleep(1000);
                }
                this.submittingRequests = false;
                throw error;
            }
        });
    }
    sendTeleportRequest(data, txProof, nonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let { transaction, request, lockerLockingScript } = data;
            let blockFee = yield this.btcRelayInterface.getBlockHeaderFee(transaction.blockNumber, 0);
            switch (request.data.requestType) {
                case 'transfer': {
                    let result = yield this.ccTransferInterface.sendTransferRequest(lockerLockingScript, txProof.parsedTx, txProof.merkleProof, transaction.blockNumber, blockFee, nonce);
                    return result;
                }
                case 'exchange': {
                    let result = yield this.ccExchangeInterface.sendExchangeRequest(lockerLockingScript, txProof.parsedTx, txProof.merkleProof, transaction.blockNumber, blockFee, nonce);
                    return result;
                }
                case 'lend':
                case 'borrow': {
                    if (this.isLendingActivated) {
                        let result = yield this.lendingInterface.sendLendingRequest(lockerLockingScript, txProof.parsedTx, txProof.merkleProof, transaction.blockNumber, blockFee, nonce);
                        return result;
                    }
                    return {
                        success: false,
                        message: 'lending is disabled',
                    };
                }
                default:
                    break;
            }
            return {
                success: false,
                message: 'invalid request type',
            };
        });
    }
    getNewTeleportRequest(blockHeight) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            logger.debug(`get new requests- block: ${+blockHeight} - lockerAddresses: ${this.lockerAddresses}`);
            let newTxRequests = yield this.btcInterface.getTeleporterRequests(this.lockerAddresses, +blockHeight);
            this.addNewRequestsToQueue(newTxRequests);
        });
    }
    processOldTeleportRequests(latestBlockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let lastSavedBtcBlock = yield teleporterDb.methods.general.getLastCheckedBitcoinBlock(this.workId);
                let lastBlock = lastSavedBtcBlock || (yield this.btcRelayInterface.firstSubmittedHeight());
                logger.debug(`processOldTeleportRequests lastBlock: ${lastBlock}`);
                yield this.getNewTeleportRequest(lastBlock);
                while (!(yield this.checkPendingTxAndResetNonce())) {
                    yield sleep(100);
                }
                yield this.handleTeleportRequests();
                yield teleporterDb.methods.general.setLastCheckedBitcoinBlock(latestBlockNumber, this.workId);
            }
            catch (error) {
                handleError(error);
                yield sleep(1 * 60000);
                yield this.processOldTeleportRequests();
            }
        });
    }
    newBlockReceived(blockEvent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                logger.debug(`new block received. block: ${JSON.stringify(blockEvent, null, 2)}`);
                this.lastReceivedBitcoinBlock = Math.max(this.lastReceivedBitcoinBlock || 0, +blockEvent.height);
                yield this.handleTeleportRequests();
                let block = yield teleporterDb.methods.general.getLastCheckedBitcoinBlock(this.workId);
                logger.debug(`lastSavedBlock: ${block} - last received block: ${this.lastReceivedBitcoinBlock}`);
                yield this.getNewTeleportRequest(+block);
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
module.exports = Teleport;
//# sourceMappingURL=teleport.js.map