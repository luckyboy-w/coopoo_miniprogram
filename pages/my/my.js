// index.js
// 获取应用实例
const App = getApp();

Page({
  data: {
    wxUserInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad() {
    if (wx.getStorageSync('wxUserInfo')) {
      this.setData({
        hasUserInfo: true,
        wxUserInfo:JSON.parse(wx.getStorageSync('wxUserInfo'))
      })
    }else{
      this.setData({
        hasUserInfo: false,
      })
    }
  },
  getUserProfile(e) {
    App.getUserProfile().then(res=>{
      if (res) {
        this.setData({
          hasUserInfo: true,
          wxUserInfo:JSON.parse(wx.getStorageSync('wxUserInfo'))
        })
      }
    })
  },
  clearUserInfo(){
  wx.clearStorageSync()
  wx.clearStorage()
  this.setData({
    hasUserInfo: false,
  })
  }
})
