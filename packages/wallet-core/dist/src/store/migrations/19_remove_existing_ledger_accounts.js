"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExistingLedgerAccounts = void 0;
const tslib_1 = require("tslib");
const types_1 = require("../types");
exports.removeExistingLedgerAccounts = {
    version: 19,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const accounts = {};
        for (const walletId in state.accounts) {
            if (!accounts[walletId]) {
                accounts[walletId] = {};
            }
            for (const network in state.accounts[walletId]) {
                accounts[walletId][network] = state.accounts[walletId][network].filter((a) => {
                    return [types_1.AccountType.BitcoinLedgerNativeSegwit, types_1.AccountType.BitcoinLedgerLegacy].includes(a.type);
                });
            }
        }
        const newState = Object.assign(Object.assign({}, state), { whatsNewModalVersion: state.watsNewModalVersion || '', accounts });
        delete newState.watsNewModalVersion;
        return newState;
    }),
};
//# sourceMappingURL=19_remove_existing_ledger_accounts.js.map