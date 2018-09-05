/**
 * Created by lxk on 2017/12/26.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

// 获取热门搜素关键词
export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    needNewCode: 0,
    loginUin: 0,
    hostUin: 0
  })

  return jsonp(url, data, options)
}

// 获取搜索结果
export function musicSearch (query, page, zhida, perpage) {
  const url = 'api/search'

  const data = Object.assign({}, commonParams, {
    uin: '0',
    platform: 'h5',
    needNewCode: '1',
    w: query,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: '0',
    flag: '1',
    ie: 'utf-8',
    sem: '1',
    aggr: '0',
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
