import { createDirectStore } from 'direct-vuex';
import state from './state';
import getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

const { store } = createDirectStore({
  state,
  getters,
  actions,
  mutations,
});

export default store;
