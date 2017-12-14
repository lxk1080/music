/**
 * Created by lxk on 2017/12/12.
 */
import * as types from './mutation-types'

export const playSongActions = ({commit}, {list, index}) => {
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING, true)
}
