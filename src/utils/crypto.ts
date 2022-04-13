import { enc as Enc, lib as Lib } from 'crypto-js';
import { walletOptionsStore } from '../walletOptions';

const PBKDF2_ITERATIONS = 1000000;
const PBKDF2_LENGTH = 32;
const PBKDF2_DIGEST = 'sha256';

async function pbkdf2(password, salt) {
  return walletOptionsStore.walletOptions.crypto.pbkdf2(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_LENGTH,
    PBKDF2_DIGEST
  );
}

const JsonFormatter = {
  stringify(cipherParams) {
    const jsonObj: { ct; iv?; s? } = {
      ct: cipherParams.ciphertext.toString(Enc.Base64),
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

    const cipherParams = Lib.CipherParams.create({
      ciphertext: Enc.Base64.parse(jsonObj.ct),
    });

    if (jsonObj.iv) {
      cipherParams.iv = Enc.Hex.parse(jsonObj.iv);
    }

    if (jsonObj.s) {
      cipherParams.salt = Enc.Hex.parse(jsonObj.s);
    }

    return cipherParams;
  },
};

async function encrypt(value, key) {
  const keySalt = Enc.Hex.stringify(Lib.WordArray.random(16));
  const derivedKey = await pbkdf2(key, keySalt);
  const rawEncryptedValue = await walletOptionsStore.walletOptions.crypto.encrypt(value, derivedKey);
  return {
    encrypted: JsonFormatter.stringify(rawEncryptedValue),
    keySalt,
  };
}

async function decrypt(encrypted, key, keySalt) {
  if (!keySalt) return false;

  const encryptedValue = JsonFormatter.parse(encrypted);
  try {
    const derivedKey = await pbkdf2(key, keySalt);
    const decryptedValue = await walletOptionsStore.walletOptions.crypto.decrypt(encryptedValue, derivedKey);
    return decryptedValue.toString(Enc.Utf8);
  } catch (e) {
    return false;
  }
}

export { encrypt, decrypt };
