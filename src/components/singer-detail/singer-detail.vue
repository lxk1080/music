<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { getDiscSongs } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
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
          const hotSongs = res.hotSongs;
          getDiscSongs(hotSongs).then((res) => {
            if (res.code === ERR_OK) {
              const data = res.data

              for (let i = 0, len = data.length; i < len; i++) {
                hotSongs[i].url = data[i].url
              }
              this.songs = this._dataHandler(hotSongs)
            }
          })
        })
      },
      _dataHandler(list) {
        let ret = []
        for (let i = 0; i < list.length; i++) {
          ret.push(createSong(list[i]))
        }
        return ret
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
