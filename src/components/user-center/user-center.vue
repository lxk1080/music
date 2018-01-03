<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <v-switches :switches="switches" :currentIndex="currentIndex" @tabCls="tabCls"></v-switches>
      </div>
      <div class="play-btn" @click="randomPlay">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <!--我喜欢的-->
        <v-scroll class="list-scroll" v-if="currentIndex===0" ref="favoriteList" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @playSong="playSong"></song-list>
          </div>
        </v-scroll>
        <!--最近播放-->
        <v-scroll class="list-scroll" v-if="currentIndex===1" ref="playHistory" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @playSong="playSong"></song-list>
          </div>
        </v-scroll>
      </div>
      <div class="no-result-wrapper" v-show="getShow">
        <no-result :title="getTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import { mapGetters, mapActions } from 'vuex'
  import NoResult from 'base/no-result/no-result'
  import { Song } from 'common/js/song'
  import { fixBottomMixin } from 'common/js/mixin'

  export default {
    mixins: [fixBottomMixin],
    data() {
      return {
        switches: [
          {name: '我喜欢的'},
          {name: '最近播放'}
        ],
        currentIndex: 0,
        title: '您还没有喜欢的歌曲呢'
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'favoriteList'
      ]),
      getShow() {
        return this.currentIndex === 0 ? !this.favoriteList.length : !this.playHistory.length
      },
      getTitle() {
        if (this.currentIndex === 0) {
          return '您还没有喜欢的歌曲哦'
        } else {
          return '您最近似乎并没听歌呢'
        }
      }
    },
    methods: {
      ...mapActions([
        'saveFavoriteAction',
        'deleteFavoriteAction',
        'playSongAction',
        'randomPlayAction'
      ]),
      handlerBottom(playList) {
        let bottom = playList.length > 0 ? '60px' : 0
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playHistory && this.$refs.playHistory.refresh()
      },
      back() {
        this.$router.back()
      },
      tabCls(index) {
        this.currentIndex = index
      },
      playSong(song, index) {
        let musicList = this._getCurrentList()
        this.playSongAction({
          list: musicList,
          index: index
        })
      },
      randomPlay() {
        let musicList = this._getCurrentList()
        if (!musicList.length) {
          return
        }
        this.randomPlayAction({
          list: musicList
        })
      },
      _getCurrentList() {
        let musicList = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        musicList = musicList.map((item) => {
          return new Song(item)
        })
        return musicList
      }
    },
    components: {
      'v-switches': Switches,
      'v-scroll': Scroll,
      'song-list': SongList,
      'no-result': NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 120px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 5px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
