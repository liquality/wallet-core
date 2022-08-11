import { removeExistingLedgerAccounts } from "./19_remove_existing_ledger_accounts";
import state from "./19_remove_existing_ledger_accounts.state.pre.json";

const newState = removeExistingLedgerAccounts.migrate(state);
console.log('newState', newState);
