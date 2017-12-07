/**
 * Created by lxk on 2017/11/28.
 */
import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  url += ((url.indexOf('?') < 0) ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    var value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }

  // 如果存在参数，将第一个'&'删除
  return url ? url.substring(1) : ''
}
