<template>
  <div class="slider" ref="slide">
    <div class="slider-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 1000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSlideWidth()
        this._initSlider()
      }, 20)
    },
    methods: {
      _setSlideWidth() {
        this.children = this.$refs.slideGroup.children
        let width = 0
        let sliderWidth = this.$refs.slide.clientWidth
        for (var i = 0; i < this.children.length; i++) {
          let child = this.children[i]

          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'

          width += sliderWidth
        }

        if (this.loop) {
          width += 2 * sliderWidth
        }

        this.$refs.slideGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop, // 循环切换
            threshold: 0.3,  // 拖动百分比触发切换
            speed: 400 // 切换的速度
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
