import { LiqualityError } from './LiqualityError';
export class LedgerDeviceConnectionError extends LiqualityError {
  public readonly name = LedgerDeviceConnectionError.name;

  constructor() {
    super();
  }
}
