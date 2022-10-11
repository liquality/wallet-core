import { LiqualityError } from './LiqualityErrors';
import { reportToConsole } from './reporters/console';
import { reportToDiscord } from './reporters/discord';
import { reportToEmail } from './reporters/email';
import { ReportType } from './types/types';

export const REPORTERS: Record<ReportType, <T extends LiqualityError>(error: T) => void> = {
  [ReportType.Console]: reportToConsole,
  [ReportType.Discord]: reportToDiscord,
  [ReportType.Email]: reportToEmail,
};

export const ERROR_ID_LENGTH = 10;
