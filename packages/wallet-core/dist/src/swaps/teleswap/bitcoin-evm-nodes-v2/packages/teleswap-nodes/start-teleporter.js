"use strict";
const tslib_1 = require("tslib");
const Teleporter = require('./src/Teleporter');
const { logger } = require('./src/config/logger');
const { sourceNetwork, targetNetwork, account, contracts, service, } = require('./src/config/blockchain.config');
const { handleErrorAndExit } = require('./src/error/error-handler');
const { sendNotificationToAdmin } = require('./src/utils/notify-admin');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (service.name !== 'teleporter')
            handleErrorAndExit('incorrect service name. service name should be teleporter');
        let teleporter = new Teleporter({
            allLockerAddresses: service.teleporter.lockers,
            sourceNetwork,
            targetNetwork,
            mnemonic: account.mnemonic,
            bitcoinRelayContractAddress: contracts.relayAddress,
            lendingContractAddress: contracts.lendingAddress,
            ccTransferContractAddress: contracts.ccTransferAddress,
            ccExchangeContractAddress: contracts.ccExchangeAddress,
            instantRouterContractAddress: contracts.instantRouterAddress,
            lockerContractAddress: contracts.lockerAddress,
            ccBurnContractAddress: contracts.ccBurnAddress,
            isTeleportActivated: service.teleporter.teleportEnabled,
            isLendingActivated: service.teleporter.lendingEnabled,
            isSlashLockerActivated: service.teleporter.slashLockerEnabled,
            isSlashUserActivated: service.teleporter.slashUserEnabled,
        });
        logger.info('******************** Start Teleporter ********************');
        yield teleporter.init(account.index);
        logger.info(`********************************************************`);
        logger.info(`
  is teleport active: ${teleporter.isTeleportActivated}
  is slash user active: ${teleporter.isSlashUserActivated}
  is slash locker active: ${teleporter.isSlashLockerActivated}
  is lending active: ${teleporter.teleport.isLendingActivated}
  `);
        logger.info(`********************************************************`);
        logger.info(`lockers addresses: ${teleporter.teleport.lockerAddresses}`);
        logger.info(`********************************************************`);
        logger.info(`teleport ethereum client: ${teleporter.teleport.ethClientAddress}`);
        logger.info(`slash locker ethereum client: ${teleporter.slashLocker.ethClientAddress}`);
        logger.info(`slash user ethereum client: ${teleporter.slashUser.ethClientAddress}`);
        sendNotificationToAdmin(`Teleporter start working
  - - -
  is Teleport active: ${teleporter.isTeleportActivated}
  is Lending active: ${teleporter.isTeleportActivated && teleporter.teleport.isLendingActivated}
  Teleport and Lending ethereum client: ${teleporter.teleport.ethClientAddress}
  - - -
  is SlashUser active: ${teleporter.isSlashUserActivated}
  SlashUser ethereum client: ${teleporter.slashUser.ethClientAddress}
  - - -
  is SlashLocker active: ${teleporter.isSlashLockerActivated}
  SlashLocker ethereum client: ${teleporter.slashLocker.ethClientAddress}
  - - -
  Lockers addresses: ${teleporter.teleport.lockerAddresses}
  `);
        yield teleporter.startTeleporter();
    });
}
start();
//# sourceMappingURL=start-teleporter.js.map