"use strict";
let providers = require('@sinatdt/providers');
let { BitcoinBase } = require('@sinatdt/bitcoin');
let { calculateFee, getFeeParams } = require('@sinatdt/scripts');
let { BlockStream } = providers.bitcoin.ApiProviders;
let targetNetworkConnectionInfo = {
    web3: {
        url: 'wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK',
    },
};
calculateFee({
    amount: '0.01',
    type: 'burn',
    targetNetworkConnectionInfo,
    testnet: true,
}).then((x) => console.log(x));
//# sourceMappingURL=test.js.map