import 'babel-polyfill' // 编译es6API
import Vue from 'vue'
import App from './App'
import router from './router'
import Store from './store'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import vueLazyload from 'vue-lazyload'
// import VConsole from 'vconsole' // 移动端调试工具

/* eslint-disable no-unused-vars */
// var vConsole = new VConsole()
// console.log('Hello world')

// 解决移动端点击延迟
fastclick.attach(document.body)

Vue.use(vueLazyload, {
  loading: require('components/recommend/origin.png') // 默认底图
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: Store,
  render: h => h(App)
})
