"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptTermsAndConditions = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const acceptTermsAndConditions = (context, { analyticsAccepted }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit, dispatch } = (0, __1.rootActionContext)(context);
    commit.ACCEPT_TNC();
    if (analyticsAccepted) {
        yield dispatch.initializeAnalyticsPreferences({
            accepted: analyticsAccepted,
        });
        yield dispatch.initializeAnalytics();
    }
});
exports.acceptTermsAndConditions = acceptTermsAndConditions;
//# sourceMappingURL=acceptTermsAndConditions.js.map