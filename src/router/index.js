import Vue from 'vue'
import VueRouter from 'vue-router'
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import Tab from 'components/tab/tab'
import SingerDetail from 'components/singer-detail/singer-detail'
import Desc from 'components/desc/desc'
import TopList from 'components/top-list/top-list'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':dissid',
          component: Desc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':mid',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':mid',  // 子路由的值为动态路由（变量）
          component: SingerDetail
        }
      ]
    },
    {
      path: '/tab',
      component: Tab
    }
  ]
})
