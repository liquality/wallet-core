"use strict";
const tslib_1 = require("tslib");
const BurnRequest = require('../actions/burn-request');
const { targetNetwork, account, service } = require('../../config/blockchain.config');
const getLocker = require('../../../../scripts/src/script/get-lockers');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let burn = new BurnRequest({
            mnemonic: account.mnemonic,
            index: 2,
            targetNetworkConnectionConfig: { connectionInfo: targetNetwork.connection.web3 },
        });
        let lockerAddress = (yield getLocker(0.0005, 'burn')).preferredLocker.bitcoinAddress;
        let amount = 0.0001;
        yield burn.sendBurnRequest(lockerAddress, amount, null, false);
    });
}
start();
//# sourceMappingURL=burn-request.js.map