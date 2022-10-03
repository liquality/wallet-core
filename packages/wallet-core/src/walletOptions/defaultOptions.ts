import { AES } from 'crypto-js';
import _pbkdf2 from 'pbkdf2';
import { WalletOptions } from '../types';

const defaultWalletOptions: WalletOptions = {
  crypto: {
    async pbkdf2(password, salt, iterations, length, digest) {
      return new Promise((resolve, reject) => {
        _pbkdf2.pbkdf2(password, salt, iterations, length, digest, (err, derivedKey) => {
          if (err) reject(err);
          else resolve(Buffer.from(derivedKey).toString('hex'));
        });
      });
    },
    async encrypt(value, key) {
      return AES.encrypt(value, key);
    },
    async decrypt(value, key) {
      return AES.decrypt(value, key);
    },
  },
  createNotification({ message }) {
    console.warn(`Notification: ${message}`);
  },
};

export default defaultWalletOptions;
