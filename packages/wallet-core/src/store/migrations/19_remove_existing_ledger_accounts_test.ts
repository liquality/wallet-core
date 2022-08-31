import { removeExistingLedgerAccounts } from './19_remove_existing_ledger_accounts';
import state from './19_remove_existing_ledger_accounts.state.pre.json';

const _newState = removeExistingLedgerAccounts.migrate(state);
