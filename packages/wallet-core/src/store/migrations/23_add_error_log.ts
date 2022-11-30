import { updateErrorReporterConfig, LiqualityErrorJSON } from '@liquality/error-parser';
import store from '..';

// Add error log to state
export const addErrorLog = {
  version: 23,
  migrate: async (state: any) => {
    updateErrorReporterConfig({ fallback: (error: LiqualityErrorJSON) => store.dispatch.logError(error) });
    return { ...state, errorLog: [] };
  },
};
