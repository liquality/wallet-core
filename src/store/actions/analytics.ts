import { v4 as uuidv4 } from 'uuid';
import { version as walletVersion } from '../../../package.json';
import amplitude from 'amplitude-js';

const useAnalytics = !!process.env.VUE_APP_AMPLITUDE_API_KEY;
console.log('ANALITYCS_ENABLED', useAnalytics);

export const initializeAnalyticsPreferences = ({ commit }, { accepted }) => {
  commit('SET_ANALYTICS_PREFERENCES', {
    userId: uuidv4(),
    acceptedDate: accepted ? Date.now() : null,
    askedTimes: 0,
    askedDate: Date.now(),
    notAskAgain: false,
  });
};

export const updateAnalyticsPreferences = ({ commit }, payload) => {
  commit('SET_ANALYTICS_PREFERENCES', { ...payload });
};

export const setAnalyticsResponse = async ({ commit }, { accepted }) => {
  if (accepted) {
    commit('SET_ANALYTICS_PREFERENCES', { acceptedDate: Date.now() });
  } else {
    commit('SET_ANALYTICS_PREFERENCES', { acceptedDate: null });
  }
};

export const initializeAnalytics = async ({ dispatch, state }) => {
  if (!state.analytics || !state.analytics.userId) {
    await dispatch('initializeAnalyticsPreferences', { accepted: false });
    return false;
  } else if (state.analytics?.acceptedDate && useAnalytics) {
    amplitude
      .getInstance()
      .init(process.env.VUE_APP_AMPLITUDE_API_KEY, state.analytics?.userId);
    return true;
  }
};

export const trackAnalytics = ({ state }, { event, properties = {} }) => {
  if (
    useAnalytics &&
    state.analytics &&
    state.analytics.acceptedDate &&
    state.analytics.userId
  ) {
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
