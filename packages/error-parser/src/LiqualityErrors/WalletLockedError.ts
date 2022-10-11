import { LiqualityError } from './LiqualityError';
export class WalletLockedError extends LiqualityError {
  public readonly name = WalletLockedError.name;

  constructor() {
    super();
  }
}
