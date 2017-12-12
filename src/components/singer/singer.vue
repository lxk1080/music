<template>
  <div class="singer">
    <v-listview :data="singers" @entryDetail="entryDetail"></v-listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import { mapMutations } from 'vuex'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      entryDetail(singer) {
        // 调用 router.push(...)等同于<router-link :to="...">
        this.$router.push({
          path: `/singer/${singer.mid}`, // 到指定的路由
          query: {}  // 可传递参数
        })
        this.setSinger(singer)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'  // 映射 this.setSinger(param) 为 this.$store.commit('SET_SINGER', param)，如果不改名，可以用数组方式映射
      }),
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._dataHandle(res.data.list)
          }
        })
      },
      // 数据处理
      _dataHandle(array) {
        // 对处理后的数据进行装载
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        array.forEach((item, index) => {
          // 热门数据
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
          }
          // 聚合数据（A~Z）
          var key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
        })

        // 按照需要对数据进行排序
        let hot = []
        let ret = []
        for (let key in map) {
          let value = map[key]
          if (value.title.match(/[a-zA-Z]/)) {
            ret.push(value)
          } else if (map[key].title === HOT_NAME) {
            hot.push(value)
          }
        }
        ret.sort((v1, v2) => {
          return v1.title.charCodeAt(0) - v2.title.charCodeAt(0)
        })

        return hot.concat(ret)
      }
    },
    components: {
      'v-listview': Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
