<template>
  <div class="music-list">
    <!--返回-->
    <div class="back">
      <i class="icon-back" @click="back()"></i>
    </div>
    <!--banner-->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="BgImageStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="play" @click="randomPlay">
          <span class="icon-play"></span>
          <div class="text">随机播放全部</div>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!--辅助层-->
    <div class="bg-layer" ref="layer"></div>
    <!--歌曲列表-->
    <v-scroll class="list" ref="list" :data="songs" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @playSong="playSong" ></song-list>
      </div>
      <!--loading-->
      <div class="loading-container" v-show="!songs.length">
        <v-loading></v-loading>
      </div>
    </v-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import { prefixStyle } from 'common/js/dom'
  import { mapActions } from 'vuex'
  import { fixBottomMixin } from 'common/js/mixin'

  const RESERVED_HEIGHT = 40
  const TRANSFORM = prefixStyle('transform')
  const BACKDROP_FILTER = prefixStyle('backdropFilter')
  const BOX_SHADOW = prefixStyle('boxShadow')

  export default {
    mixins: [fixBottomMixin],
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        probeType: 3,
        listenScroll: true,
        scrollY: 0
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      // 获取组件的dom元素写法
      this.$refs.list.$el.style.top = this.imageHeight + 'px'
    },
    computed: {
      BgImageStyle() {
        return {
          backgroundImage: `url(${this.bgImage})`
        }
      }
    },
    methods: {
      handlerBottom(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapActions([
        'playSongAction',
        'randomPlayAction'
      ]),
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      playSong(song, index) {
        this.playSongAction({
          list: this.songs,
          index: index
        })
      },
      randomPlay() {
        this.randomPlayAction({
          list: this.songs
        })
      }
    },
    watch: {
      scrollY(newY) {
        let percent = Math.abs(newY / this.imageHeight)
        // 向上滚动时
        if (newY < 0) {
          let translateY = Math.max(this.minTranslateY, newY)
          // 让辅助层偏移
          this.$refs.layer.style[TRANSFORM] = `translate3d(0, ${translateY}px, 0)`
          // 改变图片的层级以及高度，改变随机播放按钮的显隐
          let zIndex = 0
          if (newY > this.minTranslateY) {
            this.$refs.bgImage.style['paddingTop'] = this.imageHeight + 'px'
            this.$refs.bgImage.style['height'] = 0
            this.$refs.play.style.display = 'block'
            // 消除阴影
            this.$refs.bgImage.style[BOX_SHADOW] = 'none'
          } else {
            zIndex = 10
            this.$refs.bgImage.style['paddingTop'] = 0
            this.$refs.bgImage.style['height'] = RESERVED_HEIGHT + 'px'
            this.$refs.play.style.display = 'none'
            // 渐隐效果
            this.$refs.bgImage.style[BOX_SHADOW] = '0 0 15px 15px #242424'
          }
          this.$refs.bgImage.style['zIndex'] = zIndex
          // 模糊效果
          let blur = Math.min(20 * percent, 20)
          this.$refs.filter.style[BACKDROP_FILTER] = `blur(${blur}px)`
        }
        // 向下滚动时
        if (newY > 0) {
          // 使图片扩大并改变层级
          let scale = 1 + percent
          this.$refs.bgImage.style[TRANSFORM] = `scale(${scale})`
          this.$refs.bgImage.style['zIndex'] = 10
        }
      }
    },
    components: {
      'v-scroll': Scroll,
      'song-list': SongList,
      'v-loading': Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
      // background-image -webkit-gradient(linear, left top, left 10px, from(rgba(36,36,36,1)), to(36,36,36,0))
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
