<!--轮播图组件-->
<template>
  <div class="slider" ref="slide">
    <div class="slider-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{'active': currentPageIndex === index}"></span>
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
        default: 3000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSlideWidth() // 设置滑块的总宽度
        this._initDots() // 初始化滑动分页器
        this._initSlider() // 启动better-scroll
        if (this.autoPlay) {
          this._autoPlay() // 自动播放
        }
      }, 20)
      // 窗口大小重置时重新计算滑块的宽度并刷新 better-scroll
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSlideWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSlideWidth(isResize) {
        this.children = this.$refs.slideGroup.children
        let width = 0
        let sliderWidth = this.$refs.slide.clientWidth
        for (var i = 0; i < this.children.length; i++) {
          let child = this.children[i]

          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'

          width += sliderWidth
        }

        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }

        this.$refs.slideGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop, // 循环切换
            threshold: 0.3,  // 拖动百分比触发切换
            speed: 400 // 过渡时间
          },
          click: true // better-scroll的click事件会阻止默认的click事件
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          // 如果设置循环，则在原本滑块的开头和末尾各加一个过渡滑块，此时所有原本滑块的索引加一
          if (this.loop) {
            pageIndex = pageIndex - 1
          }
          this.currentPageIndex = pageIndex

          if (this._autoPlay) {
            // 每次滑动后重置定时器，防止在手动滑动后发生立即再一次滑动的情况发生
            clearTimeout(this.timer)
            this._autoPlay()
          }
        })
      },
      _autoPlay() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex = pageIndex + 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed() {
      // 当切换路由时，释放资源
      clearTimeout(this.timer)
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
