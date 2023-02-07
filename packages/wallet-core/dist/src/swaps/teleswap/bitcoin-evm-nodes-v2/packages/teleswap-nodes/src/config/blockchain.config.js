"use strict";
const nconf = require('./.envs.nconf');
const CONTRACTS = require('@sinatdt/configs').teleswap.contractsInfo;
const TOKENS = require('@sinatdt/configs').teleswap.tokenInfo;
const chainInfo = require('@sinatdt/configs').chainInfo;
let targetNetwork = nconf.get('TARGET_NETWORK:NAME').replace('_testnet', '');
let isTargetTestnet = nconf.get('TARGET_NETWORK:NAME').includes('_testnet');
let contracts = isTargetTestnet
    ? CONTRACTS[targetNetwork].testnet
    : CONTRACTS[targetNetwork].mainnet;
let tokens = isTargetTestnet ? TOKENS[targetNetwork].testnet : TOKENS[targetNetwork].mainnet;
const config = {
    service: {
        name: nconf.get('SERVICE:NAME'),
        teleporter: {
            teleportEnabled: nconf.get('SERVICE:TELEPORTER:TELEPORT_ENABLED'),
            slashUserEnabled: nconf.get('SERVICE:TELEPORTER:SLASH_USER_ENABLED'),
            slashLockerEnabled: nconf.get('SERVICE:TELEPORTER:SLASH_LOCKER_ENABLED'),
            lendingEnabled: nconf.get('SERVICE:TELEPORTER:LENDING_ENABLED'),
            lockers: nconf.get('SERVICE:TELEPORTER:LOCKERS_LIST'),
        },
    },
    sourceNetwork: {
        name: nconf.get('SOURCE_NETWORK:NAME'),
        connection: {
            api: {
                enabled: true,
                provider: nconf.get('SOURCE_NETWORK:CONNECTION:API:PROVIDER'),
                token: nconf.get('SOURCE_NETWORK:CONNECTION:API:TOKEN'),
            },
            rpc: {
                enabled: nconf.get('SOURCE_NETWORK:CONNECTION:RPC:ENABLED'),
                url: nconf.get('SOURCE_NETWORK:CONNECTION:RPC:URL'),
                auth: nconf.get('SOURCE_NETWORK:CONNECTION:RPC:AUTH'),
                headers: nconf.get('SOURCE_NETWORK:CONNECTION:RPC:HEADERS'),
            },
        },
        options: {},
    },
    targetNetwork: {
        name: nconf.get('TARGET_NETWORK:NAME'),
        chainId: chainInfo[nconf.get('TARGET_NETWORK:NAME')].chainId,
        connection: {
            web3: {
                url: nconf.get('TARGET_NETWORK:CONNECTION:WEB3:URL'),
                headers: nconf.get('TARGET_NETWORK:CONNECTION:WEB3:HEADERS'),
            },
        },
        options: {},
    },
    account: {
        mnemonic: nconf.get('ACCOUNT:MNEMONIC'),
        index: nconf.get('ACCOUNT:INDEX'),
    },
    contracts: nconf.get('CUSTOM_CONTRACT_AND_TOKEN_ENABLED') === true
        ? {
            relayAddress: nconf.get('CONTRACTS:RELAY_ADDRESS'),
            lendingAddress: nconf.get('CONTRACTS:LENDING_ADDRESS'),
            ccTransferAddress: nconf.get('CONTRACTS:CC_TRANSFER_ADDRESS'),
            ccExchangeAddress: nconf.get('CONTRACTS:CC_EXCHANGE_ADDRESS'),
            ccBurnAddress: nconf.get('CONTRACTS:CC_BURN_ADDRESS'),
            instantRouterAddress: nconf.get('CONTRACTS:INSTANT_ROUTER_ADDRESS'),
            lockerAddress: nconf.get('CONTRACTS:LOCKER_ADDRESS'),
        }
        : contracts,
    tokens: nconf.get('CUSTOM_CONTRACT_AND_TOKEN_ENABLED') === true
        ? {
            teleBTC: nconf.get('TOKENS:TELE_BTC'),
            link: nconf.get('TOKENS:LINK'),
        }
        : tokens,
};
module.exports = config;
//# sourceMappingURL=blockchain.config.js.map