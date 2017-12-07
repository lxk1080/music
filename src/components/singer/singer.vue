<template>
  <div class="singer">
    <v-listview :data="singers"></v-listview>

    <!--loading-->
    <div class="loading-container" v-show="!singers.length">
      <v-loading></v-loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import Loading from 'base/loading/loading'

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
      'v-listview': Listview,
      'v-loading': Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .loading-container
      position: absolute
      width: 100%
      top: 30%
      transform: translateY(-50%)
</style>
