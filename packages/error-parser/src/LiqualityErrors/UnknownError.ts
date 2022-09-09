import { LiqualityError } from '.';
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

UnknownError.prototype.name = 'UnknownError';

export default UnknownError;
