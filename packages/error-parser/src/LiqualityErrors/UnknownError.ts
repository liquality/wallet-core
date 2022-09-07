import { LiqualityError } from '.';
import { ErrorType } from '../types/types';

class UnknownError extends LiqualityError {
  constructor(lang?: string) {
    super();
    this.wrapUserErrorMessage(lang);
  }

  wrapUserErrorMessage(lang?: string): void {
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Sorry, something went wrong while processing this transaction.',
          suggestions: [],
        };
        break;
    }
  }
}

UnknownError.prototype.name = ErrorType.UnknownError;

export default UnknownError;
