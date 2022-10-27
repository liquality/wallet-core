import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { ReportTargets } from '../types/types';
import { reportToConsole } from './console';
import { reportToDiscord } from './discord';

export function reportLiqualityError(error: LiqualityError) {
  if (error.reported) return;
  const reportTargets = process.env.VUE_APP_REPORT_TARGETS;
  if (reportTargets?.includes(ReportTargets.Console)) reportToConsole(error);
  if (reportTargets?.includes(ReportTargets.Discord)) reportToDiscord(error);

  error.reported = true;
}
