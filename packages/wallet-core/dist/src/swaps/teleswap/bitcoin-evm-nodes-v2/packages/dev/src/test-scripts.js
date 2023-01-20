"use strict";
const { EthereumBase } = require("@sinatdt/contracts-helper");
const account = {
    mnemonic: "agent explain garment dilemma scatter winner media shift oak gold fringe few",
    index: 2,
};
const { calculateFee, getLockerPendingBurns, getLockerPendingRequests, getLockers, getUserPendingBurns, getUserPendingRequests, } = require("@sinatdt/scripts");
let myEth = new EthereumBase({ connectToNetwork: false });
let ethClientAddress = myEth.addAccountByMnemonic({
    mnemonic: account.mnemonic,
    index: 2,
});
let targetNetworkConnectionInfo = {
    web3: {
        url: "wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK",
    },
};
let amount = 0.0005;
calculateFee({
    amount,
    targetNetworkConnectionInfo,
    testnet: true,
}).then((x) => console.log(x));
//# sourceMappingURL=test-scripts.js.map