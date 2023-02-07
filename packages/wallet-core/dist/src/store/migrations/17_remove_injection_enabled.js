"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInjectionEnabled = void 0;
const tslib_1 = require("tslib");
exports.removeInjectionEnabled = {
    version: 17,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        delete state.injectionEnabled;
        return Object.assign({}, state);
    }),
};
//# sourceMappingURL=17_remove_injection_enabled.js.map