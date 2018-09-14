/**
 * Created by lxk on 2017/12/7.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from "axios/index";

// 获取歌手列表
export function getSingerList () {
  // const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const url = '/toplist/artist'

  /*const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0
  })*/

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取歌手详情
export function getSingerDetail (mid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: mid,
    order: 'listen',
    begin: 0,
    num: 50,
    songstatus: 1
  })

  return jsonp(url, data, options)
}
