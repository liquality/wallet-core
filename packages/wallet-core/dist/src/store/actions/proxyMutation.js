"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyMutation = void 0;
const tslib_1 = require("tslib");
const proxyMutation = ({ commit }, { type, payload }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    commit(type, payload);
});
exports.proxyMutation = proxyMutation;
//# sourceMappingURL=proxyMutation.js.map