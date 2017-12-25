<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend" @click="moveLine(1)">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer" @click="moveLine(2)">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank" @click="moveLine(3)">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search" @click="moveLine(4)">
      <span class="tab-link">搜索</span>
    </router-link>

    <div class="line" ref="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  const TRANSITION = prefixStyle('transition')
  const TRANSFORM = prefixStyle('transform')

  export default {
    methods: {
      moveLine(num) {
        console.log(123)
        this.$refs.line.style[TRANSITION] = '0.3s'
        this.$refs.line.style[TRANSFORM] = `translate3d(${parseInt(num) * 30}px, 0, 0)`

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
          border-bottom: 2px solid $color-theme
    .line
      position absolute
      left: 32px
      bottom: 3px
      width: 30px
      border-bottom: 2px solid $color-theme
</style>
