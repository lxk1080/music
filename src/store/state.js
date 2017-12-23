/**
 * Created by lxk on 2017/12/12.
 */
import { playMode } from 'common/js/config'

const state = {
  singer: {}, // 歌手对象

  playing: false, // 播放/暂停

  fullScreen: false, // 全屏/mini

  playList: [], // 播放列表

  sequenceList: [], // 顺序播放列表

  mode: playMode.sequence, // 播放模式

  currentIndex: -1, // 在播放列表中当前播放索引

  desc: {} // 歌单对象
}

export default state
