// pages/invite/jump.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jumpUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let urls = JSON.stringify('https://app.coopoo.com/share.html?inviteCode='+options.inviteCode+'&avatarUrl='+options.avatarUrl+'&nickname='+options.nickname)
//console.log(wx.getStorageSync('urlsKey'))
console.log(options)
    let urls = options.urls
    // let isIndex = options.isIndex
    // let nickname=wx.getStorageSync('urlsKey').nickname
    // let avatarUrl=wx.getStorageSync('urlsKey').avatarUrl
    // let inviteCode = App.getUserInfo().pkMemberId
    // let jumpurl = JSON.parse(urls)+'?inviteCode='+inviteCode+'&avatarUrl='+avatarUrl+'&nickname='+nickname
    // if(isIndex ==1 || isIndex =='1'){
    //   jumpurl = jumpurl 
    // }else{
    //   jumpurl = jumpurl+'?inviteCode='+memId 
    // }
    this.setData({
      // jumpUrl: jumpurl
      jumpUrl: urls

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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})