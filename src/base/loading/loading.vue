<template>
  <div class="loading">
    <img src="./loading.gif" alt="img" :width="size" :height="size">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '载入中...'
      },
      size: {
        type: Number,
        default: 30
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width 100%
    text-align center
    .desc
      line-height 20px
      font-size $font-size-small
      color: $color-text-l

</style>
