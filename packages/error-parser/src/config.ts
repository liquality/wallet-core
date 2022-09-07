import { reportToConsole } from './reporters/console';
import { reportToDiscord } from './reporters/discord';
import { reportToEmail } from './reporters/email';
import { ReportType, ErrorSource } from './types/types';
import { LiqualityError } from './LiqualityErrors';
import { OneInchSwapErrorParser } from './parsers';

export const ERROR_CODES: Record<ErrorSource, number> = {
  [ErrorSource.OneInchSwapAPI]: 1000,
};
// We will have a errorSourceToParserClass mapping here ...
export const PARSERS = {
  [ErrorSource.OneInchSwapAPI]: OneInchSwapErrorParser,
};

export const REPORTERS: Record<ReportType, <T extends LiqualityError>(error: T) => void> = {
  [ReportType.Console]: reportToConsole,
  [ReportType.Discord]: reportToDiscord,
  [ReportType.Email]: reportToEmail,
};

export const ERROR_ID_LENGTH = 10;
