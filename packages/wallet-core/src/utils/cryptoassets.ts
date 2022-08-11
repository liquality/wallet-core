import { Asset } from '@liquality/cryptoassets';
import type { OriginalStore } from '../store';

// Redefine the `cryptoassets` lib to pull from the getter - to include custom tokens
let store: OriginalStore;

// Lazy load the store to prevent cyclic dependencies
function getStore() {
  if (store) return store;

  store = require('../store').default; // eslint-disable-line
  return store;
}

const cryptoassets: { [asset: string]: Asset } = new Proxy(
  {},
  {
    get(_target, name, receiver) {
      return Reflect.get({ ...getStore().getters.cryptoassets }, name, receiver);
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
  }
);

export default cryptoassets;
