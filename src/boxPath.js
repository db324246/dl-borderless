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
    // this.color = CanvasUtils.getRandomColor()
    this.color = '#fff'
    this.visible = true
    this.hovering = false
    this.imageReady = false
    this.loadImage()
    this.transform = 0

    Reflect.set(BoxPath.pathsMap, this.id, this)
    Reflect.set(BoxPath.visiblesMap, this.id, this)
    BoxPath.total = Object.values(BoxPath.pathsMap).length
  }

  draw() {
    if (this.hovering) {
      this.transform = this.transform >= 10
        ? 10
        : this.transform + 1
      this.drawHandler(this.maskCtx, this.transform)
    } else {
      this.transform = this.transform <= 0
        ? 0
        : this.transform - 1
      this.transform && this.drawHandler(this.maskCtx, this.transform)
    }
    this.drawHandler(this.ctx)
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

  loadImage() {
    if (!this.data.url) return
    this.img = new Image();
    this.img.src = this.data.url;
    this.img.onload = () => {
      this.imageReady = true
      this.computedImageRatio()
      this.ctx.drawImage(
        this.img,
        this.renderX,
        this.renderY,
        this.renderWidth,
        this.renderHeight,
        this.x + this.padding - this.transform,
        this.y + this.padding - this.transform,
        this.rWidth + this.transform * 2,
        this.rHeight + this.transform * 2
      )
    }
  }

  drawHandler(ctx, transform = 0) {
    ctx.fillStyle = this.color
    this.path = new Path2D()
    this.path.rect(
      this.x + 1,
      this.y + 1,
      this.width - 2,
      this.height - 2
    )
    ctx.fillRect(
      this.x - transform,
      this.y - transform,
      this.width + transform * 2,
      this.height + transform * 2
    )
    ctx.fill(this.path)

    this.imageReady && ctx.drawImage(
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

BoxPath.destroy = ids => {
  ids.forEach(id => {
    Reflect.deleteProperty(BoxPath.pathsMap, id)
    Reflect.deleteProperty(BoxPath.visiblesMap, id)
  })
  BoxPath.total = Object.values(BoxPath.pathsMap).length
}

module.exports = BoxPath
