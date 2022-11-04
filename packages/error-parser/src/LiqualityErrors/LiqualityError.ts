/* eslint-disable @typescript-eslint/no-explicit-any */
import randomBytes = require('randombytes');
import { JSONObject } from '../types';
import { ERROR_ID_LENGTH } from '../config';
import { PLACEHOLDER, PLAIN } from './translations/translationKeys';
import { LIQUALITY_ERROR_STRING_STARTER } from '../utils';

export abstract class LiqualityError<Context extends JSONObject = JSONObject> extends Error {
  source: string;
  translationKey: string;
  devMsg: { desc: string; data: JSONObject };
  rawError: any;
  data: Context | { errorId: string };
  reported = false;
  reportable = false;

  constructor(name: string, data?: Context) {
    super();
    this.name = name;
    this.setTranslationKey(data);
    if (!data) data = {} as Context;
    this.data = { ...data, errorId: randomBytes(ERROR_ID_LENGTH).toString('hex') };
  }

  setTranslationKey(data?: Context) {
    if (data) {
      this.translationKey = `${this.name}.${PLACEHOLDER}`;
    } else {
      this.translationKey = `${this.name}.${PLAIN}`;
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
