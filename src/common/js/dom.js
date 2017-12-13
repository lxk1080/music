export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  var ClassArr = el.className.split(' ')
  ClassArr.push(className)
  el.className = ClassArr.join(' ')
}

export function removeClass (el, className) {
  if (!hasClass(el, className)) {
    return
  }
  var ClassArr = el.className.split(' ')
  var index = ClassArr.indexOf(className)
  ClassArr.splice(index, 1)
  el.className = ClassArr.join(' ')
}

export function hasClass (el, className) {
  var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData (el, name, val) {
  name = 'data-' + name
  if (val) {
    el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 获取元素距离屏幕可视区的高度
export function getTop (obj) {
  var top = 0
  while (obj) {
    top += obj.offsetTop
    obj = obj.offsetParent
  }
  return top
}
