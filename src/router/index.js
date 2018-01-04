import Vue from 'vue'
import VueRouter from 'vue-router'
// import Rank from 'components/rank/rank'
// import Recommend from 'components/recommend/recommend'
// import Search from 'components/search/search'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Desc from 'components/desc/desc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

Vue.use(VueRouter)

// 路由懒加载
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Desc = () => import('components/desc/desc')
const TopList = () => import('components/top-list/top-list')
const UserCenter = () => import('components/user-center/user-center')

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
      path: '/user',
      component: UserCenter
    }
  ]
})
