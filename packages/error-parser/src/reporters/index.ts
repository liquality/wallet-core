import { REPORTERS } from '../config';
import { LiqualityError } from '../LiqualityErrors';
import { ReportConfig, ReportType } from '../types/types';

let reportConfig: ReportConfig = {};

export function setReportConfig(_reportConfig: ReportConfig) {
  reportConfig = _reportConfig;
}

export function reportLiqError(error: LiqualityError) {
  const reportTypes = Object.keys(reportConfig) as Array<ReportType>;
  const validReportTypes = Object.values(ReportType);
  if (reportTypes.length === 0) return;
  reportTypes.forEach((reportType) => {
    if (validReportTypes.find((validReportType) => validReportType === reportType)) {
      REPORTERS[reportType](error);
    }
  });
}
