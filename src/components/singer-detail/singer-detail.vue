<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'  // 映射 this.singer 为 this.$store.state.singer (如果要用别名，可以用对象的形式映射)
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    created() {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer.mid) { // 刷新返回歌手列表
          this.$router.push({path: '/singer'})
          return
        }
        getSingerDetail(this.singer.mid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._dataHandle(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _dataHandle(list) {
        let data = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.songmid) {
            data.push(createSong(musicData))
          }
        })
        return data
      }
    },
    components: {
      'music-list': MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
