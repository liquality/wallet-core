"use strict";
const tslib_1 = require("tslib");
const { BitcoinRelay } = require('@sinatdt/contracts-helper').contracts;
const { sleep } = require('@sinatdt/utils').tools;
const Teleport = require('./modules/teleporter/teleport');
const SlashUser = require('./modules/teleporter/slash-user');
const SlashLocker = require('./modules/teleporter/slash-locker');
const { handleError, handleErrorAndExit } = require('./error/error-handler');
const { logger } = require('./config/logger');
class Teleporter {
    constructor({ allLockerAddresses = [], sourceNetwork, targetNetwork, mnemonic, ccBurnContractAddress, bitcoinRelayContractAddress, lendingContractAddress, ccTransferContractAddress, ccExchangeContractAddress, instantRouterContractAddress, lockerContractAddress, isTeleportActivated, isSlashLockerActivated, isSlashUserActivated, isLendingActivated, }) {
        this.allLockerAddresses = allLockerAddresses;
        this.validLockerAddresses = null;
        let connectionConfig = { connectionInfo: targetNetwork.connection.web3 };
        this.isWsProvider = connectionConfig.connectionInfo.url.startsWith('wss');
        this.setContractsInterfaces({
            connectionConfig,
            bitcoinRelayContractAddress,
        });
        this.teleport =
            isTeleportActivated &&
                new Teleport({
                    sourceNetwork,
                    targetNetwork,
                    mnemonic,
                    bitcoinRelayContractAddress,
                    lendingContractAddress,
                    ccExchangeContractAddress,
                    ccTransferContractAddress,
                    lockerContractAddress,
                    isLendingActivated,
                });
        this.slashUser =
            isSlashUserActivated &&
                new SlashUser({
                    sourceNetwork,
                    targetNetwork,
                    mnemonic,
                    instantRouterContractAddress,
                });
        this.slashLocker =
            isSlashLockerActivated &&
                new SlashLocker({
                    sourceNetwork,
                    targetNetwork,
                    mnemonic,
                    ccBurnContractAddress,
                    lockerContractAddress,
                    bitcoinRelayContractAddress,
                });
        this.isTeleportActivated = isTeleportActivated;
        this.isSlashLockerActivated = isSlashLockerActivated;
        this.isSlashUserActivated = isSlashUserActivated;
    }
    setContractsInterfaces({ connectionConfig, bitcoinRelayContractAddress }) {
        this.btcRelayInterface = new BitcoinRelay(connectionConfig, bitcoinRelayContractAddress);
    }
    init(index = 0) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.isTeleportActivated) {
                this.teleport.setAccount(index);
                yield this.teleport.init();
                this.validLockerAddresses =
                    (_a = this.validLockerAddresses) !== null && _a !== void 0 ? _a : (yield this.teleport.validateAndSetLockerAddresses(this.allLockerAddresses));
            }
            if (this.isSlashLockerActivated) {
                this.slashLocker.setAccount(index);
                yield this.slashLocker.init();
                this.validLockerAddresses =
                    (_b = this.validLockerAddresses) !== null && _b !== void 0 ? _b : (yield this.slashLocker.validateAndSetLockerAddresses(this.allLockerAddresses));
                this.slashLocker.setValidLockerAddresses(this.validLockerAddresses);
            }
            if (this.isSlashUserActivated) {
                this.slashUser.setAccount(index);
            }
        });
    }
    listenForNewBlock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.isWsProvider) {
                this.btcRelayInterface.contract.events
                    .BlockAdded({})
                    .on('connected', (subscriptionId) => {
                    logger.verbose(`BlockAdded event subscriptionId: ${subscriptionId}`);
                })
                    .on('data', (event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        let blockData = this.btcRelayInterface.parseBlockAddedEvent(event);
                        if (this.isSlashUserActivated) {
                            this.slashUser.newBlockReceived(blockData);
                        }
                        if (this.isSlashLockerActivated) {
                            this.slashLocker.newBlockReceived(blockData);
                        }
                        if (this.isTeleportActivated) {
                            this.teleport.newBlockReceived(blockData);
                        }
                    }
                    catch (error) {
                        handleError(error);
                    }
                }))
                    .on('error', (err) => logger.error(`event error${err}`));
            }
            else {
                let lastCheckedBlock = yield this.btcRelayInterface.lastSubmittedHeight();
                while (true) {
                    try {
                        let currentBlock = yield this.btcRelayInterface.lastSubmittedHeight();
                        let lastEthBlock = yield this.btcRelayInterface.getLatestBlockNumber();
                        console.log(lastCheckedBlock, currentBlock);
                        for (let i = +lastCheckedBlock + 1; i <= +currentBlock; i += 1) {
                            let blockData = {
                                height: i,
                                txInfo: {
                                    blockNumber: lastEthBlock,
                                },
                            };
                            if (this.isSlashUserActivated) {
                                this.slashUser.newBlockReceived(blockData);
                            }
                            if (this.isSlashLockerActivated) {
                                this.slashLocker.newBlockReceived(blockData);
                            }
                            if (this.isTeleportActivated) {
                                this.teleport.newBlockReceived(blockData);
                            }
                            lastCheckedBlock = i;
                        }
                    }
                    catch (error) {
                        handleError(error);
                    }
                    yield sleep(5 * 60000);
                }
            }
        });
    }
    startTeleporter() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let lastBtcBlockNumber = yield this.btcRelayInterface.lastSubmittedHeight();
                if (this.isTeleportActivated) {
                    let enoughBalance = yield this.teleport.baseEthWeb3.checkCurrentAccountBalanceForContractCall({});
                    if (!enoughBalance) {
                        handleErrorAndExit('not enough balance');
                    }
                    yield this.teleport.processOldTeleportRequests(lastBtcBlockNumber);
                }
                if (this.isSlashLockerActivated) {
                    let enoughBalance = yield this.slashLocker.baseEthWeb3.checkCurrentAccountBalanceForContractCall({});
                    if (!enoughBalance) {
                        handleErrorAndExit('not enough balance');
                    }
                    yield this.slashLocker.processOldRequests(lastBtcBlockNumber);
                    this.slashLocker.listenForBurnEvents();
                }
                if (this.isSlashUserActivated) {
                    let enoughBalance = yield this.slashUser.baseEthWeb3.checkCurrentAccountBalanceForContractCall({});
                    if (!enoughBalance) {
                        handleErrorAndExit('not enough balance');
                    }
                    yield this.slashUser.processOldRequests(lastBtcBlockNumber);
                    this.slashUser.listenForInstantEvents();
                }
                this.listenForNewBlock();
            }
            catch (err) {
                handleError(err);
                yield sleep(10 * 60000);
                this.startTeleporter();
            }
        });
    }
}
module.exports = Teleporter;
//# sourceMappingURL=Teleporter.js.map