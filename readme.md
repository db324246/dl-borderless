## dl-borderless

> `dl-borderless` 是一个可以无边界瀑布流渲染图片列表的插件。<br/>

## 安装
### 通过 NPM 安装
```
npm i dl-borderless -S
```
### CDN
目前可以通过 unpkg.com/dl-borderless 获取到最新版本的资源，在页面上引入 js 文件即可开始使用。
``` html
<script src="https://unpkg.com/dl-borderless@1.0.0/lib/dl-borderless.js"></script>
```
## Attrs

| 名称 | 描述 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| el | 指定 `dl-borderless` 渲染的 DOM 父节点 | DOM | document.body | false |
| className | 指定 `dl-borderless` 渲染的 DOM 节点的类名 | String | '' | false |
| width | 指定 `dl-borderless` 渲染的 DOM 节点的宽度 | Number | window.innerWidth | false |
| height | 指定 `dl-borderless` 渲染的 DOM 节点的高度 | Number | window.innerHeight | false |
| draggable | 图片界面是否拖拽 | Boolen | true | false |
| boxWidth | 图片渲染的宽度 | Number | 150 | false |
| boxHeight | 图片渲染的高度。数组表示随机的范围 | Number, Array | [150, 300] | false |
| boxPadding | 图片渲染的内间距 | Number | 1 | false |
| maxsize | 图片的最大存储数量，超出后会移除隐藏的图片，减少内存消耗。图片懒加载时，超出后不再调用加载方法。 | Number | 500 | false |
| mousehover | 图片的hover效果 | Boolean | false | false |
| animation | 图片界面位移动画 | Boolean | false | false |
| animationSpeed | 位移动画的速度。x，y分别表示两个方向的移动速度。 | Object | {x:-1,y:-1} | false |
| data | 图片列表数据。图片(imageItem)详细数据见下表。 | Array<Object> | [] | false |
| loadData | 图片列表数据懒加载。返回一个Promise，数据通过Promise传递 | Function | - | false |
| loadFinished | 没有更多数据，不再调用懒加载请求函数 | Boolean | true | false |

## Events

| 名称 | 描述 | 参数 |
| - | - | - |
| draw | 绘制列表界面 | - |
| onclick | 图片点击事件 | 图片对象 |

## ImageItem

| 名称 | 描述 | 类型 | 默认值 | 必传 |
| - | - | - | - | - |
| url | 图片的链接地址 | String | - | true |
| width | 图片的宽度。如果传入了图片的宽、高数据，那么图片的高度将按比例计算，不采用 boxHeight。 | Number | - | false |
| height | 图片的高度。如果传入了图片的宽、高数据，那么图片的高度将按比例计算，不采用 boxHeight。 | Number | - | false |
