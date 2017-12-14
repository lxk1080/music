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

// 获取与设置自定义属性
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

// 判断浏览器供应商
let vendor = (() => {
  let elementStyle = document.createElement('div').style
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    o: 'oTransform',
    ms: 'msTransform',
    standard: 'Transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

// 返回对应的带有浏览器前缀的样式属性
export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
