"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiqualityLiquidityForAsset = exports.getSwapProviderInfo = exports.getSwapProviderConfig = void 0;
const tslib_1 = require("tslib");
const build_config_1 = tslib_1.__importDefault(require("../build.config"));
const factory_1 = require("../factory");
const types_1 = require("../store/types");
const info_json_1 = tslib_1.__importDefault(require("./astroport/info.json"));
const info_json_2 = tslib_1.__importDefault(require("./fastbtc/info.json"));
const info_json_3 = tslib_1.__importDefault(require("./hop/info.json"));
const info_json_4 = tslib_1.__importDefault(require("./lifi/info.json"));
const info_json_5 = tslib_1.__importDefault(require("./jupiter/info.json"));
const info_json_6 = tslib_1.__importDefault(require("./liquality/info.json"));
const info_json_7 = tslib_1.__importDefault(require("./liqualityboost/liqualityBoostERC20toNative/info.json"));
const info_json_8 = tslib_1.__importDefault(require("./liqualityboost/liqualityBoostNativeToERC20/info.json"));
const info_json_9 = tslib_1.__importDefault(require("./oneinch/info.json"));
const info_json_10 = tslib_1.__importDefault(require("./sovryn/info.json"));
const info_json_11 = tslib_1.__importDefault(require("./thorchain/info.json"));
const info_json_12 = tslib_1.__importDefault(require("./uniswap/info.json"));
const info_json_13 = tslib_1.__importDefault(require("./debridge/info.json"));
const info_json_14 = tslib_1.__importDefault(require("./teleswap/info.json"));
const error_parser_1 = require("@liquality/error-parser");
const swapProviderInfo = {
    [types_1.SwapProviderType.Liquality]: info_json_6.default,
    [types_1.SwapProviderType.UniswapV2]: info_json_12.default,
    [types_1.SwapProviderType.OneInch]: info_json_9.default,
    [types_1.SwapProviderType.Thorchain]: info_json_11.default,
    [types_1.SwapProviderType.FastBTCDeposit]: info_json_2.default,
    [types_1.SwapProviderType.FastBTCWithdraw]: info_json_2.default,
    [types_1.SwapProviderType.LiqualityBoostNativeToERC20]: info_json_8.default,
    [types_1.SwapProviderType.LiqualityBoostERC20ToNative]: info_json_7.default,
    [types_1.SwapProviderType.Sovryn]: info_json_10.default,
    [types_1.SwapProviderType.Astroport]: info_json_1.default,
    [types_1.SwapProviderType.Hop]: info_json_3.default,
    [types_1.SwapProviderType.Jupiter]: info_json_5.default,
    [types_1.SwapProviderType.DeBridge]: info_json_13.default,
    [types_1.SwapProviderType.LiFi]: info_json_4.default,
    [types_1.SwapProviderType.TeleSwap]: info_json_14.default,
};
function getSwapProviderConfig(network, providerId) {
    return build_config_1.default.swapProviders[network][providerId];
}
exports.getSwapProviderConfig = getSwapProviderConfig;
function getSwapProviderInfo(network, providerId) {
    const config = getSwapProviderConfig(network, providerId);
    if (!config) {
        throw (0, error_parser_1.createInternalError)(error_parser_1.CUSTOM_ERRORS.NotFound.SwapProvider.Config(providerId, network));
    }
    return swapProviderInfo[config.type];
}
exports.getSwapProviderInfo = getSwapProviderInfo;
const getLiqualityLiquidityForAsset = ({ asset, network, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const swapProvider = (0, factory_1.getSwapProvider)(network, types_1.SwapProviderType.Liquality);
    return swapProvider.getAssetLiquidity(asset);
});
exports.getLiqualityLiquidityForAsset = getLiqualityLiquidityForAsset;
//# sourceMappingURL=utils.js.map