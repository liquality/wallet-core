import { LiqualityError } from './LiqualityError';
export class LowSpeedupFeeError extends LiqualityError {
  public readonly name = LowSpeedupFeeError.name;

  constructor() {
    super();
  }
}
