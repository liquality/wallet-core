"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rskLegacyDerivationPathFix = exports.rskLegacyDerivationPath = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const rskLegacyDerivationMigration = (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const hasAccounts = Object.keys(state.accounts || {}).length > 0;
    if (!hasAccounts) {
        return Object.assign({}, state);
    }
    const rskLegacyDerivation = yield (0, utils_1.shouldApplyRskLegacyDerivation)(state.accounts);
    return Object.assign(Object.assign({}, state), { rskLegacyDerivation });
});
exports.rskLegacyDerivationPath = {
    version: 11,
    migrate: rskLegacyDerivationMigration,
};
exports.rskLegacyDerivationPathFix = {
    version: 12,
    migrate: rskLegacyDerivationMigration,
};
//# sourceMappingURL=11_12_rsk_legacy_derivation_path.js.map