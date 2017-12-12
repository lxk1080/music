<template>
  <v-scroll class="listview" ref="listview" :listenScroll="true" :probeType="3" @scroll="scroll">
    <!--滚动列表（scroll内的第一个元素）-->
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" @click="entryDetail(item)">
            <img class="avatar" v-lazy="item.avatar" alt="img">
            <div class="name">{{item.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
    <!--右侧快速入口-->
    <div class="list-shortcut">
      <ul>
        <li class="item"
            v-for="(item,index) in shortcutList"
            :data-index="index"
            :class="{current: currentIndex===index}"
            @touchstart="start"
            @touchmove.stop.prevent="move"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <!--固定标题-->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <!--loading-->
    <div class="loading-container" v-show="!data.length">
      <v-loading></v-loading>
    </div>
  </v-scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  // import {getData} from 'common/js/dom' // 获取自定义属性的方法，不需要

  // 每个锚点的高度(例如 A，B，C，... ，根据样式计算而来)
  const ANCHOR_HEIGHT = 18
  // 滚动固定标题的高度
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        scrollY: 0, // 滚动时Y轴的值，注意向上滚动时Y为负值
        currentIndex: 0,  // 滚动监听用
        posY: 0,  // 为scrollY的绝对值
        diff: 0  // 控制滚动时顶动动画的
      }
    },
    created() {
      this.touch = {} // 记录触摸时手指所在位置距离屏幕上边缘的高度
      this.listHeights = []  // 记录滚动列表每个元素的高度
    },
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      },
      fixedTitle() {
        // 向下拉动时，隐藏fixedTitle
        if (this.posY > 0) {
          return ''
        }
        // 这里的细节（一定要先判断数据来没来）
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      entryDetail(singer) {
        this.$emit('entryDetail', singer)
      },
      start(e) {
        let index = e.target.dataset.index
        let position = e.touches[0] // 获取第一个手指的位置
        this.touch.y1 = position.pageY // 获取这个位置的高度（距离屏幕上边缘的高度）
        this.touch.index = index // 记录一开始点击时的索引
        this._scrollToElement(index)
      },
      move(e) {
        let position = e.touches[0]
        this.touch.y2 = position.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0  // 获得滑过的锚点个数（'或0'向下取整）
        let index = parseInt(this.touch.index) + delta
        this._scrollToElement(index)
      },
      scroll(pos) {
        this.posY = pos.y
        this.scrollY = Math.abs(this.posY | 0)
      },
      _scrollToElement(index) {
        this.currentIndex = parseInt(index)
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 1000)
      },
      _calcHeight() {
        this.listHeights = []
        let height = 0
        this.listHeights.push(height)
        let listGroup = this.$refs.listGroup
        for (let i = 0, len = listGroup.length; i < len; i++) {
          let item = listGroup[i]
          height += item.clientHeight
          this.listHeights.push(height)
        }
      }
    },
    watch: {
      data() {
       setTimeout(() => {
         this._calcHeight()
       }, 20)
      },
      scrollY(newY) {
        for (let i = 0, len = this.listHeights.length; i < len; i++) {
          let height1 = this.listHeights[i]
          let height2 = this.listHeights[i + 1]
          if (!height2 || (newY >= height1 && newY < height2)) {
            this.currentIndex = i
            this.diff = height2 + this.posY
            break
          }
        }
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      'v-scroll': Scroll,
      'v-loading': Loading
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
        // margin-top -1px // 消除空隙
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
        // margin-top -1px // 消除空隙
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
