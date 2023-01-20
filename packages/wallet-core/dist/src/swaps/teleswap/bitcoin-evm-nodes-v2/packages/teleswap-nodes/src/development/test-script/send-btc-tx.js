"use strict";
const tslib_1 = require("tslib");
const { getLockers } = require('@sinatdt/scripts');
const TransferAndExchange = require('../actions/cc-transfer-exchange');
const { account, tokens, targetNetwork } = require('../../config/blockchain.config');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let transferExchange = new TransferAndExchange({
            mnemonic: account.mnemonic,
            index: 2,
        });
        let amount = 0.0005;
        let lockerAddress = (yield getLockers({
            amount,
            targetNetworkConnectionInfo: { web3: targetNetwork.connection.web3 },
        })).preferredLocker.bitcoinAddress;
        yield transferExchange.send(lockerAddress, amount, {
            isExchange: false,
            outputAmount: 0,
            isFixedToken: false,
            exchangeTokenAddress: tokens.link,
        });
    });
}
start();
//# sourceMappingURL=send-btc-tx.js.map