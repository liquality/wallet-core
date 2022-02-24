import { Store } from 'vuex'

const wallet = new Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    add (context) {
      context.commit('increment');
    }
  }
})

export { wallet }
