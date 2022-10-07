import { LiqualityError } from '.';
class LowSpeedupFeeError extends LiqualityError {
  public readonly name = 'LowSpeedupFeeError';

  constructor() {
    super();
  }
}

export default LowSpeedupFeeError;
