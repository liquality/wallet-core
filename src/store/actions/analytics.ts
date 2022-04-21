import amplitude from 'amplitude-js';
import { v4 as uuidv4 } from 'uuid';
import { ActionContext, rootActionContext } from '..';
import { version as walletVersion } from '../../../package.json';
import { AnalyticsState } from '../types';

const useAnalytics = !!process.env.VUE_APP_AMPLITUDE_API_KEY;

export const initializeAnalyticsPreferences = (context: ActionContext, { accepted }: { accepted: boolean }) => {
  const { commit } = rootActionContext(context);
  commit.SET_ANALYTICS_PREFERENCES({
    userId: uuidv4(),
    acceptedDate: accepted ? Date.now() : 0,
    askedTimes: 0,
    askedDate: Date.now(),
    notAskAgain: false,
  });
};

export const updateAnalyticsPreferences = (context: ActionContext, payload: AnalyticsState) => {
  const { commit } = rootActionContext(context);
  commit.SET_ANALYTICS_PREFERENCES({ ...payload });
};

export const setAnalyticsResponse = async (context: ActionContext, { accepted }: { accepted: boolean }) => {
  const { commit } = rootActionContext(context);
  if (accepted) {
    commit.SET_ANALYTICS_PREFERENCES({ acceptedDate: Date.now() });
  } else {
    commit.SET_ANALYTICS_PREFERENCES({ acceptedDate: 0 });
  }
};

export const initializeAnalytics = async (context: ActionContext): Promise<boolean> => {
  const { state, dispatch } = rootActionContext(context);
  if (!state.analytics || !state.analytics.userId) {
    await dispatch.initializeAnalyticsPreferences({ accepted: false });
    return false;
  } else if (state.analytics?.acceptedDate && useAnalytics) {
    amplitude.getInstance().init(process.env.VUE_APP_AMPLITUDE_API_KEY!, state.analytics?.userId);
    return true;
  }
  return false;
};

export const trackAnalytics = (
  context: ActionContext,
  { event, properties = {} }: { event: any; properties: any }
): any => {
  // TODO: types?
  const { state } = rootActionContext(context);
  if (useAnalytics && state.analytics && state.analytics.acceptedDate && state.analytics.userId) {
    const { activeNetwork, activeWalletId, version } = state;
    return amplitude.getInstance().logEvent(event, {
      ...properties,
      network: activeNetwork,
      walletId: activeWalletId,
      migrationVersion: version,
      walletVersion,
    });
  }
};
