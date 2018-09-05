<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getDiscInfo, getDiscSongs } from 'api/recommend'
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
        return this.desc.name
      },
      bgImage() {
        return this.desc.coverImgUrl
      },
      ...mapGetters([
        'desc'
      ])
    },
    methods: {
      _getDiscSongs() {
        if (!this.desc.id) {
          this.$router.push({
            path: '/recommend'
          })
          return
        }
        // 获取歌单详情
        getDiscInfo(this.desc.id).then((res) => {
          if (res.code === ERR_OK) {
            const tracks = res.playlist.tracks
            // 歌单详情内只有所有歌曲的id，通过id获得歌单内的所有歌曲的url
            getDiscSongs(tracks).then((res) => {
              if (res.code === ERR_OK) {
                const data = res.data

                for (let i = 0, len = data.length; i < len; i++) {
                  tracks[i].url = data[i].url
                }
                this.songs = this._dataHandler(tracks)
              }
            })
          }
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
