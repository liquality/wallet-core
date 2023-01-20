"use strict";
const tslib_1 = require("tslib");
const Locker = require('./src/Locker');
const { logger } = require('./src/config/logger');
const { sourceNetwork, targetNetwork, account, contracts, service, } = require('./src/config/blockchain.config');
const { handleErrorAndExit } = require('./src/error/error-handler');
const { sendNotificationToAdmin } = require('./src/utils/notify-admin');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (service.name !== 'locker')
            handleErrorAndExit('incorrect service name. service name should be locker');
        let locker = new Locker({
            sourceNetwork,
            targetNetwork,
            mnemonic: account.mnemonic,
            ccBurnContractAddress: contracts.ccBurnAddress,
            bitcoinRelayContractAddress: contracts.relayAddress,
            lockerContractAddress: contracts.lockerAddress,
        });
        locker.setAccount(account.index);
        yield locker.setNumberOfConfirmations();
        logger.info('******************** Start Locker ********************');
        logger.info(`number of confirmations: ${locker.numberOfConfirmations}`);
        logger.info(`Locker bitcoin address: ${locker.bitcoinAddress}`);
        logger.info(`Locker ethereum client address: ${locker.ethClientAddress}`);
        sendNotificationToAdmin(`Locker start working
  - - -
  number of confirmations: ${locker.numberOfConfirmations}
  Locker bitcoin address: ${locker.bitcoinAddress}
  Locker ethereum client address: ${locker.ethClientAddress}
  `);
        locker.start();
    });
}
start();
//# sourceMappingURL=start-locker.js.map