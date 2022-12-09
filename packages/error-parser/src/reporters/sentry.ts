import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { LiqualityErrorJSON } from '../types';
import * as Sentry from '@sentry/browser';

export const reportToSentry = async (error: LiqualityError | LiqualityErrorJSON) => {
  const jsError = new Error();
  jsError.name = error.name;
  jsError.stack = error.stack;

  Sentry.withScope(function (scope) {
    scope.setContext('Liquality Error Info', {
      'Developer Message': `${JSON.stringify(error.devMsg)}`,
      Data: `${JSON.stringify(error.data)}`,
      'Raw Error': `${JSON.stringify(error.rawError)}`,
    });
    scope.setTags({
      ID: `${error.data.errorId}`,
      Source: `${error.source}`,
    });
    Sentry.captureException(jsError, () => scope);
  });
};
