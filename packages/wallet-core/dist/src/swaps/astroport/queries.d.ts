import { MsgExecuteContract } from '@terra-money/terra.js';
import { SwapHistoryItem } from '../../store/types';
export declare const getRateNativeToAsset: (fromAmount: string, asset?: string, pairAddress?: string) => {
    query: {
        simulation: {
            offer_asset: {
                info?: {
                    native_token: {
                        denom: string;
                    };
                    token?: undefined;
                } | {
                    token: {
                        contract_addr: string | undefined;
                    };
                    native_token?: undefined;
                } | undefined;
                amount: string;
            };
        };
    };
    address: string;
};
export declare const getRateERC20ToERC20: (fromAmount: string, firstAsset?: string, secondAsset?: string, pairAddress?: string) => {
    query: {
        simulate_swap_operations: {
            offer_amount: string;
            operations: ({
                astro_swap: {
                    ask_asset_info: {
                        native_token: {
                            denom: string;
                        };
                        token?: undefined;
                    };
                    offer_asset_info?: {
                        native_token: {
                            denom: string;
                        };
                        token?: undefined;
                    } | {
                        token: {
                            contract_addr: string | undefined;
                        };
                        native_token?: undefined;
                    } | undefined;
                };
            } | {
                astro_swap: {
                    ask_asset_info?: {
                        native_token: {
                            denom: string;
                        };
                        token?: undefined;
                    } | {
                        token: {
                            contract_addr: string | undefined;
                        };
                        native_token?: undefined;
                    } | undefined;
                    offer_asset_info: {
                        native_token: {
                            denom: string;
                        };
                        token?: undefined;
                    };
                };
            })[];
        };
    };
    address: string;
};
export declare const buildSwapFromNativeTokenMsg: (quote: SwapHistoryItem, denom: string, address: string, pairAddress?: string) => {
    data: {
        fee: number;
        msgs: MsgExecuteContract[];
        gasLimit: number;
    };
};
export declare const buildSwapFromContractTokenMsg: (quote: SwapHistoryItem, recipient: string, fromTokenAddress: string, toTokenAddress: string) => {
    data: {
        fee: number;
        msgs: MsgExecuteContract[];
        gasLimit: number;
    };
};
export declare const buildSwapFromContractTokenToUSTMsg: (quote: SwapHistoryItem, address: string, fromTokenAddress: string, pairAddress: string) => {
    data: {
        fee: number;
        msgs: MsgExecuteContract[];
        gasLimit: number;
    };
};
export declare const getPairAddressQuery: (tokenAddress: string) => {
    pair: {
        asset_infos: ({
            token: {
                contract_addr: string;
            };
            native_token?: undefined;
        } | {
            native_token: {
                denom: string;
            };
            token?: undefined;
        })[];
    };
};
