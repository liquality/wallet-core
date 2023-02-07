"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_RPC_NODE_ERRORS = exports.LEDGER_ERRORS = exports.JSON_RPC_NODE_ERROR_SOURCE_NAME = exports.LEDGER_ERROR_SOURCE_NAME = exports.ChainifyErrorSource = void 0;
exports.ChainifyErrorSource = 'Chainify';
exports.LEDGER_ERROR_SOURCE_NAME = 'LedgerDevice';
exports.JSON_RPC_NODE_ERROR_SOURCE_NAME = 'JsonRPCNode';
exports.LEDGER_ERRORS = {
    APP_MISMATCH_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6a15)',
    DAPP_CONFLICT_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6501)',
    APP_NOT_SELECTED_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6511)',
    DEVICE_LOCKED_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6b0c)',
    NOT_UPDATED_ERROR: 'Ledger device: UNKNOWN_ERROR [object Object]',
    INVALID_DATA_ERROR: 'Invalid data received (0x6a80)',
    USER_REJECTED: 'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)',
    SMART_CONTRACT_INTERACTION_DISABLED: 'EthAppPleaseEnableContractData: Please enable Blind signing or Contract data in the Ethereum app Settings',
};
exports.JSON_RPC_NODE_ERRORS = {
    INSUFFICIENT_GAS_PRICE_RSK: "transaction's gas price lower than block's minimum",
};
//# sourceMappingURL=index.js.map