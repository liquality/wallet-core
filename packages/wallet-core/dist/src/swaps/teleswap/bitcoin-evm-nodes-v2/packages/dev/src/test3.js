"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin_1 = require("@sinatdt/bitcoin");
let btcBase = new bitcoin_1.BitcoinBase(undefined, "bitcoin_testnet");
btcBase
    .getExtendedUtxo({
    address: "2N8JDhrLqtwZ4MGC1QAcwyiQg3v6ffhCrJb",
    addressType: "p2sh-p2wpkh",
    privateKeyId: null,
    derivationPath: null,
    publicKey: null,
})
    .then((x) => console.log(x));
//# sourceMappingURL=test3.js.map