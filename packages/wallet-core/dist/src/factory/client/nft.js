"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNftProvider = void 0;
const evm_1 = require("@chainify/evm");
const types_1 = require("../../store/types");
function getNftProvider(providerType, walletProvider, testnet) {
    switch (providerType) {
        case types_1.NftProviderType.OpenSea:
            return new evm_1.OpenSeaNftProvider(walletProvider, {
                url: 'https://api.opensea.io/api/v1/',
                apiKey: '963da5bcea554a92b078fe1f48a2300e',
            });
        case types_1.NftProviderType.Moralis:
            if (testnet) {
                return new evm_1.MoralisNftProvider(walletProvider, {
                    url: 'https://tjgwcry8a7dd.usemoralis.com:2053/server',
                    appId: 'PwWfldBBlRaVWGihW4K6LqL4AQbmVNTI3w2OyDhN',
                    apiKey: 'X9Bg0wQh5rzvbZ3owmtqAsxdMTy3L81jnz6BNVsj',
                });
            }
            return new evm_1.MoralisNftProvider(walletProvider, {
                url: 'https://ghi7f9miezr7.usemoralis.com:2053/server',
                appId: 'T94TjnFcaFycYfHqkf227JmpZeEjGXmDWINkfJD2',
                apiKey: 'iv94v0ZQgQfIkTe09QLple1DDAGbmAD8zX9BeVGo',
            });
        case types_1.NftProviderType.Covalent:
            return new evm_1.CovalentNftProvider(walletProvider, {
                url: 'https://api.covalenthq.com/v1',
                apiKey: 'ckey_d87425e55bac4d78aa8ac902a34',
            });
    }
}
exports.getNftProvider = getNftProvider;
//# sourceMappingURL=nft.js.map