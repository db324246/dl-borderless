this.DlBorderless = (function () {
  'use strict';

  function CanvasUtils$2() {
    this.sin = CanvasUtils$2.sin;
    this.cos = CanvasUtils$2.cos;
    this.sqrtC = CanvasUtils$2.sqrtC;
    this.radian = CanvasUtils$2.radian;
    this.getRandom = CanvasUtils$2.getRandom;
    this.getRandomColor = CanvasUtils$2.getRandomColor;
  }
  // sin 根据角度计算点位
  CanvasUtils$2.sin = function (deg) {
    return Math.sin(CanvasUtils$2.radian(deg));
  };

  // cos 根据角度计算点位
  CanvasUtils$2.cos = function (deg) {
    return Math.cos(CanvasUtils$2.radian(deg));
  };

  // 跟据角度计算弧度
  CanvasUtils$2.radian = function (deg) {
    return Math.PI * deg / 180;
  };

  // 根据点位 计算角度
  CanvasUtils$2.pointsToAngle = function (x1, y1, x2, y2) {
    const a = Math.abs(y2 - y1);
    const b = Math.abs(x2 - x1);
    let angle = Math.atan(a / b) * 180 / Math.PI;
    if (x1 > x2) {
      angle = 180 - angle;
      if (y1 > y2) {
        angle = 180 - angle + 180;
      }
    } else if (y1 > y2) {
      angle = 360 - angle;
    }
    return angle;
  };

  // 直角三角形 斜边c
  CanvasUtils$2.sqrtC = function (a, b) {
    return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
  };

  // 随机数
  CanvasUtils$2.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 随机颜色
  CanvasUtils$2.getRandomColor = function () {
    return `rgba(${CanvasUtils$2.getRandom(0, 255)}, ${CanvasUtils$2.getRandom(0, 255)}, ${CanvasUtils$2.getRandom(0, 255)}, 1)`;
  };

  // 深度克隆
  CanvasUtils$2.deepClone = function (source) {
    if (!source || typeof source !== 'object') {
      return source;
      // throw new Error('error arguments', 'shallowClone')
    }

    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = CanvasUtils$2.deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    });
    return targetObj;
  };

  // 返回变量的数据类型
  CanvasUtils$2.typeOf = function (data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
  };

  // 生成一个用不重复的ID， 时间戳+随机数
  CanvasUtils$2.genNonDuplicateID = function () {
    let idStr = Date.now().toString(36);
    idStr += Math.random().toString(36).substr(3, 6);
    return idStr;
  };
  var utils = CanvasUtils$2;

  const CanvasUtils$1 = utils;
  class BoxPath$1 {
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
      this.id = CanvasUtils$1.genNonDuplicateID();
      this.ctx = ctx;
      this.maskCtx = maskCtx;
      this.x = x;
      this.y = y;
      this.data = data;
      this.width = width;
      this.padding = padding;
      this.computedHeight(height);
      this.color = CanvasUtils.getRandomColor()
      // this.color = '#fff';
      this.visible = true;
      this.hovering = false;
      this.imageReady = false;
      this.loadImage();
      this.transform = 0;
      Reflect.set(BoxPath$1.pathsMap, this.id, this);
      Reflect.set(BoxPath$1.visiblesMap, this.id, this);
      BoxPath$1.total = Object.values(BoxPath$1.pathsMap).length;
    }
    draw() {
      if (this.hovering) {
        this.transform = this.transform >= 10 ? 10 : this.transform + 1;
        this.drawHandler(this.maskCtx, this.transform);
      } else {
        this.transform = this.transform <= 0 ? 0 : this.transform - 1;
        this.transform && this.drawHandler(this.maskCtx, this.transform);
      }
      this.drawHandler(this.ctx);
    }
    update() {
      this.checkPosition();
      this.visible && this.draw();
    }
    clear() {
      this.ctx.clearRect(this.x - this.transform, this.y - this.transform, this.width + this.transform * 2, this.height + this.transform * 2);
      this.maskCtx.clearRect(this.x - this.transform, this.y - this.transform, this.width + this.transform * 2, this.height + this.transform * 2);
    }
    checkPosition() {
      const old = this.visible;
      this.visible = this.x >= 0 - this.width && this.x <= this.ctx.canvas.width && this.y >= 0 - this.height && this.y <= this.ctx.canvas.height;
      if (old && !this.visible) {
        // 隐藏了
        Reflect.deleteProperty(BoxPath$1.visiblesMap, this.id);
      } else if (!old && this.visible) {
        // 出现了
        Reflect.set(BoxPath$1.visiblesMap, this.id, this);
      }
    }
    loadImage() {
      if (!this.data.url) return;
      this.img = new Image();
      this.img.src = this.data.url;
      this.img.onload = () => {
        this.imageReady = true;
        this.computedImageRatio();
        this.ctx.drawImage(this.img, this.renderX, this.renderY, this.renderWidth, this.renderHeight, this.x + this.padding - this.transform, this.y + this.padding - this.transform, this.rWidth + this.transform * 2, this.rHeight + this.transform * 2);
      };
    }
    drawHandler(ctx, transform = 0) {
      ctx.fillStyle = this.color;
      this.path = new Path2D();
      this.path.rect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
      ctx.fillRect(this.x - transform, this.y - transform, this.width + transform * 2, this.height + transform * 2);
      ctx.fill(this.path);
      this.imageReady && ctx.drawImage(this.img, this.renderX, this.renderY, this.renderWidth, this.renderHeight, this.x + this.padding - transform, this.y + this.padding - transform, this.rWidth + transform * 2, this.rHeight + transform * 2);
    }
    computedHeight(heightData) {
      const {
        width,
        height
      } = this.data;
      if (width && height) {
        const ratio = width / height;
        this.height = this.width / ratio;
      } else {
        this.height = CanvasUtils$1.typeOf(heightData) === 'array' ? CanvasUtils$1.getRandom(...heightData) : heightData;
      }
    }
    computedImageRatio() {
      this.imgWidth = this.img.width;
      this.imgHeight = this.img.height;
      const imgRatio = this.imgWidth / this.imgHeight;
      this.rWidth = this.width - this.padding * 2;
      this.rHeight = this.height - this.padding * 2;
      const rRatio = this.rWidth / this.rHeight;
      if (imgRatio >= rRatio) {
        this.renderHeight = this.imgHeight;
        this.renderWidth = Math.round(this.rWidth / this.rHeight * this.imgHeight);
        this.renderY = 0;
        this.renderX = Math.round((this.imgWidth - this.renderWidth) / 2);
      } else {
        this.renderWidth = this.imgWidth;
        this.renderHeight = Math.round(this.rHeight / this.rWidth * this.imgWidth);
        this.renderX = 0;
        this.renderY = Math.round((this.imgHeight - this.renderHeight) / 2);
      }
    }
  }
  BoxPath$1.pathsMap = {};
  BoxPath$1.visiblesMap = {};
  BoxPath$1.destroy = ids => {
    ids.forEach(id => {
      Reflect.deleteProperty(BoxPath$1.pathsMap, id);
      Reflect.deleteProperty(BoxPath$1.visiblesMap, id);
    });
    BoxPath$1.total = Object.values(BoxPath$1.pathsMap).length;
  };
  var boxPath = BoxPath$1;

  const BoxPath = boxPath;
  const CanvasUtils = utils;
  class DlBorderless {
    constructor(config = {}) {
      this.validateConfig(config);
      const {
        el,
        data,
        width,
        height,
        maxsize,
        boxWidth,
        boxHeight,
        className,
        boxPadding,
        draggable,
        mousehover,
        animation,
        animationSpeed
      } = config;
      if (width && height) {
        this.containerWidth = width;
        this.containerHeight = height;
      } else {
        this.containerWidth = window.innerWidth;
        this.containerHeight = window.innerHeight;
      }
      this.data = CanvasUtils.deepClone(data || []);
      this.parentDom = document.querySelector(el) || document.body;
      this.className = className;
      this.draggable = draggable;
      this.mousehover = mousehover;
      this.animation = animation;
      this.animationSpeed = animationSpeed || {};
      this.maxsize = maxsize || 500;
      this.boxWidth = boxWidth || 150;
      this.boxHeight = boxHeight || [150, 300];
      this.boxPadding = boxPadding !== undefined ? boxPadding : 5;
      this.boxRect = []; // path 矩阵
      this.firstScreen = true;
      this.initContainer();
    }
    validateConfig(config) {
      const typeOf = CanvasUtils.typeOf;
      if (typeOf(config) !== 'object') {
        throw new Error('config must be a object');
      }
      if (Reflect.has(config, 'el') && typeOf(config.el) !== 'string') {
        throw new Error("el must be a string");
      }
      if (Reflect.has(config, 'animationSpeed') && typeOf(config.animationSpeed) !== 'object') {
        throw new Error('animationSpeed must be a object');
      }
      if (Reflect.has(config, 'boxHeight')) {
        if (!['number', 'array'].includes(typeOf(config.boxHeight))) {
          throw new Error('boxHeight must be a number or a array for random range');
        }
      }
      if (Reflect.has(config, 'data')) {
        const data = config.data;
        if (typeOf(data) !== 'array') {
          throw new Error('data must be a array');
        }
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          if (typeOf(item) !== 'object') {
            throw new Error('data item must be a object');
          }
          if (typeOf(item.url) !== 'string') {
            throw new Error("item's url is required and must be a string");
          }
          if (Reflect.has(item, 'width') && typeOf(item.width) !== 'number') {
            throw new Error("item's width must be a number");
          }
          if (Reflect.has(item, 'height') && typeOf(item.height) !== 'number') {
            throw new Error("item's height must be a number");
          }
        }
      }
    }
    initContainer() {
      this.container = document.createElement('div');
      this.container.className = this.className;
      this.container.style.position = 'relative';
      this.container.style.width = this.containerWidth + 'px';
      this.container.style.height = this.containerHeight + 'px';
      this.createCanvas();
      this.parentDom.appendChild(this.container);
    }
    createCanvas() {
      // 底层画布
      this.canvas = document.createElement('canvas');
      this.canvas.style.display = 'block';
      this.canvas.width = this.containerWidth;
      this.canvas.height = this.containerHeight;
      this.ctx = this.canvas.getContext('2d');
      this.registerEvents();
      // 上层画布
      this.maskCanvas = document.createElement('canvas');
      this.maskCanvas.style.position = 'absolute';
      this.maskCanvas.style.left = 0;
      this.maskCanvas.style.top = 0;
      this.maskCanvas.style.pointerEvents = 'none';
      this.maskCanvas.width = this.containerWidth;
      this.maskCanvas.height = this.containerHeight;
      this.maskCtx = this.maskCanvas.getContext('2d');
      this.registerHover();
      this.container.appendChild(this.canvas);
      this.container.appendChild(this.maskCanvas);
    }
    draw() {
      this.drawFirstScreen();
      this.registerAnimation();
    }

    // 首屏绘制
    drawFirstScreen() {
      const centerPoint = {
        x: this.containerWidth / 2,
        y: this.containerHeight / 2
      };
      const firstBox = new BoxPath({
        x: Math.ceil(centerPoint.x - this.boxWidth / 2),
        ctx: this.ctx,
        maskCtx: this.maskCtx,
        width: this.boxWidth,
        height: this.boxHeight,
        padding: this.boxPadding,
        data: this.getDataItem()
      });
      firstBox.y = Math.ceil(centerPoint.y - firstBox.height / 2);
      firstBox.draw();
      const firstRow = [];
      firstRow.push(firstBox);
      this.boxRect.push(firstRow);

      // 递归补漏
      const recursionHole = () => {
        const hasHole = this.drawHole();
        console.log(hasHole ? '补漏了' : '完全没漏');
        if (BoxPath.total > this.maxsize) return;
        hasHole && recursionHole();
      };
      recursionHole();
      this.firstScreen = false;
    }

    // -------- 补漏绘制 -----------
    // 首行补漏
    checkFirstRowHole(ctx) {
      const visiblePaths = Object.values(BoxPath.visiblesMap);
      for (let x = 0; x <= this.containerWidth; x += this.boxWidth) {
        if (visiblePaths.every(i => !ctx.isPointInPath(i.path, x, 0))) {
          console.log('首行漏了');
          if (BoxPath.total > this.maxsize) {
            console.log('尾行容量溢出', BoxPath.total);
            const deleteRow = this.boxRect.pop();
            BoxPath.destroy(deleteRow.map(i => i.id));
          }
          const firstRow = this.boxRect[0];
          const row = firstRow.map(i => {
            const pic = new BoxPath({
              ctx,
              x: i.x,
              maskCtx: this.maskCtx,
              width: this.boxWidth,
              height: this.boxHeight,
              padding: this.boxPadding,
              data: this.getDataItem()
            });
            pic.y = i.y - pic.height;
            pic.update();
            return pic;
          });
          this.boxRect.unshift(row);
          return true;
        }
      }
      return false;
    }
    // 尾行补漏
    checkLastRowHole(ctx) {
      const visiblePaths = Object.values(BoxPath.visiblesMap);
      for (let x = 0; x <= this.containerWidth; x += this.boxWidth) {
        if (visiblePaths.every(i => !ctx.isPointInPath(i.path, x, this.containerHeight))) {
          console.log('尾行漏了');
          if (BoxPath.total > this.maxsize) {
            console.log('首行容量溢出', BoxPath.total);
            const deleteRow = this.boxRect.shift();
            BoxPath.destroy(deleteRow.map(i => i.id));
          }
          const lastRow = this.boxRect[this.boxRect.length - 1];
          const row = lastRow.map(i => {
            const pic = new BoxPath({
              ctx,
              x: i.x,
              y: i.y + i.height,
              maskCtx: this.maskCtx,
              width: this.boxWidth,
              height: this.boxHeight,
              padding: this.boxPadding,
              data: this.getDataItem()
            });
            pic.update();
            return pic;
          });
          this.boxRect.push(row);
          return true;
        }
      }
      return false;
    }
    // 首列补漏
    checkFirstColHole(ctx) {
      const visiblePaths = Object.values(BoxPath.visiblesMap);
      const firstCol = this.boxRect.map(i => i[0]);
      for (let y = 0; y <= this.containerHeight; y += this.containerHeight) {
        if (visiblePaths.every(i => !ctx.isPointInPath(i.path, 0, y))) {
          console.log('首列漏了');
          if (BoxPath.total > this.maxsize) {
            console.log('尾列容量溢出', BoxPath.total);
            BoxPath.destroy(this.boxRect.reduce((p, c) => {
              const deleteBox = c.pop();
              p.push(deleteBox.id);
              return p;
            }, []));
          }
          let rowIndex = 0;
          const newCol = [];
          while (rowIndex < firstCol.length) {
            const sidePic = firstCol[rowIndex];
            let y = 0;
            if (rowIndex > 0) {
              const prevPic = newCol[rowIndex - 1];
              y = prevPic.y + prevPic.height;
            } else {
              y = firstCol[0].y;
            }
            const pic = new BoxPath({
              ctx,
              y,
              x: sidePic.x - this.boxWidth,
              maskCtx: this.maskCtx,
              width: this.boxWidth,
              height: this.boxHeight,
              padding: this.boxPadding,
              data: this.getDataItem()
            });
            newCol.push(pic);
            this.boxRect[rowIndex].unshift(pic);
            pic.update();
            rowIndex++;
          }
          return true;
        }
      }
      return false;
    }
    // 尾列补漏
    checkLastColHole(ctx) {
      const visiblePaths = Object.values(BoxPath.visiblesMap);
      const lastCol = this.boxRect.map(i => i[i.length - 1]);
      for (let y = 0; y <= this.containerHeight; y += this.containerHeight) {
        if (visiblePaths.every(i => !ctx.isPointInPath(i.path, this.containerWidth, y))) {
          console.log('尾列漏了');
          if (BoxPath.total > this.maxsize) {
            console.log('首列容量溢出', BoxPath.total);
            BoxPath.destroy(this.boxRect.reduce((p, c) => {
              const deleteBox = c.shift();
              p.push(deleteBox.id);
              return p;
            }, []));
          }
          let rowIndex = 0;
          const newCol = [];
          while (rowIndex < lastCol.length) {
            const sidePic = lastCol[rowIndex];
            let y = 0;
            if (rowIndex > 0) {
              const prevPic = newCol[rowIndex - 1];
              y = prevPic.y + prevPic.height;
            } else {
              y = lastCol[0].y;
            }
            const pic = new BoxPath({
              ctx,
              y,
              x: sidePic.x + this.boxWidth,
              maskCtx: this.maskCtx,
              width: this.boxWidth,
              height: this.boxHeight,
              padding: this.boxPadding,
              data: this.getDataItem()
            });
            newCol.push(pic);
            this.boxRect[rowIndex].push(pic);
            pic.update();
            rowIndex++;
          }
          return true;
        }
      }
      return false;
    }
    drawHole() {
      let hasHole = false;
      hasHole = this.checkFirstRowHole(this.ctx);
      hasHole = this.checkLastRowHole(this.ctx) || hasHole;
      hasHole = this.checkFirstColHole(this.ctx) || hasHole;
      hasHole = this.checkLastColHole(this.ctx) || hasHole;
      return hasHole;
    }

    // 取数据项目
    getDataItem() {
      const item = this.data.find(i => !i.used);
      if (item) {
        item.used = true;
        return item;
      }
      if (!this.data.length) return {};
      const index = CanvasUtils.getRandom(0, this.data.length - 1);
      return this.data[index] || {};
    }

    // -------- 事件注册 -----------
    registerEvents() {
      // -------- 鼠标拖拽 -----------
      const draggingHandler = this.draggingHandler.bind(this);
      this.dragData = {
        dragging: false,
        mousePositionX: 0,
        mousePositionY: 0,
        requestId: ''
      };
      this.canvas.addEventListener('mousedown', e => {
        if (!this.draggable) return;
        this.dragData.mousePositionX = e.offsetX;
        this.dragData.mousePositionY = e.offsetY;
        this.dragData.dragging = true;
        this.canvas.addEventListener('mousemove', draggingHandler);
      });
      document.addEventListener('mouseup', () => {
        this.dragData.dragging = false;
        this.registerAnimation();
        this.canvas.removeEventListener('mousemove', draggingHandler);
      });
      // 点击事件
      this.canvas.addEventListener('click', e => {
        if (!this.onclick) return;
        if (CanvasUtils.typeOf(this.onclick) !== 'function') {
          throw new Error('onclick must be a function');
        }
        Object.values(BoxPath.visiblesMap).forEach(item => {
          if (this.ctx.isPointInPath(item.path, e.offsetX, e.offsetY)) {
            this.onclick(item);
          }
        });
      });
    }
    draggingHandler(e) {
      const disX = e.offsetX - this.dragData.mousePositionX;
      const disY = e.offsetY - this.dragData.mousePositionY;
      this.dragData.mousePositionX = e.offsetX;
      this.dragData.mousePositionY = e.offsetY;
      this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      Object.values(BoxPath.pathsMap).forEach(i => {
        i.x += disX;
        i.y += disY;
        i.update();
      });
      this.drawHole();
    }

    // -------- hover -----------
    registerHover() {
      this.hoverData = {
        prev: null,
        cur: null,
        hovering: false,
        hoverRequestId: ''
      };
      this.canvas.addEventListener('mouseenter', () => {
        if (!this.mousehover) return;
        this.hoverData.hovering = true;
        this.hoverHandler();
      });
      this.canvas.addEventListener('mousemove', e => {
        if (!this.mousehover) return;
        Object.values(BoxPath.visiblesMap).forEach(item => {
          item.hovering = this.ctx.isPointInPath(item.path, e.offsetX, e.offsetY);
          if (item.hovering && (!this.hoverData.cur || this.hoverData.cur.id !== item.id)) {
            this.hoverData.prev = this.hoverData.cur;
            this.hoverData.cur = item;
          }
        });
      });
      this.canvas.addEventListener('mouseleave', () => {
        if (!this.mousehover) return;
        console.log('mouseleave');
        this.hoverData.hovering = false;
        this.hoverData.prev = this.hoverData.cur;
        this.hoverData.cur = null;
        this.hoverData.prev.hovering = false;
      });
    }
    hoverHandler() {
      const {
        hovering,
        prev,
        cur,
        hoverRequestId
      } = this.hoverData;
      this.maskCtx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      if (!hovering && prev && !prev.transform) {
        hoverRequestId && window.cancelAnimationFrame(hoverRequestId);
        return;
      }
      prev && prev.update();
      cur && cur.update();
      this.hoverData.hoverRequestId = window.requestAnimationFrame(this.hoverHandler.bind(this));
    }

    // -------- 动画 -----------
    registerAnimation() {
      if (!this.animation || this.dragData.dragging) {
        this.dragData.requestId && window.cancelAnimationFrame(this.dragData.requestId);
        return;
      }
      this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
      Object.values(BoxPath.pathsMap).forEach(i => {
        i.x += this.animationSpeed.x || -1;
        i.y += this.animationSpeed.y || 1;
        i.update();
      });
      this.drawHole();
      this.dragData.requestId = window.requestAnimationFrame(this.registerAnimation.bind(this));
    }
  }
  var src = DlBorderless;

  return src;

}());
