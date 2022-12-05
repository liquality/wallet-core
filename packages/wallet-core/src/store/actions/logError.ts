import { LiqualityErrorJSON } from '@liquality/error-parser';
import { ActionContext, rootActionContext } from '..';

export const logError = (context: ActionContext, error: LiqualityErrorJSON) => {
  const { commit } = rootActionContext(context);
  commit.LOG_ERROR(error);
};
