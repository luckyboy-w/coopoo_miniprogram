// pages/newIndex/newIndex.js
const App = getApp();
const $api = require('../../utils/api.js').API;
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    swiperCurrent: 0,
    playbackPNG: '',
    newUserGiftPNG: '',
    beanMallPNG: '',
    loadTitle: '下拉加载更多',

    goodsList: [],
    totalPage: 0,
    isNextPage: true,
    pageSize: 6,
    pageNum: 1,

    optionData: {},
    showActivity: false,
    activityId: '',
    activityType: '',
    storeId: '',
    inviteMemberId: '',
    sourceType: '',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexData()
    this.getGoodsList(true)

    console.log("options", options, options.datas)
    // if (options.activityId) {
    //   this.setData({
    //     activityId:options.activityId
    //   })
    // }
    // if (options.activityType) {
    //   this.setData({
    //     activityType:options.activityType
    //   })
    // }
    // if (options.storeId) {
    //   this.setData({
    //     storeId:options.storeId
    //   })
    // }
    // if (options.inviteMemberId) {
    //   this.setData({
    //     inviteMemberId:options.inviteMemberId
    //   })
    // }
    // if (options.sourceType) {
    //   this.setData({
    //     sourceType:options.sourceType
    //   })
    // }
    App.firstOpen().then(res => {
      if (options && JSON.stringify(options) != '{}') {
        // console.log('有参', JSON.parse(options.datas))
        let optionData = JSON.parse(options.datas)
        this.setData({
          optionData: optionData,
          showActivity: true,
        })
        if (optionData.activityType == '12' || optionData.activityType == '5') {
          this.setData({
            activityType: "collage"
          })
        } else if (optionData.activityType == '13' || optionData.activityType == '6') {
          this.setData({
            activityType: "bargain"
          })
        }
        wx.setStorageSync('shareData', JSON.stringify(optionData))
        this.getOtherPage(optionData)
      }
    }).catch(err => {
      console.log(err)
    })
  },

  getIndexData() {
    $api.indexList({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    })
      .then(res => {
        //请求成功
        // console.log(res)
        this.setData({
          bannerList: res.data.bannerList,
          playbackPNG: res.data.playbackPNG,
          newUserGiftPNG: res.data.newUserGiftPNG,
          beanMallPNG: res.data.beanMallPNG,
        })
      })
      .catch(err => {
        console.log(err)

        //请求失败
        //console.log(err)
      })
  },
  swiperChange: function (e) {
    // console.log(e)
    if (e.detail.source === 'touch') {
      this.setData({
        swiperCurrent: e.detail.current
      })
    } else if (e.detail.source === 'autoplay') {
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
  },

  getGoodsList(isPage) {
    if (isPage === true) {
      this.setData({
        pageNum: 1
      });
    } else {
      var num = this.data.pageNum + 1;
      if (num <= this.data.totalPage) {
        this.setData({
          pageNum: num
        });
      } else if (num > this.data.totalPage) {
        this.setData({
          isNextPage: false
        })
      }
    }
    if (!isPage && !this.data.isNextPage) {
      wx.hideLoading()
      return false
    }
    $api.goodsList({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(res => {
      //请求成功
      let goodsArr = this.data.goodsList
      if (isPage === true) {
        goodsArr = res.data.records
      } else {
        let goodsArr_ = res.data.records
        goodsArr_.forEach((e, i) => {
          goodsArr.push(e)
        })
      }
      this.setData({
        totalPage: res.data.pages,
        goodsList: goodsArr,
        loadTitle: this.data.pageNum == res.data.pages ? '暂无更多数据' : '上拉加载更多',
        isNextPage: this.data.pageNum >= res.data.pages ? false : true,
      });
    })
      .catch(err => {
        //请求失败
      })
  },

  goNav(e) {
    var urls = e.currentTarget.dataset.url
    wx.navigateTo({
      url: urls
    })
  },


  // 模拟砍价拼团链接跳转小程序

  goActivityPage(option) {
    console.log(option.currentTarget.dataset)
    
    let activitytype=option.currentTarget.dataset.activitytype
    console.log(this.data.activityType,activitytype)
    if (activitytype==this.data.activityType) {
      let datas = {
        activityId: this.data.optionData.activityId,
        activityType: this.data.optionData.activityType,
        inviteMemberId: this.data.optionData.inviteMemberId,
        sourceType: this.data.optionData.sourceType,
        storeId:this.data.optionData.storeId,
      }
      if (option.currentTarget.dataset.type=="wxminiprogram") {
        datas.sourceType='wxminiprogram'
      }
      console.log(datas)
      this.getOtherPage(datas)
    } else {
      wx.showToast({
        title: "暂无活动",
        icon: "none"
      })
    }
    // return false;
    // let datas = { activityId: "edd69b141964442b9cd28c83b33ff611", activityType: "12", storeId: "6", inviteMemberId: "8106388546937348096", sourceType: "app" }
    //     let datas={
    //       activityId:"c8087032d0df4d66a1447de7fb4aeb12",
    // activityType: "5",
    // collageId: "17",
    // goodsId:"e24309db54614c82ba4135fd0f8e64c3",
    // inviteMemberId:"1506930947960999936",
    // marketingGoodsId:"2ce2383e63904b618a799e4f61977de6",
    // sourceType: "wxminiprogram",
    // storeId: 13,
    // type: "inviteCollage",
    //     }
    // let datas = { activityId: "094861e38acd47588422c837371b1b18", activityType: "13", storeId: "6", inviteMemberId: "8106388546937348096", sourceType: "app" }
    // let datas = {
    //   activityId:"1488ba819bbe4b5ca5b4889d78e254a8",
    //   activityType: 6,
    //   cutPriceId: "43",
    //   inviteMemberId:"1511985854074195968",
    //   sourceType: "wxminiprogram",
    //   storeId: 13,
    //   type: "inviteBargain"
    //   }
      
    //   console.log(datas)
    // this.onLoad({ datas: JSON.stringify(datas)})
  },

  getOtherPage(options) {
    console.log("链接携带的参数", options)
    // 区分是通过App来的还是小程序
    if (options.sourceType == "app") {
      // 如果是App来的 执行App跳转页面
      this.sourceAppGetPage(options)
    } else if (options.sourceType == "wxminiprogram") {
      // 如果是小程序来的 执行小程序跳转页面
      console.log(111111)
      this.sourceXcxGetPage(options)
    }else if (options.sourceType == "message") {
      // 如果是订阅消息来的 执行订阅消息跳转页面
      console.log('message')
      this.sourceMessageGetPage(options)
    }
  },
  // app来的，根据不同情况进行跳转
  sourceAppGetPage(options) {
    let collageUrl = "../collage/collage" //拼团页面
    let bargainUrl = "../bargain/bargain" //砍价页面
    // 判断活动是拼团还是砍价
    if (options.activityType == '12') {
      // 拼团
      wx.navigateTo({
        url: collageUrl + "?datas=" + JSON.stringify(options)
      })
    } else if (options.activityType == '13') {
      // 砍价
      wx.navigateTo({
        url: bargainUrl + "?datas=" + JSON.stringify(options)
      })
    }
  },
  // 小程序来的，根据不同情况进行跳转
  sourceXcxGetPage(options) {
    console.log('小程序分享链接', options)
    let collageUrl = "../collage/collage" //拼团页面
    let bargainUrl = "../bargain/bargain" //砍价页面
    // 判断活动是拼团还是砍价
    if (options.activityType == '12' || options.activityType == '5') {
      // 拼团
      console.log('拼团')
      if (options.type == 'inviteCollage') {
        this.getCollageResult(options)
        console.log('邀请拼团')
      } else if (options.type == 'shareCollage') {
        wx.navigateTo({
          url: collageUrl + "?datas=" + JSON.stringify(options)
        })
      }else{
        wx.navigateTo({
          url: collageUrl + "?datas=" + JSON.stringify(options)
        })
      }

    } else if (options.activityType == '13' || options.activityType == '6') {
      // 砍价
      if (options.type == 'inviteBargain') {
        console.log('邀请砍价')
        this.getBargainResult(options)
        // wx.navigateTo({
        //   url: '../collageGood/collageGood?datas=' + JSON.stringify(options) 
        // })
      } else if (options.type == 'shareBargain') {
        wx.navigateTo({
          url: bargainUrl + "?datas=" + JSON.stringify(options)
        })
      }else{
        wx.navigateTo({
          url: bargainUrl + "?datas=" + JSON.stringify(options)
        })
      }
    }
  },
//订阅消息来的
//拼团结果  (collageResult)
// 砍价进度  (bargainProgress)
// 砍价成功   (bargainSuccess)
// 砍价失败  (bargainFail)
sourceMessageGetPage(options){
  console.log('订阅消息的参数', options)
  // let datas ={
  //           activityId: '',//活动id
  //           activityType: '',//活动类型
  //           cutPriceId: '',//砍价id
  //           storeId: '',//门店id
  //           inviteMemberId: '',//用户id
  //           sourceType: 'message',//来源标识（message）
  //           messageType: ''//消息类型 
  // }
    if (options.messageType=='collageResult') {
      wx.navigateTo({
        url: '../myOrder/myOrder'
      })
    }else if (options.messageType=='bargainProgress'){
      $api.getBargainData({
        activityId: options.activityId,
        cutPriceId: options.cutPriceId
      }).then(res => {
        wx.navigateTo({
          url: '../bargain/detail?datas=' + JSON.stringify(res.data) //砍价中还未支付
        })
      })
    }else if (options.messageType=='bargainSuccess'){
      wx.navigateTo({
        url: '../myOrder/myOrder'
      })
    }else if (options.messageType=='bargainFail'){
      wx.navigateTo({
        url: '../bargain/bargain?datas=' + JSON.stringify(options)
      })
    }


},

  getCollageResult(options) {
    $api.getCollageResult({
      activityId: options.activityId,
      collageId: options.collageId
    }).then(res => {
      //请求成功
      console.log(res)
      if (res.data.isSuccess == 1) {
        wx.navigateTo({
          url: '../collageGood/collageGood?datas=' + JSON.stringify(options)
        })
      } else if (res.data.isSuccess == 2 || res.data.isSuccess == 3) {
        wx.navigateTo({
          url: '../collage/collageResult?datas=' + JSON.stringify(res.data)
        })
      } else {
        wx.showToast({
          title: "活动已过期",
          icon: "none"
        })
      }
    })
      .catch(err => {
        console.log(err)
        wx.showToast({
          title: err.message,
          icon: "none"
        })
        //请求失败
      })
  },

  getBargainResult(options) {
    $api.getBargainData({
      activityId: options.activityId,
      cutPriceId: options.cutPriceId
    }).then(res => {
      //请求成功
      console.log(res)


      if (res.data.isSuccess === 0) {
        if (res.data.isMyCutPrice == 1) {
          wx.navigateTo({
            url: '../bargain/detail?datas=' + JSON.stringify(res.data) //砍价中还未支付
          })
        } else if (res.data.isMyCutPrice === 0) {
          if (res.data.isAlreadyCut == 1) {
            wx.navigateTo({
              url: '../bargain/bargainResult?datas=' + JSON.stringify(res.data) + "&state=2"  //已经帮别人砍过了
            })
          } else if (res.data.isAlreadyCut === 0) {
            wx.navigateTo({
              url: '../bargain/helpChop?datas=' + JSON.stringify(res.data) //可以去帮砍
            })
          }
        }
      } else if (res.data.isSuccess == 1) {
        if (res.data.isMyCutPrice == 1) {
          wx.navigateTo({
            url: '../bargain/detail?datas=' + JSON.stringify(res.data) //砍成功了是我的还未支付
          })
        } else if (res.data.isMyCutPrice === 0) {
          wx.navigateTo({
            url: '../bargain/bargainResult?datas=' + JSON.stringify(res.data) + "&state=3"  //不是我的且砍成功了
          })
        }
      } else if (res.data.isSuccess == 2) {
        wx.navigateTo({
          url: '../bargain/bargainResult?datas=' + JSON.stringify(res.data) + "&state=4" //砍价失效
        })
      } else {
        wx.showToast({
          title: "活动已过期",
          icon: "none"
        })
      }
    })
      .catch(err => {
        console.log(err)
        wx.showToast({
          title: err.message,
          icon: "none"
        })
        //请求失败
      })
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
    this.getGoodsList();
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})