/**
 * Created by lxk on 2017/12/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 在开发模式下执行debug，生产环境下停用

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,

  strict: debug, // 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
  plugins: debug ? [createLogger()] : []  // 打印出某一个状态改变的日志
})
