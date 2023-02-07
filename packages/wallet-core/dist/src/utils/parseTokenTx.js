"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTokenTx = void 0;
const tslib_1 = require("tslib");
const ethers = tslib_1.__importStar(require("ethers"));
const human_standard_token_abi_1 = tslib_1.__importDefault(require("human-standard-token-abi"));
const hstInterface = new ethers.utils.Interface(human_standard_token_abi_1.default);
const parseTokenTx = (data) => hstInterface.parseTransaction({ data });
exports.parseTokenTx = parseTokenTx;
//# sourceMappingURL=parseTokenTx.js.map