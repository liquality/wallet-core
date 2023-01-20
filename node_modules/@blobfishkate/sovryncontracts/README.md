# Sovryn Contracts Package

This package contains the abis and contracts addresses for smart contracts used by the Sovryn Protocol

## Usage

This package will default to using testnet settings. To use mainnet setting you will need to set two environment variables:
- NETWORK_MODE=mainnet
- WEB3_PROVIDER= mainnet node url

To import just an address:
`import { addresses } from "@blobfishkate/sovryncontracts";`

To get an individual address:
`const BTC_address = addresses.BTC_token;`

To import a single contract:
`import { BTC_lending } from "@blobfishkate/sovryncontracts";`
where BTC_lending is the name of the contract.

To import all contracts as a single object where keys are contract names:
`import { contracts } from "@blobfishkate/sovryncontracts";`
where contracts.BTC_lending is the BTC_lending contract.

Github repo is here: https://github.com/BetsyBraddock/Sovryn-Contracts-Package

A list of exported addresses can be found in /contract-mainnet.json or /contracts-testnet.json.

A list of named contracts can be found in /build-contracts.js.

If you need to view the abis, they can be found in the /abi directory.