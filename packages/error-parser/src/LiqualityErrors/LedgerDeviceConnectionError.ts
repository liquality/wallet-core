import { LiqualityError } from './LiqualityError';
export class LedgerDeviceConnectionError extends LiqualityError {
  constructor() {
    super(LedgerDeviceConnectionError.name);
  }
}
