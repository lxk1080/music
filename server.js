/**
 * Created by lxk on 2018/1/4.
 */
const express = require('express')
const config = require('./config/index')
const axios = require('axios')

const port = process.env.port || config.build.port

const app = express()

const apiRouter = express.Router()

app.use('/api', apiRouter)

apiRouter.get('/getDiscList', (req, res) => {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

apiRouter.get('/getLyric', (req, res) => {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    // 这里虽然传递的format是json，但是返回的还是jsonp数据，做一下处理
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1]) // matches[0]: 整个匹配项 matches[1]: 匹配子表达式
      }
    }
    res.json(ret)
  }).catch((err) => {
    console.log(err)
  })
})

apiRouter.get('/getDiscSongs', (req, res) => {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

app.use(express.static('./dist'))

app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at port ' + port)
})
