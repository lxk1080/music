/**
 * Created by lxk on 2017/12/13.
 */
import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'

class Song {
  /**
   * @param id
   * @param mid 音乐编号
   * @param name 歌名
   * @param singer 歌手
   * @param album 专辑
   * @param duration 歌曲时长
   * @param image 专辑图片
   * @param url 歌曲链接
   */
  constructor ({id, mid, name, singer, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.name = name
    this.singer = singer
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    getLyric(this.mid).then((res) => {
      if (res.code === ERR_OK) {
        this.lyric = res.lyric
        console.log(res)
      }
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    singer: singerFilter(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function singerFilter (singer) {
  let data = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    data.push(item.name)
  })
  return data.join('/')
}
