"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearErrorLog = void 0;
const __1 = require("..");
const clearErrorLog = (context) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.CLEAR_ERROR_LOG();
};
exports.clearErrorLog = clearErrorLog;
//# sourceMappingURL=clearErrorLog.js.map