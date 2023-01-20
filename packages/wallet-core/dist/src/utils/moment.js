"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const locale = window.navigator.userLanguage || window.navigator.language;
moment_1.default.locale(locale);
exports.default = moment_1.default;
//# sourceMappingURL=moment.js.map