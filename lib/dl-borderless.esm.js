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
      targetObj[keys] = deepClone(source[keys]);
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
var utils = CanvasUtils$2;

const CanvasUtils$1 = utils;
class BoxPath$1 {
  constructor({
    ctx,
    x,
    y,
    width
  }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = CanvasUtils$1.getRandom(150, 300);
    this.color = CanvasUtils$1.getRandomColor();
    this.visible = true;
  }
  draw() {
    this.path = new Path2D();
    this.path.rect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = this.color;
    this.ctx.fill(this.path);
  }
  update() {
    this.checkPosition();
    this.visible && this.draw();
  }
  checkPosition() {
    this.visible = this.x >= 0 - this.width && this.x <= this.ctx.canvas.width && this.y >= 0 - this.height && this.y <= this.ctx.canvas.height;
  }
}
var boxPath = BoxPath$1;

const BoxPath = boxPath;
const CanvasUtils = utils;
class DlBorderless {
  constructor(config = {}) {
    if (CanvasUtils.typeOf(config) !== 'object') {
      throw new Error('config must be a object');
    }
    const {
      width,
      height,
      boxWidth
    } = config;
    if (width && height) {
      this.containerWidth = width;
      this.containerHeight = height;
    } else {
      this.containerWidth = window.innerWidth;
      this.containerHeight = window.innerHeight;
    }
    this.boxWidth = boxWidth || 150;
    this.boxPathList = []; // path 集合
    this.boxRect = []; // path 矩阵
    this.mousePosition = {
      x: 0,
      y: 0
    };
    this.createCanvas();
  }
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.containerWidth;
    this.canvas.height = this.containerHeight;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }
  draw() {
    this.drawFirstScreen();
    this.drawHole();
  }

  // 首屏绘制
  drawFirstScreen() {
    let totalHeight = 0;
    let rowIndex = 0; // 行索引
    while (totalHeight <= this.containerHeight) {
      let rowWidth = 0;
      let rowHeight = 0;
      const row = [];
      let colIndex = 0; // 列索引
      while (rowWidth <= this.containerWidth) {
        let y = 0;
        if (rowIndex > 0) {
          const prevRow = this.boxRect[rowIndex - 1];
          const prevPic = prevRow[colIndex];
          y = prevPic.y + prevPic.height;
        }
        const pic = new BoxPath({
          y,
          x: rowWidth,
          ctx: this.ctx,
          width: this.boxWidth
        });
        pic.draw();
        this.boxPathList.push(pic);
        row.push(pic);
        colIndex++;
        rowWidth += pic.width;
        rowHeight = Math.max(pic.height, rowHeight);
      }
      rowIndex++;
      this.boxRect.push(row);
      totalHeight += rowHeight;
    }
  }

  // -------- 补漏绘制 -----------
  // 首行补漏
  checkFirstRowHole(visiblePaths, ctx) {
    for (let x = 0; x <= this.containerWidth; x += this.boxWidth) {
      if (visiblePaths.every(i => !ctx.isPointInPath(i.path, x, 0))) {
        console.log('首行漏了');
        const firstRow = this.boxRect[0];
        const row = firstRow.map(i => {
          const pic = new BoxPath({
            ctx,
            x: i.x,
            width: this.boxWidth
          });
          pic.y = i.y - pic.height;
          pic.update();
          this.boxPathList.push(pic);
          return pic;
        });
        this.boxRect.unshift(row);
        break;
      }
    }
  }
  // 尾行补漏
  checkLastRowHole(visiblePaths, ctx) {
    for (let x = 0; x <= this.containerWidth; x += this.boxWidth) {
      if (visiblePaths.every(i => !ctx.isPointInPath(i.path, x, this.containerHeight))) {
        console.log('尾行漏了');
        const lastRow = this.boxRect[this.boxRect.length - 1];
        const row = lastRow.map(i => {
          const pic = new BoxPath({
            ctx,
            x: i.x,
            y: i.y + i.height,
            width: this.boxWidth
          });
          pic.update();
          this.boxPathList.push(pic);
          return pic;
        });
        this.boxRect.push(row);
        break;
      }
    }
  }
  // 首列补漏
  checkFirstColHole(visiblePaths, ctx) {
    const firstCol = this.boxRect.map(i => i[0]);
    for (let y = 0; y <= this.containerHeight; y += this.containerHeight) {
      if (visiblePaths.every(i => !ctx.isPointInPath(i.path, 0, y))) {
        console.log('首列漏了');
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
            width: this.boxWidth
          });
          newCol.push(pic);
          this.boxRect[rowIndex].unshift(pic);
          pic.update();
          this.boxPathList.push(pic);
          rowIndex++;
        }
        break;
      }
    }
  }
  // 尾列补漏
  checkLastColHole(visiblePaths, ctx) {
    const lastCol = this.boxRect.map(i => i[i.length - 1]);
    for (let y = 0; y <= this.containerHeight; y += this.containerHeight) {
      if (visiblePaths.every(i => !ctx.isPointInPath(i.path, this.containerWidth, y))) {
        console.log('尾列漏了');
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
            width: this.boxWidth
          });
          newCol.push(pic);
          this.boxRect[rowIndex].push(pic);
          pic.update();
          this.boxPathList.push(pic);
          rowIndex++;
        }
        break;
      }
    }
  }
  drawHole() {
    const visiblePaths = this.boxPathList.filter(i => i.visible);
    this.checkFirstRowHole(visiblePaths, this.ctx);
    this.checkLastRowHole(visiblePaths, this.ctx);
    this.checkFirstColHole(visiblePaths, this.ctx);
    this.checkLastColHole(visiblePaths, this.ctx);
  }

  // -------- 鼠标拖拽 -----------
  registerEvents() {
    const moveHandler = this.moveHandler.bind(this);
    this.canvas.addEventListener('mousedown', e => {
      this.mousePosition.x = e.offsetX;
      this.mousePosition.y = e.offsetY;
      this.canvas.addEventListener('mousemove', moveHandler);
    });
    document.addEventListener('mouseup', () => {
      this.canvas.removeEventListener('mousemove', moveHandler);
    });
  }
  moveHandler(e) {
    const disX = e.offsetX - this.mousePosition.x;
    const disY = e.offsetY - this.mousePosition.y;
    this.mousePosition.x = e.offsetX;
    this.mousePosition.y = e.offsetY;
    this.ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
    this.boxPathList.forEach(i => {
      i.x += disX;
      i.y += disY;
      i.update();
    });
    this.drawHole();
  }
}
var src = DlBorderless;

export { src as default };
