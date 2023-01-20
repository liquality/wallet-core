"use strict";
const tslib_1 = require("tslib");
const { getAxiosInstance } = require('../../utils/tools');
class BaseBitcoinLikeRpc {
    constructor({ headers, url: baseUrl, auth }) {
        this.axios = BaseBitcoinLikeRpc.getAxiosInstance({
            baseUrl,
            headers,
            auth,
            timeout: 3 * 60000,
        });
    }
    static getAxiosInstance(provider) {
        return getAxiosInstance(provider);
    }
    static getRpcBody(method, params = []) {
        return {
            jsonrpc: '2.0',
            id: 'teleport-dao',
            method,
            params,
        };
    }
    getChainInfo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getblockchaininfo'));
            return response.data.result;
        });
    }
    getLatestBlockNumber() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getblockcount'));
            return response.data.result;
        });
    }
    getBlockHash(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getblockhash', [Number(blockNumber)]));
            return response.data.result;
        });
    }
    getBlockByBlockHash(blockHash, verbosity = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getblock', [blockHash, Number(verbosity)]));
            return response.data.result;
        });
    }
    getBlockHeaderByBlockHash(blockHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getblockheader', [blockHash, false]));
            return response.data.result;
        });
    }
    getBlockByBlockNumber(blockNumber, verbosity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getBlockByBlockHash(yield this.getBlockHash(blockNumber), verbosity);
        });
    }
    getTransaction(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getrawtransaction', [txId, true]));
            let tx = response.data.result;
            let block = yield this.getBlockByBlockHash(tx.blockhash);
            return {
                txId: tx.txid,
                version: tx.version,
                locktime: tx.locktime,
                blockNumber: block.height || null,
                blockHash: tx.blockhash || null,
                vout: tx.vout.map((vo) => ({
                    address: vo.scriptPubKey.address || null,
                    script: vo.scriptPubKey.hex,
                    value: Number((Number(vo.value) * 1e8).toFixed()),
                })),
            };
        });
    }
    getRawTransaction(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('getrawtransaction', [txId, true]));
            return response.data.result.hex;
        });
    }
    getTxOutProof(txId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('gettxoutproof', [txId, true]));
            return response.data.result.hex;
        });
    }
    getBlockTransactionIds(blockHash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let block = yield this.getBlockByBlockHash(blockHash);
            return block.tx;
        });
    }
    sendRawTransaction(txHex, maxFeeRate = 0.1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('sendrawtransaction', [txHex, maxFeeRate]));
            return response.data.result;
        });
    }
    getBlockHeaderHex(blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hash = yield this.getBlockHash(blockNumber);
            const result = yield this.getBlockHeaderByBlockHash(hash);
            return result;
        });
    }
    getEstimateFeeByNumberOfBlock(n) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = yield this.axios.post('/', BaseBitcoinLikeRpc.getRpcBody('estimatesmartfee', [n]));
            return response.data.result.feerate * Math.pow(10, 5);
        });
    }
    getFeeRate(speed = 'normal') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let fee;
            switch (speed) {
                case 'slow':
                    fee = this.getEstimateFeeByNumberOfBlock(6);
                    break;
                case 'fast':
                    fee = this.getEstimateFeeByNumberOfBlock(1);
                    break;
                case 'normal':
                default:
                    fee = this.getEstimateFeeByNumberOfBlock(3);
                    break;
            }
            return fee.toFixed(2);
        });
    }
}
module.exports = BaseBitcoinLikeRpc;
//# sourceMappingURL=index.js.map