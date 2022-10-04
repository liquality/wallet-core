import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';
class LowSpeedupFeeError extends LiqualityError {
  public readonly name = 'LowSpeedupFeeError';

  constructor() {
    super();
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Replacement Fee to speed up transaction is less than or equals the old fee.',
          suggestions: ['Try Speeding up transaction with a higher fee'],
        };
        break;
    }

    return this.userMsg;
  }
}

export default LowSpeedupFeeError;
