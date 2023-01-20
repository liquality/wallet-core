"use strict";
const tslib_1 = require("tslib");
class TeleportDaoPayment {
    payBurnRequest(receivers) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let extendedUtxo = yield this.transactionBuilder.getExtendedUtxo({
                address: this.currentAccount,
                addressType: this.currentAccountType,
                publicKey: this.publicKey.toString("hex"),
            });
            let unsignedTx = yield this.transactionBuilder.processUnsignedTransaction({
                extendedUtxo,
                targets: receivers,
                changeAddress: this.currentAccount,
                feeRate: 1,
                fullAmount: false,
            });
            let signedPsbt = yield this.signer.signPsbt(unsignedTx, this.privateKey);
            let signedTx = this.signer.finalizePsbts([signedPsbt]);
            console.log(signedTx, signedPsbt);
            let txId = yield this.transactionBuilder.sendTx(signedTx);
            console.log(txId);
            return txId;
        });
    }
    transferBitcoinToEth({ lockerAddress, amount, chainId, appId, recipientAddress, percentageFee, speed = 0, isExchange = false, exchangeTokenAddress = "0x0000000000000000000000000000000000000000", outputAmount = 0, deadline, isFixedToken = false, feeSpeed = "normal", }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let extendedUtxo = yield this.getExtendedUtxo({
                address: this.currentAccount,
                addressType: this.currentAccountType,
                publicKey: this.publicKey.toString("hex"),
            });
            let unsignedTx = this.getBitcoinToEthUnsignedPsbt({
                extendedUtxo,
                lockerAddress,
                amount,
                chainId,
                appId,
                recipientAddress,
                percentageFee,
                speed,
                isExchange,
                exchangeTokenAddress,
                outputAmount,
                deadline,
                isFixedToken,
                feeSpeed,
            });
            let signedPsbt = yield this.signer.signPsbt(unsignedTx, this.privateKey);
            let txId = yield this.sendSignedPsbt(signedPsbt);
            return txId;
        });
    }
    getBitcoinToEthTargetOutputs({ lockerAddress, amount, chainId, appId, recipientAddress, percentageFee, speed = 0, isExchange = false, exchangeTokenAddress = "0x0000000000000000000000000000000000000000", outputAmount = 0, deadline, isFixedToken = false, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let dataHex = TeleportDaoPayment.getTransferOpReturnData({
                chainId,
                appId,
                recipientAddress,
                percentageFee,
                speed,
                isExchange,
                exchangeTokenAddress,
                outputAmount,
                deadline,
                isFixedToken,
            });
            let opTarget = this.transactionBuilder.getOpReturnTarget(dataHex);
            return [
                {
                    address: lockerAddress,
                    value: amount,
                },
                opTarget,
            ];
        });
    }
    getBitcoinToEthUnsignedPsbt({ extendedUtxo, lockerAddress, amount, chainId, appId, recipientAddress, percentageFee, speed = 0, isExchange = false, exchangeTokenAddress = "0x0000000000000000000000000000000000000000", outputAmount = 0, deadline, isFixedToken = false, feeSpeed = "normal", }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let feeRate = this.transactionBuilder._getFeeRate(feeSpeed);
            let targets = this.getBitcoinToEthTargetOutputs({
                lockerAddress,
                amount,
                chainId,
                appId,
                recipientAddress,
                percentageFee,
                speed,
                isExchange,
                exchangeTokenAddress,
                outputAmount,
                deadline,
                isFixedToken,
            });
            let unsignedTx = yield this.transactionBuilder.processUnsignedTransaction({
                extendedUtxo,
                targets,
                changeAddress: this.currentAccount,
                feeRate,
                fullAmount: false,
            });
            return unsignedTx;
        });
    }
    bitcoinToEthLend({ lockerAddress, amount, chainId, appId, recipientAddress, percentageFee, mode = 0, isBorrow = false, tokenAddress = "0x0000000000000000000000000000000000000000", borrowAmount = 0, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let dataHex = TeleportDaoPayment.getLendingOpReturnData({
                chainId,
                appId,
                recipientAddress,
                percentageFee,
                mode,
                isBorrow,
                tokenAddress,
                borrowAmount,
            });
            let opTarget = this.transactionBuilder.getOpReturnTarget(dataHex);
            let extendedUtxo = yield this.transactionBuilder.getExtendedUtxo({
                address: this.currentAccount,
                addressType: this.currentAccountType,
                publicKey: this.publicKey.toString("hex"),
            });
            let unsignedTx = yield this.transactionBuilder.processUnsignedTransaction({
                extendedUtxo,
                targets: [
                    {
                        address: lockerAddress,
                        value: amount,
                    },
                    opTarget,
                ],
                changeAddress: this.currentAccount,
                feeRate: 1,
                fullAmount: false,
            });
            let signedPsbt = yield this.signer.signPsbt(unsignedTx, this.privateKey);
            let signedTx = this.signer.finalizePsbts([signedPsbt]);
            console.log(signedTx);
            let txId = yield this.transactionBuilder.sendTx(signedTx);
            return txId;
        });
    }
    static getTransferOpReturnData({ chainId, appId, recipientAddress, percentageFee, speed = 0, isExchange = false, exchangeTokenAddress = "0x0000000000000000000000000000000000000000", outputAmount = 0, deadline, isFixedToken = false, }) {
        let chainIdHex = Number(chainId).toString(16).padStart(2, "0");
        let appIdHex = Number(appId).toString(16).padStart(4, "0");
        let recipientAddressHex = recipientAddress.replace("0x", "").toLowerCase().padStart(40, "0");
        let percentageFeeHex = Number((percentageFee * 100).toFixed(0))
            .toString(16)
            .padStart(4, "0");
        let speedHex = speed ? "01" : "00";
        let dataHex = chainIdHex + appIdHex + recipientAddressHex + percentageFeeHex + speedHex;
        if (!isExchange) {
            if (dataHex.length !== 26 * 2)
                throw new Error("invalid data length");
            return dataHex;
        }
        let exchangeTokenAddressHex = exchangeTokenAddress
            .replace("0x", "")
            .toLowerCase()
            .padStart(40, "0");
        let outputAmountHex = Number(outputAmount).toString(16).padStart(56, "0");
        let deadlineHex = Number(deadline).toString(16).padStart(8, "0");
        let isFixedTokenHex = isFixedToken ? "01" : "00";
        dataHex = dataHex + exchangeTokenAddressHex + outputAmountHex + deadlineHex + isFixedTokenHex;
        if (dataHex.length !== 79 * 2)
            throw new Error("invalid data length");
        return dataHex;
    }
    static getLendingOpReturnData({ chainId, appId, recipientAddress, percentageFee, mode, isBorrow = false, tokenAddress = "0x0000000000000000000000000000000000000000", borrowAmount = 0, }) {
        let chainIdHex = Number(chainId).toString(16).padStart(2, "0");
        let appIdHex = Number(appId).toString(16).padStart(4, "0");
        let recipientAddressHex = recipientAddress.replace("0x", "").toLowerCase().padStart(40, "0");
        let percentageFeeHex = Number((percentageFee * 100).toFixed(0))
            .toString(16)
            .padStart(4, "0");
        let modeHex = Number(mode).toString(16).padStart(2, "0");
        let dataHex = chainIdHex + appIdHex + recipientAddressHex + percentageFeeHex + modeHex;
        if (!isBorrow) {
            if (dataHex.length !== 26 * 2)
                throw new Error("invalid data length");
            return dataHex;
        }
        let tokenAddressHex = tokenAddress.replace("0x", "").toLowerCase().padStart(40, "0");
        let borrowAmountHex = Number(borrowAmount).toString(16).padStart(56, "0");
        dataHex = dataHex + tokenAddressHex + borrowAmountHex;
        if (dataHex.length !== 74 * 2)
            throw new Error("invalid data length");
        return dataHex;
    }
}
module.exports = TeleportDaoPayment;
//# sourceMappingURL=teleport-dao-payments.js.map