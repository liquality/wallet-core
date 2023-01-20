"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeActiveNetwork = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const changeActiveNetwork = (context, { network }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.CHANGE_ACTIVE_NETWORK({
        network,
    });
});
exports.changeActiveNetwork = changeActiveNetwork;
//# sourceMappingURL=changeActiveNetwork.js.map