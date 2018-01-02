<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!--搜索框-->
      <div class="search-box-wrapper">
        <search-box :placeholder="placeholder" @query="queryChange" ref="searchBox"></search-box>
      </div>
      <!--tab-->
      <div class="shortcut" v-show="!query">
        <!--tab组件-->
        <v-switches :switches="switches" :currentIndex="currentIndex" @tabCls="tabCls"></v-switches>
        <div class="list-wrapper">
          <!--最近播放-->
          <v-scroll class="list-scroll" v-if="currentIndex===0" ref="playHistory" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @playSong="selectSong"></song-list>
            </div>
          </v-scroll>
          <!--搜索历史-->
          <v-scroll class="list-scroll" v-if="currentIndex===1" ref="searchHistory" :data="searchHistory">
            <div class="list-inner">
              <search-list :searches="searchHistory" @selectOne="addQuery" @deleteOne="deleteOne"></search-list>
            </div>
          </v-scroll>
        </div>
      </div>
      <!--搜索结果-->
      <div class="search-result" v-show="query">
        <v-suggest :query="query" :showSinger="showSinger" @scrollStart="blurInput" @saveSearch="saveSearch"></v-suggest>
      </div>
      <!--添加提示-->
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">已添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import { searchMixin } from 'common/js/mixin'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import { Song } from 'common/js/song'
  import { mapGetters, mapActions } from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import TopTip from 'base/top-tip/top-tip'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        placeholder: '搜索歌曲',
        showSinger: false,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ],
        currentIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
    methods: {
      ...mapActions([
        'insertSongAction'
      ]),
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.playHistory.refresh()
          } else {
            this.$refs.searchHistory.refresh()
          }
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      tabCls(index) {
        this.currentIndex = index
      },
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSongAction(new Song(song))
          this.showTip()
        }
      },
      showTip() {
        this.$refs.topTip.show()
      }
    },
    components: {
      'search-box': SearchBox,
      'v-suggest': Suggest,
      'v-switches': Switches,
      'v-scroll': Scroll,
      'song-list': SongList,
      'search-list': SearchList,
      'top-tip': TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        left: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 18px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
