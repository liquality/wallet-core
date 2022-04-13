import { WalletOptions } from '../types';
import _pbkdf2 from 'pbkdf2';
import { AES } from 'crypto-js';

const defaultWalletOptions: WalletOptions = {
  crypto: {
    async pbkdf2(password, salt, iterations, length, digest) {
      return new Promise((resolve, reject) => {
        _pbkdf2.pbkdf2(
          password,
          salt,
          iterations,
          length,
          digest,
          (err, derivedKey) => {
            if (err) reject(err);
            else resolve(Buffer.from(derivedKey).toString('hex'));
          }
        );
      });
    },
    // @ts-ignore
    encrypt(value, key) {
      return AES.encrypt(value, key);
    },
    // @ts-ignore
    decrypt(value, key) {
      return AES.decrypt(value, key);
    },
  },
  createNotification({ message }) {
    console.log(`Notification: ${message}`);
  },
};

export default defaultWalletOptions;
