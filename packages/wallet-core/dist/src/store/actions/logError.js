"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const __1 = require("..");
const logError = (context, error) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.LOG_ERROR(error);
};
exports.logError = logError;
//# sourceMappingURL=logError.js.map