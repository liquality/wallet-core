import { createDirectStore } from 'direct-vuex';

import state from './state';
import getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

const {
  store,
  moduleActionContext,
  moduleGetterContext,
  rootActionContext,
  rootGetterContext,
} = createDirectStore({
  state,
  getters,
  actions,
  mutations,
});

export {
  store,
  moduleActionContext,
  moduleGetterContext,
  rootActionContext,
  rootGetterContext,
};
