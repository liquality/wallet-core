"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showNotification = void 0;
const tslib_1 = require("tslib");
const notification_1 = require("../broker/notification");
const showNotification = (_, notification) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    (0, notification_1.createNotification)(notification);
});
exports.showNotification = showNotification;
//# sourceMappingURL=showNotification.js.map