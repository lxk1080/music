import axios from "axios/index";

// 获取歌手列表
export function getSingerList () {
  const url = '/toplist/artist'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌手详情
export function getSingerDetail (mid) {
  const url = `/artists?id=${mid}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}
