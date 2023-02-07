"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let store;
function getStore() {
    if (store) {
        return store;
    }
    store = require('../store').default;
    return store;
}
const cryptoassets = new Proxy({}, {
    get(_target, name, receiver) {
        return Reflect.get(Object.assign({}, getStore().getters.cryptoassets), name, receiver);
    },
    ownKeys() {
        return Reflect.ownKeys(getStore().getters.cryptoassets);
    },
    getOwnPropertyDescriptor() {
        return {
            enumerable: true,
            configurable: true,
        };
    },
});
exports.default = cryptoassets;
//# sourceMappingURL=cryptoassets.js.map