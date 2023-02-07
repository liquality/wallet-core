"use strict";
const tslib_1 = require("tslib");
const { CcBurnRouter, WrappedToken } = require('@sinatdt/contracts-helper').contracts;
const { BitcoinInterface, TeleportDaoPayment: LockerPayment } = require('@sinatdt/bitcoin');
const { addressTypesNumber } = require('@sinatdt/configs').teleswap.bitcoinAddressTypes;
const { sourceNetwork, contracts, tokens } = require('../../config/blockchain.config');
class BurnRequest {
    constructor({ mnemonic, index, targetNetworkConnectionConfig, bitcoinAddressType = 'p2wpkh' }) {
        this.burnContract = new CcBurnRouter(targetNetworkConnectionConfig, contracts.ccBurnAddress);
        this.teleBTC = new WrappedToken({
            web3Eth: this.burnContract.web3Eth,
        }, tokens.teleBTC);
        this.ethClientAddress = this.burnContract.addAccountByMnemonic({ mnemonic, index });
        this.teleBTC.setCurrentAccount(this.ethClientAddress);
        this.btcInterface = new BitcoinInterface(sourceNetwork.connection, sourceNetwork.name);
        let btcTransaction = new LockerPayment(sourceNetwork.connection, sourceNetwork.name);
        btcTransaction.setAccountPrivateKeyByMnemonic({
            mnemonic,
            index,
        });
        this.bitcoinAddress = btcTransaction.setAccount(bitcoinAddressType);
        this.isInitialize = false;
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.teleBTC.setDecimal();
            this.isInitialize = true;
        });
    }
    sendBurnRequest(lockerAddress, amount, receiverAddress = null, mintIfNeeded = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialize)
                yield this.init();
            let lockerObj = this.btcInterface.convertAddressToScript(lockerAddress);
            const lockerScript = `0x${lockerObj.script.toString('hex')}`;
            let receiverBitcoinAddress = receiverAddress || this.bitcoinAddress;
            console.log('receiverBitcoinAddress', receiverBitcoinAddress);
            console.log('teleBTC.unit', this.teleBTC.unit);
            console.log('teleBTC.contractAddress', this.teleBTC.contractAddress);
            yield this.getTeleBtcBalanceAndMintIfNeeded(mintIfNeeded);
            let realAmount = (amount * Math.pow(10, this.teleBTC.unit)).toFixed();
            let approvedBalance = yield this.teleBTC.getApprovedBalanceForAddress(this.burnContract.contractAddress);
            console.log('approvedBalance: ', +approvedBalance, 'realAmount: ', +realAmount);
            if (+approvedBalance < +realAmount) {
                console.log('approve balance');
                console.log('approve balance txId', (yield this.teleBTC.approve(this.burnContract.contractAddress, (50 * Number(realAmount)).toFixed())).transactionHash);
            }
            let { addressObject: receiver, addressType } = this.btcInterface.convertAddressToObject(receiverBitcoinAddress);
            console.log('receiver', `0x${receiver.hash.toString('hex')}`, addressTypesNumber[addressType]);
            const gasAmount = yield this.burnContract.contract.methods
                .ccBurn(realAmount, `0x${receiver.hash.toString('hex')}`, addressTypesNumber[addressType], lockerScript)
                .estimateGas({ from: this.burnContract.currentAccount });
            let y = yield this.burnContract.contract.methods
                .ccBurn(realAmount, `0x${receiver.hash.toString('hex')}`, addressTypesNumber[addressType], lockerScript)
                .send({ from: this.burnContract.currentAccount, gas: gasAmount });
            console.log('send transactionHash: ', y.transactionHash);
            return y.transactionHash;
        });
    }
    getTeleBtcBalanceAndMintIfNeeded(mint = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialize)
                yield this.init();
            let teleBtcBalance = yield this.teleBTC.getBalance();
            console.log(`${this.ethClientAddress} teleBtcBalance`, teleBtcBalance);
            if (mint && +teleBtcBalance < 0.001 * Math.pow(10, this.teleBTC.unit)) {
                console.log('mint test teleBTC for account', this.ethClientAddress);
                let response = yield this.mintTestToken();
                console.log('mint txId', response.transactionHash);
            }
            return +teleBtcBalance / Math.pow(10, this.teleBTC.unit);
        });
    }
    mintTestToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('mint test teleBTC for account', this.ethClientAddress);
            let response = yield this.teleBTC.mintTestToken();
            console.log('mint txId', response.transactionHash);
        });
    }
}
module.exports = BurnRequest;
//# sourceMappingURL=burn-request.js.map