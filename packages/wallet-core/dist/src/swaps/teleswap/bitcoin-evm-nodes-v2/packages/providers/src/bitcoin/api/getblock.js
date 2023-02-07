"use strict";
const tslib_1 = require("tslib");
const { getAxiosInstance } = require('../../utils/tools');
class GetBlock {
    constructor({ token, timeout = 30000 }, testnet = false) {
        const mainnetUrl = `https://btc.getblock.io/mainnet/blockbook/api`;
        const testnetUrl = 'https://btc.getblock.io/testnet/blockbook/api/';
        this.baseURL = testnet ? testnetUrl : mainnetUrl;
        this.axios = getAxiosInstance({
            baseUrl: this.baseURL,
            timeout,
            headers: {
                'x-api-key': token,
            },
        });
    }
    getUtxos(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/utxo/${address}`);
            const utxos = result.data.map((tx) => ({
                address,
                txId: tx.txid,
                index: tx.vout,
                value: Number(tx.satoshis),
                blockNumber: +tx.height,
            }));
            return utxos;
        });
    }
}
module.exports = GetBlock;
//# sourceMappingURL=getblock.js.map