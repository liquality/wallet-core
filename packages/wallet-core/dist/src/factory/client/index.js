"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const cryptoassets_1 = require("@liquality/cryptoassets");
const error_parser_1 = require("@liquality/error-parser");
const clients_1 = require("./clients");
const evm_1 = require("./evm");
const createClient = ({ chainId, settings, mnemonic, accountInfo, }) => {
    let client;
    const chain = (0, cryptoassets_1.getChain)(settings.network, chainId);
    if (chain.isEVM) {
        client = (0, evm_1.createEvmClient)(chain, settings, mnemonic, accountInfo);
    }
    else {
        switch (chainId) {
            case cryptoassets_1.ChainId.Bitcoin:
                client = (0, clients_1.createBtcClient)(settings, mnemonic, accountInfo);
                break;
            case cryptoassets_1.ChainId.Near:
                client = (0, clients_1.createNearClient)(settings, mnemonic, accountInfo);
                break;
            case cryptoassets_1.ChainId.Terra:
                client = (0, clients_1.createTerraClient)(settings, mnemonic, accountInfo);
                break;
            case cryptoassets_1.ChainId.Solana:
                client = (0, clients_1.createSolanaClient)(settings, mnemonic, accountInfo);
                break;
            default:
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Client(chainId));
        }
    }
    if (client.chain)
        client.chain = proxify(client.chain);
    if (client.swap)
        client.swap = proxify(client.swap);
    if (client.nft)
        client.nft = proxify(client.nft);
    if (client.wallet)
        client.wallet = proxify(client.wallet);
    return client;
};
exports.createClient = createClient;
const parser = (0, error_parser_1.getErrorParser)(error_parser_1.ChainifyErrorParser);
function proxify(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            if (target[prop] instanceof Function) {
                return (...args) => {
                    try {
                        const result = target[prop](...args);
                        if (isPromise(result)) {
                            return result.catch((e) => {
                                throw parser.parseError(e, null);
                            });
                        }
                        return result;
                    }
                    catch (e) {
                        throw parser.parseError(e, null);
                    }
                };
            }
            else {
                return target[prop];
            }
        },
    });
}
function isPromise(p) {
    if (p !== null && typeof p === 'object' && typeof p.then === 'function' && typeof p.catch === 'function') {
        return true;
    }
    return false;
}
//# sourceMappingURL=index.js.map