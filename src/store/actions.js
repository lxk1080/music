/**
 * Created by lxk on 2017/12/12.
 */
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/Util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

/**
 * 歌单播放歌曲（有播放列表）
 * @param commit
 * @param state
 * @param list
 * @param index
 */
export const playSongAction = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list)

  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    index = findIndex(randomList, list[index])
    commit(types.SET_PLAY_LIST, randomList)
  } else {
    commit(types.SET_PLAY_LIST, list)
  }

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

/**
 * 随机播放（有播放列表）
 * @param commit
 * @param list
 */
export const randomPlayAction = ({commit}, {list}) => {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

/**
 * 从搜索的歌曲中播放（插入播放列表）
 * @param commit
 * @param state
 * @param song
 */
export const insertSongAction = ({commit, state}, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 记录下当前的歌曲
  let currentSong = playList[currentIndex]
  // 判断待插入的歌是否已在播放列表中，并返回索引
  let index = findIndex(playList, song)
  // 插入播放列表
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 如果存在这首歌，则将已存在的这首歌删除
  if (index > -1) {
    if (currentIndex > index) {
      playList.splice(index, 1)
      currentIndex--
    } else {
      playList.splice(index + 1, 1)
    }
  }

  // 记录当前歌曲在顺序列表中的索引
  let csIndex = findIndex(sequenceList, currentSong)
  // 判断要插入的歌是否已在顺序列表中
  let sqIndex = findIndex(sequenceList, song)
  // 插入顺序列表
  csIndex++
  sequenceList.splice(csIndex, 0, song)
  // 如果要插入的歌已存在，则将已存在的这首歌删除
  if (sqIndex > -1) {
    if (csIndex > sqIndex) {
      sequenceList.splice(sqIndex, 1)
    } else {
      sequenceList.splice(sqIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}

/**
 * 保存搜索历史
 * @param commit
 * @param query
 */
export const saveSearchAction = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

/**
 * 删除一个搜索历史
 * @param commit
 * @param query
 */
export const deleteSearchAction = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

/**
 * 清空搜索历史
 * @param commit
 */
export const clearSearchAction = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

/**
 * 从播放列表中删除一首歌
 * @param commit
 * @param state
 * @param song
 */
export const deleteSongAction = ({commit, state}, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  // 第二个条件为: 当currentSong为最后一首歌，并且删除的也是最后一首歌时
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  if (!playList.length) {
    commit(types.SET_PLAYING, false)
  }

  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

/**
 * 清空播放列表
 * @param commit
 * @param state
 */
export const clearSongListAction = ({commit}) => {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING, false)
}

/**
 * 保存歌曲到最近播放
 * @param commit
 * @param song
 */
export const savePlayAction = ({commit}, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

/**
 * 收藏歌曲
 * @param commit
 * @param song
 */
export const saveFavoriteAction = ({commit}, song) => {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

/**
 * 取消收藏
 * @param commit
 * @param song
 */
export const deleteFavoriteAction = ({commit}, song) => {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
