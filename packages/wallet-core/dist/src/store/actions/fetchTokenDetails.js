"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTokenDetails = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("@chainify/errors");
const __1 = require("..");
const fetchTokenDetails = (context, tokenDetailsRequest) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { walletId, network, chain, contractAddress } = tokenDetailsRequest;
    const { getters } = (0, __1.rootActionContext)(context);
    const client = getters.client({ network, walletId, chainId: chain });
    try {
        return yield client.chain.getTokenDetails(contractAddress);
    }
    catch (err) {
        if (err.rawError instanceof errors_1.UnsupportedMethodError) {
            return null;
        }
        throw err;
    }
});
exports.fetchTokenDetails = fetchTokenDetails;
//# sourceMappingURL=fetchTokenDetails.js.map