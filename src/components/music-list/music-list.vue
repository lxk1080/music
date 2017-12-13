<template>
  <div class="music-list">
    <!--返回-->
    <div class="back">
      <i class="icon-back" @click="back()"></i>
    </div>
    <!--banner-->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="BgImageStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <!--适应层-->
    <div class="bg-layer" ref="layer"></div>
    <!--歌曲列表-->
    <v-scroll class="list" ref="list" :data="songs" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
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

  const RESERVED_HEIGHT = 40

  export default {
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
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.go(-1)
      }
    },
    watch: {
      scrollY(newY) {
        let percent = Math.abs(newY / this.imageHeight)
        if (newY < 0) { // 向上滚动时
          let translateY = Math.max(this.minTranslateY, newY)
          this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
          this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
          let zIndex = 0
          if (newY < this.minTranslateY) {
            zIndex = 10
            this.$refs.bgImage.style['paddingTop'] = 0
            this.$refs.bgImage.style['height'] = RESERVED_HEIGHT + 'px'
          } else {
            this.$refs.bgImage.style['paddingTop'] = this.imageHeight + 'px'
            this.$refs.bgImage.style['height'] = 0
          }
          this.$refs.bgImage.style['zIndex'] = zIndex
          let blur = Math.min(50 * percent, 50)
          this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
          this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        }
        if (newY > 0) { // 向下滚动时
          let scale = 1 + percent
          this.$refs.bgImage.style['transform'] = `scale(${scale})`
          this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
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
