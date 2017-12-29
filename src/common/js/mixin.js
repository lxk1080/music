/**
 * Created by Administrator on 2017/12/23.
 */
import { mapGetters } from 'vuex'

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

}
