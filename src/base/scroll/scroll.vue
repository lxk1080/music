<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    props: {
      // 派发 scroll 事件的时机
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      // 是否开启滚动监听
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 是否开启上拉加载
      pullUp: {
        type: Boolean,
        default: false
      },
      // 是否开启开始滚动时通知
      beforeScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.slider = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          bounceTime: 500
        })

        if (this.listenScroll) {
          let me = this
          this.slider.on('scroll', (pos) => { // pos是滚动位置的对象
            // 此环境的this会指向 better-scroll
            me.$emit('scroll', pos)
          })
        }

        if (this.pullUp) {
          this.slider.on('scrollEnd', () => {
            // maxScrollY也为负值
            if (this.slider.y < this.slider.maxScrollY + 50) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.slider.on('beforeScrollStart', () => {
            this.$emit('scrollStart')
          })
        }
      },
      enable() {
        this.slider && this.slider.enable()
      },
      disable() {
        this.slider && this.slider.disable()
      },
      refresh() {
        this.slider && this.slider.refresh()
      },
      scrollTo() {
        // 这里的绑定上下文（还是绑定到better-scroll的环境内），只是为了更方便的传递数目不定的参数
        this.slider && this.slider.scrollTo.apply(this.slider, arguments)
      },
      scrollToElement() {
        this.slider && this.slider.scrollToElement.apply(this.slider, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
