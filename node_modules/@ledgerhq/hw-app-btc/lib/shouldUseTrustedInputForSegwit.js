"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.shouldUseTrustedInputForSegwit = void 0;
var semver_1 = __importDefault(require("semver"));
function shouldUseTrustedInputForSegwit(_a) {
    var version = _a.version, name = _a.name;
    if (name === "Decred")
        return false;
    if (name === "Exchange")
        return true;
    return semver_1["default"].gte(version, "1.4.0");
}
exports.shouldUseTrustedInputForSegwit = shouldUseTrustedInputForSegwit;
//# sourceMappingURL=shouldUseTrustedInputForSegwit.js.map