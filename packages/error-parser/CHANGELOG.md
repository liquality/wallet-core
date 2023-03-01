# @liquality/error-parser

## 2.2.4

### Patch Changes

- Updated dependencies [5391ea28]
  - @liquality/cryptoassets@2.5.0

## 2.2.3

### Patch Changes

- Updated dependencies [ef71d00]
- Updated dependencies [8cbbaee]
  - @liquality/cryptoassets@2.4.0

## 2.2.1

### Patch Changes

- Updated dependencies [3e6dd4e]
  - @liquality/cryptoassets@2.3.0

## 2.2.0

### Minor Changes

- 7f7f84f: Fix thorchain url

### Patch Changes

- Updated dependencies [7f7f84f]
  - @liquality/cryptoassets@2.2.0

## 2.1.0

### Minor Changes

- 8a17872: Updted package from chanify and implemented custom rpc settings

## 2.0.1

### Patch Changes

- 25567cb: fix: add ledger error parser
  fix: add jsonRPC error parser
  fix: add error parser for debridge
  fix: add error parser for thorchain
- 118f1a0: fix: map 1006NotFound error to pair not supported- - 1inch probably didn't find token in their list enabled/supported ones
- 839c9eb: test: bump to next pre release version
- 594615f: test: bump versions
- 196dd88: fix: move translations out of error-parser - translation strings should be in the clients that use them
- 7f192b5: fix: add error parser for uniswapV2
  fix: split messages going to discord
- 4b3b100: test: bump pre release version
- a9ffd93: fix: add new liquality error, LedgerDeviceSmartContractTransactionDisabledError
  fix: make chainify proxy work after transpilation. sendTransaction, an async function is made into a regular function and causes undesireable effects
- a9110e3: fix: map more errors to PairNotSupportedError
- 9e5ff10: fix: report error iff users wish to
- Updated dependencies [aa5fe04]
- Updated dependencies [839c9eb]
- Updated dependencies [594615f]
- Updated dependencies [4b3b100]
  - @liquality/cryptoassets@2.1.0

## 2.0.1-next.3

### Patch Changes

- 118f1a0: fix: map 1006NotFound error to pair not supported- - 1inch probably didn't find token in their list enabled/supported ones
- 9e5ff10: fix: report error iff users wish to

## 2.0.1-next.2

### Patch Changes

- 4b3b100: test: bump pre release version
- Updated dependencies [4b3b100]
  - @liquality/cryptoassets@2.1.0-next.2

## 2.0.1-next.1

### Patch Changes

- 839c9eb: test: bump to next pre release version
- 196dd88: fix: move translations out of error-parser - translation strings should be in the clients that use them
- a9ffd93: fix: add new liquality error, LedgerDeviceSmartContractTransactionDisabledError
  fix: make chainify proxy work after transpilation. sendTransaction, an async function is made into a regular function and causes undesireable effects
- a9110e3: fix: map more errors to PairNotSupportedError
- Updated dependencies [839c9eb]
  - @liquality/cryptoassets@2.1.0-next.1

## 2.0.1-next.0

### Patch Changes

- 594615f: test: bump versions
- Updated dependencies [aa5fe04]
- Updated dependencies [594615f]
  - @liquality/cryptoassets@2.1.0-next.0

## 2.0.0

### Patch Changes

- 1673543: test: bump versions from master for 0.78.0 release
- Updated dependencies [1673543]
  - @liquality/cryptoassets@2.0.0

## 2.0.0-next.6

### Patch Changes

- 5bb19d0: bump version after fix
- Updated dependencies [5bb19d0]
  - @liquality/cryptoassets@2.0.0-next.6

## 2.0.0-next.5

### Major Changes

- bc9b6a3: test: bump all along with error parser

### Patch Changes

- Updated dependencies [bc9b6a3]
  - @liquality/cryptoassets@2.0.0-next.5

## 1.1.4-next.4

### Patch Changes

- b1dbb31: test: bump pre release version
- Updated dependencies [b1dbb31]
  - @liquality/cryptoassets@1.16.3-next.4

## 1.1.4-next.3

### Patch Changes

- 07bd108: test: bump pre release
- Updated dependencies [07bd108]
  - @liquality/cryptoassets@1.16.3-next.3

## 1.1.4-next.2

### Patch Changes

- 3c309e1: fix: covalent api key
- Updated dependencies [3c309e1]
  - @liquality/cryptoassets@1.16.3-next.2
  - @liquality/wallet-core@1.31.4-next.2

## 1.1.4-next.1

### Patch Changes

- a156f8e: test: bump versions to next
- Updated dependencies [a156f8e]
  - @liquality/cryptoassets@1.16.3-next.1
  - @liquality/wallet-core@1.31.4-next.1

## 1.1.4-next.0

### Patch Changes

- test: bump versions
- Updated dependencies
  - @liquality/cryptoassets@1.16.3-next.0
  - @liquality/wallet-core@1.31.4-next.0

## 1.1.3

### Patch Changes

- Updated dependencies [2173cb9]
  - @liquality/wallet-core@1.31.3

## 1.1.2

### Patch Changes

- 2ecbc28: test: bump versions with toggle fix
- Updated dependencies [2ecbc28]
  - @liquality/cryptoassets@1.16.2
  - @liquality/wallet-core@1.31.2

## 1.1.1

### Patch Changes

- 0dd1f89: test: bump versions from master
- Updated dependencies [0dd1f89]
  - @liquality/cryptoassets@1.16.1
  - @liquality/wallet-core@1.31.1

## 1.1.0

### Patch Changes

- 17378a0: test: bump versions for 0.76.0 release
- Updated dependencies [17378a0]
  - @liquality/cryptoassets@1.16.0
  - @liquality/wallet-core@1.31.0

## 1.1.0-next.5

### Patch Changes

- 840dbd8: chore: bump versions after lifi integration
- Updated dependencies [840dbd8]
  - @liquality/cryptoassets@1.16.0-next.5
  - @liquality/wallet-core@1.31.0-next.5

## 1.1.0-next.4

### Minor Changes

- fa3595a: fix debridge and testnet issues

### Patch Changes

- Updated dependencies [fa3595a]
  - @liquality/cryptoassets@1.16.0-next.4
  - @liquality/wallet-core@1.31.0-next.4

## 1.1.0-next.3

### Minor Changes

- 7454432: lifi + debridge + goerli

### Patch Changes

- Updated dependencies [7454432]
  - @liquality/cryptoassets@1.16.0-next.3
  - @liquality/wallet-core@1.31.0-next.3

## 1.1.0-next.2

### Minor Changes

- 412e1d1: bump
- 412e1d1: bump2

### Patch Changes

- Updated dependencies [412e1d1]
- Updated dependencies [412e1d1]
  - @liquality/cryptoassets@1.16.0-next.2
  - @liquality/wallet-core@1.31.0-next.2

## 1.1.0-next.1

### Minor Changes

- b9db052: increment

### Patch Changes

- Updated dependencies [b9db052]
  - @liquality/cryptoassets@1.16.0-next.1
  - @liquality/wallet-core@1.31.0-next.1

## 1.1.0-next.0

### Minor Changes

- 3d90aee: Lifi + debridge + goerli testnet
- e45d2cb: fix: debridge rpc url
- 61c228e: feat: eth testnet to goerli

### Patch Changes

- Updated dependencies [3d90aee]
- Updated dependencies [e45d2cb]
- Updated dependencies [61c228e]
  - @liquality/cryptoassets@1.16.0-next.0
  - @liquality/wallet-core@1.31.0-next.0

<<<<<<< HEAD

## 1.1.0-next.2

### Minor Changes

- e80e6eb: feat: debridge swap provider
- 5e3607c: feat: debridge swap provider

### Patch Changes

- Updated dependencies [e80e6eb]
- Updated dependencies [5e3607c]
  - @liquality/cryptoassets@1.16.0-next.2
  - @liquality/wallet-core@1.31.0-next.2

## 1.1.0-next.1

### Minor Changes

- 31a975e: bump
- eadd70c: fix: getQuotes has slow quotes propery

### Patch Changes

- Updated dependencies [31a975e]
- Updated dependencies [eadd70c]
  - @liquality/cryptoassets@1.16.0-next.1
  - @liquality/wallet-core@1.31.0-next.1

## 1.1.0-next.0

### Minor Changes

- 7fa751e: feat: lifi swap provider
  refactor: get quotes returns fast quotes first. getSlowQuotes action to retrieve restr
- cb2c60a: feat: lifi swap provider
  refactor: get quotes returns fast quotes first. `getSlowQuotes` action to retrieve restr

### Patch Changes

- Updated dependencies [7fa751e]
- Updated dependencies [cb2c60a]
  - @liquality/wallet-core@1.31.0-next.0
  - # @liquality/cryptoassets@1.16.0-next.0

## 1.0.12

### Patch Changes

- d764511: - fix fetching assets

## 1.0.11

### Patch Changes

- efdc92d: fix: pass solana rpc as environmnet variable

## 1.0.10

### Patch Changes

- 1ae3e84: fix: bump versions from master
  > > > > > > > master

## 1.0.9

### Patch Changes

- bd46603: test: bump all versions for hot fix solana endpoints change

## 1.0.8

### Patch Changes

- f6394a0: fix: revert some changes and bump versions

## 1.0.7

### Patch Changes

- 3c0113f: test: bump patch versions
- e466d4f: test: bump versions

## 1.0.6

### Patch Changes

- 955a8c3: feat: bump to patch versions for 0.73.0

## 1.0.5

### Patch Changes

- 8f4b740: test: bump version from master test

## 1.0.4

### Patch Changes

- c632674: test: bump all packages after remove logic from ci

## 1.0.3

### Patch Changes

- 1784096: feat: bump version from master after yarn lock file

## 1.0.2

### Patch Changes

- fe656f0: test: testing bump version without running changeset version command local
- 66038e7: test: bump another next version from develop branch
- 66038e7: test: test another pre release bump
- f552f0e: feat: bump patch version from master branch for rc0.73.0

## 1.0.2-next.3

### Patch Changes

- fe656f0: test: testing bump version without running changeset version command local

## 1.0.2-next.2

### Patch Changes

- test: test another pre release bump

## 1.0.2-next.1

### Patch Changes

- test: bump another next version from develop branch

## 1.0.2-next.0

### Patch Changes

- 179f0b4: test: prerelease version bump

## 1.0.1

### Patch Changes

- 5e73c63: feat: bump all versions from master
