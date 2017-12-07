<template>
  <v-scroll class="listview" ref="listview">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar" alt="img">
            <div class="name">{{item.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li class="item" v-for="(item,index) in shortcutList" :data-index="index" @touchstart="start" @touchmove.stop.prevent="move">{{item}}</li>
      </ul>
    </div>
  </v-scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  // import {getData} from 'common/js/dom' // 获取自定义属性的方法，不需要

  // 每个锚点的高度(例如 A，B，C，... ，根据样式计算而来)
  const ANCHOR_HEIGHT = 18

  export default {
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      }
    },
    methods: {
      start(e) {
        var index = e.target.dataset.index
        let position = e.touches[0] // 获取第一个手指的位置
        this.touch.y1 = position.pageY // 获取这个位置的高度（距离屏幕上边缘的高度）
        this.touch.index = index // 记录一开始点击时的索引
        this._scrollToElement(index)
      },
      move(e) {
        let position = e.touches[0]
        this.touch.y2 = position.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0  // 获得滑过的锚点个数
        let index = parseInt(this.touch.index) + delta
        this._scrollToElement(index)
      },
      _scrollToElement(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    components: {
      'v-scroll': Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
