import Util from './util.js';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';
// 小程序秘钥  572439fbe8670007e47f2cac92aa959c
// 小程序AppID  wxd0064def61db7901
// 线上
// const baseURL = 'https://app.coopoo.com/lany/';
// 预发布
const baseURL = 'https://tapp.coopoo.com/lany/';
// 测试
// const baseURL = 'https://testapp.coopoo.com/lany/';
// **本地
// const baseURL = 'http://58.33.146.178:8769/';
// 内网开发
// const baseURL = 'http://192.168.1.218:8769/';
// 公网开发
// const baseURL = 'http://58.33.146.178:8769/';


function request(method, url, data) {
  return new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let getHeader ='application/json'
    let postFormHeader ='application/x-www-form-urlencoded'
    let postHeader = 'application/json'
    console.log('请求参数',data)
    console.log(wx.getStorageSync('deviceId'),'deviceId')
    wx.request({
      url: baseURL + url,
      method: method,
      data: data,
      header: {
        'version':'w2.4.4',
        'content-type': method === POST ? postHeader : getHeader,
        'deviceId':(wx.getStorageSync('deviceId')&&wx.getStorageSync('deviceId') != '' )?wx.getStorageSync('deviceId'):'',
        'wx-mini-token': (wx.getStorageSync('wx-mini-token')&&wx.getStorageSync('wx-mini-token') != '' )?wx.getStorageSync('wx-mini-token'):'',
        'token': (wx.getStorageSync('userData') != '' && wx.getStorageSync('token') != '') ? wx.getStorageSync('token') : '',
      },
      success(res) {
        //请求成功
        console.log('返回数据',res)
        //判断状态码---errCode状态根据后端定义来判断
        wx.hideLoading()
        if (res.data.errCode ===0  || res.data.errCode == '0') {
          resolve(res.data);
        } else if (res.data.errCode == 10004 || res.data.errCode == '10004') {
          // wx.removeStorage();
          // wx.clearStorageSync()
          // wx.clearStorage()
          wx.setStorage({
            data: '',
            key: 'token',
        })
        wx.setStorage({
            data: '',
            key: 'userData',
        })
          wx.showToast({
            title: '登录超时，请重新登录',
            duration: 2000,
            icon: 'none'
          })
          return
        } else if (res.data.errCode == -99 || res.data.errCode == '-99') {

          wx.showModal({
            // title: '提示',
            content: '您的账号已被禁用，请联系http://www.coopoo.com/ 平台客服',
            showCancel: false,
            success: function (e) {
              if (e.confirm) {
                // 用户点击了确定 
              } else if (e.cancel) {}
            }
          })

        } else if (res.data.errCode == 20006) {
          //token失效 微信未授权
          wx.showToast({
            title: '微信未授权，请刷新页面重试',
            icon: 'none'
          })
          getApp().wxLogin()
          return false;
        }else if(res.data.errCode==20007){
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          wx.showModal({
            title: '提示',
            content: '支付订单与当前登录手机号不一致，请重新登录',
            showCancel: false,
            success(res) {
              wx.setStorage({
                data: '',
                key: 'token',
            })
            wx.setStorage({
                data: '',
                key: 'userData',
            })
            }
          })
          return false;
        }else{
          // //console.log("异常：", res)
          let msg = res.data.message ? res.data.message : res.data.msg
          //其他异常
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          reject(res.data);
        }

      },
      fail(err) {
        //请求失败
        wx.hideLoading()
        console.log('报错信息',err)
        reject("err",err)
      }
    })
  })
}
/**
 * 执行用户登录
 */
function doLogin() {
  // 保存当前页面
  let pages = getCurrentPages();

  if (pages.length) {
    console.log(pages, 'pages')
    let currentPage = pages[pages.length - 1];
    "pages/login/login" != currentPage.route
    wx.setStorage({
      data: JSON.stringify(currentPage),
      key: 'currentPage',
    })
  }
  // 跳转授权页面
  wx.navigateTo({
    url: "/pages/login/login"
  });
}


const API = {
  indexList: (data) => request(GET, `portal/index`, data),
  goodsList: (data) => request(GET, `portal/goods/recommend-goods-list`, data),
  goodDetail: (data) => request(GET, `portal/goods/detail`, data),
  goodSkuDetail: (data) => request(GET, `portal/shopping-cart/goods-sku`, data),
  getCommentList: (data) => request(POST, `portal/goods-comment/list`, data),
  getWxToken: (data) => request(GET, `portal/activity/login`, data),
  browseRecords: (data) => request(POST, `portal/activity/add-browse-record`, data),
  sendSms: (data) => request(POST, `portal/login/send-verify-code`, data),
  loginBySmsCode: (data) => request(POST, `portal/login/register-by-invite`, data),
  // loginBySmsCode: (data) => request(POST, `portal/login/login-by-sms-code`, data),
  confirmOrder: (data) => request(POST, `portal/order/goods-confirm-order`, data),
  getAddrlist: (data) => request(GET, `portal/address/get-list`, data),
  deleteAddr: (data) => request(POST, `portal/address/delete`, data),
  addAddress:(data) => request(POST, `portal/address/add`, data),
  editAddress:(data) => request(POST, `portal/address/update`, data),
  createOrderCollageGood:(data) => request(POST, `portal/activity/start-collage-create-order`, data),
  payGoodsOrder:(data) => request(POST, `portal/pay/goods-order`, data),
  getCollageResult:(data) => request(POST, `portal/activity/collage-info`, data),
  getJoinCollage:(data) => request(POST, `portal/activity/collage`, data),
  
  getBargaining:(data) => request(POST, `portal/activity/start-cut-price`, data),
  getBargainData:(data) => request(POST, `portal/activity/cut-price-info`, data),
  createBargainOrder:(data) => request(POST, `portal/order/goods-create-order`, data),
  cutBargainPrice:(data) => request(POST, `portal/activity/cut-price`, data),



  



  initActivity: (data) => request(POST, `portal/activity/index`, data),




  baseURL: baseURL
};
module.exports = {
  API: API
}