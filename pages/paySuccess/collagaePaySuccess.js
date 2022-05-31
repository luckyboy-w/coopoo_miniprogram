// pages/paySuccess/collagaePaySuccess.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      navSty: 'relitive', //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
      navbar: 1, //不同顶部的内容 如 文字/搜索框/logo 
      fontColor: '#333', //中间字的颜色
      title: '支付成功',
      urls: '/pages/collage/collage?datas='+JSON.stringify(App.getShareData()),
      bgcolor: '#fff', //整个头部背景色，支持透明
      textL: "center", //居中或者居左 
      isLeftIcon: true, //是否显示左侧返回按钮，自定义左侧图标需要再定义变量
    },

    payPrice: 0,
    collageId: '',
    goodsId: '',
    marketingGoodsId: '',
    activityId: '',
    activityType: '',
    goodsImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      // payPrice:options.payPrice,
      // collageId:options.collageId
      payPrice: options.payPrice,
      collageId: options.collageId,
      goodsId: options.goodsId,
      marketingGoodsId: options.marketingGoodsId,
      activityId: options.activityId,
      activityType: options.activityType,
      goodsImg:options.goodsImg
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getDownload() {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    wx.enableAlertBeforeUnload({
      success: function (res) {
      console.log("方法注册成功：", res)
      wx.redirectTo({
        url:'/pages/collage/collage?datas='+JSON.stringify(App.getShareData()),
      })
      },
      fail: function (errMsg) {
      console.log("方法注册失败：", errMsg);
      },
      
      });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    let datas = {
      activityId: this.data.activityId,//活动id
      activityType: this.data.activityType,//活动类型
      collageId: this.data.collageId,//拼团id
      goodsId: this.data.goodsId,//商品id
      marketingGoodsId: this.data.marketingGoodsId,//活动商品id
      // storeId: App.getUserData().storeId,//门店id
      inviteMemberId: App.getUserData().pkMemberId,//用户id
      sourceType: 'wxminiprogram',//来源标识
      type: 'inviteCollage'//邀请拼团的类型
    }
    if (App.getUserData().storeId) {
      datas.storeId=App.getUserData().storeId
   } else {
      datas.storeId= App.getShareData().storeId //门店id
   }
    // if (ops.from === 'button') {
    // 来自页面内转发按钮
    console.log(ops.target)
    let path = '/pages/index/index?datas=' + JSON.stringify(datas)
    return {
      title: '我参加了一个拼团活动，赶紧和我一起参加',
      imageUrl:this.data.goodsImg,
      path: path,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功!',
          icon: 'none'
        })
      },
      fail: function (err) {
        // 转发失败
        wx.showToast({
          title: '转发失败!',
          icon: 'none'
        })
      }
    }
    // }

  }
})