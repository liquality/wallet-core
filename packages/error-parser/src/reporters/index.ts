import { InternalError, CUSTOM_ERRORS } from '../LiqualityErrors';
import { isLiqualityErrorString, liqualityErrorStringToJson } from '../utils';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { LiqualityErrorJSON, ReportTargets } from '../types';
import { reportToConsole } from './console';
import { reportToDiscord } from './discord';

export function reportLiqualityError(error: any) {
  const liqualityError = errorToLiqualityErrorObj(error);

  if (liqualityError.reported) return;
  const reportTargets = process.env.VUE_APP_REPORT_TARGETS;
  if (reportTargets?.includes(ReportTargets.Console)) reportToConsole(liqualityError);
  if (reportTargets?.includes(ReportTargets.Discord)) reportToDiscord(liqualityError);

  liqualityError.reported = true;
}

function errorToLiqualityErrorObj(error: any): LiqualityError | LiqualityErrorJSON {
  if (error instanceof LiqualityError) return error;
  else if (error instanceof Error && isLiqualityErrorString(error.message))
    return liqualityErrorStringToJson(error.message);
  else return new InternalError(CUSTOM_ERRORS.Unknown(error));
}
