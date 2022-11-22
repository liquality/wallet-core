export const ChainifyErrorSource = 'Chainify';

export const LEDGER_ERROR_SOURCE_NAME = 'LedgerDevice';
export const JSON_RPC_NODE_ERROR_SOURCE_NAME = 'JsonRPCNode';

export const LEDGER_ERRORS = {
  APP_MISMATCH_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6a15)',
  DAPP_CONFLICT_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6501)',
  APP_NOT_SELECTED_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6511)',
  DEVICE_LOCKED_ERROR: 'Ledger device: UNKNOWN_ERROR (0x6b0c)',
  NOT_UPDATED_ERROR: 'Ledger device: UNKNOWN_ERROR [object Object]',
  INVALID_DATA_ERROR: 'Invalid data received (0x6a80)',
  USER_REJECTED: 'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)',
};

export const JSON_RPC_NODE_ERRORS = {
  INSUFFICIENT_GAS_PRICE_RSK: "transaction's gas price lower than block's minimum",
};
