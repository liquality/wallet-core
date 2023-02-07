"use strict";
const tslib_1 = require("tslib");
const { getAxiosInstance } = require('../../utils/tools');
class BlockStreamProvider {
    constructor({ timeout = 30000 }, testnet = false) {
        const mainnetUrl = 'https://blockstream.info/api';
        const testnetUrl = 'https://blockstream.info/testnet/api';
        this.baseURL = testnet ? testnetUrl : mainnetUrl;
        this.axios = getAxiosInstance({
            baseUrl: this.baseURL,
            timeout,
        });
    }
    getLatestBlockNumber() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/blocks/tip/height`);
            return result.data;
        });
    }
    getBlockHash(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/block-height/${blockNumber}`);
            return result.data;
        });
    }
    getBlockHeaderHex(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hash = yield this.getBlockHash(blockNumber);
            const result = yield this.axios.get(`/block/${hash}/header`);
            return result.data;
        });
    }
    getConfirmedTransactions(userAddress, lastReceivedTxId = '') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/address/${userAddress}/txs/chain/${lastReceivedTxId}`);
            return result.data;
        });
    }
    getMempoolTransactions(userAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/address/${userAddress}/txs/mempool`);
            return result.data;
        });
    }
    getTransaction(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/tx/${txId}`);
            let tx = result.data;
            return {
                txId: tx.txid,
                version: tx.version,
                locktime: tx.locktime,
                blockTime: tx.status.block_time,
                blockNumber: tx.status.block_height || null,
                blockHash: tx.status.block_hash || null,
                vout: tx.vout.map((vo) => ({
                    address: vo.scriptpubkey_address || null,
                    script: vo.scriptpubkey,
                    value: vo.value,
                })),
            };
        });
    }
    getRawTransaction(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/tx/${txId}/hex`);
            return result.data;
        });
    }
    getTransactionHistory(userAddress, blockNumber = 0, lastSeenTxId = null) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let maximumTxsLength = 15;
            let fetchTxs = true;
            let allResults = [];
            let lastReceivedTxId = '';
            while (fetchTxs) {
                let result = yield this.getConfirmedTransactions(userAddress, lastReceivedTxId);
                let lastSeenTxIdIndex = result.findIndex((tx) => tx.txId === lastSeenTxId);
                result = result.filter((_value) => +_value.status.block_height > blockNumber);
                result =
                    lastSeenTxIdIndex < 0 ? result : result.filter((_value, index) => index < lastSeenTxIdIndex);
                allResults.push(...result);
                lastReceivedTxId = (_a = result[result.length - 1]) === null || _a === void 0 ? void 0 : _a.txid;
                fetchTxs = result.length === maximumTxsLength && lastSeenTxIdIndex < 0 && result.length !== 0;
            }
            return allResults.map((tx) => ({
                address: userAddress,
                txId: tx.txid,
                version: tx.version,
                locktime: tx.locktime,
                blockNumber: tx.status.block_height || null,
                blockHash: tx.status.block_hash || null,
                vout: tx.vout.map((vo) => ({
                    address: vo.scriptpubkey_address || null,
                    script: vo.scriptpubkey,
                    value: vo.value,
                })),
                vin: tx.vin.map((vi) => ({
                    txId: vi.txid,
                    index: vi.vout,
                    address: vi.prevout.scriptpubkey_address || null,
                    script: vi.prevout.scriptpubkey,
                    value: vi.prevout.value,
                })),
            }));
        });
    }
    getMempoolTransactionHistory(userAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.getMempoolTransactions(userAddress);
            return result.map((tx) => ({
                address: userAddress,
                txId: tx.txid,
                version: tx.version,
                locktime: tx.locktime,
                vout: tx.vout.map((vo) => ({
                    address: vo.scriptpubkey_address || null,
                    script: vo.scriptpubkey,
                    value: vo.value,
                })),
                vin: tx.vin.map((vi) => ({
                    txId: vi.txid,
                    index: vi.vout,
                    address: vi.prevout.scriptpubkey_address || null,
                    script: vi.prevout.scriptpubkey,
                    value: vi.prevout.value,
                })),
            }));
        });
    }
    getMempoolTransactionHistoryForMultipleAddresses(userAddresses, blockNumber = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const allPromises = [];
            for (let address of userAddresses) {
                let promise = yield this.getMempoolTransactionHistory(address, blockNumber);
                allPromises.push(promise);
            }
            let result = yield Promise.all(allPromises);
            return result;
        });
    }
    getTransactionHistoryForMultipleAddresses(userAddresses, blockNumber = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const allPromises = [];
            for (let address of userAddresses) {
                let promise = yield this.getTransactionHistory(address, blockNumber);
                allPromises.push(promise);
            }
            let result = yield Promise.all(allPromises);
            return result;
        });
    }
    getUtxos(userAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/address/${userAddress}/utxo`);
            return result.data.map((tx) => {
                var _a;
                return ({
                    address: userAddress,
                    txId: tx.txid,
                    index: tx.vout,
                    value: tx.value,
                    blockNumber: ((_a = tx.status) === null || _a === void 0 ? void 0 : _a.block_height) || null,
                });
            });
        });
    }
    getBalance(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let utxos = this.getUtxos(address);
            return utxos.reduce((a, tx) => a + Number(tx.value), 0);
        });
    }
    getBlockTransactionIds(blockHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.axios.get(`/block/${blockHash}/txids`);
            return result.data;
        });
    }
    getFeeRate(speed = 'normal') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.axios.get(`/fee-estimates`);
            let fees = {
                slow: +result.data[6],
                normal: +result.data[3],
                fast: +result.data[1],
            };
            return fees[speed] || fees.normal;
        });
    }
    sendRawTransaction(rawTransaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.post(`/tx`, rawTransaction);
            return result.data;
        });
    }
    getMerkleProof(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.axios.get(`/tx/${txId}/merkle-proof`);
            result = result.data;
            let intermediateNodes = result.merkle.reduce((a, merkle) => a + Buffer.from(merkle, 'hex').reverse().toString('hex'), '0x');
            let transactionIndex = result.pos;
            return {
                intermediateNodes,
                transactionIndex,
            };
        });
    }
    getLatestBlock() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/blocks`);
            const blocks = result.data;
            return blocks[0];
        });
    }
    getBlock(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const blockHash = yield this.getBlockHash(blockNumber);
            const result = yield this.axios.get(`/block/${blockHash}`);
            return result.data;
        });
    }
}
module.exports = BlockStreamProvider;
//# sourceMappingURL=blockstream.js.map