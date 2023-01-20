"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analitycsSettings = void 0;
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
exports.analitycsSettings = {
    version: 10,
    migrate: (state) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const userId = (0, uuid_1.v4)();
        return Object.assign(Object.assign({}, state), { analytics: {
                userId,
                acceptedDate: null,
                askedDate: null,
                askedTimes: 0,
                notAskAgain: false,
            } });
    }),
};
//# sourceMappingURL=10_analytics_settings.js.map