function CanvasUtils() {
  this.sin = CanvasUtils.sin
  this.cos = CanvasUtils.cos
  this.sqrtC = CanvasUtils.sqrtC
  this.radian = CanvasUtils.radian
  this.getRandom = CanvasUtils.getRandom
  this.getRandomColor = CanvasUtils.getRandomColor
}
// sin 根据角度计算点位
CanvasUtils.sin = function(deg) {
  return Math.sin(CanvasUtils.radian(deg))
}

// cos 根据角度计算点位
CanvasUtils.cos = function(deg) {
  return Math.cos(CanvasUtils.radian(deg))
}

// 跟据角度计算弧度
CanvasUtils.radian = function(deg) {
  return Math.PI * deg / 180
}

// 根据点位 计算角度
CanvasUtils.pointsToAngle = function(x1, y1, x2, y2) {
  const a = Math.abs(y2 - y1)
  const b = Math.abs(x2 - x1)
  let angle = Math.atan(a / b) * 180 / Math.PI

  if (x1 > x2) {
    angle = 180 - angle
    if (y1 > y2) {
      angle = 180 - angle + 180
    }
  } else if (y1 > y2) {
    angle = 360 - angle
  }
  return angle
}

// 直角三角形 斜边c
CanvasUtils.sqrtC = function(a, b) {
  return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)))
}

// 随机数
CanvasUtils.getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// 随机颜色
CanvasUtils.getRandomColor = function() {
  return `rgba(${CanvasUtils.getRandom(0, 255)}, ${CanvasUtils.getRandom(0, 255)}, ${CanvasUtils.getRandom(0, 255)}, 1)`
}

// 深度克隆
CanvasUtils.deepClone = function(source) {
  if (!source || typeof source !== 'object') {
    return source
    // throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = CanvasUtils.deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 返回变量的数据类型
CanvasUtils.typeOf = function(data) {
  return Object.prototype.toString
    .call(data)
    .slice(8, -1)
    .toLowerCase()
}

// 生成一个用不重复的ID， 时间戳+随机数
CanvasUtils.genNonDuplicateID = function() {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, 6)
  return idStr
}

module.exports = CanvasUtils
