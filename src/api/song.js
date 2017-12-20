/**
 * Created by lxk on 2017/12/20.
 */
import {commonParams} from './config'
import axios from 'axios'

export function getLyric (mid) {
  const url = 'api/getLyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data)
  })
}
