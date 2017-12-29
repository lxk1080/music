<template>
  <div class="player" v-show="playList.length">
    <!--全屏-->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="setMini">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart="midTouchstart"
             @touchmove="midTouchmove"
             @touchend="midTouchend">
          <!--图片-->
          <div class="middle-l" v-show="showPic" ref="cd">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :class="isRotate" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" ref="playingLyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--歌词-->
          <v-scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   :class="{'current': currentLineNum==index}"
                   v-for="(line,index) in currentLyric.lines"
                   ref="lyricLine"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </v-scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': activeDot=='cd'}"></span>
            <span class="dot" :class="{'active': activeDot=='lyric'}"></span>
          </div>
          <!--进度条-->
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | timeFilter}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="getPercent" @percentChange="doPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{totalTime | timeFilter}}</span>
          </div>
          <!--播放相关控制-->
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="modeChange"></i>
            </div>
            <div class="icon i-left" :class="isDisable">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="isDisable">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="isDisable">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--mini屏-->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
            <img width="40" height="40" :src="currentSong.image" :class="isRotate">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="getPercent">
            <i class="icon-mini" :class="playIconMini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--播放列表-->
    <v-playlist ref="playlist"></v-playlist>
    <!--播放器-->
    <!--
      oncanplay: 当文件就绪可以开始播放时（这里是为了防止快速切歌的标志位）
      onerror: 文件加载期间发生错误时（发生错误时songReady也得为true，否则就切不了歌了）
      onended: 歌曲播放完成时
    -->
    <audio :src="currentSong.url" ref="audio"
           @canplay="songCanplay"
           @error="songError"
           @ended="songEnd"
           @timeupdate="doSomething"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import animations from 'create-keyframe-animation'
  import { prefixStyle } from 'common/js/dom'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import { playMode } from 'common/js/config'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'
  import { modeChangeMixin } from 'common/js/mixin'

  const TRANSFORM = prefixStyle('transform')
  const TRANSITION = prefixStyle('transition')
  // const TRANSFORM_ORIGIN = prefixStyle('transformOrigin')

  export default {
    mixins: [modeChangeMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        totalTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        showPic: true,
        activeDot: 'cd',
        playingLyric: ''
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      isRotate() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      playIconMini() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      isDisable() {
        return this.songReady ? '' : 'disable'
      },
      getPercent() {
        return this.currentTime / this.totalTime
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'playing',
        'currentIndex'
      ])
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING'
      }),
      showPlaylist() {
        this.$refs.playlist.show()
      },
      setMini() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        // 定义一个动画
        let animation = {
          0: {
            transform: `translate3d(${-x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }
        // 注册动画
        animations.registerAnimation({
          name: 'move',
          animation: animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        // 指定执行动画的dom（这个时候事实上是在dom上挂载了一个css动画）
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        // 注销动画并且清除dom上的动画属性
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style['animation'] = 'none'
      },
      leave(el, done) {
        this.$refs.cdWrapper.style['transition'] = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[TRANSFORM] = `translate3d(${-x}px, ${y}px, 0) scale(${scale})`

        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style['transtion'] = 'none'
        this.$refs.cdWrapper.style[TRANSFORM] = 'none'
      },
      togglePlaying() {
        if (!this.songReady) {
          return
        }
        this.setPlaying(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prevSong() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
        }
        this.songReady = false
      },
      nextSong() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
        }
        this.songReady = false
      },
      songCanplay(e) {
        this.songReady = true
        this.totalTime = e.target.duration
      },
      songError() {
        this.songReady = true
        this.totalTime = 0
        this.timer = setInterval(() => {
          if (this.currentLyric) {
            this.currentLyric.lines.splice(0, this.currentLyric.lines.length, {time: 0, txt: '该歌曲为付费内容！'})
            this.playingLyric = this.currentLyric.lines[0].txt

            clearTimeout(this.timer)
          }
        }, 100)
      },
      songEnd() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.nextSong()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      doSomething(e) {
        this.currentTime = e.target.currentTime
      },
      doPercentChange(percent) {
        const currentTime = this.totalTime * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.setPlaying(true)
        }
        // 到对应的歌词
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000) // 单位ms
        }
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this._handler)
          console.log(this.currentLyric)
          if (this.currentLyric.lines.length === 0) {
            let tab = {time: 0, txt: ''}
            for (let i = 0; i < 5; i++) {
              this.currentLyric.lines.push(tab)
            }
            this.currentLyric.lines.push({time: 1, txt: '纯音乐，请欣赏'})
          }
          this.currentLyric.play()
        }).catch(() => {
          this.currentLyric = null
          this.currentLineNum = 0
          this.playingLyric = ''
        })
      },
      _handler({lineNum, txt}) {
        this.currentLineNum = lineNum
        this.playingLyric = txt
        if (lineNum > 5) {
          let docEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(docEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      },
      midTouchstart(e) {
        this.touch.running = true
        this.touch.percent = 0
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      midTouchmove(e) {
        if (!this.touch.running) {
          return
        }
        let deltaX = e.touches[0].pageX - this.touch.startX
        let deltaY = e.touches[0].pageY - this.touch.startY
        // 如果是滚动歌词的操作，则不在cd与lyric之间切换
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        // 获取此时lyric的左边距
        let left = this.activeDot === 'cd' ? 0 : -window.innerWidth
        let offset = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offset / window.innerWidth)

        this.$refs.lyricList.$el.style[TRANSITION] = '0s'
        this.$refs.lyricList.$el.style[TRANSFORM] = `translate3d(${offset}px, 0, 0)`
        this.$refs.cd.style.opacity = 1 - this.touch.percent
      },
      midTouchend() {
        this.touch.running = false
        if (this.touch.percent === 0) {
          return
        }
        this.$refs.lyricList.$el.style[TRANSITION] = '0.3s'
        this.$refs.cd.style[TRANSITION] = '0.3s'
        let offset = null
        let opacity = null
        if (this.activeDot === 'cd') {
          if (this.touch.percent > 0.1) {
            offset = -window.innerWidth
            opacity = 0
            this.activeDot = 'lyric'
          } else {
            offset = 0
            opacity = 1
          }
        } else if (this.activeDot === 'lyric') {
            if (this.touch.percent < 0.9) {
              offset = 0
              opacity = 1
              this.activeDot = 'cd'
            } else {
              offset = -window.innerWidth
              opacity = 0
            }
        }
        this.$refs.lyricList.$el.style[TRANSFORM] = `translate3d(${offset}px, 0, 0)`
        this.$refs.cd.style.opacity = opacity
      },
      /**
       * 得到大图与小图圆心的x轴y轴的距离和缩放比例
       * @return {{x: number, y: number, scale: number}}
       * @private
       */
      _getPosAndScale() {
        let targetWidth = window.innerWidth * 0.8 // 大图的宽
        let top = 80 // 大图距离屏幕的上边距
        let miniWidth = 40 // 小图的宽
        let scale = miniWidth / targetWidth // 缩放比例
        let left = 20 + miniWidth / 2 // 小图圆心距离屏幕左边距
        let bottom = 10 + miniWidth / 2 //  小图圆心距离屏幕下边距
        let x = window.innerWidth / 2 - left // 大图与小图的x轴距离
        let y = window.innerHeight - top - targetWidth / 2 - bottom // 大图与小图的y轴距离

        return { x, y, scale }
      }
    },
    filters: {
      timeFilter(time) {
        time = time | 0
        let minute = time / 60 | 0
        let second = time % 60
        if (second < 10) {
          second = '0' + second
        }
        return `${minute}:${second}`
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentLyric = null
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.setPlaying(true)
          this.getLyric()
        }, 1000)
      },
      playing(newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }
      // 监听当前歌词
      /* currentLineNum() {
        if (!this.i) {
          this.i = 0
        }
        this.i = this.i - 360
        this.$refs.playingLyric.style[TRANSITION] = '0.3s'
        this.$refs.playingLyric.style[TRANSFORM_ORIGIN] = '0 0'
        this.$refs.playingLyric.style[TRANSFORM] = `rotate(${this.i}deg)`
      } */
    },
    components: {
      'progress-bar': ProgressBar,
      'progress-circle': ProgressCircle,
      'v-scroll': Scroll,
      'v-playlist': Playlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              letter-spacing: 1px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              height: 32px
              line-height: 32px
              letter-spacing: 1px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(.66, -0.37, .37, 1.35)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini
          font-size: 30px
          color: $color-theme-d
        .icon-playlist
          font-size: 30px
          color: $color-theme-l
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
