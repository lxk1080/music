/**
 * Created by lxk on 2017/12/12.
 */
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

// 当前歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const desc = state => state.desc

export const topList = state => state.topList
