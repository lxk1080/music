/**
 * Created by Administrator on 2017/12/23.
 */
import { mapGetters, mapMutations } from 'vuex'
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

// 播放模式切换
export const modeChangeMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'mode',
      'currentSong'
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
