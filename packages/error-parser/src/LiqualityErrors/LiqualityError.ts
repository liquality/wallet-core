/* eslint-disable @typescript-eslint/no-explicit-any */
import randomBytes = require('randombytes');
import { JSONObject } from '../types';
import { ERROR_ID_LENGTH } from '../config';
import { CAUSE, PLACEHOLDER, PLAIN, SUGGESTIONS } from './translations/translationKeys';
import { LIQUALITY_ERROR_STRING_STARTER } from '../utils';

export abstract class LiqualityError<Context extends JSONObject = JSONObject> extends Error {
  source: string;
  causeKey: string;
  suggestionKey: string;
  devMsg: { desc: string; data: JSONObject };
  rawError: any;
  data: Context | { errorId: string };
  reported: boolean;

  constructor(name: string, data?: Context) {
    super();
    this.name = name;
    this.reported = false;
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

  toString(): string {
    const jsonifiedErrorWithoutStack = JSON.parse(JSON.stringify(this));
    const jsonifiedErrorWithStack = { ...jsonifiedErrorWithoutStack, stack: this.stack };

    return `${LIQUALITY_ERROR_STRING_STARTER}${JSON.stringify(jsonifiedErrorWithStack)}`;
  }
}

export enum UserActivity {
  SWAP = 'SWAP',
  UNKNOWN = 'UNKNOWN',
}
