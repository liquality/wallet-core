"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrations = exports.buildConfig = exports.setupWallet = void 0;
const tslib_1 = require("tslib");
const error_parser_1 = require("@liquality/error-parser");
const build_config_1 = tslib_1.__importDefault(require("./build.config"));
exports.buildConfig = build_config_1.default;
const store_1 = tslib_1.__importDefault(require("./store"));
const migrations = tslib_1.__importStar(require("./store/migrations"));
exports.migrations = migrations;
const walletOptions_1 = require("./walletOptions");
function setupWallet(options) {
    walletOptions_1.walletOptionsStore.setOptions(options);
    if (options.initialState)
        store_1.default.commit.SET_STATE({ newState: options.initialState });
    (0, error_parser_1.updateErrorReporterConfig)({ callback: (error) => store_1.default.dispatch.logError(error) });
    return store_1.default;
}
exports.setupWallet = setupWallet;
//# sourceMappingURL=index.js.map