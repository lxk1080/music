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
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  // 前端通过axios发起ajax请求到node，再由node发起http请求到接口（node可以改变请求头的信息）
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌单里的歌曲
export function getDiscSongs(dissid) {
  const url = '/api/getDiscSongs'

  const data = Object.assign({}, commonParams, {
    type: '1',
    json: '1',
    utf8: '1',
    onlysong: 0,
    disstid: dissid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
