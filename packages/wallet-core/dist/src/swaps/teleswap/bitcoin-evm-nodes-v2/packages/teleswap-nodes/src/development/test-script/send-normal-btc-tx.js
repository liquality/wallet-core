"use strict";
const tslib_1 = require("tslib");
const { BitcoinBase } = require('@sinatdt/bitcoin');
const { sourceNetwork, targetNetwork } = require('../../config/blockchain.config');
const { account, tokens, service } = require('../../config/blockchain.config');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(sourceNetwork.connection, sourceNetwork.name);
        let btcTransaction = new BitcoinBase(sourceNetwork.connection, sourceNetwork.name);
        btcTransaction.setAccountPrivateKeyByMnemonic({
            mnemonic: account.mnemonic,
            index: 12,
        });
        btcTransaction.setAccount('p2sh-p2wpkh');
        let receiverAddress = 'tb1qf702f8h09g56jzad2wdf726lxmq9yxlagr4zzf';
        let amount = 0.001 * 1e8;
        let response = yield btcTransaction.send({ receiverAddress, amount });
        console.log(response);
    });
}
start();
//# sourceMappingURL=send-normal-btc-tx.js.map