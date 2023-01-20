"use strict";
const tslib_1 = require("tslib");
const Locker = require('../Locker');
const { sourceNetwork, targetNetwork, account, contracts } = require('../config/blockchain.config');
function addLocker() {
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
        let value = '5000000000000000000';
        console.log('locker.ethClientAddress', locker.ethClientAddress, 'value', +value / 1e18);
        console.log({
            lockerAddress: locker.bitcoinAddress,
            lockerLockingScript: locker.bitcoinLockingScript,
            lockedTDTAmount: 0,
            lockedNativeTokenAmount: value,
            lockerRescueScript: `0x${locker.rescueBtcTx.addressObj.hash.toString('hex')}`,
            lockerRescueType: 'p2sh',
        });
        let response = yield locker.lockerInterface.requestToBecomeLocker({
            lockerLockingScript: locker.bitcoinLockingScript,
            lockedTDTAmount: 0,
            lockedNativeTokenAmount: value,
            lockerRescueScript: `0x${locker.rescueBtcTx.addressObj.hash.toString('hex')}`,
            lockerRescueType: 'p2sh',
        });
        console.log(response);
    });
}
addLocker();
//# sourceMappingURL=add-locker.js.map