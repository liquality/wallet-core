"use strict";
const tslib_1 = require("tslib");
const { BitcoinInterface } = require('@sinatdt/bitcoin');
const { BitcoinRelay } = require('@sinatdt/contracts-helper').contracts;
const { sleep } = require('@sinatdt/utils').tools;
const { logger } = require('./config/logger');
const { handleError, handleErrorAndExit } = require('./error/error-handler');
const { sendNotificationToAdmin } = require('./utils/notify-admin');
const { PRIORITY } = require('./error/error-constant');
class BitcoinRelayer {
    constructor({ sourceNetwork, targetNetwork, bitcoinRelayContractAddress, mnemonic }) {
        this.mnemonic = mnemonic;
        this.btcInterface = new BitcoinInterface(sourceNetwork.connection, sourceNetwork.name);
        this.bitcoinRelayContract = new BitcoinRelay({ connectionInfo: targetNetwork.connection.web3 }, bitcoinRelayContractAddress);
        this.run = true;
        this.testnet = sourceNetwork.name.includes('testnet');
        this.numberOfSuccessfulTxs = 0;
        this.totalSuccessfulTxsGasUsed = 0;
        this.totalSuccessfulTxsEthPaid = 0;
        this.numberOfFailedTxs = 0;
        this.totalFailedTxsGasUsed = 0;
        this.totalFailedTxsEthPaid = 0;
        this.totalNumberOfBlockSubmitted = 0;
    }
    static calculateBitcoinSleep(numberOfCheck) {
        const baseSleepTime = 1 * 60 * 1000;
        if (numberOfCheck > 100) {
            return baseSleepTime;
        }
        const round = Math.floor(numberOfCheck / 5);
        let sleepTime = baseSleepTime / Math.pow(2, round);
        sleepTime = sleepTime < 2000 ? 2000 : sleepTime;
        logger.debug(`numberOfCheck: ${numberOfCheck}- sleepTime :  ${sleepTime}`);
        return sleepTime;
    }
    logData() {
        logger.info(`
    numberOfSuccessfulTxs: ${this.numberOfSuccessfulTxs}
    totalSuccessfulTxsGasUsed: ${this.totalSuccessfulTxsGasUsed}
    totalSuccessfulTxsEthPaid: ${this.totalSuccessfulTxsEthPaid}
    numberOfFailedTxs: ${this.numberOfFailedTxs}
    totalFailedTxsGasUsed: ${this.totalFailedTxsGasUsed}
    totalFailedTxsEthPaid: ${this.totalFailedTxsEthPaid}
    totalNumberOfBlockSubmitted: ${this.totalNumberOfBlockSubmitted}
    `);
    }
    setAccount(index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let walletAddress = this.bitcoinRelayContract.addAccountByMnemonic({
                mnemonic: this.mnemonic,
                index,
            });
            return walletAddress;
        });
    }
    startRelaying() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let enoughBalance = yield this.bitcoinRelayContract.checkCurrentAccountBalanceForContractCall({});
            if (!enoughBalance) {
                handleErrorAndExit('not enough balance');
            }
            let lastCheckedBitcoinBlock = yield this.bitcoinRelayContract.lastSubmittedHeight();
            logger.info(`lastCheckedBitcoinBlock: ${lastCheckedBitcoinBlock}`);
            let numberOfCheck = 0;
            while (this.run) {
                try {
                    let blockHeight = yield this.btcInterface.getLatestBlockNumber();
                    logger.debug(`blockHeight: ${blockHeight}`);
                    if (blockHeight > +lastCheckedBitcoinBlock) {
                        let lastSubmittedBlock = yield this.bitcoinRelayContract.lastSubmittedHeight();
                        if (blockHeight > lastSubmittedBlock) {
                            let response = yield this.relaying(lastSubmittedBlock, blockHeight);
                            if (response)
                                lastCheckedBitcoinBlock = blockHeight;
                        }
                        numberOfCheck = 0;
                    }
                }
                catch (error) {
                    handleError(error);
                }
                yield sleep(BitcoinRelayer.calculateBitcoinSleep(numberOfCheck));
                numberOfCheck += 1;
            }
        });
    }
    relaying(anchorBlockNumber, lastSeenBlockHeight, maxBlockBatchSize = 50) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let anchorBlockHeader = yield this.btcInterface.getBlockHeaderHex(anchorBlockNumber);
                let anchorBlockHash = yield this.btcInterface.getBlockHash(anchorBlockNumber);
                let isExist = yield this.bitcoinRelayContract.isBlockHashSubmitted(anchorBlockHash, anchorBlockNumber);
                if (isExist === false) {
                    let forkMessage = `there is a fork -> blockNumber=${anchorBlockNumber} - blockHash=${anchorBlockHash}`;
                    logger.warn(forkMessage);
                    sendNotificationToAdmin(forkMessage, PRIORITY.WARNING);
                    return yield this.relaying(anchorBlockNumber - 1, lastSeenBlockHeight);
                }
                let lastBitcoinBlock = lastSeenBlockHeight || (yield this.btcInterface.getLatestBlockNumber());
                let startBlockNumber = +anchorBlockNumber + 1;
                let endBlockNumber = Math.min(+anchorBlockNumber + maxBlockBatchSize, lastBitcoinBlock);
                let newBlockHeadersArray = yield this.btcInterface.getHexBlockHeaders(startBlockNumber, endBlockNumber);
                for (let i in newBlockHeadersArray) {
                    let result;
                    const { hexBlockHeaders, fromBlockNumber, toBlockNumber } = newBlockHeadersArray[i];
                    let newAnchorBlockHeader = +i === 0
                        ? anchorBlockHeader
                        : newBlockHeadersArray[i - 1].hexBlockHeaders.slice(newBlockHeadersArray[i - 1].hexBlockHeaders.length - 160);
                    if (!this.testnet && fromBlockNumber % 2016 === 0) {
                        let oldPeriodStartHeader = yield this.btcInterface.getBlockHeaderHex(fromBlockNumber - 2016);
                        let oldPeriodEndHeader = newAnchorBlockHeader;
                        logger.debug('submit blocks with retarget');
                        result = yield this.bitcoinRelayContract.submitBlockHeadersWithRetarget(`0x${oldPeriodStartHeader}`, `0x${oldPeriodEndHeader}`, `0x${hexBlockHeaders}`);
                        let submitBlockMessage = `block submitted with retarget -> blockNumber=${fromBlockNumber}`;
                        sendNotificationToAdmin(submitBlockMessage);
                        logger.info(submitBlockMessage);
                    }
                    else {
                        logger.verbose(`submit block ... from=${fromBlockNumber} - to=${toBlockNumber}`);
                        result = yield this.bitcoinRelayContract.submitBlockHeaders(`0x${newAnchorBlockHeader}`, `0x${hexBlockHeaders}`);
                    }
                    if ((result === null || result === void 0 ? void 0 : result.status) === false) {
                        this.numberOfFailedTxs += 1;
                        this.totalFailedTxsGasUsed += +result.gasUsed;
                        this.totalFailedTxsEthPaid += (+result.gasUsed * +result.gasPrice) / Math.pow(10, 18);
                        throw new Error(`transaction failed. from: ${fromBlockNumber} - to: ${toBlockNumber} - hexBlockHeaders: ${hexBlockHeaders} -> txId: ${result.txId}`);
                    }
                    else {
                        this.numberOfSuccessfulTxs += 1;
                        this.totalSuccessfulTxsGasUsed += +result.gasUsed;
                        this.totalSuccessfulTxsEthPaid += (+result.gasUsed * +result.gasPrice) / Math.pow(10, 18);
                        this.totalNumberOfBlockSubmitted += +toBlockNumber - +fromBlockNumber + 1;
                        let submitBlockMessage = `new blocks submitted. from=${fromBlockNumber} - to=${toBlockNumber} -> txId=${result.txId}
          fee=${(+result.gasUsed * +result.gasPrice) / Math.pow(10, 18)} ETH`;
                        if (+fromBlockNumber % 30 === 0)
                            sendNotificationToAdmin(submitBlockMessage);
                        logger.info(submitBlockMessage);
                    }
                }
                if (endBlockNumber < lastBitcoinBlock) {
                    return yield this.relaying(endBlockNumber, lastBitcoinBlock);
                }
                yield this.bitcoinRelayContract.checkCurrentAccountBalanceForContractCall({});
                return true;
            }
            catch (error) {
                handleError(error);
                return false;
            }
            finally {
                this.logData();
            }
        });
    }
}
module.exports = BitcoinRelayer;
//# sourceMappingURL=Relayer.js.map