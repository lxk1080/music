import { getLyric, getSongsUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export class Song {
  /**
   * @param id 音乐编号
   * @param mid mv编号
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
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('纯音乐，请欣赏')
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mv,
    name: musicData.name,
    singer: singerFilter(musicData.ar),
    album: musicData.al.name,
    duration: musicData.dt / 1000, // 单位: s
    image: musicData.al.picUrl,
    // url: musicData.url
    url: `http://music.163.com/song/media/outer/url?id=${musicData.id}.mp3` // 解决上面url的403问题
  })
}

export function singerFilter (singer) {
  let data = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    data.push(item.name)
  })
  return data.join('/')
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo
      midUrlInfo.forEach((info, index) => {
        let song = songs[index]
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
      })
    }
    return songs
  })
}
