"use strict";
require('dotenv').config();
const nconf = require('nconf')
    .env({
    separator: '__',
    parseValues: true,
    transform: (obj) => {
        if (obj.key.includes('HEADERS')) {
            let headers = {};
            let value = obj.value;
            if (value.charAt(value.length - 1) === ',')
                value = value.slice(0, -1);
            value.split(',').forEach((element) => {
                const [key, value] = element.split(':');
                headers[key] = value;
            });
            obj.value = headers;
        }
        if (obj.key.includes('AUTH')) {
            const [username, password] = obj.value.split(':');
            obj.value = {
                username,
                password,
            };
        }
        if (obj.key.includes('LOCKERS_LIST')) {
            let value = obj.value;
            if (value.charAt(value.length - 1) === ',')
                value = value.slice(0, -1);
            obj.value = value.split(',');
        }
        return obj;
    },
})
    .file('.config.json');
nconf.required([
    'SOURCE_NETWORK:NAME',
    'TARGET_NETWORK:NAME',
    'TARGET_NETWORK:CONNECTION:WEB3:URL',
    'SERVICE:NAME',
    'ACCOUNT:MNEMONIC',
    'ACCOUNT:INDEX',
]);
if (nconf.get('SOURCE_NETWORK:CONNECTION:RPC_ENABLED') === true) {
    nconf.required(['SOURCE_NETWORK:CONNECTION:RPC:URL']);
}
nconf.required(['SOURCE_NETWORK:CONNECTION:API:PROVIDER']);
if (nconf.get('EMAIL:ENABLED') === true) {
    nconf.required([
        'EMAIL:HOST',
        'EMAIL:PORT',
        'EMAIL:USERNAME',
        'EMAIL:PASSWORD',
        'EMAIL:FROM',
        'EMAIL:ADMIN_ADDRESSES',
    ]);
}
if (nconf.get('SLACK:ENABLED') === true)
    nconf.required(['SLACK:WEBHOOK_URL']);
if (nconf.get('SERVICE:NAME') === 'teleporter') {
    nconf.required([
        'SERVICE:TELEPORTER:TELEPORT_ENABLED',
        'SERVICE:TELEPORTER:SLASH_USER_ENABLED',
        'SERVICE:TELEPORTER:SLASH_LOCKER_ENABLED',
        'SERVICE:TELEPORTER:LENDING_ENABLED',
        'SERVICE:TELEPORTER:LOCKERS_LIST',
    ]);
    if (nconf.get('CUSTOM_CONTRACT_AND_TOKEN_ENABLED') === true) {
        if (nconf.get('SERVICE:TELEPORTER:LENDING_ENABLED') === true) {
            nconf.required(['CONTRACTS:LENDING_ADDRESS']);
        }
        nconf.required([
            'CONTRACTS:RELAY_ADDRESS',
            'CONTRACTS:CC_TRANSFER_ADDRESS',
            'CONTRACTS:CC_EXCHANGE_ADDRESS',
            'CONTRACTS:INSTANT_ROUTER_ADDRESS',
            'CONTRACTS:CC_BURN_ADDRESS',
            'CONTRACTS:LOCKER_ADDRESS',
        ]);
    }
}
if (nconf.get('SERVICE:NAME') === 'locker') {
    if (nconf.get('CUSTOM_CONTRACT_AND_TOKEN_ENABLED') === true)
        nconf.required([
            'CONTRACTS:RELAY_ADDRESS',
            'CONTRACTS:CC_BURN_ADDRESS',
            'CONTRACTS:LOCKER_ADDRESS',
        ]);
}
if (nconf.get('SERVICE:NAME') === 'relayer') {
    if (nconf.get('CUSTOM_CONTRACT_AND_TOKEN_ENABLED') === true)
        nconf.required(['CONTRACTS:RELAY_ADDRESS']);
}
if (nconf.get('CUSTOM_CONTRACT_AND_TOKEN_ENABLED') === true)
    nconf.required(['TOKENS:TELE_BTC', 'TOKENS:LINK']);
module.exports = nconf;
//# sourceMappingURL=.envs.nconf.js.map