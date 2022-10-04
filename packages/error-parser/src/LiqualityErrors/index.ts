/* eslint-disable @typescript-eslint/no-explicit-any */
import randomBytes = require('randombytes');
import { ERROR_ID_LENGTH } from '../config';
import { UserErrorMessage } from '../types/types';

export abstract class LiqualityError<Context = any> extends Error {
  source: string;
  userMsg: UserErrorMessage;
  devMsg: { desc: string; data: any };
  rawError: never;
  context: Context;

  constructor(context?: Context) {
    super();
    if (context) this.context = context;
  }

  abstract wrapUserErrorMessage(lang?: string): UserErrorMessage;

  suggestContactSupport(): string {
    return `If it persist, please contact support on discord with errorId: ${randomBytes(ERROR_ID_LENGTH).toString(
      'hex'
    )}`;
  }
}
