import axios from 'axios'

// 获取banner
export function getBanners () {
  const url = '/banner'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取精品歌单(看到歌单名字 , 但看不到具体歌单内容)
export function getDiscList () {
  const url = '/top/playlist/highquality'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单详情(调用此接口 , 传入歌单 id, 可以获取对应歌单内的所有的音乐的 id)
export function getDiscInfo(id) {
  const url = `/playlist/detail?id=${id}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单里的音乐url
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

// 检查音乐是否可用
export function checkMusic(songId) {
  const url = `/check/music?id=${songId}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}
