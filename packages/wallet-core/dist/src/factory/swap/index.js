"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapProvider = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const types_1 = require("../../store/types");
const AstroportSwapProvider_1 = require("../../swaps/astroport/AstroportSwapProvider");
const FastBTCDepositSwapProvider_1 = require("../../swaps/fastbtc/FastBTCDepositSwapProvider");
const FastBTCWithdrawSwapProvider_1 = require("../../swaps/fastbtc/FastBTCWithdrawSwapProvider");
const HopSwapProvider_1 = require("../../swaps/hop/HopSwapProvider");
const JupiterSwapProvider_1 = require("../../swaps/jupiter/JupiterSwapProvider");
const LifiSwapProvider_1 = require("../../swaps/lifi/LifiSwapProvider");
const LiqualitySwapProvider_1 = require("../../swaps/liquality/LiqualitySwapProvider");
const LiqualityBoostERC20toNative_1 = require("../../swaps/liqualityboost/liqualityBoostERC20toNative/LiqualityBoostERC20toNative");
const LiqualityBoostNativeToERC20_1 = require("../../swaps/liqualityboost/liqualityBoostNativeToERC20/LiqualityBoostNativeToERC20");
const OneinchSwapProvider_1 = require("../../swaps/oneinch/OneinchSwapProvider");
const SovrynSwapProvider_1 = require("../../swaps/sovryn/SovrynSwapProvider");
const ThorchainSwapProvider_1 = require("../../swaps/thorchain/ThorchainSwapProvider");
const UniswapSwapProvider_1 = require("../../swaps/uniswap/UniswapSwapProvider");
const DeBridgeSwapProvider_1 = require("../../swaps/debridge/DeBridgeSwapProvider");
const TeleSwapSwapProvider_1 = require("../../swaps/teleswap/TeleSwapSwapProvider");
const providers = {
    [types_1.SwapProviderType.Liquality]: LiqualitySwapProvider_1.LiqualitySwapProvider,
    [types_1.SwapProviderType.UniswapV2]: UniswapSwapProvider_1.UniswapSwapProvider,
    [types_1.SwapProviderType.OneInch]: OneinchSwapProvider_1.OneinchSwapProvider,
    [types_1.SwapProviderType.Thorchain]: ThorchainSwapProvider_1.ThorchainSwapProvider,
    [types_1.SwapProviderType.LiqualityBoostNativeToERC20]: LiqualityBoostNativeToERC20_1.LiqualityBoostNativeToERC20,
    [types_1.SwapProviderType.LiqualityBoostERC20ToNative]: LiqualityBoostERC20toNative_1.LiqualityBoostERC20toNative,
    [types_1.SwapProviderType.FastBTCDeposit]: FastBTCDepositSwapProvider_1.FastBTCDepositSwapProvider,
    [types_1.SwapProviderType.FastBTCWithdraw]: FastBTCWithdrawSwapProvider_1.FastBTCWithdrawSwapProvider,
    [types_1.SwapProviderType.Sovryn]: SovrynSwapProvider_1.SovrynSwapProvider,
    [types_1.SwapProviderType.Astroport]: AstroportSwapProvider_1.AstroportSwapProvider,
    [types_1.SwapProviderType.Hop]: HopSwapProvider_1.HopSwapProvider,
    [types_1.SwapProviderType.Jupiter]: JupiterSwapProvider_1.JupiterSwapProvider,
    [types_1.SwapProviderType.DeBridge]: DeBridgeSwapProvider_1.DeBridgeSwapProvider,
    [types_1.SwapProviderType.LiFi]: LifiSwapProvider_1.LifiSwapProvider,
    [types_1.SwapProviderType.TeleSwap]: TeleSwapSwapProvider_1.TeleSwapSwapProvider,
};
const createSwapProvider = (network, providerId) => {
    const swapProviderConfig = build_config_1.default.swapProviders[network][providerId];
    if (!swapProviderConfig) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.Config(providerId, network));
    }
    const SwapProvider = providers[swapProviderConfig.type];
    return new SwapProvider(Object.assign(Object.assign({}, swapProviderConfig), { providerId }));
};
const mapLegacyProvidersToSupported = {
    oneinchV3: 'oneinchV4',
    liqualityBoost: 'liqualityBoostNativeToERC20',
};
const swapProviderCache = {};
function getSwapProvider(network, providerId) {
    const supportedProviderId = mapLegacyProvidersToSupported[providerId]
        ? mapLegacyProvidersToSupported[providerId]
        : providerId;
    const cacheKey = [network, supportedProviderId].join('-');
    const cachedSwapProvider = swapProviderCache[cacheKey];
    if (cachedSwapProvider)
        return cachedSwapProvider;
    const swapProvider = createSwapProvider(network, supportedProviderId);
    swapProviderCache[cacheKey] = swapProvider;
    return swapProvider;
}
exports.getSwapProvider = getSwapProvider;
//# sourceMappingURL=index.js.map