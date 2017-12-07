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
