"use strict";
const tslib_1 = require("tslib");
const { EthereumBase: EthBase } = require('@sinatdt/contracts-helper');
const { BitcoinInterface, TeleportDaoPayment: LockerPayment } = require('@sinatdt/bitcoin');
const { calculateFee } = require('@sinatdt/scripts');
const appIds = require('./protocol-app-ids');
const { sourceNetwork, targetNetwork } = require('../../config/blockchain.config');
class TransferAndExchange {
    constructor({ mnemonic, index, bitcoinAddressType = 'p2wpkh' }) {
        const ethBase = new EthBase({ connectToNetwork: false });
        this.clientAddress = ethBase.addAccountByMnemonic({
            mnemonic,
            index,
        });
        this.targetNetworkChainId = targetNetwork.chainId;
        this.btcTransaction = new LockerPayment(sourceNetwork.connection, sourceNetwork.name);
        this.btcTransaction.setAccountPrivateKeyByMnemonic({
            mnemonic,
            index,
        });
        this.bitcoinAddress = this.btcTransaction.setAccount(bitcoinAddressType);
        this.btcInterface = new BitcoinInterface(sourceNetwork.connection, sourceNetwork.name);
    }
    send(lockerAddress, amount, { isExchange = false, outputAmount = 0, isFixedToken = false, exchangeTokenAddress }, constantFee = null, clientAddress = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let type = isExchange ? 'exchange' : 'transfer';
            let ethClientAddress = clientAddress || this.clientAddress;
            console.log('ethClientAddress', ethClientAddress);
            console.log('lockerAddress', lockerAddress);
            let balance = yield this.btcInterface.getBalance(this.bitcoinAddress);
            console.log('bitcoinAddress', this.bitcoinAddress, 'balance', balance);
            let deadline = Math.ceil(new Date().getTime() / 1000 + 3600);
            let percentageFee = constantFee || (yield calculateFee(amount, type)).teleporterPercentageFee;
            console.log('deadline', deadline);
            console.log('percentageFee', percentageFee);
            let response = yield this.btcTransaction.transferBitcoinToEth({
                lockerAddress,
                amount: Math.floor(amount * 1e8),
                recipientAddress: ethClientAddress,
                percentageFee,
                chainId: this.targetNetworkChainId,
                appId: isExchange ? appIds.exchange : appIds.transfer,
                speed: 0,
                isExchange,
                outputAmount,
                exchangeTokenAddress,
                isFixedToken,
                deadline,
            });
            console.log('transaction sent. txId: ', response);
            return response;
        });
    }
    getBtcBalance() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let balance = yield this.btcInterface.getBalance(this.bitcoinAddress);
            return +balance / 1e8;
        });
    }
}
module.exports = TransferAndExchange;
//# sourceMappingURL=cc-transfer-exchange.js.map