<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getDiscSongs } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getDiscSongs()
    },
    computed: {
      title() {
        return this.desc.dissname
      },
      bgImage() {
        return this.desc.imgurl
      },
      ...mapGetters([
        'desc'
      ])
    },
    methods: {
      _getDiscSongs() {
        if (!this.desc.dissid) {
          this.$router.push({
            path: '/recommend'
          })
          return
        }
        getDiscSongs(this.desc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._dataHandler(res.cdlist[0].songlist)
          }
        })
      },
      _dataHandler(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      'music-list': MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
