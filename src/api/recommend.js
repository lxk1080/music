import { commonParams } from './config'
import axios from 'axios'

// 获取banner
export function getBanners () {
  const url = '/banner'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单
export function getDiscList () {
  const url = '/top/playlist/highquality'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单详情
export function getDiscInfo(id) {
  const url = `/playlist/detail?id=${id}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单里的音乐
export function getDiscSongs(tracks) {
  const ids = []

  for (let i = 0; i < tracks.length; i++) {
    ids.push(tracks[i].id)
  }

  const url = `/music/url?id=${ids.join(',')}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}
