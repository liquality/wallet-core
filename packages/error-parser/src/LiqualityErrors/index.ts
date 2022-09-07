/* eslint-disable @typescript-eslint/no-explicit-any */
import randomBytes = require('randombytes');
import { ERROR_ID_LENGTH } from '../config';
import { UserErrorMessage } from '../types/types';

export abstract class LiqualityError extends Error {
  code: number;
  userMsg: UserErrorMessage;
  devMsg: { desc: string; data: any };
  rawError: never;

  constructor() {
    super();
  }

  abstract wrapUserErrorMessage(context?: any, lang?: string): void;

  suggestContactSupport(): string {
    return `If it persist, please contact support on discord with errorId: ${randomBytes(ERROR_ID_LENGTH).toString(
      'hex'
    )}`;
  }
}
