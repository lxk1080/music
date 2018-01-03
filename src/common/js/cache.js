/**
 * Created by lxk on 2017/12/28.
 */
import storage from 'good-storage'

const SEARCH_KEY = '__SEARCH__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 100

const FAVERITE_KEY = '__favorite__'
const FAVORITE_MAX_LEM = 100

/**
 * 保存搜索历史
 * @param query
 * @return {Array}
 */
export function saveSearch (query) {
  // 从localStorage中获得
  let historyArr = storage.get(SEARCH_KEY, [])
  // 执行插入操作（插入到数组的第一位）
  insertToArray(historyArr, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  // 保存到localStorage
  storage.set(SEARCH_KEY, historyArr)
  // 返回给vuex
  return historyArr
}

/**
 * 删除搜索历史
 * @param query
 * @return {Array}
 */
export function deleteSearch (query) {
  let historyArr = storage.get(SEARCH_KEY, [])
  deteleFromArray(historyArr, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, historyArr)
  return historyArr
}

/**
 * 清空搜索历史
 * @return {Array}
 */
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

/**
 * 从localStorage中获得搜索历史，返回给vuex
 * @return {Array}
 */
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

/**
 * 保存到最近播放
 * @param song
 * @return {*}
 */
export function savePlay (song) {
  let historyArr = storage.get(PLAY_KEY, [])
  insertToArray(historyArr, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, historyArr)
  return historyArr
}

/**
 * 从localStorage中获得最近播放的歌曲，返回给vuex
 * @return {*}
 */
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

/**
 * 收藏歌曲
 * @param song
 */
export function saveFavorite (song) {
  let songsArr = storage.get(FAVERITE_KEY, [])
  insertToArray(songsArr, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LEM)
  storage.set(FAVERITE_KEY, songsArr)
  return songsArr
}

/**
 * 取消收藏
 * @param song
 */
export function deleteFavorite (song) {
  let songsArr = storage.get(FAVERITE_KEY, [])
  deteleFromArray(songsArr, (item) => {
    return item.id === song.id
  })
  storage.set(FAVERITE_KEY, songsArr)
  return songsArr
}

/**
 * 从localStorage中获得收藏的歌曲，返回给vuex
 * @return {*}
 */
export function loadFavorite () {
  return storage.get(FAVERITE_KEY, [])
}

// 往数组插入一个元素
function insertToArray (arr, query, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(query)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 从数组删除一个元素
function deteleFromArray (arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
