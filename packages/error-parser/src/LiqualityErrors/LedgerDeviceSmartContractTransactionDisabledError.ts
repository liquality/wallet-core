import { ERROR_NAMES } from '../config';
import { LiqualityError } from './LiqualityError';
export class LedgerDeviceSmartContractTransactionDisabledError extends LiqualityError {
  constructor() {
    super(ERROR_NAMES.LedgerDeviceSmartContractTransactionDisabledError);
  }
}
