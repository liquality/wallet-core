import Vuex from 'vuex';

import state from './state';
import getters from './getters';
import * as actions from './actions';
import mutations from './mutations';

export default new Vuex.Store({
  state: state,
  getters,
  actions,
  mutations,
});
