"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWhatsNewModalVersion = void 0;
const __1 = require("..");
const setWhatsNewModalVersion = (context, { version }) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.SET_WHATS_NEW_MODAL_VERSION({ version });
};
exports.setWhatsNewModalVersion = setWhatsNewModalVersion;
//# sourceMappingURL=setWhatsNewModalVersion.js.map