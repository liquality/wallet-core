"use strict";
const tslib_1 = require("tslib");
const Web3Eth = require("web3-eth");
const { BigNumber } = require("bignumber.js");
const Web3HttpProvider = require("web3-providers-http");
const Web3WsProvider = require("web3-providers-ws");
const bip39 = require("bip39");
const bip32 = require("bip32");
const { hdWalletPath } = require("@sinatdt/configs");
class EthereumBase {
    constructor({ connectionInfo = undefined, web3Eth = undefined }) {
        this.web3Eth = web3Eth || new Web3Eth();
        if (!web3Eth && connectionInfo) {
            this.setProviderUsingUrl(connectionInfo);
        }
        this.web3Eth.transactionConfirmationBlocks = 1;
        this.web3Eth.transactionBlockTimeout = 10;
        this.isAccountInitialized = false;
        this.currentAccount = null;
        this.hdWalletPath = hdWalletPath.ethereum;
    }
    static extractEventTxInfo(rawEvent) {
        const { blockNumber, logIndex, transactionHash, event: eventName, signature } = rawEvent;
        return { blockNumber, logIndex, transactionHash, eventName, signature };
    }
    setProviderUsingUrl({ url, headers = undefined }) {
        if (url.startsWith("wss")) {
            this.setWssProviderUsingUrl({ url, headers });
        }
        else {
            this.setHttpProviderUsingUrl({ url, headers });
        }
    }
    setWssProviderUsingUrl({ url, headers = undefined }, options = {
        timeout: 10000,
        reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 3,
            onTimeout: true,
        },
        clientConfig: {
            keepalive: true,
            keepaliveInterval: 60000,
            maxReceivedFrameSize: 100000000,
            maxReceivedMessageSize: 100000000,
        },
    }) {
        let providerUrl = url;
        let optionWithHeader = Object.assign({}, options);
        let provider = new Web3WsProvider(providerUrl, optionWithHeader);
        this.setWeb3EthProvider(provider);
        provider.on("connect", () => {
            console.log(`Web3 WS Connected - providerUrl : ${providerUrl}`);
        });
        provider.on("error", (error) => {
            console.error(`ws error. error: ${error.message}`);
            setTimeout(() => this.setWssProviderUsingUrl({ url, headers }), 5000);
        });
        provider.on("end", (end) => {
            console.log(`ws end. message: ${end.message}`);
            setTimeout(() => this.setWssProviderUsingUrl({ url, headers }), 5000);
        });
    }
    setHttpProviderUsingUrl({ url, headers = undefined }) {
        let providerUrl = url;
        this.setWeb3EthProvider(new Web3HttpProvider(providerUrl));
    }
    setWeb3EthProvider(provider) {
        this.web3Eth.setProvider(provider);
    }
    setCurrentAccount(address) {
        if (this.web3Eth.accounts.wallet[address]) {
            this.currentAccount = address;
            this.isAccountInitialized = true;
        }
        else
            throw new Error("wallet not exist");
    }
    addAccountByPrivateKey(privateKeyHex) {
        let ethPrivateKeyHex = privateKeyHex.startsWith("0x") ? privateKeyHex : `0x${privateKeyHex}`;
        let wallet = this.web3Eth.accounts.wallet.add(ethPrivateKeyHex);
        if (!this.currentAccount)
            this.setCurrentAccount(wallet.address);
        return wallet.address;
    }
    addAccountByMnemonic({ mnemonic, mnemonicPassword = "", index = 0, walletNumber = 0 }) {
        if (!bip39.validateMnemonic(mnemonic))
            throw new Error("invalid mnemonic");
        const seed = bip39.mnemonicToSeedSync(mnemonic, mnemonicPassword);
        const node = bip32.fromSeed(seed);
        const path = `${this.hdWalletPath}/${walletNumber}`;
        const account = node.derivePath(path);
        const userKeyPair = account.derive(index);
        return this.addAccountByPrivateKey(`0x${userKeyPair.privateKey.toString("hex")}`);
    }
    getLatestBlock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.web3Eth.getBlock(yield this.getLatestBlockNumber());
        });
    }
    getLatestBlockNumber() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.web3Eth.getBlockNumber();
        });
    }
    getCurrentNonce(address, revertIfAnyPendingTxExist = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let nOfPendingTransactions = yield this.getNumberOfPendingTransactions(address);
            if (revertIfAnyPendingTxExist && nOfPendingTransactions > 0)
                throw new Error("number of pending txs");
            let n1 = yield this.web3Eth.getTransactionCount(address, "pending");
            return n1;
        });
    }
    getNumberOfConfirmedTransactions(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.web3Eth.getTransactionCount(address);
        });
    }
    getNumberOfMemPoolTransactions(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let confirmedTxNum = yield this.getNumberOfConfirmedTransactions(address);
            let allTxNum = yield this.web3Eth.getTransactionCount(address, "pending");
            return allTxNum - confirmedTxNum;
        });
    }
    checkCurrentAccountBalance(warningAmount = 0.01 * 1e18, errorAmount = 0.005 * 1e18, handleError, sendNotificationToAdmin) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let walletBalance = yield this.web3Eth.getBalance(this.currentAccount);
            if (new BigNumber(walletBalance).isLessThan(errorAmount)) {
                if (handleError) {
                    handleError("this client has not enough balance", {
                        address: this.currentAccount,
                        balance: walletBalance,
                    });
                }
                return false;
            }
            if (new BigNumber(walletBalance).isLessThan(warningAmount)) {
                if (sendNotificationToAdmin) {
                    sendNotificationToAdmin(`address balance is low
      ${JSON.stringify({
                        address: this.currentAccount,
                        balance: walletBalance,
                    }, null, 2)}`, 2);
                }
            }
            return true;
        });
    }
    checkCurrentAccountBalanceForContractCall({ maximumGasLimit = 1000000, NumberOfCallForWarning = 30, NumberOfCallForError = 1, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let gasPrice = yield this.web3Eth.getGasPrice();
            let fee = new BigNumber(maximumGasLimit).multipliedBy(gasPrice);
            let warningAmount = fee.multipliedBy(NumberOfCallForWarning).toString();
            let errorAmount = fee.multipliedBy(NumberOfCallForError).toString();
            return this.checkCurrentAccountBalance(warningAmount, errorAmount);
        });
    }
}
module.exports = EthereumBase;
//# sourceMappingURL=ethereum-base.js.map