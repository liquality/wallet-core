"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUseLedgerLive = void 0;
const tslib_1 = require("tslib");
exports.removeUseLedgerLive = {
    version: 8,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        delete state.useLedgerLive;
        return Object.assign(Object.assign({}, state), { usbBridgeWindowsId: 0 });
    }),
};
//# sourceMappingURL=8_remove_use_ledger_live.js.map