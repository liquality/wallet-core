const contractsMainnet = require("./contracts-mainnet.json")
const contractsTestnet = require("./contracts-testnet.json")
const contracts = require("./build-contracts")

console.log(`Using ${process.env.NETWORK_MODE} mode`)

module.exports = {
    addresses: process.env.NETWORK_MODE && process.env.NETWORK_MODE === "mainnet" ? contractsMainnet : contractsTestnet,
    contracts: { ...contracts },
    ...contracts
}