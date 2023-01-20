"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SovrynSwapProvider = void 0;
const tslib_1 = require("tslib");
const abiSovrynSwapNetwork_json_1 = tslib_1.__importDefault(require("@blobfishkate/sovryncontracts/abi/abiSovrynSwapNetwork.json"));
const abiWrapperProxy_new_json_1 = tslib_1.__importDefault(require("@blobfishkate/sovryncontracts/abi/abiWrapperProxy_new.json"));
const contracts_mainnet_json_1 = tslib_1.__importDefault(require("@blobfishkate/sovryncontracts/contracts-mainnet.json"));
const contracts_testnet_json_1 = tslib_1.__importDefault(require("@blobfishkate/sovryncontracts/contracts-testnet.json"));
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const ERC20_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/ERC20.json"));
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const ethers = tslib_1.__importStar(require("ethers"));
const uuid_1 = require("uuid");
const utils_1 = require("../../store/actions/performNextAction/utils");
const asset_1 = require("../../utils/asset");
const chainify_1 = require("../../utils/chainify");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const error_parser_1 = require("@liquality/error-parser");
const wrappedRbtcAddress = {
    mainnet: contracts_mainnet_json_1.default.BTC_token,
    testnet: contracts_testnet_json_1.default.BTC_token,
};
class SovrynSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this._apiCache = {};
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromInfo = cryptoassets_2.default[from];
            const toInfo = cryptoassets_2.default[to];
            if (fromInfo.chain !== cryptoassets_1.ChainId.Rootstock || toInfo.chain !== cryptoassets_1.ChainId.Rootstock || amount.lte(0)) {
                return null;
            }
            const fromTokenAddress = (fromInfo.contractAddress || wrappedRbtcAddress[network]).toLowerCase();
            const toTokenAddress = (toInfo.contractAddress || wrappedRbtcAddress[network]).toLowerCase();
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(fromInfo, new bignumber_js_1.default(amount)).toFixed();
            const ssnContract = new ethers.Contract(this.config.routerAddress.toLowerCase(), abiSovrynSwapNetwork_json_1.default, this._getApi(network, from));
            const path = yield ssnContract.conversionPath(fromTokenAddress, toTokenAddress);
            const rate = yield ssnContract.rateByPath(path, fromAmountInUnit);
            return {
                fromAmount: fromAmountInUnit,
                toAmount: rate.toString(),
                path: path,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approvalRequired = (0, asset_1.isERC20)(quote.from);
            const updates = approvalRequired
                ? yield this.approveTokens({ network, walletId, quote })
                : yield this.sendSwap({ network, walletId, quote });
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: 50 }, updates);
        });
    }
    requiresApproval({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, asset_1.isERC20)(quote.from))
                return false;
            const fromInfo = cryptoassets_2.default[quote.from];
            const toInfo = cryptoassets_2.default[quote.to];
            const erc20 = new ethers.Contract(fromInfo.contractAddress.toLowerCase(), ERC20_json_1.default.abi, this._getApi(network, quote.from));
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromInfo.chain).formatAddress(fromAddressRaw);
            const spender = (fromInfo.type === cryptoassets_1.AssetTypes.native || toInfo.type === cryptoassets_1.AssetTypes.native
                ? this.config.routerAddressRBTC
                : this.config.routerAddress).toLowerCase();
            const allowance = yield erc20.allowance(fromAddress.toLowerCase(), spender);
            const inputAmount = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed());
            if (allowance.gte(inputAmount)) {
                return false;
            }
            return true;
        });
    }
    buildApprovalTx({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromInfo = (0, chainify_1.assetsAdapter)(quote.from)[0];
            const toInfo = cryptoassets_2.default[quote.to];
            const erc20 = new ethers.Contract(String(fromInfo.contractAddress), ERC20_json_1.default.abi, this._getApi(network, quote.from));
            const inputAmount = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed());
            const inputAmountHex = inputAmount.toHexString();
            const spender = (fromInfo.type === cryptoassets_1.AssetTypes.native || toInfo.type === cryptoassets_1.AssetTypes.native
                ? this.config.routerAddressRBTC
                : this.config.routerAddress).toLowerCase();
            const encodedData = erc20.interface.encodeFunctionData('approve', [spender, inputAmountHex]);
            const fromChain = fromInfo.chain;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            return {
                from: fromAddress,
                to: String(fromInfo.contractAddress),
                value: new bignumber_js_1.default(0),
                data: encodedData,
                fee: quote.fee,
            };
        });
    }
    approveTokens({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const requiresApproval = yield this.requiresApproval({
                network,
                walletId,
                quote,
            });
            if (!requiresApproval) {
                return {
                    status: 'APPROVE_CONFIRMED',
                };
            }
            const txData = yield this.buildApprovalTx({ network, walletId, quote });
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const approveTx = yield client.wallet.sendTransaction(txData);
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTx,
                approveTxHash: approveTx.hash,
            };
        });
    }
    buildSwapTx({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fromInfo = cryptoassets_2.default[quote.from];
            const toInfo = cryptoassets_2.default[quote.to];
            const api = this._getApi(network, quote.from);
            const conversionPath = quote.path;
            const toAmountWithSlippage = this._calculateSlippage(quote.toAmount).toString();
            let encodedData;
            let routerAddress;
            if (fromInfo.type === cryptoassets_1.AssetTypes.native || toInfo.type === cryptoassets_1.AssetTypes.native) {
                routerAddress = this.config.routerAddressRBTC.toLowerCase();
                const wpContract = new ethers.Contract(routerAddress, abiWrapperProxy_new_json_1.default, api);
                encodedData = wpContract.interface.encodeFunctionData('convertByPath', [
                    conversionPath,
                    quote.fromAmount,
                    toAmountWithSlippage,
                ]);
            }
            else {
                routerAddress = this.config.routerAddress.toLowerCase();
                const ssnContract = new ethers.Contract(routerAddress, abiSovrynSwapNetwork_json_1.default, api);
                encodedData = ssnContract.interface.encodeFunctionData('convertByPath', [
                    conversionPath,
                    quote.fromAmount,
                    toAmountWithSlippage,
                    '0x0000000000000000000000000000000000000000',
                    '0x0000000000000000000000000000000000000000',
                    0,
                ]);
            }
            const value = (0, asset_1.isERC20)(quote.from) ? new bignumber_js_1.default(0) : new bignumber_js_1.default(quote.fromAmount);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromInfo.chain).formatAddress(fromAddressRaw);
            return {
                from: fromAddress,
                to: routerAddress,
                value,
                data: encodedData,
                fee: quote.fee,
            };
        });
    }
    sendSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const txData = yield this.buildSwapTx({ network, walletId, quote });
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            const swapTx = yield client.wallet.sendTransaction(txData);
            return {
                status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
                swapTx,
                swapTxHash: swapTx.hash,
            };
        });
    }
    estimateFees({ network, walletId, asset, txType, quote, feePrices, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType !== this.fromTxType) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.TransactionType(txType));
            }
            const nativeAsset = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[asset].chain).nativeAsset[0].code;
            const account = this.getAccount(quote.fromAccountId);
            if (!account)
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Account(quote.fromAccountId));
            const client = this.getClient(network, walletId, quote.from, account.id);
            let gasLimit = 0;
            if (yield this.requiresApproval({ network, walletId, quote })) {
                const approvalTx = yield this.buildApprovalTx({
                    network,
                    walletId,
                    quote,
                });
                const rawApprovalTx = {
                    from: approvalTx.from,
                    to: approvalTx.to,
                    data: approvalTx.data,
                    value: '0x' + approvalTx.value.toString(16),
                };
                gasLimit += (yield client.chain.getProvider().estimateGas(rawApprovalTx)).toNumber();
            }
            gasLimit += 750000;
            const fees = {};
            for (const feePrice of feePrices) {
                const gasPrice = new bignumber_js_1.default(feePrice).times(1e9);
                const fee = new bignumber_js_1.default(gasLimit).times(1.1).times(gasPrice);
                fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset], fee);
            }
            return fees;
        });
    }
    getMin(_quoteRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new bignumber_js_1.default(0);
        });
    }
    waitForApproveConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.approveTxHash);
                if (tx && tx.confirmations && tx.confirmations > 0) {
                    return {
                        endTime: Date.now(),
                        status: 'APPROVE_CONFIRMED',
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
    performNextSwapAction(store, { network, walletId, swap }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                case 'APPROVE_CONFIRMED':
                    return (0, utils_1.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendSwap({ quote: swap, network, walletId }); }));
                case 'WAITING_FOR_SWAP_CONFIRMATIONS':
                    return (0, utils_1.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSwapConfirmations({ swap, network, walletId }); }));
            }
        });
    }
    _getApi(network, asset) {
        const chain = cryptoassets_2.default[asset].chain;
        if (chain !== cryptoassets_1.ChainId.Rootstock) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.Chain);
        }
        const chainId = Number((0, cryptoassets_1.getChain)(network, cryptoassets_1.ChainId.Rootstock).network.chainId);
        if (chainId in this._apiCache) {
            return this._apiCache[chainId];
        }
        else {
            const api = new ethers.providers.StaticJsonRpcProvider(this.config.rpcURL);
            this._apiCache[chainId] = api;
            return api;
        }
    }
    _calculateSlippage(amount) {
        return new bignumber_js_1.default(amount).times(new bignumber_js_1.default(0.995)).toFixed(0);
    }
    _getStatuses() {
        return {
            WAITING_FOR_APPROVE_CONFIRMATIONS: {
                step: 0,
                label: 'Approving {from}',
                filterStatus: 'PENDING',
                notification(swap) {
                    return {
                        message: `Approving ${swap.from}`,
                    };
                },
            },
            APPROVE_CONFIRMED: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
            },
            WAITING_FOR_SWAP_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging Sovryn',
                    };
                },
            },
            SUCCESS: {
                step: 2,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            FAILED: {
                step: 2,
                label: 'Swap Failed',
                filterStatus: 'REFUNDED',
                notification() {
                    return {
                        message: 'Swap failed',
                    };
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
        return ['APPROVE', 'SWAP'];
    }
    _totalSteps() {
        return 3;
    }
}
exports.SovrynSwapProvider = SovrynSwapProvider;
//# sourceMappingURL=SovrynSwapProvider.js.map