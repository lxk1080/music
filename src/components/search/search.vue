<template>
  <div class="search">
    <!--搜索框-->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
    </div>
    <!--热门搜索与历史搜索-->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <v-scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <!--热门搜索-->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--历史搜索-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="alertConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!--历史列表-->
            <search-list :searches="searchHistory" @selectOne="addQuery" @deleteOne="deleteOne"></search-list>
          </div>
        </div>
      </v-scroll>
    </div>
    <!--搜索结果-->
    <div class="search-result" ref="searchResult" v-show="query">
      <v-suggest ref="suggest" :query="query" @scrollStart="blurInput" @saveSearch="saveSearch"></v-suggest>
    </div>
    <!--弹窗组件-->
    <v-confirm ref="confirm" :text="text" @confirm="clearSearch"></v-confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import { fixBottomMixin } from 'common/js/mixin'
  import { mapActions, mapGetters } from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'

  export default {
    mixins: [fixBottomMixin],
    data() {
      return {
        query: '',
        hotKey: [],
        text: '确定清空所有搜索记录？'
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      ...mapActions([
        'saveSearchAction',
        'deleteSearchAction',
        'clearSearchAction'
      ]),
      handlerBottom(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      saveSearch(query) {
        this.saveSearchAction(query)
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      addQuery(key) {
        this.$refs.searchBox.addQuery(key)
      },
      queryChange(newQuery) {
        this.query = newQuery
      },
      deleteOne(item) {
        this.deleteSearchAction(item)
      },
      alertConfirm() {
        this.$refs.confirm.show()
      },
      clearSearch() {
        this.clearSearchAction()
        this.$refs.confirm.hide()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      }
    },
    watch: {
      query(newQuery) {
        if (newQuery === '') {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      'search-box': SearchBox,
      'v-suggest': Suggest,
      'search-list': SearchList,
      'v-confirm': Confirm,
      'v-scroll': Scroll
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
