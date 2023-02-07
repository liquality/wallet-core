"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmSwapProvider = void 0;
const tslib_1 = require("tslib");
const evm_1 = require("@chainify/evm");
const utils_1 = require("@chainify/evm/dist/lib/utils");
const types_1 = require("@chainify/types");
const cryptoassets_1 = require("@liquality/cryptoassets");
const isTransactionNotFoundError_1 = require("../utils/isTransactionNotFoundError");
const ethers = tslib_1.__importStar(require("ethers"));
const chainify_1 = require("../utils/chainify");
const types_2 = require("../store/types");
const SwapProvider_1 = require("./SwapProvider");
class EvmSwapProvider extends SwapProvider_1.SwapProvider {
    constructor(config) {
        super(config);
    }
    requiresApproval(swapRequest, approvalAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { quote, network, walletId } = swapRequest;
            const fromAsset = (0, chainify_1.assetsAdapter)(quote.from)[0];
            if (!fromAsset.contractAddress) {
                return false;
            }
            const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
            const signer = client.wallet.getSigner();
            const tokenContract = evm_1.Typechain.ERC20__factory.connect(fromAsset.contractAddress, signer);
            const userAddressRaw = yield this.getSwapAddress(network, walletId, quote.from, quote.fromAccountId);
            const userAddress = (0, cryptoassets_1.getChain)(network, fromAsset.chain).formatAddress(userAddressRaw);
            const _approvalAddress = approvalAddress !== null && approvalAddress !== void 0 ? approvalAddress : this.config.routerAddress;
            const allowance = yield tokenContract.allowance(userAddress.toLowerCase(), _approvalAddress);
            if (allowance.gte(quote.fromAmount)) {
                return false;
            }
            return true;
        });
    }
    buildApprovalTx(swapRequest, approveMax = true, approvalAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approveRequired = yield this.requiresApproval(swapRequest, approvalAddress);
            if (approveRequired) {
                const { quote, network, walletId } = swapRequest;
                const fromAsset = (0, chainify_1.assetsAdapter)(quote.from)[0];
                const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
                const signer = client.wallet.getSigner();
                const tokenContract = evm_1.Typechain.ERC20__factory.connect(String(fromAsset.contractAddress), signer);
                const approveAmount = approveMax ? ethers.constants.MaxUint256 : ethers.BigNumber.from(quote.fromAmount);
                const _approvalAddress = approvalAddress !== null && approvalAddress !== void 0 ? approvalAddress : this.config.routerAddress;
                return tokenContract.populateTransaction.approve(_approvalAddress, approveAmount);
            }
        });
    }
    approve(swapRequest, approveMax = true, approvalAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const approveTxData = yield this.buildApprovalTx(swapRequest, approveMax, approvalAddress);
            const { quote, network, walletId } = swapRequest;
            const isLSP = swapRequest.quote.provider === types_2.SwapProviderType.Liquality;
            if (approveTxData) {
                const client = this.getClient(network, walletId, quote.from, quote.fromAccountId);
                const approveTx = yield client.wallet.sendTransaction((0, utils_1.toEthereumTxRequest)(approveTxData, quote.fee));
                return {
                    status: isLSP ? 'WAITING_FOR_APPROVE_CONFIRMATIONS_LSP' : 'WAITING_FOR_APPROVE_CONFIRMATIONS',
                    approveTx,
                    approveTxHash: approveTx.hash,
                };
            }
            else {
                return {
                    status: isLSP ? 'APPROVE_CONFIRMED_LSP' : 'APPROVE_CONFIRMED',
                };
            }
        });
    }
    waitForApproveConfirmations(swapRequest) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { swap, network, walletId } = swapRequest;
            const client = this.getClient(network, walletId, swap.from, swap.fromAccountId);
            const isLSP = swapRequest.swap.provider === types_2.SwapProviderType.Liquality;
            try {
                const tx = yield client.chain.getTransactionByHash(swap.approveTxHash);
                if (tx.status === types_1.TxStatus.Success) {
                    return {
                        endTime: Date.now(),
                        status: isLSP ? 'APPROVE_CONFIRMED_LSP' : 'APPROVE_CONFIRMED',
                    };
                }
            }
            catch (e) {
                if ((0, isTransactionNotFoundError_1.isTransactionNotFoundError)(e))
                    console.warn(e);
                else {
                    throw e;
                }
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
        };
    }
}
exports.EvmSwapProvider = EvmSwapProvider;
//# sourceMappingURL=EvmSwapProvider.js.map