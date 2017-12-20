/**
 * Created by lxk on 2017/12/20.
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌
export function shuffle (arr) {
  let newArr = arr.slice()
  for (let i = 0; i < newArr.length; i++) {
    let j = getRandomInt(0, i)
    let tmp = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = tmp
  }
  return newArr
}
