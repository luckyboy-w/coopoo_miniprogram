// pages/address/address.js
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const $api = require('../../utils/api.js').API;
import util from '../../utils/util.js';
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paddingTop: getApp().globalData.paddingTop,
    parameter:{
      navSty:'relitive',   //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
      navbar:1,  //不同顶部的内容 如 文字/搜索框/logo 
      fontColor:'#1A1A1A', //中间字的颜色
      title:'我的收货地址',   
      bgcolor:'#fff',   //整个头部背景色，支持透明
      textL:"center",   //居中或者居左 
      isLeftIcon:true,  //是否显示左侧返回按钮，自定义左侧图标需要再定义变量  
    },
    addressList: [],
    result: [],
    pageNum: 1,
    pageSize: 100,
    pages: 1,
    memId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let memId = App.getUserData().pkMemberId
    this.setData({
      memId: memId,
      // result: [],
      // pageNum: 1
    })
    this.doRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.doRefresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  // 跳转页面
  goto(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  editAddress(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  //删除
  delAddress(e) {
    Dialog.confirm({
      title: '删除提示',
      message: '您是否要删除该地址?'
    }).then(() => {
      Toast.loading({
        duration: 0,
        forbidClick: true
      });
      let that = this
      $api.deleteAddr({id: e.currentTarget.dataset.id})
      .then(res => {
         //请求成功
         Toast.clear();
         let result = res
         if (res.errCode === 0) {
           Toast.success('删除成功！');
           
           that.doRefresh()
         } else {
           Toast.fail(result.message)
         }
            
      })
      .catch(err => {Toast.clear();})
    }).catch(() => {
      // on cancel
    });
    
  },

  //监听用户上拉页面到最底部
  onReachBottom() {
    if (this.data.pageNum<this.data.pages) {
      let pageNum = this.data.pageNum++
      this.setData({
        pageNum: pageNum
      })
      this.doRefresh()
    }
  },

  goback(e) {
    let rst = {
      id: e.currentTarget.dataset.id,
      receiveUser: e.currentTarget.dataset.name,
      receivePhone: e.currentTarget.dataset.mobile,
      address: e.currentTarget.dataset.address
    }
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[ pages.length - 2 ];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      addressData: rst
    })
    //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
    //最后就是返回上一个页面。
    let delta = 1
    if (prevPage.route === "pages/editAddress/editAddress"){
      delta = 3
    }
    wx.navigateBack({
      delta: delta  // 返回上一级页面。
    })
  },

  // 获取地址列表
  doRefresh() {
    let params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum
    }
    this.setData({
      pageNum: 1,
      result:[]
    })
    $api.getAddrlist(params)
    .then(res => {
       //请求成功
        let result = [...this.data.result, ...res.data.records]
        this.setData({
          result: result,
          pages: res.data.pages
        });
    })
    .catch(err => {})
  }
})