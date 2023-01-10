# @liquality/wallet-core

## 4.5.0

### Minor Changes

- 66a384e: Disabled hop protocol from swap providers

## 4.4.0

### Minor Changes

- 2ec598f: Added default enabled assets for DAI, USDC and USDT in EVM chains
- b5e4530: Added default enabled assets for DAI, USDC and USDT in EVM chains

## 4.3.0

### Minor Changes

- 7a0fe4a: Fixed Optimism provider to use the right chainId settings

## 4.2.0

### Minor Changes

- c66cf6f: Set miner tip to always be above 30 in Polygon in all speeds

## 4.1.0

### Minor Changes

- 2439e04: Set the right gas limit amount for Lify and Hop Providers when use Arbitrum
- 0bd5027: Publish swap gas estimation fixes
- fef13b7: Updated arbiutrum fixes
- 02d4bf0: Bumped version

## 4.0.0

### Major Changes

- c90fba9: Updated custom settings bindings

### Minor Changes

- f4f0143: Fixed prettier issues

## 3.1.0

### Minor Changes

- 8a17872: Updted package from chanify and implemented custom rpc settings

### Patch Changes

- Updated dependencies [8a17872]
  - @liquality/error-parser@2.1.0

## 3.0.0

### Major Changes

- 1b62040: Error Parsing user consent

### Minor Changes

- 92d0788: Changes to fix Error report with user consent

### Patch Changes

- 25567cb: fix: add ledger error parser
  fix: add jsonRPC error parser
  fix: add error parser for debridge
  fix: add error parser for thorchain
- 839c9eb: test: bump to next pre release version
- 366cf25: fix NFTs without token_id
- 594615f: test: bump versions
- 7f192b5: fix: add error parser for uniswapV2
  fix: split messages going to discord
- 4b3b100: test: bump pre release version
- a9ffd93: fix: add new liquality error, LedgerDeviceSmartContractTransactionDisabledError
  fix: make chainify proxy work after transpilation. sendTransaction, an async function is made into a regular function and causes undesireable effects
- 9e5ff10: fix: report error iff users wish to
- Updated dependencies [25567cb]
- Updated dependencies [aa5fe04]
- Updated dependencies [118f1a0]
- Updated dependencies [839c9eb]
- Updated dependencies [594615f]
- Updated dependencies [196dd88]
- Updated dependencies [7f192b5]
- Updated dependencies [4b3b100]
- Updated dependencies [a9ffd93]
- Updated dependencies [a9110e3]
- Updated dependencies [9e5ff10]
  - @liquality/error-parser@2.0.1
  - @liquality/cryptoassets@2.1.0

## 2.0.1-next.3

### Patch Changes

- 9e5ff10: fix: report error iff users wish to
- Updated dependencies [118f1a0]
- Updated dependencies [9e5ff10]
  - @liquality/error-parser@2.0.1-next.3

## 2.0.1-next.2

### Patch Changes

- 4b3b100: test: bump pre release version
- Updated dependencies [4b3b100]
  - @liquality/cryptoassets@2.1.0-next.2
  - @liquality/error-parser@2.0.1-next.2

## 2.0.1-next.1

### Patch Changes

- 839c9eb: test: bump to next pre release version
- 366cf25: fix NFTs without token_id
- a9ffd93: fix: add new liquality error, LedgerDeviceSmartContractTransactionDisabledError
  fix: make chainify proxy work after transpilation. sendTransaction, an async function is made into a regular function and causes undesireable effects
- Updated dependencies [839c9eb]
- Updated dependencies [196dd88]
- Updated dependencies [a9ffd93]
- Updated dependencies [a9110e3]
  - @liquality/cryptoassets@2.1.0-next.1
  - @liquality/error-parser@2.0.1-next.1

## 2.0.1-next.0

### Patch Changes

- 594615f: test: bump versions
- Updated dependencies [aa5fe04]
- Updated dependencies [594615f]
  - @liquality/cryptoassets@2.1.0-next.0
  - @liquality/error-parser@2.0.1-next.0

## 2.0.0

### Patch Changes

- 1673543: test: bump versions from master for 0.78.0 release
- Updated dependencies [1673543]
  - @liquality/cryptoassets@2.0.0
  - @liquality/error-parser@2.0.0

## 2.0.0-next.6

### Patch Changes

- 5bb19d0: bump version after fix
- Updated dependencies [5bb19d0]
  - @liquality/cryptoassets@2.0.0-next.6
  - @liquality/error-parser@2.0.0-next.6

## 2.0.0-next.5

### Major Changes

- bc9b6a3: test: bump all along with error parser

### Patch Changes

- Updated dependencies [bc9b6a3]
  - @liquality/cryptoassets@2.0.0-next.5
  - @liquality/error-parser@2.0.0-next.5

## 1.31.4-next.4

### Patch Changes

- b1dbb31: test: bump pre release version
- Updated dependencies [b1dbb31]
  - @liquality/cryptoassets@1.16.3-next.4
  - @liquality/error-parser@1.1.4-next.4

## 1.31.4-next.3

### Patch Changes

- 07bd108: test: bump pre release
- Updated dependencies [07bd108]
  - @liquality/cryptoassets@1.16.3-next.3
  - @liquality/error-parser@1.1.4-next.3

## 1.31.4-next.2

### Patch Changes

- 3c309e1: fix: covalent api key
- Updated dependencies [3c309e1]
  - @liquality/cryptoassets@1.16.3-next.2

## 1.31.4-next.1

### Patch Changes

- a156f8e: test: bump versions to next
- Updated dependencies [a156f8e]
  - @liquality/cryptoassets@1.16.3-next.1

## 1.31.4-next.0

### Patch Changes

- test: bump versions
- Updated dependencies
  - @liquality/cryptoassets@1.16.3-next.0

## 1.31.3

### Patch Changes

- 2173cb9: feat: bump wallet core version with slippage % debridge

## 1.31.2

### Patch Changes

- 2ecbc28: test: bump versions with toggle fix
- Updated dependencies [2ecbc28]
  - @liquality/cryptoassets@1.16.2

## 1.31.1

### Patch Changes

- 0dd1f89: test: bump versions from master
- Updated dependencies [0dd1f89]
  - @liquality/cryptoassets@1.16.1

## 1.31.0

### Patch Changes

- 17378a0: test: bump versions for 0.76.0 release
- Updated dependencies [17378a0]
  - @liquality/cryptoassets@1.16.0

## 1.31.0-next.5

### Patch Changes

- 840dbd8: chore: bump versions after lifi integration
- Updated dependencies [840dbd8]
  - @liquality/cryptoassets@1.16.0-next.5

## 1.31.0-next.4

### Minor Changes

- fa3595a: fix debridge and testnet issues

### Patch Changes

- Updated dependencies [fa3595a]
  - @liquality/cryptoassets@1.16.0-next.4

## 1.31.0-next.3

### Minor Changes

- 7454432: lifi + debridge + goerli

### Patch Changes

- Updated dependencies [7454432]
  - @liquality/cryptoassets@1.16.0-next.3

## 1.31.0-next.2

### Minor Changes

- 412e1d1: bump
- 412e1d1: bump2

### Patch Changes

- Updated dependencies [412e1d1]
- Updated dependencies [412e1d1]
  - @liquality/cryptoassets@1.16.0-next.2

## 1.31.0-next.1

### Minor Changes

- b9db052: increment

### Patch Changes

- Updated dependencies [b9db052]
  - @liquality/cryptoassets@1.16.0-next.1

## 1.31.0-next.0

### Minor Changes

- 3d90aee: Lifi + debridge + goerli testnet
- e45d2cb: fix: debridge rpc url
- 61c228e: feat: eth testnet to goerli

### Patch Changes

- Updated dependencies [3d90aee]
- Updated dependencies [e45d2cb]
- Updated dependencies [61c228e]
  - @liquality/cryptoassets@1.16.0-next.0

## 1.30.3

### Patch Changes

- d764511: - fix fetching assets
- Updated dependencies [d764511]
  - @liquality/cryptoassets@1.15.3

## 1.30.2

### Patch Changes

- efdc92d: fix: pass solana rpc as environmnet variable
- Updated dependencies [efdc92d]
  - @liquality/cryptoassets@1.15.2

## 1.30.1

### Patch Changes

- 1ae3e84: fix: bump versions from master
- Updated dependencies [1ae3e84]
  - @liquality/cryptoassets@1.15.1

## 1.30.0

### Minor Changes

- 87ea3f6: - evm chains work under same logic now

### Patch Changes

- Updated dependencies [87ea3f6]
  - @liquality/cryptoassets@1.15.0

## 1.29.25

### Patch Changes

- bd46603: test: bump all versions for hot fix solana endpoints change
- Updated dependencies [bd46603]
  - @liquality/cryptoassets@1.14.20

## 1.29.24

### Patch Changes

- Updated dependencies [4a746a4]
  - @liquality/cryptoassets@1.14.19

## 1.29.23

### Patch Changes

- f6394a0: fix: revert some changes and bump versions
- Updated dependencies [f6394a0]
  - @liquality/cryptoassets@1.14.18

## 1.29.22

### Patch Changes

- 3c0113f: test: bump patch versions
- e466d4f: test: bump versions
- Updated dependencies [3c0113f]
- Updated dependencies [e466d4f]
  - @liquality/cryptoassets@1.14.17

## 1.29.21

### Patch Changes

- 955a8c3: feat: bump to patch versions for 0.73.0
- Updated dependencies [955a8c3]
  - @liquality/cryptoassets@1.14.16

## 1.29.21-next.1

### Patch Changes

- af3fca0: test: bump versions
- Updated dependencies [af3fca0]
  - @liquality/cryptoassets@1.14.16-next.1

## 1.29.21-next.0

### Patch Changes

- 671dea7: Bump up Chainify package
- 06aebc7: fix: regression bugs bump version
- Updated dependencies [06aebc7]
  - @liquality/cryptoassets@1.14.16-next.0

## 1.29.20

### Patch Changes

- 8f4b740: test: bump version from master test
- Updated dependencies [8f4b740]
  - @liquality/cryptoassets@1.14.15

## 1.29.19

### Patch Changes

- c632674: test: bump all packages after remove logic from ci
- Updated dependencies [c632674]
  - @liquality/cryptoassets@1.14.14

## 1.29.18

### Patch Changes

- 1784096: feat: bump version from master after yarn lock file
- Updated dependencies [1784096]
  - @liquality/cryptoassets@1.14.13

## 1.29.17

### Patch Changes

- fe656f0: test: testing bump version without running changeset version command local
- 66038e7: test: bump another next version from develop branch
- 66038e7: test: test another pre release bump
- f552f0e: feat: bump patch version from master branch for rc0.73.0
- ae1b06b: Wallet core minor bump
- Updated dependencies [fe656f0]
- Updated dependencies [66038e7]
- Updated dependencies [66038e7]
- Updated dependencies [f552f0e]
  - @liquality/cryptoassets@1.14.12

## 1.29.17-next.4

### Patch Changes

- ae1b06b: Wallet core minor bump

## 1.29.17-next.3

### Patch Changes

- fe656f0: test: testing bump version without running changeset version command local
- Updated dependencies [fe656f0]
  - @liquality/cryptoassets@1.14.12-next.3

## 1.29.17-next.2

### Patch Changes

- test: test another pre release bump
- Updated dependencies
  - @liquality/cryptoassets@1.14.12-next.2

## 1.29.17-next.1

### Patch Changes

- test: bump another next version from develop branch
- Updated dependencies
  - @liquality/cryptoassets@1.14.12-next.1

## 1.29.17-next.0

### Patch Changes

- 179f0b4: test: prerelease version bump
- Updated dependencies [179f0b4]
  - @liquality/cryptoassets@1.14.12-next.0

## 1.29.16

### Patch Changes

- 5e73c63: feat: bump all versions from master
- Updated dependencies [5e73c63]
  - @liquality/cryptoassets@1.14.11

## 1.29.14

### Patch Changes

- 7f1b399: Add account id for client getter inside NFT send transaction action

## 1.29.15

### Patch Changes

- 52f0702: - fix RSK address validation
- Updated dependencies [52f0702]
  - @liquality/cryptoassets@1.14.10

## 1.29.13

### Patch Changes

- a45924d: - fix address validation for evm chains
- Updated dependencies [a45924d]
- c9f3735: - fix address validation for evm chains
- Updated dependencies [c9f3735]
  - @liquality/cryptoassets@1.14.8

## 1.29.12

### Patch Changes

- 376246d: test: testing bump versions with beta tag
- Updated dependencies [376246d]
- 7179204: chore: bump versions with correct script
- Updated dependencies [7179204]
  - @liquality/cryptoassets@1.14.7

## 1.29.11

### Patch Changes

- f3bb88f: fix: uns name resolving
- Updated dependencies [f3bb88f]
- 9e0c685: core: bump both packages versions
- Updated dependencies [9e0c685]
  - @liquality/cryptoassets@1.14.6

## 1.29.10

### Patch Changes

- fa2d81f: test: test publishing single package

## 1.29.9

### Patch Changes

- 62a7f32: test: testing changeset publish
- Updated dependencies [62a7f32]
  - @liquality/cryptoassets@1.14.5

## 1.29.8

### Patch Changes

- 76252fd: test: test yarn issue
- Updated dependencies [76252fd]
  - @liquality/cryptoassets@1.14.4

## 1.29.7

### Patch Changes

- f80033c: test: testing yarn exit issue

## 1.29.6

### Patch Changes

- 266526d: test: bump wallet core version for testing

## 1.29.5

### Patch Changes

- 783263e: feat: bump wallet core for testing

## 1.29.4

### Patch Changes

- 3a367a2: ci: added git release flag

## 1.29.3

### Patch Changes

- 457fd1a: feat: optimism chain integration
- Updated dependencies [457fd1a]
  - @liquality/cryptoassets@1.14.3

## 1.29.2

### Patch Changes

- ec9a3b9: fix: fix the script in package.json
- Updated dependencies [ec9a3b9]
  - @liquality/cryptoassets@1.14.2

## 1.29.1

### Patch Changes

- e268c44: fix: added npm token to yarnnc
- Updated dependencies [e268c44]
  - @liquality/cryptoassets@1.14.1

## 1.29.0

### Minor Changes

- 607345e: fix: UNS should resolve for polygon correctly and test

### Patch Changes

- Updated dependencies [607345e]
  - @liquality/cryptoassets@1.14.0

## 1.28.6

### Patch Changes

- eb07864: ci: update timestamp
- Updated dependencies [eb07864]
  - @liquality/cryptoassets@1.13.6
