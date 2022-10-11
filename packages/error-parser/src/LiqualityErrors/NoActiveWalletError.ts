import { LiqualityError } from './LiqualityError';
export class NoActiveWalletError extends LiqualityError {
  public readonly name = NoActiveWalletError.name;

  constructor() {
    super();
  }
}
