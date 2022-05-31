// index.js
// 获取应用实例
const App = getApp();

Page({
  data: {
    parameter: {
      navSty: 'relitive', //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
      navbar: 1, //不同顶部的内容 如 文字/搜索框/logo 
      fontColor: '#333', //中间字的颜色
      title: '我的',
      urls: '',
      bgcolor: '#fff', //整个头部背景色，支持透明
      textL: "center", //居中或者居左 
      isLeftIcon: true, //是否显示左侧返回按钮，自定义左侧图标需要再定义变量
    },
    myUrl:'https://bucket.coopoo.com/wx-mini/myDownload.html'
  },
  onLoad() {
    
  },
})
