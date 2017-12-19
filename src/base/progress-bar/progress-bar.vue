<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner" @click="progressClick">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchstart"
           @touchmove.prevent="progressTouchmove"
           @touchend="progressTouchend"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  // 进度球的宽
  const progressBtnWidth = 16
  const TRANSFORM = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchstart(e) {
        this.touch.running = true // 触摸开始
        this.touch.startX = e.touches[0].pageX // 记录一开始触摸时的位置
        this.touch.oldOffsetWidth = this.$refs.progress.clientWidth // 记录开始的进度
      },
      progressTouchmove(e) {
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 总长度
        let delta = e.touches[0].pageX - this.touch.startX // 拖动距离
        let offsetWidth = Math.min(barWidth, Math.max(0, this.touch.oldOffsetWidth + delta)) // 偏移量最小0，最大是总长
        this._offset(offsetWidth)
      },
      progressTouchend() {
        this.touch.running = false // 触摸结束
        this._percentChange()
      },
      progressClick(e) {
        this._offset(e.offsetX)
        this._percentChange()
      },
      _percentChange() {
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent) // 通知父组件此次的改变
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = offsetWidth + 'px' // 进度条
        this.$refs.progressBtn.style[TRANSFORM] = `translate3d(${offsetWidth}px, 0, 0)`  // 进度球
      }
    },
    watch: {
      percent(newPercent) {
        if (this.touch.running) {
          return
        }
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        let offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
