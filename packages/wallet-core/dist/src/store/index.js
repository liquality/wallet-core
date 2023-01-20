"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleGetterContext = exports.moduleActionContext = exports.rootGetterContext = exports.rootActionContext = void 0;
const tslib_1 = require("tslib");
const direct_vuex_1 = require("direct-vuex");
const vue_1 = tslib_1.__importDefault(require("vue"));
const vuex_1 = tslib_1.__importDefault(require("vuex"));
const actions = tslib_1.__importStar(require("./actions"));
const getters_1 = tslib_1.__importDefault(require("./getters"));
const mutations_1 = tslib_1.__importDefault(require("./mutations"));
const state_1 = tslib_1.__importDefault(require("./state"));
vue_1.default.use(vuex_1.default);
const { store, rootActionContext, rootGetterContext, moduleActionContext, moduleGetterContext } = (0, direct_vuex_1.createDirectStore)({
    state: state_1.default,
    getters: getters_1.default,
    actions,
    mutations: mutations_1.default,
});
exports.rootActionContext = rootActionContext;
exports.rootGetterContext = rootGetterContext;
exports.moduleActionContext = moduleActionContext;
exports.moduleGetterContext = moduleGetterContext;
exports.default = store;
//# sourceMappingURL=index.js.map