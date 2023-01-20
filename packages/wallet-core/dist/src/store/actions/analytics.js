"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackAnalytics = exports.initializeAnalytics = exports.setAnalyticsResponse = exports.updateAnalyticsPreferences = exports.initializeAnalyticsPreferences = void 0;
const tslib_1 = require("tslib");
const amplitude_js_1 = tslib_1.__importDefault(require("amplitude-js"));
const uuid_1 = require("uuid");
const __1 = require("..");
const package_json_1 = require("../../../package.json");
const useAnalytics = !!process.env.VUE_APP_AMPLITUDE_API_KEY;
const initializeAnalyticsPreferences = (context, { accepted }) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.SET_ANALYTICS_PREFERENCES({
        userId: (0, uuid_1.v4)(),
        acceptedDate: accepted ? Date.now() : 0,
        askedTimes: 0,
        askedDate: Date.now(),
        notAskAgain: false,
    });
};
exports.initializeAnalyticsPreferences = initializeAnalyticsPreferences;
const updateAnalyticsPreferences = (context, payload) => {
    const { commit } = (0, __1.rootActionContext)(context);
    commit.SET_ANALYTICS_PREFERENCES(Object.assign({}, payload));
};
exports.updateAnalyticsPreferences = updateAnalyticsPreferences;
const setAnalyticsResponse = (context, { accepted }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { commit } = (0, __1.rootActionContext)(context);
    if (accepted) {
        commit.SET_ANALYTICS_PREFERENCES({ acceptedDate: Date.now() });
    }
    else {
        commit.SET_ANALYTICS_PREFERENCES({ acceptedDate: 0 });
    }
});
exports.setAnalyticsResponse = setAnalyticsResponse;
const initializeAnalytics = (context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { state, dispatch } = (0, __1.rootActionContext)(context);
    if (!state.analytics || !state.analytics.userId) {
        yield dispatch.initializeAnalyticsPreferences({ accepted: false });
        return false;
    }
    else if (((_a = state.analytics) === null || _a === void 0 ? void 0 : _a.acceptedDate) && useAnalytics) {
        amplitude_js_1.default.getInstance().init(process.env.VUE_APP_AMPLITUDE_API_KEY, (_b = state.analytics) === null || _b === void 0 ? void 0 : _b.userId);
        return true;
    }
    return false;
});
exports.initializeAnalytics = initializeAnalytics;
const trackAnalytics = (context, { event, properties = {} }) => {
    const { state } = (0, __1.rootActionContext)(context);
    if (useAnalytics && state.analytics && state.analytics.acceptedDate && state.analytics.userId) {
        const { activeNetwork, activeWalletId, version } = state;
        return amplitude_js_1.default.getInstance().logEvent(event, Object.assign(Object.assign({}, properties), { network: activeNetwork, walletId: activeWalletId, migrationVersion: version, walletCoreVersion: package_json_1.version }));
    }
};
exports.trackAnalytics = trackAnalytics;
//# sourceMappingURL=analytics.js.map