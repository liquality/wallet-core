"use strict";
const tslib_1 = require("tslib");
const { BitcoinRelayABI } = require("@sinatdt/configs").teleswap.ABI;
const EthereumBase = require("../ethereum-base");
class BitcoinRelay extends EthereumBase {
    constructor(connectionConfig, contractAddress) {
        super(connectionConfig);
        this.contractAddress = contractAddress;
        this.contract = new this.web3Eth.Contract(BitcoinRelayABI, contractAddress);
    }
    firstSubmittedHeight() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let firstSubmittedHeight = yield this.contract.methods.initialHeight().call();
            return firstSubmittedHeight;
        });
    }
    isBlockHashSubmitted(blockHash, blockHeight) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ethBlockHash = `0x${Buffer.from(blockHash, "hex").reverse().toString("hex")}`;
            let numberOfSubmittedHeaders = yield this.getNumberOfSubmittedHeaders(blockHeight);
            for (let i = 0; i < numberOfSubmittedHeaders; i += 1) {
                let submittedBlockHeaderHash = yield this.getSubmittedHeaderHash(blockHeight, i);
                if (ethBlockHash === submittedBlockHeaderHash) {
                    return true;
                }
            }
            return false;
        });
    }
    lastSubmittedHeight() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let lastSubmittedHeight = yield this.contract.methods.lastSubmittedHeight().call();
            return lastSubmittedHeight;
        });
    }
    getNumberOfSubmittedHeaders(height) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let numberOfSubmittedHeaders = this.contract.methods.getNumberOfSubmittedHeaders(height).call();
            return numberOfSubmittedHeaders;
        });
    }
    getSubmittedHeaderHash(height, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let blockHeaderHash = yield this.contract.methods.getBlockHeaderHash(height, index).call();
            return blockHeaderHash;
        });
    }
    getBlockHeaderFee(height, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let blockHeaderHash = yield this.contract.methods.getBlockHeaderFee(height, index).call();
            return blockHeaderHash;
        });
    }
    submitBlockHeadersWithRetarget(oldPeriodStartHeader, oldPeriodEndHeader, newBlockHeaders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const gasPrice = yield this.web3Eth.getGasPrice();
            const gasAmount = yield this.contract.methods
                .addHeadersWithRetarget(oldPeriodStartHeader, oldPeriodEndHeader, newBlockHeaders)
                .estimateGas({ from: this.currentAccount, gasPrice });
            let receipt = yield this.contract.methods
                .addHeadersWithRetarget(oldPeriodStartHeader, oldPeriodEndHeader, newBlockHeaders)
                .send({ from: this.currentAccount, gas: gasAmount, gasPrice })
                .catch((err) => {
                if (err.receipt)
                    return Object.assign(Object.assign({}, err.receipt), { message: err.reason });
                throw err;
            });
            return {
                status: receipt.status,
                txId: receipt.transactionHash,
                gasUsed: receipt.gasUsed,
                gasPrice,
            };
        });
    }
    submitBlockHeaders(anchorBlockHeader, newBlockHeaders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const gasPrice = yield this.web3Eth.getGasPrice();
            const gasAmount = yield this.contract.methods
                .addHeaders(anchorBlockHeader, newBlockHeaders)
                .estimateGas({ from: this.currentAccount, gasPrice });
            let receipt = yield this.contract.methods
                .addHeaders(anchorBlockHeader, newBlockHeaders)
                .send({ from: this.currentAccount, gas: gasAmount, gasPrice })
                .catch((err) => {
                if (err.receipt)
                    return Object.assign(Object.assign({}, err.receipt), { message: err.reason });
                throw err;
            });
            return {
                status: receipt.status,
                txId: receipt.transactionHash,
                gasUsed: receipt.gasUsed,
                gasPrice,
                message: receipt.reason || "",
            };
        });
    }
    getNumberOfConfirmations() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let finalizationParameter = yield this.contract.methods.finalizationParameter().call();
            return finalizationParameter;
        });
    }
    getPastEventBlockHeight(fromBlock = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let events = yield this.contract.getPastEvents("BlockAdded", {
                fromBlock,
            });
            if (events.length === 0)
                return 0;
            const lastBlockHeight = this.parseBlockAddedEvent(events[events.length - 1]).height;
            return lastBlockHeight;
        });
    }
    parseBlockAddedEvent(BlockAddedEvent) {
        const txInfo = BitcoinRelay.extractEventTxInfo(BlockAddedEvent);
        const { height, selfHash, parentHash, relayer } = BlockAddedEvent.returnValues;
        return {
            height,
            selfHash,
            parentHash,
            relayer,
            txInfo,
        };
    }
    getLastBlockFee() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let blockHeight = yield this.lastSubmittedHeight();
            let numberOfSubmittedHeaders = yield this.getNumberOfSubmittedHeaders(blockHeight);
            return this.getBlockHeaderFee(blockHeight, +numberOfSubmittedHeaders - 1);
        });
    }
}
module.exports = BitcoinRelay;
//# sourceMappingURL=bitcoin-relay-contract-interface.js.map