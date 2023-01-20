"use strict";
const tslib_1 = require("tslib");
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { targetNetwork, account, service } = require('../../config/blockchain.config');
const User = require('./user');
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let startIndex = 1000;
        let numberOfUser = 2;
        let userPrefix = 'test-user-';
        let lockerAddress = service.teleporter.lockers[0].split(':')[0];
        let ethBase = new EthBase({
            connectionInfo: targetNetwork.connection.web3,
        });
        let targetNetworkConnectionConfig = {
            web3Eth: ethBase.web3Eth,
        };
        for (let index = startIndex; index < startIndex + numberOfUser; index += 1) {
            let user = new User({
                userPrefix,
                mnemonic: account.mnemonic,
                index,
                targetNetworkConnectionConfig,
                bitcoinAddressType: 'p2wpkh',
                lockerLists: [lockerAddress],
            });
            yield user.init();
            user.simulate();
        }
    });
}
start();
//# sourceMappingURL=start-simulation.js.map