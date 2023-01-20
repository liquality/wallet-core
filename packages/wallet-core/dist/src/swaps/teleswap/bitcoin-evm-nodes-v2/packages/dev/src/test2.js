"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BitcoinScript = tslib_1.__importStar(require("@sinatdt/scripts"));
let targetNetworkConnectionInfo = {
    web3: {
        url: "wss://polygon-mumbai.g.alchemy.com/v2/5M02lhCj_-C62MzO5TcSj53mOy-X-QPK",
    },
};
BitcoinScript.getLockerPendingBurns({
    lockerBtcAddress: "2N8JDhrLqtwZ4MGC1QAcwyiQg3v6ffhCrJb",
    targetNetworkConnectionInfo,
    testnet: true,
}).then((x) => console.log(x));
BitcoinScript.get({
    lockerBtcAddress: "2N8JDhrLqtwZ4MGC1QAcwyiQg3v6ffhCrJb",
    targetNetworkConnectionInfo,
    testnet: true,
}).then((x) => console.log(x));
//# sourceMappingURL=test2.js.map