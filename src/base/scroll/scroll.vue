<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    props: {
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
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        this.slider = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          bounce: 900
        })
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
        // 这里要用绑定上下文（也就是绑定到调用此组件的环境内），如果直接调用会作用于当前组件vue实例
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
