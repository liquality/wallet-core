"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_js_1 = require("crypto-js");
const pbkdf2_1 = tslib_1.__importDefault(require("pbkdf2"));
const defaultWalletOptions = {
    crypto: {
        pbkdf2(password, salt, iterations, length, digest) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    pbkdf2_1.default.pbkdf2(password, salt, iterations, length, digest, (err, derivedKey) => {
                        if (err)
                            reject(err);
                        else
                            resolve(Buffer.from(derivedKey).toString('hex'));
                    });
                });
            });
        },
        encrypt(value, key) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return crypto_js_1.AES.encrypt(value, key);
            });
        },
        decrypt(value, key) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return crypto_js_1.AES.decrypt(value, key);
            });
        },
    },
    createNotification({ message }) {
        console.warn(`Notification: ${message}`);
    },
};
exports.default = defaultWalletOptions;
//# sourceMappingURL=defaultOptions.js.map