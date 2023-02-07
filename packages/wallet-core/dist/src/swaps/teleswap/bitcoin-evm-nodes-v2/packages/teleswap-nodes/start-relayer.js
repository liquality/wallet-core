"use strict";
const tslib_1 = require("tslib");
const BitcoinRelayer = require('./src/Relayer');
const { logger } = require('./src/config/logger');
const { sourceNetwork, targetNetwork, account, contracts, service, } = require('./src/config/blockchain.config');
const { handleErrorAndExit } = require('./src/error/error-handler');
const { sendNotificationToAdmin } = require('./src/utils/notify-admin');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (service.name !== 'relayer')
            handleErrorAndExit('incorrect service name. service name should be relayer');
        let bitcoinRelayer = new BitcoinRelayer({
            sourceNetwork,
            targetNetwork,
            mnemonic: account.mnemonic,
            bitcoinRelayContractAddress: contracts.relayAddress,
        });
        logger.info('******************** Start Relayer ********************');
        let walletAddress = yield bitcoinRelayer.setAccount(account.index);
        logger.info(`Relayer Address : ${walletAddress}`);
        sendNotificationToAdmin(`Relayer start working
  - - -
  Relayer Address : ${walletAddress}
  `);
        yield bitcoinRelayer.startRelaying();
    });
}
start();
//# sourceMappingURL=start-relayer.js.map