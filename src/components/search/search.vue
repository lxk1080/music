<template>
  <div class="search">
    <!--搜索框-->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
    </div>
    <!--热门搜索-->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" @click="addQuery(item)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--搜索结果-->
    <div class="search-result" ref="searchResult" v-show="query">
      <v-suggest ref="suggest" :query="query" @scrollStart="blurInput"></v-suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import { fixBottomMixin } from 'common/js/mixin'

  export default {
    mixins: [fixBottomMixin],
    data() {
      return {
        query: '',
        hotKey: []
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      handlerBottom(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      addQuery(item) {
        this.$refs.searchBox.addQuery(item.k)
      },
      queryChange(newQuery) {
        this.query = newQuery
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      }
    },
    components: {
      'search-box': SearchBox,
      'v-suggest': Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 165px
      bottom: 0
</style>
