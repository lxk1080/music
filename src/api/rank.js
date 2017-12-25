/**
 * Created by lxk on 2017/12/25.
 */
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

// 获取排行榜的类型
export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 获取排行榜某种类型的歌曲列表
export function getMusicList (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    topid: id,
    type: 'top',
    page: 'detail',
    tpl: 3,
    uin: 0
  })

  return jsonp(url, data, options)
}
