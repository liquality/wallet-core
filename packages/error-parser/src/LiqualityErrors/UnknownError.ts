import { LiqualityError } from '.';
class UnknownError extends LiqualityError {
  public readonly name = 'UnknownError';

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

export default UnknownError;
