"use strict";
const tslib_1 = require("tslib");
const Locker = require('../Locker');
const { sourceNetwork, targetNetwork, account, contracts } = require('../config/blockchain.config');
function addCollateral(valueInEth) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let locker = new Locker({
            sourceNetwork,
            targetNetwork,
            mnemonic: account.mnemonic,
            ccBurnContractAddress: contracts.ccBurnAddress,
            bitcoinRelayContractAddress: contracts.relayAddress,
            lockerContractAddress: contracts.lockerAddress,
        });
        locker.setAccount(account.index);
        locker.lockerInterface.setCurrentAccount(locker.ethClientAddress);
        let value = (valueInEth * 1e18).toFixed();
        console.log('locker.ethClientAddress', locker.ethClientAddress, 'valueInEth', valueInEth);
        console.log({
            targetAddress: locker.lockerInterface.currentAccount,
            nativeTokenAmount: value,
        });
        yield locker.baseEthWeb3.checkCurrentAccountBalance();
        let response = yield locker.lockerInterface.addCollateral({
            nativeTokenAmount: value,
        });
        console.log(response);
    });
}
addCollateral(5);
//# sourceMappingURL=add-collatral.js.map