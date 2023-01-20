"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleExperiment = void 0;
const __1 = require("..");
const toggleExperiment = (context, { name }) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.TOGGLE_EXPERIMENT({ name });
};
exports.toggleExperiment = toggleExperiment;
//# sourceMappingURL=toggleExperiment.js.map