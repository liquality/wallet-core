import { InternalError, CUSTOM_ERRORS } from '../LiqualityErrors';
import { errorToLiqualityErrorString, isLiqualityErrorString, liqualityErrorStringToJson } from '../utils';
import { LiqualityError } from '../LiqualityErrors/LiqualityError';
import { LiqualityErrorJSON, ReportTargets } from '../types';
import { reportToConsole } from './console';
import { reportToDiscord } from './discord';

const reporterConfig = new (class ReporterConfig {
  public useReporter: boolean;
  public fallback: (error: LiqualityErrorJSON) => any;

  constructor() {
    this.useReporter = false;
    this.fallback = false as any;
  }
})();

export function updateErrorReporterConfig({
  useReporter,
  fallback,
}: {
  useReporter?: boolean;
  fallback?: (error: LiqualityErrorJSON) => any;
}) {
  if (typeof useReporter !== 'undefined') reporterConfig.useReporter = useReporter;
  if (fallback) {
    reporterConfig.fallback = fallback;
  }
}

export function reportLiqualityError(error: any) {
  if (reporterConfig.useReporter) {
    const liqualityError = errorToLiqualityErrorObj(error);
    if (!liqualityError.reportable || liqualityError.reported) return;
    const reportTargets = process.env.VUE_APP_REPORT_TARGETS;
    if (reportTargets?.includes(ReportTargets.Console)) reportToConsole(liqualityError);
    if (reportTargets?.includes(ReportTargets.Discord)) reportToDiscord(liqualityError);

    liqualityError.reported = true;
  } else {
    reporterConfig.fallback && reporterConfig.fallback(liqualityErrorStringToJson(errorToLiqualityErrorString(error)));
  }
}

function errorToLiqualityErrorObj(error: any): LiqualityError | LiqualityErrorJSON {
  if (error instanceof LiqualityError) return error;
  else if (error instanceof Error && isLiqualityErrorString(error.message))
    return liqualityErrorStringToJson(error.message);
  else return new InternalError(CUSTOM_ERRORS.Unknown(error));
}
