---
'@liquality/error-parser': patch
'@liquality/wallet-core': patch
---

fix: add new liquality error, LedgerDeviceSmartContractTransactionDisabledError
fix: make chainify proxy work after transpilation. sendTransaction, an async function is made into a regular function and causes undesireable effects