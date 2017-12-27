<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <div class="tab-wrapper" @click="moveLine" data-index="0">
        <span class="tab-link">推荐</span>
      </div>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <div class="tab-wrapper" @click="moveLine" data-index="1">
        <span class="tab-link">歌手</span>
      </div>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <div class="tab-wrapper" @click="moveLine" data-index="2">
        <span class="tab-link">排行</span>
      </div>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <div class="tab-wrapper" @click="moveLine" data-index="3">
        <span class="tab-link">搜索</span>
      </div>
    </router-link>

    <div class="line" ref="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  const TRANSITION = prefixStyle('transition')
  const TRANSFORM = prefixStyle('transform')

  export default {
    mounted() {
      let tabWrapper = document.getElementsByClassName('tab-wrapper')
      if (!localStorage.musicTab) {
        localStorage.musicTab = 0
      }
      tabWrapper[parseInt(localStorage.musicTab)].click()
    },
    methods: {
      moveLine(e) {
        let target = null
        let left = 0
        let child = e.target.getElementsByTagName('span')
        // 判断点击的是父元素还是子元素
        if (child.length) {
          left = parseInt(child[0].offsetLeft)
          target = e.target
        } else {
          left = parseInt(e.target.offsetLeft)
          target = e.target.parentNode
        }
        localStorage.musicTab = target.dataset.index
        this.$refs.line.style[TRANSITION] = '0.2s'
        this.$refs.line.style[TRANSFORM] = `translate3d(${left}px, 0, 0)`

        return false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .tab
    position: relative
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          // border-bottom: 2px solid $color-theme
    .line
      position absolute
      left: 0
      bottom: 6px
      width: 28px
      border-bottom: 2px solid $color-theme
</style>
