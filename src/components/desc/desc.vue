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
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

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
        if (!this.desc.id) {
          this.$router.push({
            path: '/recommend'
          })
          return
        }
        getDiscInfo(this.desc.id).then((res) => {
          // ...
          console.log(111, res)

          if (res.code === ERR_OK) {
            const tracks = res.playlist.tracks

            getDiscSongs(tracks).then((res) => {
              if (res.code === ERR_OK) {
                // ...
                console.log(222, res)

                const data = res.data

                for (let i = 0, len = data.length; i < len; i++) {
                  tracks[i].url = data[i].url
                }

                // ...
                console.log('tracks', tracks)
              }
            })

            /*processSongsUrl(this._dataHandler(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs
            })*/
          }
        })
      },
      _dataHandler(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
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
