import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';
class UnknownError extends LiqualityError {
  public readonly name = 'UnknownError';

  constructor() {
    super();
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Sorry, something went wrong while processing this transaction.',
          suggestions: [],
        };
        break;
    }

    return this.userMsg;
  }
}

export default UnknownError;
