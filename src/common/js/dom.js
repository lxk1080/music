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