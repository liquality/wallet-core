"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPairAddressQuery = exports.buildSwapFromContractTokenToUSTMsg = exports.buildSwapFromContractTokenMsg = exports.buildSwapFromNativeTokenMsg = exports.getRateERC20ToERC20 = exports.getRateNativeToAsset = void 0;
const terra_js_1 = require("@terra-money/terra.js");
const ADDRESSES = {
    ASSETS_CONTRACT: 'terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552',
    FACTORY_CONTRACT: 'terra16t7dpwwgx9n3lq6l6te3753lsjqwhxwpday9zx',
};
const getRateNativeToAsset = (fromAmount, asset, pairAddress) => {
    const isDenom = asset === 'uluna' || asset === 'uusd';
    const query = {
        simulation: {
            offer_asset: Object.assign(Object.assign({ amount: fromAmount }, (isDenom && {
                info: {
                    native_token: {
                        denom: asset,
                    },
                },
            })), (!isDenom && {
                info: {
                    token: {
                        contract_addr: asset,
                    },
                },
            })),
        },
    };
    let address = ADDRESSES.ASSETS_CONTRACT;
    if (pairAddress) {
        address = pairAddress;
    }
    return { query, address };
};
exports.getRateNativeToAsset = getRateNativeToAsset;
const getRateERC20ToERC20 = (fromAmount, firstAsset, secondAsset, pairAddress) => {
    const isFirstAssetDenom = firstAsset === 'uluna' || firstAsset === 'uusd';
    const isSecondAssetDenom = secondAsset === 'uluna' || secondAsset === 'uusd';
    const query = {
        simulate_swap_operations: {
            offer_amount: fromAmount,
            operations: [
                {
                    astro_swap: Object.assign(Object.assign(Object.assign({}, (isFirstAssetDenom && {
                        offer_asset_info: {
                            native_token: {
                                denom: firstAsset,
                            },
                        },
                    })), (!isFirstAssetDenom && {
                        offer_asset_info: {
                            token: {
                                contract_addr: firstAsset,
                            },
                        },
                    })), { ask_asset_info: {
                            native_token: { denom: 'uusd' },
                        } }),
                },
                {
                    astro_swap: Object.assign(Object.assign({ offer_asset_info: {
                            native_token: { denom: 'uusd' },
                        } }, (isSecondAssetDenom && {
                        ask_asset_info: {
                            native_token: {
                                denom: secondAsset,
                            },
                        },
                    })), (!isSecondAssetDenom && {
                        ask_asset_info: {
                            token: {
                                contract_addr: secondAsset,
                            },
                        },
                    })),
                },
            ],
        },
    };
    let address = ADDRESSES.FACTORY_CONTRACT;
    if (pairAddress) {
        address = pairAddress;
    }
    return { query, address };
};
exports.getRateERC20ToERC20 = getRateERC20ToERC20;
const buildSwapFromNativeTokenMsg = (quote, denom, address, pairAddress) => {
    const to = pairAddress ? pairAddress : ADDRESSES.ASSETS_CONTRACT;
    return {
        data: {
            fee: quote.fee,
            msgs: [
                new terra_js_1.MsgExecuteContract(address, to, {
                    swap: {
                        offer_asset: {
                            info: {
                                native_token: {
                                    denom,
                                },
                            },
                            amount: quote.fromAmount,
                        },
                        to: address,
                    },
                }, { [denom]: Number(quote.fromAmount) }),
            ],
            gasLimit: 400000,
        },
    };
};
exports.buildSwapFromNativeTokenMsg = buildSwapFromNativeTokenMsg;
const buildSwapFromContractTokenMsg = (quote, recipient, fromTokenAddress, toTokenAddress) => {
    const isERC20ToLuna = quote.to === 'LUNA';
    const isLunaToERC20 = quote.from === 'LUNA';
    const isERC20ToERC20 = quote.to !== 'LUNA' && quote.from !== 'LUNA';
    const swapMsg = {
        execute_swap_operations: {
            offer_amount: quote.fromAmount,
            operations: [
                {
                    astro_swap: Object.assign(Object.assign(Object.assign({}, ((isERC20ToERC20 || isERC20ToLuna) && {
                        offer_asset_info: {
                            token: {
                                contract_addr: fromTokenAddress,
                            },
                        },
                    })), (isLunaToERC20 && {
                        offer_asset_info: {
                            native_token: {
                                denom: 'uluna',
                            },
                        },
                    })), { ask_asset_info: {
                            native_token: {
                                denom: 'uusd',
                            },
                        } }),
                },
                {
                    astro_swap: Object.assign(Object.assign({ offer_asset_info: {
                            native_token: {
                                denom: 'uusd',
                            },
                        } }, ((isLunaToERC20 || isERC20ToERC20) && {
                        ask_asset_info: {
                            token: {
                                contract_addr: toTokenAddress,
                            },
                        },
                    })), (isERC20ToLuna && {
                        ask_asset_info: {
                            native_token: {
                                denom: 'uluna',
                            },
                        },
                    })),
                },
            ],
        },
    };
    if (isERC20ToERC20 || isERC20ToLuna) {
        const msgInBase64 = Buffer.from(JSON.stringify(swapMsg)).toString('base64');
        return {
            data: {
                fee: quote.fee,
                msgs: [
                    new terra_js_1.MsgExecuteContract(recipient, fromTokenAddress, {
                        send: {
                            msg: msgInBase64,
                            amount: quote.fromAmount,
                            contract: ADDRESSES.FACTORY_CONTRACT,
                        },
                    }),
                ],
                gasLimit: 1500000,
            },
        };
    }
    return {
        data: {
            fee: quote.fee,
            msgs: [
                new terra_js_1.MsgExecuteContract(recipient, ADDRESSES.FACTORY_CONTRACT, swapMsg, { ['uluna']: Number(quote.fromAmount) }),
            ],
            gasLimit: 1500000,
        },
    };
};
exports.buildSwapFromContractTokenMsg = buildSwapFromContractTokenMsg;
const buildSwapFromContractTokenToUSTMsg = (quote, address, fromTokenAddress, pairAddress) => {
    const msgInBase64 = Buffer.from(JSON.stringify({
        swap: {},
    })).toString('base64');
    return {
        data: {
            fee: quote.fee,
            msgs: [
                new terra_js_1.MsgExecuteContract(address, fromTokenAddress, {
                    send: {
                        msg: msgInBase64,
                        amount: quote.fromAmount,
                        contract: pairAddress,
                    },
                }),
            ],
            gasLimit: 400000,
        },
    };
};
exports.buildSwapFromContractTokenToUSTMsg = buildSwapFromContractTokenToUSTMsg;
const getPairAddressQuery = (tokenAddress) => ({
    pair: {
        asset_infos: [
            {
                token: {
                    contract_addr: tokenAddress,
                },
            },
            {
                native_token: {
                    denom: 'uusd',
                },
            },
        ],
    },
});
exports.getPairAddressQuery = getPairAddressQuery;
//# sourceMappingURL=queries.js.map