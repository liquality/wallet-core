"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstroportSwapProvider = void 0;
const tslib_1 = require("tslib");
const terra_1 = require("@chainify/terra");
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const terra_js_1 = require("@terra-money/terra.js");
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const uuid_1 = require("uuid");
const utils_1 = require("../../store/actions/performNextAction/utils");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const queries_1 = require("./queries");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const error_parser_1 = require("@liquality/error-parser");
class AstroportSwapProvider extends SwapProvider_1.SwapProvider {
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getQuote(quoteRequest) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { from, to, amount } = quoteRequest;
            const fromInfo = cryptoassets_2.default[from];
            const toInfo = cryptoassets_2.default[to];
            if (fromInfo.chain !== cryptoassets_1.ChainId.Terra || toInfo.chain !== cryptoassets_1.ChainId.Terra || amount.lt(0)) {
                return null;
            }
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(fromInfo, new bignumber_js_1.default(amount).decimalPlaces(fromInfo.decimals, bignumber_js_1.default.ROUND_DOWN)).toFixed();
            const { rate, fromTokenAddress, toTokenAddress, pairAddress } = yield this._getSwapRate(fromAmountInUnit, fromInfo, toInfo);
            if (rate.amount === 0 || rate.return_amount === 0) {
                return null;
            }
            return {
                fromAmount: fromAmountInUnit,
                toAmount: ((_a = rate.amount) === null || _a === void 0 ? void 0 : _a.toString()) || ((_b = rate.return_amount) === null || _b === void 0 ? void 0 : _b.toString()),
                fromTokenAddress,
                toTokenAddress,
                pairAddress,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const [{ address }] = yield client.wallet.getAddresses();
            const denom = this._getDenom(quote.from);
            const { fromTokenAddress, toTokenAddress, pairAddress } = quote;
            const isFromNative = quote.from === 'UST' || (quote.from === 'LUNA' && quote.to === 'UST');
            const isFromERC20ToUST = fromTokenAddress && quote.to === 'UST';
            let txData;
            if (isFromNative) {
                if (!denom) {
                    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.AstroPortDenom);
                }
                txData = (0, queries_1.buildSwapFromNativeTokenMsg)(quote, denom, address, pairAddress);
            }
            else if (isFromERC20ToUST) {
                txData = (0, queries_1.buildSwapFromContractTokenToUSTMsg)(quote, address, fromTokenAddress, pairAddress);
            }
            else {
                txData = (0, queries_1.buildSwapFromContractTokenMsg)(quote, address, fromTokenAddress, toTokenAddress);
            }
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const swapTx = yield client.chain.sendTransaction(Object.assign({ to: '', value: new bignumber_js_1.BigNumber(0) }, txData));
            const updates = {
                status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
                swapTx,
                swapTxHash: swapTx.hash,
            };
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: 50 }, updates);
        });
    }
    waitForSwapConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.swapTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    const { status } = tx;
                    this.updateBalances(network, walletId, [swap.fromAccountId]);
                    return {
                        endTime: Date.now(),
                        status: status === types_1.TxStatus.Success ? 'SUCCESS' : 'FAILED',
                    };
                }
            }
            catch (e) {
                if ((0, isTransactionNotFoundError_1.isTransactionNotFoundError)(e))
                    console.warn(e);
                else
                    throw e;
            }
        });
    }
    performNextSwapAction(_store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (swap.status === 'WAITING_FOR_SWAP_CONFIRMATIONS') {
                return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSwapConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    getSwapLimit() {
        return 2;
    }
    estimateFees({ asset, txType, quote, feePrices, network }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType !== this.fromTxType) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.TransactionType(txType));
            }
            const nativeAsset = (0, cryptoassets_1.getNativeAssetCode)(network, cryptoassets_2.default[asset].chain);
            const gasLimit = quote.from === 'UST' || (quote.from === 'LUNA' && quote.to === 'UST') ? 400000 : 1500000;
            const fees = {};
            for (const feePrice of feePrices) {
                const fee = new bignumber_js_1.default(gasLimit).times(feePrice);
                fees[feePrice] = new bignumber_js_1.default((0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset], fee).toFixed());
            }
            return fees;
        });
    }
    getMin(_quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new bignumber_js_1.default(0);
        });
    }
    _getRPC() {
        const { chainId, rpcUrl } = terra_1.TerraNetworks.terra_mainnet;
        return new terra_js_1.LCDClient({ chainID: String(chainId), URL: String(rpcUrl) });
    }
    _getDenom(asset) {
        return {
            LUNA: 'uluna',
            UST: 'uusd',
        }[asset];
    }
    _getSwapRate(fromAmount, fromInfo, toInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rpc = this._getRPC();
            const nativeToNative = fromInfo.type === cryptoassets_1.AssetTypes.native && toInfo.type === cryptoassets_1.AssetTypes.native;
            const erc20ToErc20 = fromInfo.type === cryptoassets_1.AssetTypes.erc20 && toInfo.type === cryptoassets_1.AssetTypes.erc20;
            const nativeToErc20 = fromInfo.type === cryptoassets_1.AssetTypes.native && toInfo.type === cryptoassets_1.AssetTypes.erc20;
            const erc20ToNative = fromInfo.type === cryptoassets_1.AssetTypes.erc20 && toInfo.type === cryptoassets_1.AssetTypes.native;
            let contractData;
            let fromTokenAddress, toTokenAddress;
            if (nativeToNative) {
                const fromDenom = this._getDenom(fromInfo.code);
                contractData = (0, queries_1.getRateNativeToAsset)(fromAmount, fromDenom);
            }
            else if (erc20ToErc20) {
                fromTokenAddress = fromInfo.contractAddress;
                toTokenAddress = toInfo.contractAddress;
                if (!fromTokenAddress || !toTokenAddress) {
                    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.ContractAddress);
                }
                contractData = (0, queries_1.getRateERC20ToERC20)(fromAmount, fromTokenAddress, toTokenAddress);
            }
            else if (nativeToErc20) {
                toTokenAddress = toInfo.contractAddress;
                if (!toTokenAddress) {
                    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.ContractAddress);
                }
                const fromDenom = this._getDenom(fromInfo.code);
                const pairAddress = yield this._getPairAddress(toTokenAddress);
                contractData =
                    fromInfo.code === 'LUNA'
                        ? (0, queries_1.getRateERC20ToERC20)(fromAmount, fromDenom, toTokenAddress)
                        : (0, queries_1.getRateNativeToAsset)(fromAmount, fromDenom, pairAddress);
            }
            else if (erc20ToNative) {
                fromTokenAddress = fromInfo.contractAddress;
                if (!fromTokenAddress) {
                    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.ContractAddress);
                }
                const toDenom = this._getDenom(toInfo.code);
                const pairAddress = yield this._getPairAddress(fromTokenAddress);
                contractData =
                    toInfo.code === 'LUNA'
                        ? (0, queries_1.getRateERC20ToERC20)(fromAmount, fromTokenAddress, toDenom)
                        : (0, queries_1.getRateNativeToAsset)(fromAmount, fromTokenAddress, pairAddress);
            }
            else {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.AstroPortSwapPair(fromInfo.type, toInfo.type));
            }
            const { address, query } = contractData;
            const pairAddress = address;
            const rate = yield rpc.wasm.contractQuery(address, query);
            return { rate, fromTokenAddress, toTokenAddress, pairAddress };
        });
    }
    _getPairAddress(tokenAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rpc = this._getRPC();
            const query = (0, queries_1.getPairAddressQuery)(tokenAddress);
            const resp = yield rpc.wasm.contractQuery('terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g', query);
            return resp.contract_addr;
        });
    }
    _getStatuses() {
        return {
            WAITING_FOR_SWAP_CONFIRMATIONS: {
                step: 0,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return { message: 'Engaging Astroport' };
                },
            },
            SUCCESS: {
                step: 1,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(new bignumber_js_1.BigNumber(swap.toAmount), swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            FAILED: {
                step: 1,
                label: 'Swap Failed',
                filterStatus: 'REFUNDED',
                notification() {
                    return { message: 'Swap failed' };
                },
            },
        };
    }
    _txTypes() {
        return {
            SWAP: 'SWAP',
        };
    }
    _fromTxType() {
        return this._txTypes().SWAP;
    }
    _toTxType() {
        return null;
    }
    _timelineDiagramSteps() {
        return ['SWAP'];
    }
    _totalSteps() {
        return 2;
    }
}
exports.AstroportSwapProvider = AstroportSwapProvider;
//# sourceMappingURL=AstroportSwapProvider.js.map