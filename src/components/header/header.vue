<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Cloud Music</h1>
    <router-link to="/user" tag="div" class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable" // ~common 表示相对 common，在 webpack 配置了 common 的 alias，就能找到了它的路径
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      background-image: url("logo.png")
      background-size: 30px 32px
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      color #e51419
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 18px
        color: $color-theme
</style>
