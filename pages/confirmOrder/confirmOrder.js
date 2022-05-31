const App = getApp();
const $api = require('../../utils/api.js').API;
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paddingTop: getApp().globalData.paddingTop,
    parameter: {
      type: 2,
      navSty: 'relitive', //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
      navbar: 1, //不同顶部的内容 如 文字/搜索框/logo 
      fontColor: '#1A1A1A', //中间字的颜色
      title: '确认订单',
      bgcolor: '#fff', //整个头部背景色，支持透明
      textL: "center", //居中或者居左 
      isLeftIcon: true, //是否显示左侧返回按钮，自定义左侧图标需要再定义变量  
      urls: '/pages/order/orderList/orderList'
    },
    statusIcon: '/images/status.png',
    locationIcon: '/images/location.png',
    shopIcon: '/images/gys.png',
    goodsImg: '/images/2.png',
    isCartOder: false,
    giftPrice: 0,
    url: {
      orderDetail: '/pages/order/orderDetail/orderDetail',
      goodsDetail: ''
    },
    btnStyle1: 'padding:0;width:260rpx;height:90rpx;line-height:90rpx;border-color:#B3B3B3;font-size:32rpx;color:#D3C792;margin-right:40rpx;',
    btnStyle2: 'padding:0;width:260rpx;height:90rpx;line-height:90rpx;font-size:32rpx;" round color="#D3C792',
    invoiceId: 0,
    invoiceData: {}, //发票信息
    orderData: {},
    addressData: {},
    storeInfo: {},
    memId: '',
    orderDesc: '',
    prevIndex: '',
    prevCIndex: '',
    invoiceId: [],
    invoiceTit: [],
    invoiceEmail: [],
    invoiceCompTaxNo: [],
    invoicePhoneNo: [],
    invoiceCompanyName: [],
    invoiceOpen: [],
    couponId: [],
    couponName: [],
    optionData: {},
    isMade: 0, //是否为定制 1
    isGift: 0, //是否为礼品 1
    couponsList: [],
    isShowall: false,
    activateFlag: '',
    activateFlag_: '',
    priceList: [],
    showCarStatus: '',
    madeData: {},
    goodsMarketingId: '',
    orderList: [],
    goodsDetailType:'',
    orderDataInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.datas))
    let datas = JSON.parse(options.datas)
    if (datas.goodsMarketingId) {
      this.setData({
        goodsMarketingId: datas.goodsMarketingId
      })
    }
    this.setData({
      goodsDetailType:options.goodsDetailType,
      addressData: datas.address,
      orderData: datas,
      storeInfo: datas.storeInfo
    })
    this.initData(datas)
    // this.setData({
    //   memId: App.getUserInfo().pkMemberId,
    //   optionData: datas,
    //   isMade: isMade,
    //   // invoiceTit:this.data.invoiceTit?this.data.invoiceTit:'暂不开发票'
    // })
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
  },
  // 获取订单详细信息
  initData(datas) {
    var that = this
    if (datas) {
      that.setData({
        isShowall: true
      })
    }
  },
  // 跳转
  goNav(e, datas) {
    var that = this
    var urls = e.currentTarget.dataset.url
    if (datas) {
      urls += '?datas=' + JSON.stringify(datas)
    }
    wx.navigateTo({
      url: urls
    })
  },
  // 创建订单
  goCreateOrder(e) {
    if (this.data.orderData.deliveryType != 3) {
      if (this.data.addressData == null || this.data.addressData == undefined || (this.data.addressData && this.data.addressData.length <= 0)) {
        wx.showToast({
          title: '请先添加地址',
          icon: 'none'
        })
        return false
      }
    }
    this.createGoods()

  },


  createGoods(e) {
    let that = this
    let datas = {}
    let orderData = that.data.orderData
    datas = {
      memberId: App.getUserData().pkMemberId,
      goodsId: orderData.goodsId,
      marketingGoodsId: orderData.goodsMarketingId,
      goodsNum: orderData.goodsNum,
      skuId: orderData.skuId,
      remark: that.data.orderDesc ? that.data.orderDesc : '',
      wxAvatar: App.getWxUserInfo().avatarUrl,
      wxUsername: App.getWxUserInfo().nickName
    }

    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 10);
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    console.log(time2 + ' 16:00:00')
    if (orderData.deliveryType == 2) {
      datas.deliveryMethod = 1
      datas.addressId = that.data.addressData.id
    } else if (orderData.deliveryType == 3) {
      datas.deliveryMethod = 2
      // datas.mobile = '17347335219'
      datas.appointmentDate = time2 + ' 16:00:00'
      console.log(that.data.storeInfo)
      if(that.data.storeInfo){
        datas.storeId = that.data.storeInfo.storeId
      }else{
        wx.showToast({
          title: '请下载APP绑定门店',
          icon: 'none'
        })
        return false
      }
    }
    console.log('datas', datas)
    // return false
    if (this.data.goodsDetailType==2) {
      datas.collageId = App.getShareData().collageId
      //参与拼团
      if (that.data.orderList == [] || that.data.orderList.length <= 0) {
        $api.getJoinCollage(datas).then(res => {
          //请求成功
          console.log('参与拼团', res)
          if (res.data.orderNoList) {
            this.setData({
              orderList: res.data.orderNoList,
              orderDataInfo:res.data
            })
          }
          console.log(this.data.orderList)
          this.payGoodsOrder()
        })
          .catch(err => {
            //请求失败
            //console.log(err)
  
          })
      } else if (that.data.orderList.length >= 1 && that.data.orderList) {
        this.payGoodsOrder()
      }
      
    } else if(this.data.goodsDetailType==1){

      if (that.data.orderList == [] || that.data.orderList.length <= 0) {
         //发起拼团
      $api.createOrderCollageGood(datas)
      .then(res => {
        //请求成功
        console.log('发起拼团', res)
        if (res.data.orderNoList) {
          this.setData({
            orderList: res.data.orderNoList,
            orderDataInfo:res.data
          })
        }
        console.log(this.data.orderList)
        this.payGoodsOrder()
      })
      .catch(err => {
        //请求失败
        //console.log(err)

      })
      } else if (that.data.orderList.length >= 1 && that.data.orderList) {
        this.payGoodsOrder()
      }

     
    }
  },
  payGoodsOrder() {
    let datas =this.data.orderDataInfo
    console.log(datas)
    let that = this
    let params = {
      payChannel: 3
    }
    console.log(that.data.orderList)
    if (that.data.orderList == [] || that.data.orderList.length <= 0) {
      params.orderNoList = datas.orderNoList
    } else if (that.data.orderList.length >= 1 && that.data.orderList) {
      params.orderNoList = that.data.orderList
    }

    wx.requestSubscribeMessage({
      tmplIds: ['hrf20vRLVftr5U8pA6XoWa-5_-6wOi1pXC1cwJHgfGE'],
      success(res) { },
      complete() {
        $api.payGoodsOrder(params).then(res => {
          //请求成功
          console.log(res.data)
          if (res.data.orderFlag==1) {
            wx.redirectTo({
              url: '/pages/paySuccess/collagaePaySuccess?payPrice=' + that.data.orderData.sumPrice + "&collageId=" + datas.collageId + "&goodsId=" + that.data.orderData.goodsId + "&marketingGoodsId=" + that.data.orderData.goodsMarketingId + "&activityId=" + datas.activityId + "&activityType=" + datas.activityType + "&goodsImg=" + that.data.orderData.goodsCoverImgUrl
            })
           } else{
          let payParams = JSON.parse(res.data.wxPayInfo)
          App.wxRequestPayment(payParams).then(res => {
            console.log('7777', res)
            if (res.errMsg == 'requestPayment:ok') {
              wx.redirectTo({
                url: '/pages/paySuccess/collagaePaySuccess?payPrice=' + that.data.orderData.sumPrice + "&collageId=" + datas.collageId + "&goodsId=" + that.data.orderData.goodsId + "&marketingGoodsId=" + that.data.orderData.goodsMarketingId + "&activityId=" + datas.activityId + "&activityType=" + datas.activityType + "&goodsImg=" + that.data.orderData.goodsCoverImgUrl
              })
            } else if (res.errMsg == 'requestPayment:fail cancel') {
              wx.redirectTo({
                url: '/pages/collage/collage?datas=' + JSON.stringify(App.getShareData()),
              })
            }
          }).fail(err => {
            console.log(err)
          })
        }
        })
          .catch(err => {
            //请求失败
            //console.log(err)

          })
      }
    })
  },

  onChangeDesc(e) {
    // let orderdata = this.data.orderData
    // orderdata.goodList[e.currentTarget.dataset.index].orderDesc = e.detail
    this.setData({
      orderDesc: e.detail
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})