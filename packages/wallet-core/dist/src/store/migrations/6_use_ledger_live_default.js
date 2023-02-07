"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLedgerLiveDefault = void 0;
const tslib_1 = require("tslib");
exports.useLedgerLiveDefault = {
    version: 6,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return Object.assign(Object.assign({}, state), { useLedgerLive: false });
    }),
};
//# sourceMappingURL=6_use_ledger_live_default.js.map