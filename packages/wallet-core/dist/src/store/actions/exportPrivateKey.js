"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPrivateKey = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const exportPrivateKey = (context, { network, walletId, accountId, chainId, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { getters } = (0, __1.rootActionContext)(context);
    const client = getters.client({ network, walletId, accountId, chainId });
    return client.wallet.exportPrivateKey();
});
exports.exportPrivateKey = exportPrivateKey;
//# sourceMappingURL=exportPrivateKey.js.map