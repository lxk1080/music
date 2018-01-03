/**
 * Created by Administrator on 2017/12/23.
 */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/Util'

// 当Mini屏出现时，修复底边距
export const fixBottomMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlerBottom(this.playList)
  },
  activated() {
    this.handlerBottom(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlerBottom(this.playList)
    }
  },
  methods: {
    handlerBottom(playList) {
      throw new Error('this component must be implemented method of handlerBottom!')
    }
  }
}

// 播放模式切换与收藏功能
export const modeChangeMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'mode',
      'currentSong',
      'favoriteList'
    ]),
    iconMode() {
      if (this.mode === playMode.sequence) {
        return 'icon-sequence'
      }
      if (this.mode === playMode.random) {
        return 'icon-random'
      }
      return 'icon-loop'
    }
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteAction',
      'deleteFavoriteAction'
    ]),
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteAction(song)
      } else {
        this.saveFavoriteAction(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    isFavorite(song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    modeChange() {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 获取当前歌曲在新列表里的索引
      let index = this._getNewIndex(list, this.currentSong)
      // js执行一句的时间几微秒，nextTick的时间大约几毫秒，这两句的执行对于一次nextTick来说，是同时进行的
      this.setPlayList(list)
      this.setCurrentIndex(index)
    },
    _getNewIndex(list, song) {
      return list.findIndex((item) => {
        return item.id === song.id
      })
    }
  }
}

// 关于搜索的一些业务逻辑
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchAction',
      'deleteSearchAction'
    ]),
    saveSearch(query) {
      this.saveSearchAction(query)
      if (this.$refs.topTip) {
        this.showTip()
      }
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(key) {
      this.$refs.searchBox.addQuery(key)
    },
    queryChange(newQuery) {
      this.query = newQuery
    },
    deleteOne(item) {
      this.deleteSearchAction(item)
    }
  }
}
