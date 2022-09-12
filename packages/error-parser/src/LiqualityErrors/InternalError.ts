import { LiqualityError } from '.';
import { ErrorType } from '../types/types';

class InternalError extends LiqualityError {
  constructor(lang?: string) {
    super();
    this.wrapUserErrorMessage(lang);
  }

  wrapUserErrorMessage(lang?: string): void {
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Sorry, something went wrong while processing this transaction.',
          suggestions: ['Try again at a later time', this.suggestContactSupport()],
        };
        break;
    }
  }
}

InternalError.prototype.name = ErrorType.InternalError;
export default InternalError;
