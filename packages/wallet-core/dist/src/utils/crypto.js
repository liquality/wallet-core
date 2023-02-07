"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const tslib_1 = require("tslib");
const crypto_js_1 = require("crypto-js");
const walletOptions_1 = require("../walletOptions");
const PBKDF2_ITERATIONS = 1000000;
const PBKDF2_LENGTH = 32;
const PBKDF2_DIGEST = 'sha256';
function pbkdf2(password, salt) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return walletOptions_1.walletOptionsStore.walletOptions.crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, PBKDF2_LENGTH, PBKDF2_DIGEST);
    });
}
const JsonFormatter = {
    stringify(cipherParams) {
        const jsonObj = {
            ct: cipherParams.ciphertext.toString(crypto_js_1.enc.Base64),
        };
        if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
        }
        if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
        }
        return JSON.stringify(jsonObj);
    },
    parse(jsonStr) {
        const jsonObj = JSON.parse(jsonStr);
        const cipherParams = crypto_js_1.lib.CipherParams.create({
            ciphertext: crypto_js_1.enc.Base64.parse(jsonObj.ct),
        });
        if (jsonObj.iv) {
            cipherParams.iv = crypto_js_1.enc.Hex.parse(jsonObj.iv);
        }
        if (jsonObj.s) {
            cipherParams.salt = crypto_js_1.enc.Hex.parse(jsonObj.s);
        }
        return cipherParams;
    },
};
function encrypt(value, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const keySalt = crypto_js_1.enc.Hex.stringify(crypto_js_1.lib.WordArray.random(16));
        const derivedKey = yield pbkdf2(key, keySalt);
        const rawEncryptedValue = yield walletOptions_1.walletOptionsStore.walletOptions.crypto.encrypt(value, derivedKey);
        return {
            encrypted: JsonFormatter.stringify(rawEncryptedValue),
            keySalt,
        };
    });
}
exports.encrypt = encrypt;
function decrypt(encrypted, key, keySalt) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!keySalt)
            return false;
        const encryptedValue = JsonFormatter.parse(encrypted);
        try {
            const derivedKey = yield pbkdf2(key, keySalt);
            const decryptedValue = yield walletOptions_1.walletOptionsStore.walletOptions.crypto.decrypt(encryptedValue, derivedKey);
            return decryptedValue.toString(crypto_js_1.enc.Utf8);
        }
        catch (e) {
            return false;
        }
    });
}
exports.decrypt = decrypt;
//# sourceMappingURL=crypto.js.map