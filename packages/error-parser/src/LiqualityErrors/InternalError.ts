import { UserErrorMessage } from 'src/types/types';
import { LiqualityError } from '.';
class InternalError extends LiqualityError {
  public readonly name = 'InternalError';

  constructor() {
    super();
  }

  wrapUserErrorMessage(lang?: string): UserErrorMessage {
    switch (lang) {
      default:
        this.userMsg = {
          cause: 'Sorry, something went wrong while processing this transaction.',
          suggestions: ['Try again at a later time', this.suggestContactSupport()],
        };
        break;
    }

    return this.userMsg;
  }
}

export default InternalError;
