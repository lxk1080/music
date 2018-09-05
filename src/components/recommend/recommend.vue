<template>
  <div class="recommend" ref="recommend">
    <v-scroll ref="scroll" class="recommend-content" :data="descList">
      <!--滚动区域-->
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <v-slider>
            <div v-for="(item,index) in banners" :key="index">
              <!--这里需要处理不同的请求 song/mv/link ? -->
              <a :href="item.url">
                <img @load="loadImage" :src="item.picUrl" alt="pic">
              </a>
            </div>
          </v-slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in descList" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.coverImgUrl" alt="img" width="60" height="60">
              </div>
              <div class="text">
                <div class="name" v-html="item.name"></div>
                <div class="desc" v-html="item.copywriter"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--loading-->
      <div class="loading-container" v-show="!descList.length">
        <v-loading></v-loading>
      </div>
    </v-scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import {getBanners, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import { fixBottomMixin } from 'common/js/mixin'
  import { mapMutations } from 'vuex'

  export default {
    mixins: [fixBottomMixin],
    data() {
      return {
        banners: [],
        descList: []
      }
    },
    created() {
      this._getBanners()
      this._getDiscList()
    },
    methods: {
      ...mapMutations({
        setDesc: 'SET_DESC'
      }),
      handlerBottom(playList) {
        const bottom = playList.length > 0 ? '60px' : 0
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.id}`
        })
        this.setDesc(item)
      },
      _getBanners() {
        getBanners().then((res) => {
          if (res.code === ERR_OK) {
            this.banners = res.banners
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.descList = res.playlists
          }
        })
      },
      // 当图片撑开时，刷新 better-scroll
      loadImage() {
        if (!this.checked) {
          this.$refs.scroll.refresh()
          this.checked = true
        }
      }
    },
    components: {
      'v-slider': Slider,
      'v-scroll': Scroll,
      'v-loading': Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
