"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopSwapProvider = exports.HopTxTypes = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@chainify/utils");
const sdk_1 = require("@hop-protocol/sdk");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../../utils/isTransactionNotFoundError");
const bignumber_js_1 = tslib_1.__importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const urql_1 = require("urql");
const uuid_1 = require("uuid");
const utils_2 = require("../../store/actions/performNextAction/utils");
const asset_1 = require("../../utils/asset");
const coinFormatter_1 = require("../../utils/coinFormatter");
const cryptoassets_2 = tslib_1.__importDefault(require("../../utils/cryptoassets"));
const SwapProvider_1 = require("../SwapProvider");
const queries_1 = require("./queries");
const error_parser_1 = require("@liquality/error-parser");
var HopTxTypes;
(function (HopTxTypes) {
    HopTxTypes["SWAP"] = "SWAP";
})(HopTxTypes = exports.HopTxTypes || (exports.HopTxTypes = {}));
class HopSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
        this.graphqlURLs = {
            url: this.config.graphqlBaseURL,
            ethereum: 'hop-mainnet',
            xdai: 'hop-xdai',
            arbitrum: 'hop-arbitrum',
            polygon: 'hop-polygon',
            optimism: 'hop-optimism',
        };
    }
    getSupportedPairs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    gasLimit(networkName) {
        const networkToGasLimit = {
            arbitrum: {
                send: 9000000,
                approve: 1000000,
            },
            polygon: {
                send: 300000,
                approve: 300000,
            },
            ethereum: {
                send: 300000,
                approve: 300000,
            },
            optimism: {
                send: 345000,
                sendL1: 6500,
                approve: 65000,
                approveL1: 5600,
            },
        };
        return networkToGasLimit[networkName];
    }
    getChain(chainName) {
        const slugToChain = {
            [sdk_1.Hop.Chain.Ethereum.slug]: sdk_1.Hop.Chain.Ethereum,
            [sdk_1.Hop.Chain.Arbitrum.slug]: sdk_1.Hop.Chain.Arbitrum,
            [sdk_1.Hop.Chain.Gnosis.slug]: sdk_1.Hop.Chain.Gnosis,
            [sdk_1.Hop.Chain.Optimism.slug]: sdk_1.Hop.Chain.Optimism,
            [sdk_1.Hop.Chain.Polygon.slug]: sdk_1.Hop.Chain.Polygon,
        };
        return slugToChain[chainName];
    }
    _getHop(network, signer = undefined) {
        return new sdk_1.Hop(network === 'mainnet' ? 'mainnet' : 'kovan', signer);
    }
    _getAllTokens(hop) {
        const bridge = hop.bridge('ETH');
        const token = bridge.getCanonicalToken(sdk_1.Chain.Ethereum);
        return token.addresses;
    }
    _getClient(network, walletId, from, fromAccountId) {
        return this.getClient(network, walletId, from, fromAccountId);
    }
    _getSigner(network, walletId, from, fromAccountId, provider) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this._getClient(network, walletId, from, fromAccountId);
            const privKey = yield client.wallet.exportPrivateKey();
            return new ethers_1.Wallet(privKey, provider);
        });
    }
    _getBridgeWithSigner(hopAsset, hopChainFrom, network, walletId, from, fromAccountId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const chainFrom = this.getChain(hopChainFrom.slug);
                const client = this._getClient(network, walletId, from, fromAccountId);
                const privKey = yield client.wallet.exportPrivateKey();
                const hop = this._getHop(network);
                const signer = new ethers_1.Wallet(privKey, hop.getChainProvider(chainFrom));
                const bridge = hop.connect(signer).bridge(hopAsset);
                return bridge;
            }
            catch (err) {
                console.warn('Hop network or Hop assets is invalid');
                throw err;
            }
        });
    }
    _findAsset(asset, chain, tokens, tokenName) {
        var _a, _b;
        if (asset.type === 'native') {
            if (asset.code === tokenName || asset.matchingAsset === tokenName) {
                return tokenName;
            }
        }
        else {
            if (asset.contractAddress &&
                tokens[chain] &&
                (((_a = tokens[chain].l1CanonicalToken) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === asset.contractAddress.toLowerCase() ||
                    ((_b = tokens[chain].l2CanonicalToken) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === asset.contractAddress.toLowerCase())) {
                return tokenName;
            }
        }
    }
    _getSendInfo(assetFrom, assetTo, hop) {
        if (!assetFrom || !assetTo)
            return null;
        const _chainFrom = this.getChain(assetFrom.chain);
        const _chainTo = this.getChain(assetTo.chain);
        if (!_chainFrom || !_chainTo)
            return null;
        const availableTokens = this._getAllTokens(hop);
        let _from, _to;
        for (const token in availableTokens) {
            if (!_from)
                _from = this._findAsset(assetFrom, _chainFrom.slug, availableTokens[token], token);
            if (!_to)
                _to = this._findAsset(assetTo, _chainTo.slug, availableTokens[token], token);
        }
        if (!_from || !_to || _from !== _to)
            return null;
        const supportedAssetsFrom = hop.getSupportedAssetsForChain(_chainFrom.slug);
        const supportedAssetsTo = hop.getSupportedAssetsForChain(_chainTo.slug);
        if (!supportedAssetsFrom[_from] || !supportedAssetsTo[_to])
            return null;
        return { bridgeAsset: _from, chainFrom: _chainFrom, chainTo: _chainTo };
    }
    getQuote({ network, from, to, amount }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (amount <= new bignumber_js_1.default(0))
                return null;
            const assetFrom = cryptoassets_2.default[from];
            const assetTo = cryptoassets_2.default[to];
            const fromAmountInUnit = (0, cryptoassets_1.currencyToUnit)(cryptoassets_2.default[from], new bignumber_js_1.default(amount));
            const hop = this._getHop(network);
            const info = this._getSendInfo(assetFrom, assetTo, hop);
            if (!info)
                return null;
            const { bridgeAsset, chainFrom, chainTo } = info;
            const bridge = hop.bridge(bridgeAsset);
            const sendData = yield bridge.getSendData(fromAmountInUnit.toString(), chainFrom, chainTo);
            if (!sendData)
                return null;
            return {
                fromAmount: fromAmountInUnit.toFixed(),
                toAmount: new bignumber_js_1.default(sendData.amountOut.toString()).toFixed(),
                hopAsset: bridgeAsset,
                hopChainFrom: chainFrom,
                hopChainTo: chainTo,
                receiveFee: new bignumber_js_1.default(sendData.adjustedBonderFee.toString())
                    .plus(new bignumber_js_1.default(sendData.adjustedDestinationTxFee.toString()))
                    .toString(),
            };
        });
    }
    _formatFee(fee, networkName, type) {
        if (typeof fee === 'number') {
            return {
                gasPrice: '0x' + new bignumber_js_1.default(fee).times(1e9).decimalPlaces(0).toString(16),
                gasLimit: this.gasLimit(networkName)[type],
            };
        }
        return {
            maxFeePerGas: '0x' + new bignumber_js_1.default(fee.maxFeePerGas).times(1e9).decimalPlaces(0).toString(16),
            maxPriorityFeePerGas: '0x' + new bignumber_js_1.default(fee.maxPriorityFeePerGas).times(1e9).decimalPlaces(0).toString(16),
            gasLimit: this.gasLimit(networkName)[type],
        };
    }
    _approveToken(bridge, chainFrom, fromAmount, signer, fee) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const txData = yield bridge.populateSendApprovalTx(fromAmount, chainFrom);
            const feeFormated = this._formatFee(fee, chainFrom.name.toLowerCase(), 'approve');
            const approveTx = yield signer.sendTransaction(Object.assign(Object.assign({}, txData), feeFormated));
            return {
                status: 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                approveTx,
                approveTxHash: approveTx === null || approveTx === void 0 ? void 0 : approveTx.hash,
            };
        });
    }
    sendSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { hopAsset, hopChainFrom, hopChainTo, from, fromAccountId, fromAmount } = quote;
            const chainFrom = this.getChain(hopChainFrom.slug);
            const chainTo = this.getChain(hopChainTo.slug);
            const bridge = yield this._getBridgeWithSigner(hopAsset, hopChainFrom, network, walletId, from, fromAccountId);
            const hop = this._getHop(network);
            const signer = yield this._getSigner(network, walletId, from, fromAccountId, hop === null || hop === void 0 ? void 0 : hop.getChainProvider(chainFrom));
            const txData = yield (bridge === null || bridge === void 0 ? void 0 : bridge.populateSendTx(fromAmount, chainFrom, chainTo));
            const feeFormated = this._formatFee(quote.fee, chainFrom.name.toLowerCase(), 'send');
            const fromFundTx = yield signer.sendTransaction(Object.assign(Object.assign({}, txData), feeFormated));
            return {
                status: 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS',
                fromFundTx,
                fromFundHash: fromFundTx.hash,
            };
        });
    }
    newSwap({ network, walletId, quote }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { hopAsset, hopChainFrom, hopChainTo, from, fromAccountId, fromAmount } = quote;
            const chainFrom = this.getChain(hopChainFrom.slug);
            const chainTo = this.getChain(hopChainTo.slug);
            const bridge = yield this._getBridgeWithSigner(hopAsset, hopChainFrom, network, walletId, from, fromAccountId);
            const hop = this._getHop(network);
            const signer = yield this._getSigner(network, walletId, from, fromAccountId, hop === null || hop === void 0 ? void 0 : hop.getChainProvider(chainFrom));
            let updates;
            if ((0, asset_1.isERC20)(quote.from)) {
                updates = yield this._approveToken(bridge, chainFrom, fromAmount, signer, quote.fee);
            }
            else {
                updates = {
                    endTime: Date.now(),
                    status: 'APPROVE_CONFIRMED',
                };
            }
            return Object.assign({ id: (0, uuid_1.v4)(), fee: quote.fee, slippage: 50, hopAsset: hopAsset, hopChainFrom: chainFrom, hopChainTo: chainTo }, updates);
        });
    }
    estimateFees({ asset, txType, quote, network, feePrices, feePricesL1, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (txType !== this.fromTxType) {
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.Invalid.TransactionType(txType));
            }
            const chainId = cryptoassets_2.default[asset].chain;
            const nativeAsset = (0, cryptoassets_1.getNativeAssetCode)(network, cryptoassets_2.default[asset].chain);
            const quoteFromStr = quote.hopChainFrom.slug || '';
            const limits = this.gasLimit(quoteFromStr);
            let gasLimit = limits.send;
            if ((0, asset_1.isERC20)(quote.from)) {
                gasLimit += limits.approve;
            }
            const isMultiLayered = (0, cryptoassets_1.getChain)(network, chainId).isMultiLayered;
            if (isMultiLayered && (!feePricesL1 || !limits.sendL1 || !limits.approveL1)) {
                if (!feePricesL1)
                    throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.FeePrice);
                throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.Chain.L1GasLimit);
            }
            let gasLimitL1 = 0;
            if (isMultiLayered) {
                gasLimitL1 = limits.sendL1;
                if ((0, asset_1.isERC20)(quote.from)) {
                    gasLimitL1 += limits.approveL1;
                }
            }
            const fees = {};
            feePrices.forEach((feePrice, index) => {
                const gasPrice = new bignumber_js_1.default(feePrice).times(1e9);
                let fee = new bignumber_js_1.default(gasLimit).times(1.1).times(gasPrice);
                if (isMultiLayered) {
                    const gasPriceL1 = new bignumber_js_1.default(feePricesL1[index]).times(1e9);
                    fee = fee.plus(new bignumber_js_1.default(gasLimitL1).times(1.1).times(gasPriceL1));
                }
                fees[feePrice] = (0, cryptoassets_1.unitToCurrency)(cryptoassets_2.default[nativeAsset], fee);
            });
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
            const client = this._getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.approveTxHash);
                if (tx && tx.confirmations && tx.confirmations >= 1) {
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
    waitForSendSwapConfirmations({ swap, network, walletId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = this._getClient(network, walletId, swap.from, swap.fromAccountId);
            try {
                const tx = yield client.chain.getTransactionByHash(swap.fromFundHash);
                const chainId = swap.hopChainFrom.slug.toString();
                if (tx && tx.confirmations && tx.confirmations >= (0, cryptoassets_1.getChain)(network, chainId).safeConfirmations) {
                    this.updateBalances(network, walletId, [swap.fromAccountId]);
                    return {
                        endTime: Date.now(),
                        status: tx.status === 'SUCCESS' || Number(tx.status) === 1 ? 'WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS' : 'FAILED',
                    };
                }
            }
            catch (e) {
                if (e.name === 'TxNotFoundError')
                    console.warn(e);
                else
                    throw e;
            }
        });
    }
    waitForRecieveSwapConfirmations({ swap, network, walletId }) {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { hopChainFrom, hopChainTo, fromFundHash, from, to, fromAccountId, toAccountId } = swap;
            const client = this._getClient(network, walletId, from, fromAccountId);
            const privKey = yield client.wallet.exportPrivateKey();
            const signer = new ethers_1.Wallet(privKey);
            const chainFrom = this.getChain(hopChainFrom.slug);
            const chainTo = this.getChain(hopChainTo.slug);
            const isFromL1Source = chainFrom.isL1 && !chainTo.isL1;
            try {
                let clientGQL;
                let transferId = '';
                if (!isFromL1Source) {
                    clientGQL = (0, urql_1.createClient)({
                        url: `${this.graphqlURLs.url}/${this.graphqlURLs[chainFrom.slug]}`,
                    });
                    const { data } = yield clientGQL.query((0, queries_1.getTransferIdByTxHash)((0, utils_1.ensure0x)(fromFundHash))).toPromise();
                    transferId = (_b = (_a = data.transferSents) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.transferId;
                    if (!transferId)
                        return;
                }
                clientGQL = (0, urql_1.createClient)({
                    url: `${this.graphqlURLs.url}/${this.graphqlURLs[chainTo.slug]}`,
                });
                const { data } = yield clientGQL
                    .query((0, queries_1.getDestinationTxGQL)(transferId, signer.address.toLowerCase(), isFromL1Source))
                    .toPromise();
                const methodName = !isFromL1Source ? 'withdrawalBondeds' : 'transferFromL1Completeds';
                const destinationTxHash = (_d = (_c = data[methodName]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.transactionHash;
                if (!destinationTxHash)
                    return;
                const client = this._getClient(network, walletId, to, toAccountId);
                const tx = yield client.chain.getTransactionByHash((_f = (_e = data[methodName]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.transactionHash);
                if (tx && tx.confirmations && tx.confirmations >= 1) {
                    const isSuccessful = tx.status === 'SUCCESS' || Number(tx.status) === 1;
                    if (isSuccessful) {
                        this.updateBalances(network, walletId, [swap.toAccountId]);
                    }
                    return {
                        receiveTxHash: tx.hash,
                        receiveTx: tx,
                        endTime: Date.now(),
                        status: isSuccessful ? 'SUCCESS' : 'FAILED',
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
            let updates;
            switch (swap.status) {
                case 'WAITING_FOR_APPROVE_CONFIRMATIONS':
                    updates = yield (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForApproveConfirmations({ swap, network, walletId }); }));
                    break;
                case 'APPROVE_CONFIRMED':
                    updates = yield (0, utils_2.withLock)(store, { item: swap, network, walletId, asset: swap.from }, () => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.sendSwap({ quote: swap, network, walletId }); }));
                    break;
                case 'WAITING_FOR_SEND_SWAP_CONFIRMATIONS':
                    updates = yield (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForSendSwapConfirmations({ swap, network, walletId }); }));
                    break;
                case 'WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS':
                    updates = yield (0, utils_2.withInterval)(() => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.waitForRecieveSwapConfirmations({ swap, network, walletId }); }));
                    break;
            }
            return updates;
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
            WAITING_FOR_SEND_SWAP_CONFIRMATIONS: {
                step: 1,
                label: 'Swapping {from}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging the hop.exchange',
                    };
                },
            },
            WAITING_FOR_RECEIVE_SWAP_CONFIRMATIONS: {
                step: 2,
                label: 'Swapping {to}',
                filterStatus: 'PENDING',
                notification() {
                    return {
                        message: 'Engaging the hop.exchange',
                    };
                },
            },
            SUCCESS: {
                step: 3,
                label: 'Completed',
                filterStatus: 'COMPLETED',
                notification(swap) {
                    return {
                        message: `Swap completed, ${(0, coinFormatter_1.prettyBalance)(swap.toAmount, swap.to)} ${swap.to} ready to use`,
                    };
                },
            },
            FAILED: {
                step: 3,
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
    _totalSteps() {
        return 4;
    }
    _timelineDiagramSteps() {
        return ['APPROVE', 'INITIATION', 'RECEIVE'];
    }
}
exports.HopSwapProvider = HopSwapProvider;
//# sourceMappingURL=HopSwapProvider.js.map