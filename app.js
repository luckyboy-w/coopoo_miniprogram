//app.js
import siteInfo from 'siteinfo.js';
const $api = require('./utils/api.js').API;
App({

  api_root: 'https://asr.coding88.com/', // api地址

  onLaunch: function () {
    // console.log('88888',options)



    wx.getSystemInfo({
      success: e => {
        let info = wx.getMenuButtonBoundingClientRect()
        this.globalData.statusBarTop = e.statusBarHeight;
        this.globalData.statusBarHeight = info.top;
        this.globalData.navCapsuleHeight = info.height;
        var ww = e.windowWidth;
        var hh = e.windowHeight;
        this.globalData.ww = ww;
        this.globalData.hh = hh;
      }
    });

    // wx.getSetting({
    //   withSubscriptions: true,
    //   success (res) {
    //     console.log(res.authSetting)
    //     // res.authSetting = {
    //     //   "scope.userInfo": true,
    //     //   "scope.userLocation": true
    //     // }
    //     console.log(res.subscriptionsSetting)
    //     // res.subscriptionsSetting = {
    //     //   mainSwitch: true, // 订阅消息总开关
    //     //   itemSettings: {   // 每一项开关
    //     //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
    //     //     SYS_MSG_TYPE_RANK: 'accept'
    //     //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
    //     //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
    //     //   }
    //     // }
    //   }
    // })

    //获取设备信息
    if (wx.getStorageSync('deviceId') && wx.getStorageSync('deviceId') != '') {
      console.log('存在设备唯一码')
    } else {
      var timestamp = Date.parse(new Date());
      wx.getSystemInfo({
        success(res) {
          wx.setStorageSync("deviceId", res.model + '-' + res.version + '-' + res.platform + '-' + res.system + '-' + res.brand + '-' + timestamp)
        }
      })
    }

    this.wxLogin()


    let systemInfo = wx.getSystemInfoSync()
    // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    // 状态栏的高度
    let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
    // window的高度
    let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
    // 屏幕的高度
    let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
    // 导航栏的高度
    let navigationHeight = 44 * pxToRpxScale
    this.globalData.ktxStatusHeight = ktxStatusHeight;
    this.globalData.navigationHeight = navigationHeight;
    this.globalData.paddingTop = ktxStatusHeight + navigationHeight;
    let tabBarHeight = 50 * pxToRpxScale
    if (this.checkIsLogin()) {
      // this.getShopCartNum()
      // this.updeteUser(true)
    } else {
      // wx.hideTabBarRedDot({
      //   index: 2,
      // })
    }

    // let data={ activityId: "eec8c98572f2459caf1723fc46ccd89c", activityType: "13", storeId: "6", inviteMemberId: "8106388546937348096", sourceType: "app" }
    // let options={
    //     datas:JSON.stringify(data)
    // }
    // this.firstOpen().then(res=>{
    //   console.log(111)
    //   if (options && JSON.stringify(options) != '{}'&& options.datas) {
    //   console.log(222)

    //     // console.log('有参', JSON.parse(options.datas))
    //     let optionData = JSON.parse(options.datas)
    //     wx.setStorageSync('shareData',JSON.stringify(optionData))
    //     this.getOtherPage(optionData)
    //   }
    // }).catch(err=>{
    //   console.log(err)
    // })

  },


  // getOtherPage(options) {
  //   console.log("链接携带的参数", options)
  //   // 区分是通过App来的还是小程序
  //   if (options.sourceType == "app") {
  //     // 如果是App来的 执行App跳转页面
  //     this.sourceAppGetPage(options)
  //   } else if (options.sourceType == "wxminiprogram") {
  //     // 如果是小程序来的 执行小程序跳转页面
  //     console.log(111111)
  //     this.sourceXcxGetPage(options)
  //   }
  // },
  // // app来的，根据不同情况进行跳转
  // sourceAppGetPage(options) {
  //   let collageUrl = "/pages/collage/collage" //拼团页面
  //   let bargainUrl = "/pages/bargain/bargain" //砍价页面
  //   // 判断活动是拼团还是砍价
  //   if (options.activityType == '12') {
  //     // 拼团
  //     wx.navigateTo({
  //       url: collageUrl + "?datas=" +JSON.stringify(options) 
  //     })
  //   } else if (options.activityType == '13') {
  //     // 砍价
  //     wx.navigateTo({
  //       url: bargainUrl + "?datas=" + JSON.stringify(options) 
  //     })
  //   }
  // },
  // // 小程序来的，根据不同情况进行跳转
  // sourceXcxGetPage(options) {
  //   console.log('小程序分享链接',options)
  //   let collageUrl = "pages/collage/collage" //拼团页面
  //   let bargainUrl = "pages/bargain/bargain" //砍价页面
  //   // 判断活动是拼团还是砍价
  //   if (options.activityType == '12'||options.activityType == '5') {
  //     // 拼团
  //     console.log('拼团')
  //     if (options.type=='inviteCollage') {
  //       this.getCollageResult(options)
  //       console.log('邀请拼团')
  //     } else if (options.type=='shareCollage'){
  //       wx.navigateTo({
  //         url: collageUrl + "?datas=" + JSON.stringify(options) 
  //       })
  //     }

  //   } else if (options.activityType == '13'||options.activityType == '6') {
  //     // 砍价
  //     if (options.type=='inviteBargain') {
  //       console.log('邀请砍价')
  //       // wx.navigateTo({
  //       //   url: '../collageGood/collageGood?datas=' + JSON.stringify(options) 
  //       // })
  //     } else if (options.type=='shareBargain'){
  //       wx.navigateTo({
  //         url: bargainUrl + "?datas=" + JSON.stringify(options) 
  //       })
  //     }
  //   }
  // },


  // getCollageResult(options){
  //   $api.getCollageResult({
  //     activityId:options.activityId,
  //     collageId:options.collageId
  //   }).then(res => {
  //     //请求成功
  //     console.log(res)
  //     if (res.data.isSuccess==1) {
  //       wx.navigateTo({
  //         url: '../collageGood/collageGood?datas=' + JSON.stringify(options) 
  //       })
  //     } else if (res.data.isSuccess==2||res.data.isSuccess==3){
  //       wx.navigateTo({
  //         url: '../collage/collageResult?datas=' + JSON.stringify(res.data) 
  //       })
  //     }else{
  //       wx.showToast({
  //         title: "活动已过期",
  //         icon: "none"
  //       })
  //     }
  //   })
  //     .catch(err => {
  //       console.log(err)
  //       wx.showToast({
  //         title: err.message,
  //         icon: "none"
  //       })
  //       //请求失败
  //     })
  // },

  // 获取登录code
  wxLogin() {
    //获取小程序token
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          $api.getWxToken({
            jsCode: res.code
          }).then(res => {
            wx.setStorageSync("wx-mini-token", res.data)
          }).catch(err => {
            console.log("token获取异常", err)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  // 
  firstOpen(data) {
    return new Promise((resolve, reject) => {
      if (!wx.getStorageSync('firstOpen')) {
        wx.showModal({
          title: '授权提示',
          content: '小程序需要获取您的头像和昵称',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.getUserProfile({
                desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success(res) {
                  console.log(res)
                  // this.globalData.userInfo = res.userInfo
                  wx.setStorageSync("wxUserInfo", JSON.stringify(res.userInfo))
                  wx.setStorageSync('firstOpen', true)
                  resolve(res)
                },
                fail(err) {
                  let userInfo = {
                    avatarUrl: 'https://bucket.coopoo.com/wx-img/logo.png',
                    nickName: '神秘用户',
                  }
                  wx.setStorageSync("wxUserInfo", JSON.stringify(userInfo))
                  wx.setStorageSync('firstOpen', true)
                  reject(err)
                }
              })
            }
          }
        })
      } else {
        resolve()
      }
    })
  },

  // 获取浏览记录
  browseRecords(data) {
    return new Promise((resolve, reject) => {
      $api.browseRecords(data).then(res => {
        resolve(res)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },

  // 获取用户微信基本信息
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success(res) {
          console.log(res)
          // this.globalData.userInfo = res.userInfo
          wx.setStorageSync("wxUserInfo", JSON.stringify(res.userInfo))
          resolve(res.userInfo)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

  // 微信支付
  wxRequestPayment(params) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        appId: params.appId,
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.packageValue,
        signType: params.signType,
        paySign: params.paySign,
        success(res) {
          resolve(res)
        },
        fail(err) {
          wx.showToast({
            title: '已取消支付',
            icon: 'none'
          })
          // reject(err)
          resolve(err)
        },
        complete(data) {
          // reject(data)
          resolve(data)
        }
      })
    })
  },


  /**
   * 验证登录
   */
  checkIsLogin() {
    // return wx.getStorageSync('token') != '' && wx.getStorageSync('userInfo') != '';
    return wx.getStorageSync('userData') != '';
  },
  /**
   * 获取用户微信信息
   */
  getWxUserInfo(e, callback) {
    return JSON.parse(wx.getStorageSync('wxUserInfo'));
  },
  /**
   * 获取用户详细信息
   */
  getUserData(e, callback) {
    return JSON.parse(wx.getStorageSync('userData'));
  },
  /**
 * 获取分享链接信息
 */
  getShareData(e, callback) {
    return JSON.parse(wx.getStorageSync('shareData'));
  },

  // updeteUser(flag) {
  //   $api.getUser({memId: this.getUserInfo().pkMemberId})
  //   .then(res => {
  //     wx.setStorage({
  //       key:"userData",
  //       data:JSON.stringify(res.data)
  //     })
  //     wx.setStorage({
  //       key:"userInfo",
  //       data:JSON.stringify(res.data)
  //     })
  //   })
  //   .catch(err => {
  //   })
  // },

  formatNumber(n) {
    if (n <= 9) {
      n = n.toString()
      return "0" + n
    } else {
      return n
    }

  },
  formatDate(now) {

    let time = new Date(now)
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    month = this.formatNumber(month)
    date = this.formatNumber(date)
    hour = this.formatNumber(hour)
    minute = this.formatNumber(minute)
    second = this.formatNumber(second)
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },

  globalData: {
    userInfo: null,
    statusBarHeight: 30,
    navCapsuleHeight: 32,
    ktxStatusHeight: 40,
    navigationHeight: 88,
    paddingTop: 0
  }
})