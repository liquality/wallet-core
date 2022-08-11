import { createDirectStore } from 'direct-vuex';
import Vue from 'vue';
import Vuex, { ActionContext as _ActionContext } from 'vuex';
import * as actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';
import { RootState } from './types';

Vue.use(Vuex);

const { store, rootActionContext, rootGetterContext, moduleActionContext, moduleGetterContext } = createDirectStore({
  state,
  getters,
  actions,
  mutations,
});

export default store;
export type OriginalStore = typeof store.original;
export type ActionContext = _ActionContext<RootState, RootState>;
export { rootActionContext, rootGetterContext, moduleActionContext, moduleGetterContext };
