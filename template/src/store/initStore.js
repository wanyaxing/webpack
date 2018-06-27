import Vuex from 'vuex'
import Vue from 'vue'
import user from './user'
import page from './page'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    page,
  }
})
