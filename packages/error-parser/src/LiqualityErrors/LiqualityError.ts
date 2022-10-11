/* eslint-disable @typescript-eslint/no-explicit-any */
import randomBytes = require('randombytes');
import { ERROR_ID_LENGTH } from '../config';
import { CAUSE, PLACEHOLDER, PLAIN, SUGGESTIONS } from './translations/translationKeys';

export abstract class LiqualityError<Context = any> extends Error {
  source: string;
  causeKey: string;
  suggestionKey: string;
  devMsg: { desc: string; data: any };
  rawError: never;
  data: Context | { errorId: string };
  errorId: string;

  constructor(data?: Context) {
    super();
    this.setKeys(data);
    if (!data) data = {} as Context;
    this.data = { ...data, errorId: randomBytes(ERROR_ID_LENGTH).toString('hex') };
  }

  setKeys(data?: Context) {
    if (data) {
      this.causeKey = `${this.name}.${PLACEHOLDER}.${CAUSE}`;
      this.suggestionKey = `${this.name}.${PLACEHOLDER}.${SUGGESTIONS}`;
    } else {
      this.causeKey = `${this.name}.${PLAIN}.${CAUSE}`;
      this.suggestionKey = `${this.name}.${PLAIN}.${SUGGESTIONS}`;
    }
  }
}

export enum UserActivity {
  SWAP = 'SWAP',
  UNKNOWN = 'UNKNOWN',
}
