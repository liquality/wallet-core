# Liquality Wallet Core Library

adjustments:

- Lots of TODOS
- Comment out ledger related
- Move from Vue emitter to node event emitter
- Remove cyclical dependencies on store, by using getters from store in actions instead of from utility
- Add direct-vuex and export store. Add subscription to exported store.
- Remove direct cyclical dependency by doing dynamic require in cryptoassets
- Add types to state at types.ts
- Remove usage of "Object" in getters.js
- Add setInitialState and commit 
- setupWallet function taking options and initialising state, createNotification
- Move SwapProviderType from  src/utils/swaps.ts into separate module to prevent cyclic dependency
- Add createBitcoinLedgerProvider and createEthereumLedgerProvider to wallet options and call it from client.
- Move ledger-bridge-provider/config utils to utils. Remove ledger bridge and provider code. 