const CanvasUtils = require('./utils')

class BoxPath {
  constructor({
    x,
    y,
    data,
    width,
    height,
    padding,
    ctx,
    maskCtx
  }) {
    this.id = CanvasUtils.genNonDuplicateID()
    this.ctx = ctx
    this.maskCtx = maskCtx
    this.x = x
    this.y = y
    this.data = data
    this.width = width
    this.padding = padding
    this.computedHeight(height)
    this.visible = true
    this.hovering = false
    this.imageReady = false
    this.loadImage()
    this.transform = 0
    this.createTime = Date.now()

    Reflect.set(BoxPath.pathsMap, this.id, this)
    Reflect.set(BoxPath.visiblesMap, this.id, this)
    BoxPath.total = Object.values(BoxPath.pathsMap).length
  }

  draw() {
    if (this.hovering) {
      this.transform = this.transform >= 10
        ? 10
        : this.transform + 1
      this.drawMaskHandler()
    } else {
      this.transform = this.transform <= 0
        ? 0
        : this.transform - 1
      this.transform && this.drawMaskHandler()
    }
    this.drawDeskHandler(this.ctx)
  }

  update() {
    this.checkPosition()
    this.visible && this.draw()
  }

  clear() {
    this.ctx.clearRect(
      this.x - this.transform,
      this.y - this.transform,
      this.width + this.transform * 2,
      this.height + this.transform * 2
    )
    this.maskCtx.clearRect(
      this.x - this.transform,
      this.y - this.transform,
      this.width + this.transform * 2,
      this.height + this.transform * 2
    )
  }

  // 检查坐标是否在可视区域
  checkPosition() {
    const old = this.visible
    this.visible = this.x >= (0 - this.width) &&
      this.x <= this.ctx.canvas.width &&
      this.y >= (0 - this.height) &&
      this.y <= this.ctx.canvas.height
    if (old && !this.visible) { // 隐藏了
      Reflect.deleteProperty(BoxPath.visiblesMap, this.id)
    } else if (!old && this.visible) { // 出现了
      Reflect.set(BoxPath.visiblesMap, this.id, this)
    }
  }

  // 加载图片
  loadImage() {
    if (!this.data.url) {
      Reflect.set(BoxPath.noDataMap, this.id, this)
      return
    }
    Reflect.deleteProperty(BoxPath.noDataMap, this.id)
    if (BoxPath.imagesMap.has(this.data.url)) {
      this.img = BoxPath.imagesMap.get(this.data.url)
      this.imageReady = true
      this.imgLoadTime = Date.now() - this.createTime
      this.computedImageRatio()
      this.drawImage(this.ctx)
    } else {
      this.img = new Image();
      this.img.src = this.data.url;
      this.img.onload = () => {
        this.imageReady = true
        BoxPath.imagesMap.set(this.data.url, this.img)
        this.imgLoadTime = Date.now() - this.createTime
        this.computedImageRatio()
        this.drawImage(this.ctx)
      }
    }
  }
  
  // 绘制遮罩层
  drawMaskHandler() {
    this.maskCtx.fillStyle = '#fff'
    this.maskCtx.fillRect(
      this.x - this.transform,
      this.y - this.transform,
      this.width + this.transform * 2,
      this.height + this.transform * 2
    )
    this.drawImage(this.maskCtx, this.transform)
  }

  // 绘制桌面
  drawDeskHandler() {
    this.path = new Path2D()
    this.hoverPath = new Path2D()
    this.path.rect(
      this.x,
      this.y,
      this.width,
      this.height
    )
    this.hoverPath.rect(
      this.x + 1,
      this.y + 1,
      this.width - 2,
      this.height - 2
    )
    this.ctx.fillStyle = '#fff'
    this.ctx.fill(this.path)
    this.ctx.fill(this.hoverPath)
    this.drawImage(this.ctx)
  }

  drawHandler(ctx) {
    this.path = new Path2D()
    this.hoverPath = new Path2D()
    this.path.rect(
      this.x,
      this.y,
      this.width,
      this.height
    )
    this.hoverPath.rect(
      this.x + 1,
      this.y + 1,
      this.width - 2,
      this.height - 2
    )
    ctx.fillStyle = '#fff'
    ctx.fillRect(
      this.x - this.transform,
      this.y - this.transform,
      this.width + this.transform * 2,
      this.height + this.transform * 2
    )
    ctx.fill(this.path)
    ctx.fill(this.hoverPath)

    this.drawImage(ctx)
  }
  // 绘制图片
  drawImage(ctx, transform = 0) {
    if (!this.imageReady) return this.drawIcon(ctx, transform)
    ctx.drawImage(
      this.img,
      this.renderX,
      this.renderY,
      this.renderWidth,
      this.renderHeight,
      this.x + this.padding - transform,
      this.y + this.padding - transform,
      this.rWidth + transform * 2,
      this.rHeight + transform * 2
    )
  }
  // 绘制默认图标
  drawIcon(ctx, transform) {
    const defaultPath = new Path2D()
    const x = this.x + this.padding - transform
    const y = this.y + this.padding - transform
    const width = this.width - 2 * this.padding + transform * 2
    const height = this.height - 2 * this.padding + transform * 2
    defaultPath.rect(x, y, width, height)
    ctx.fillStyle = '#f5f5f5'
    ctx.fill(defaultPath)

    const iconPath =  new Path2D()
    const iconX = Math.round((width - 100) / 2) + x
    const iconY = Math.round((height - 50) / 2) + y
    iconPath.arc(iconX + 25, iconY + 15, 5, 0, Math.PI * 2)
    iconPath.rect(iconX, iconY, 100, 50)
    iconPath.moveTo(iconX, iconY + 50)
    iconPath.lineTo(iconX + 30, iconY + 30)
    iconPath.lineTo(iconX + 60, iconY + 35)
    iconPath.lineTo(iconX + 100, iconY + 25)
    ctx.lineWidth = '2'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#999'
    ctx.stroke(iconPath)
  }
  // 高度计算
  computedHeight(heightData) {
    const { width, height } = this.data
    if (width && height) {
      const ratio = width / height
      this.height = this.width / ratio
    } else {
      this.height = CanvasUtils.typeOf(heightData) === 'array'
        ? CanvasUtils.getRandom(...heightData)
        : heightData
    }
  }
  // 图片居中绘制比例计算
  computedImageRatio() {
    this.imgWidth = this.img.width
    this.imgHeight = this.img.height
    const imgRatio = this.imgWidth / this.imgHeight
    this.rWidth = this.width - (this.padding * 2)
    this.rHeight = this.height - (this.padding * 2)
    const rRatio = this.rWidth / this.rHeight
    if (imgRatio >= rRatio) {
      this.renderHeight = this.imgHeight
      this.renderWidth = Math.round(this.rWidth / this.rHeight * this.imgHeight)
      this.renderY = 0
      this.renderX = Math.round((this.imgWidth - this.renderWidth) / 2)
    } else {
      this.renderWidth = this.imgWidth
      this.renderHeight = Math.round(this.rHeight / this.rWidth * this.imgWidth)
      this.renderX = 0
      this.renderY = Math.round((this.imgHeight - this.renderHeight) / 2)
    }
  }
}

BoxPath.pathsMap = {}
BoxPath.visiblesMap = {}
BoxPath.noDataMap = {}
BoxPath.imagesMap = new Map()

BoxPath.destroy = ids => {
  ids.forEach(id => {
    Reflect.deleteProperty(BoxPath.pathsMap, id)
    Reflect.deleteProperty(BoxPath.visiblesMap, id)
    Reflect.deleteProperty(BoxPath.noDataMap, id)
  })
  BoxPath.total = Object.values(BoxPath.pathsMap).length
}

module.exports = BoxPath
