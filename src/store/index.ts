import { createDirectStore } from 'direct-vuex';
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const { store, rootActionContext, rootGetterContext, moduleActionContext, moduleGetterContext } = createDirectStore({
  state,
  getters,
  actions,
  mutations,
});

export default store;
export type OriginalStore = typeof store.original;
export { rootActionContext, rootGetterContext, moduleActionContext, moduleGetterContext };
