/**
 * Created by lxk on 2017/12/12.
 */
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/Util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

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

export const randomPlayAction = ({commit}, {list}) => {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}
