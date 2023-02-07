"use strict";
const tslib_1 = require("tslib");
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { BitcoinInterface, TeleportDaoPayment: LockerPayment } = require('@sinatdt/bitcoin');
const calculateFee = require('../../../../scripts/src/calculate-user-transfer-fee');
const { bitcoinConnectionInfo, ethereumConnectionInfo, mnemonic, tokens, service, } = require('../../config/blockchain.config');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const ethBase = new EthBase({ connectionInfo: ethereumConnectionInfo });
        let ethClientAddress = ethBase.addAccountByMnemonic({ mnemonic, index: 2 });
        console.log(ethClientAddress);
        let lockerAddress = service.teleporter.lockers[0].split(':')[0];
        console.log(lockerAddress);
        const btcBase = new LockerPayment(bitcoinConnectionInfo);
        btcBase.setAccountPrivateKeyByMnemonic({
            mnemonic,
            index: 2,
        });
        let address = btcBase.setAccount('p2wpkh');
        const btcInterface = new BitcoinInterface(bitcoinConnectionInfo);
        let balance = yield btcInterface.getBalance(address);
        console.log(address, balance);
        let amount = 0.0005;
        let { teleporterPercentageFee, receivedAmount } = yield calculateFee(amount);
        console.log('teleporterPercentageFee', teleporterPercentageFee);
        console.log('receivedAmount', receivedAmount);
        let parameters = {
            lockerAddress,
            amount: Math.floor(amount * 1e8),
            recipientAddress: ethClientAddress,
            chainId: 3,
            appId: 100,
            percentageFee: teleporterPercentageFee,
            mode: 0,
            isBorrow: false,
            tokenAddress: tokens.link,
            borrowAmount: 0,
        };
        console.log(parameters);
        let response = yield btcBase.bitcoinToEthLend(parameters);
        console.log(response);
    });
}
start();
//# sourceMappingURL=send-lend-tx.js.map