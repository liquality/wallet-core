import { LiqualityError } from './LiqualityError';
export class LowSpeedupFeeError extends LiqualityError {
  constructor() {
    super(LowSpeedupFeeError.name);
  }
}
