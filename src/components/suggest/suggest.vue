<template>
  <v-scroll class="suggest"
            :data="result"
            :pullUp="pullUp"
            @scrollToEnd="searchMore"
            ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="text">
          <p class="name" v-html="getDisplayName(item)"></p>
          <p class="desc" v-html="getDisplayDesc(item)"></p>
        </div>
      </li>
      <v-loading :title="loadingTitle" v-show="hasMore"></v-loading>
    </ul>
  </v-scroll>
</template>

<script type="text/ecmascript-6">
  import { musicSearch } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  const TYPE_SINGER = 'singer'
  const PERPAGE = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullUp: true,
        hasMore: true,
        hasLock: false,
        loadingTitle: '加载中...'
      }
    },
    methods: {
      getIcon(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return item.name
        }
      },
      getDisplayDesc(item) {
        if (item.type === TYPE_SINGER) {
          return `单曲：${item.songnum} · 专辑：${item.albumnum}`
        } else {
          return item.singer + ' - ' + item.album
        }
      },
      search() {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        musicSearch(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        // 如果全部加载完
        if (!this.hasMore) {
          return
        }
        // 如果被锁上
        if (this.hasLock) {
          return
        }
        this.hasLock = true // 加锁
        this.page++
        musicSearch(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
          if (res.code === ERR_OK) {
            this.result = [...this.result, ...this._genResult(res.data)]
            this._checkMore(res.data)
          }
          this.hasLock = false // 开锁
        }).catch(() => {
          this.hasLock = false // 开锁
        })
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = [...ret, ...this._dataHandler(data.song.list)]
        }
        return ret
      },
      _dataHandler(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore(data) {
        let song = data.song
        if (!song.list.length || song.curnum + (song.curpage - 1) * PERPAGE >= song.totalnum) {
          this.hasMore = false
        }
      }
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      'v-scroll': Scroll,
      'v-loading': Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding: 10px 0
        border-bottom: $lineColor solid 1px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .text
        flex: 1
        font-size: $font-size-medium
        overflow: hidden
        .name
          no-wrap()
          color: $color-text-l
        .desc
          no-wrap()
          color: $color-text-d
          padding-top 8px
          font-size 13px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
