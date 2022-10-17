import { LiqualityError } from './LiqualityError';
export class NoTipError extends LiqualityError {
  public readonly name = NoTipError.name;

  constructor() {
    super();
  }
}
