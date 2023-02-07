"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarketData = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const build_config_1 = tslib_1.__importDefault(require("../../build.config"));
const swap_1 = require("../../factory/swap");
const updateMarketData = (context, { network }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    const supportedPairResponses = yield Promise.allSettled(Object.keys(build_config_1.default.swapProviders[network]).map((provider) => {
        const swapProvider = (0, swap_1.getSwapProvider)(network, provider);
        return swapProvider.getSupportedPairs({ network }).then((pairs) => pairs.map((pair) => (Object.assign(Object.assign({}, pair), { provider }))));
    }));
    let supportedPairs = [];
    supportedPairResponses.forEach((response) => {
        if (response.status === 'fulfilled') {
            supportedPairs = [...supportedPairs, ...response.value];
        }
        else {
            console.error('Fetching market data failed', response.reason);
        }
    });
    const marketData = supportedPairs;
    commit.UPDATE_MARKET_DATA({ network, marketData });
    return { network, marketData };
});
exports.updateMarketData = updateMarketData;
//# sourceMappingURL=updateMarketData.js.map