"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapSwapProvider = void 0;
const tslib_1 = require("tslib");
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const sdk_core_1 = require("@uniswap/sdk-core");
const ERC20_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/ERC20.json"));
const IUniswapV2Pair_json_1 = tslib_1.__importDefault(require("@uniswap/v2-core/build/IUniswapV2Pair.json"));
const IUniswapV2Router02_json_1 = tslib_1.__importDefault(require("@uniswap/v2-periphery/build/IUniswapV2Router02.json"));
const v2_sdk_1 = require("@uniswap/v2-sdk");
const bignumber_js_1 = tslib_1.__importStar(require("bignumber.js"));
const ethers = tslib_1.__importStar(require("ethers"));
const jsbi_1 = tslib_1.__importDefault(require("jsbi"));
const uuid_1 = require("uuid");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const utils_1 = require("../../store/actions/performNextAction/utils");
const asset_1 = require("../../utils/asset");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const error_parser_1 = require("@liquality/error-parser");
const SWAP_DEADLINE = 30 * 60;
class UniswapSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this._apiCache = {};
    }
    getClient(network, walletId, asset, accountId) {
        return super.getClient(network, walletId, asset, accountId);
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getApi(network, asset) {
        const chainId = this.getChainId(asset, network);
        if (chainId in this._apiCache) {
            return this._apiCache[chainId];
        }
        else {
            const api = new ethers.providers.InfuraProvider(chainId, build_config_1.default.infuraApiKey);
            this._apiCache[chainId] = api;
            return api;
        }
    }
    getUniswapToken(chainId, asset) {
        if (asset === 'ETH') {
            return sdk_core_1.WETH9[chainId];
        }
        const assetData = cryptoassets_2.default[asset];
        return new sdk_core_1.Token(chainId, assetData.contractAddress, assetData.decimals, assetData.code, assetData.name);
    }
    getMinimumOutput(outputAmount) {
        const slippageTolerance = new sdk_core_1.Percent('50', '10000');
        const slippageAdjustedAmountOut = new sdk_core_1.Fraction(jsbi_1.default.BigInt(1))
            .add(slippageTolerance)
            .invert()
            .multiply(outputAmount.quotient).quotient;
        return sdk_core_1.CurrencyAmount.fromRawAmount(outputAmount.currency, slippageAdjustedAmountOut);
    }
    getChainId(asset, network) {
        const chainId = cryptoassets_2.default[asset].chain;
        if (chainId !== cryptoassets_1.ChainId.Ethereum) {
            throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Unsupported.Chain);
        }
        const chain = (0, cryptoassets_1.getChain)(network, chainId);
        return Number(chain.network.chainId);
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, asset_1.isChainEvmCompatible)(from, network) || !(0, asset_1.isChainEvmCompatible)(to, network)) {
                return null;
            }
            if (cryptoassets_2.default[from].chain !== cryptoassets_1.ChainId.Ethereum || cryptoassets_2.default[to].chain !== cryptoassets_1.ChainId.Ethereum) {
                return null;
            }
            const chainId = this.getChainId(from, network);
            const tokenA = this.getUniswapToken(chainId, from);
            const tokenB = this.getUniswapToken(chainId, to);
            const pairAddress = v2_sdk_1.Pair.getAddress(tokenA, tokenB);
            const api = this.getApi(network, from);
            const contract = new ethers.Contract(pairAddress, IUniswapV2Pair_json_1.default.abi, api);
            const reserves = yield contract.getReserves();
            const token0Address = yield contract.token0();
            const token1Address = yield contract.token1();
            const token0 = [tokenA, tokenB].find((token) => token.address === token0Address);
            const token1 = [tokenA, tokenB].find((token) => token.address === token1Address);
            if (!token0 || !token1) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.FailedAssert.UniswapTokenCalculation);
            }
            const pair = new v2_sdk_1.Pair(sdk_core_1.CurrencyAmount.fromRawAmount(token0, reserves.reserve0.toString()), sdk_core_1.CurrencyAmount.fromRawAmount(token1, reserves.reserve1.toString()));
            const route = new v2_sdk_1.Route([pair], tokenA, tokenB);
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount));
            const tokenAmount = sdk_core_1.CurrencyAmount.fromRawAmount(tokenA, fromAmountInUnit.toFixed());
            const trade = new v2_sdk_1.Trade(route, tokenAmount, sdk_core_1.TradeType.EXACT_INPUT);
            const toAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[to], new bignumber_js_1.default(trade.outputAmount.toExact()));
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: toAmountInUnit.toFixed(),
            };
        });
    }
    requiresApproval({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(0, asset_1.isERC20)(quote.from))
                return false;
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const api = this.getApi(network, quote.from);
            const erc20 = new ethers.Contract(cryptoassets_2.default[quote.from].contractAddress, ERC20_json_1.default.abi, api);
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            const allowance = yield erc20.allowance(fromAddress, this.config.routerAddress);
            const inputAmount = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed());
            if (allowance.gte(inputAmount)) {
                return false;
            }
            return true;
        });
    }
    buildApprovalTx({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const api = this.getApi(network, quote.from);
            const erc20 = new ethers.Contract(cryptoassets_2.default[quote.from].contractAddress, ERC20_json_1.default.abi, api);
            const inputAmount = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed());
            const inputAmountHex = inputAmount.toHexString();
            const encodedData = erc20.interface.encodeFunctionData('approve', [this.config.routerAddress, inputAmountHex]);
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            return {
                from: fromAddress,
                to: cryptoassets_2.default[quote.from].contractAddress,
                value: new bignumber_js_1.BigNumber(0),
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
    buildSwapTx({ network, walletId, quote }, supportingFeeOnTransferTokens = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const toChain = cryptoassets_2.default[quote.to].chain;
            const chainId = this.getChainId(quote.from, network);
            const fromToken = this.getUniswapToken(chainId, quote.from);
            const toToken = this.getUniswapToken(chainId, quote.to);
            const outputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(toToken, new bignumber_js_1.default(quote.toAmount).toFixed());
            const minimumOutput = this.getMinimumOutput(outputAmount);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const blockHeight = yield client.chain.getBlockHeight();
            const currentBlock = yield client.chain.getBlockByNumber(blockHeight);
            const path = [fromToken.address, toToken.address];
            const deadline = currentBlock.timestamp + SWAP_DEADLINE;
            const minimumOutputInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[quote.to], new bignumber_js_1.default(minimumOutput.toExact()));
            const inputAmountHex = ethers.BigNumber.from(new bignumber_js_1.default(quote.fromAmount).toFixed()).toHexString();
            const outputAmountHex = ethers.BigNumber.from(minimumOutputInUnit.toFixed()).toHexString();
            const toAddressRaw = yield this.getSwapAddress(network, walletId, quote.to, quote.toAccountId);
            const toAddress = (0, cryptoassets_1.getChain)(network, toChain).formatAddress(toAddressRaw);
            const api = this.getApi(network, quote.to);
            const uniswap = new ethers.Contract(this.config.routerAddress, IUniswapV2Router02_json_1.default.abi, api);
            let encodedData;
            const SWAP_EXACT_TOKEN_FOR_TOKENS = supportingFeeOnTransferTokens
                ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
                : 'swapExactTokensForTokens';
            const SWAP_EXACT_TOKEN_FOR_ETH = supportingFeeOnTransferTokens
                ? 'swapExactTokensForETHSupportingFeeOnTransferTokens'
                : 'swapExactTokensForETH';
            const SWAP_EXACT_ETH_FOR_TOKENS = supportingFeeOnTransferTokens
                ? 'swapExactETHForTokensSupportingFeeOnTransferTokens'
                : 'swapExactETHForTokens';
            if ((0, asset_1.isERC20)(quote.from)) {
                const swapTokensMethod = (0, asset_1.isERC20)(quote.to) ? SWAP_EXACT_TOKEN_FOR_TOKENS : SWAP_EXACT_TOKEN_FOR_ETH;
                encodedData = uniswap.interface.encodeFunctionData(swapTokensMethod, [
                    inputAmountHex,
                    outputAmountHex,
                    path,
                    toAddress,
                    deadline,
                ]);
            }
            else {
                encodedData = uniswap.interface.encodeFunctionData(SWAP_EXACT_ETH_FOR_TOKENS, [
                    outputAmountHex,
                    path,
                    toAddress,
                    deadline,
                ]);
            }
            const value = (0, asset_1.isERC20)(quote.from) ? new bignumber_js_1.BigNumber(0) : new bignumber_js_1.default(quote.fromAmount);
            const fromChain = cryptoassets_2.default[quote.from].chain;
            const fromAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const fromAddress = (0, cryptoassets_1.getChain)(network, fromChain).formatAddress(fromAddressRaw);
            return {
                from: fromAddress,
                to: this.config.routerAddress,
                value,
                data: encodedData,
                fee: quote.fee,
            };
        });
    }
    sendSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let swapTx;
            try {
                swapTx = yield this._sendSwap({ network, walletId, quote });
            }
            catch (e) {
                if ((0, error_parser_1.errorName)(e) === error_parser_1.ERROR_NAMES.ValidationError) {
                    swapTx = yield this._sendSwap({ network, walletId, quote }, true);
                }
                else {
                    throw e;
                }
            }
            return {
                status: 'WAITING_FOR_SWAP_CONFIRMATIONS',
                swapTx,
                swapTxHash: swapTx.hash,
            };
        });
    }
    _sendSwap({ network, walletId, quote }, supportingFeeOnTransferTokens = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const txData = yield this.buildSwapTx({ network, walletId, quote }, supportingFeeOnTransferTokens);
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            yield this.sendLedgerNotification(quote.fromAccountId, 'Signing required to complete the swap.');
            return yield client.wallet.sendTransaction(txData);
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
    estimateFees({ network, walletId, asset, txType, quote, feePrices }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType !== this.fromTxType) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.TransactionType(txType));
            }
            const nativeAsset = (0, cryptoassets_1.getChain)(network, cryptoassets_2.default[asset].chain).nativeAsset;
            const account = this.getAccount(quote.fromAccountId);
            if (!account) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Account(quote.fromAccountId));
            }
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
            const swapTx = yield this.buildSwapTx({ network, walletId, quote });
            const rawSwapTx = {
                from: swapTx.from,
                to: swapTx.to,
                data: swapTx.data,
                value: '0x' + swapTx.value.toString(16),
            };
            try {
                gasLimit += (yield client.chain.getProvider().estimateGas(rawSwapTx)).toNumber();
            }
            catch (_a) {
                gasLimit += 350000;
            }
            const fees = {};
            for (const feePrice of feePrices) {
                const gasPrice = new bignumber_js_1.default(feePrice).times(1e9);
                const fee = new bignumber_js_1.default(gasLimit).times(1.1).times(gasPrice);
                fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset[0].code], fee);
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
                        message: 'Engaging the unicorn',
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
exports.UniswapSwapProvider = UniswapSwapProvider;
//# sourceMappingURL=UniswapSwapProvider.js.map