import { LiqualityError } from '.';
class LowSpeedupFeeError extends LiqualityError {
  public readonly name = 'LowSpeedupFeeError';

  constructor(lang?: string) {
    super();
    this.wrapUserErrorMessage(lang);
  }

  wrapUserErrorMessage(lang?: string): void {
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Replacement Fee to speed up transaction is less than or equals the old fee.',
          suggestions: ['Try Speeding up transaction with a higher fee'],
        };
        break;
    }
  }
}

export default LowSpeedupFeeError;
