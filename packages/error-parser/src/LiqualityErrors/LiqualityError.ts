/* eslint-disable @typescript-eslint/no-explicit-any */
import randomBytes = require('randombytes');
import { ERROR_ID_LENGTH } from '../config';
import { CAUSE, PLACEHOLDER, PLAIN, SUGGESTIONS } from './translations/translationKeys';

type ObjectLiteral = { [key: string]: any };
export abstract class LiqualityError<Context extends ObjectLiteral = ObjectLiteral> extends Error {
  source: string;
  causeKey: string;
  suggestionKey: string;
  devMsg: { desc: string; data: any };
  rawError: any;
  data: Context | { errorId: string };

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
