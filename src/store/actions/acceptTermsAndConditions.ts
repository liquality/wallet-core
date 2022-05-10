import { ActionContext, rootActionContext } from '..';

export const acceptTermsAndConditions = async (
  context: ActionContext,
  { analyticsAccepted }: { analyticsAccepted: boolean }
) => {
  const { commit, dispatch } = rootActionContext(context);
  commit.ACCEPT_TNC();
  if (analyticsAccepted) {
    await dispatch.initializeAnalyticsPreferences({
      accepted: analyticsAccepted,
    });
    await dispatch.initializeAnalytics();
  }
};
