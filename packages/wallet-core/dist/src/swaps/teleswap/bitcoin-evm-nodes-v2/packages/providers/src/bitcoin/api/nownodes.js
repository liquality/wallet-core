"use strict";
const tslib_1 = require("tslib");
const { getAxiosInstance } = require('../../utils/tools');
class NowNodes {
    constructor({ token, timeout = 30000 }, testnet = false) {
        const mainnetUrl = 'https://btc.nownodes.io/';
        const testnetUrl = 'https://btc-testnet.nownodes.io/';
        this.baseURL = testnet ? testnetUrl : mainnetUrl;
        this.axios = getAxiosInstance({
            baseUrl: this.baseURL,
            timeout,
            headers: {
                'api-key': token,
            },
        });
    }
    getUtxos(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.axios.get(`/api/v2/utxo/${address}`);
            const utxos = result.data.map((tx) => ({
                address,
                txId: tx.txid,
                index: tx.vout,
                value: Number(tx.value),
                blockNumber: +tx.height,
            }));
            return utxos;
        });
    }
}
module.exports = NowNodes;
//# sourceMappingURL=nownodes.js.map