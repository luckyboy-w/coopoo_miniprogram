// pages/bargain/helpChop.js
const App = getApp();
const $api = require('../../utils/api.js').API;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        parameter: {
            navSty: 'relitive', //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
            navbar: 1, //不同顶部的内容 如 文字/搜索框/logo 
            fontColor: '#333', //中间字的颜色
            title: '砍价免费拿  包邮送到家',
            urls: '',
            bgcolor: '#fff', //整个头部背景色，支持透明
            textL: "center", //居中或者居左 
            isLeftIcon: true, //是否显示左侧返回按钮，自定义左侧图标需要再定义变量
          },
          bargainInfoData:{},
          activityTime: 0,
        timeData: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let datas = JSON.parse(options.datas)
        console.log(datas)
        this.setData({
            bargainInfoData:datas,
            activityTime: datas.leftTime * 1000
        })
    },
    onChange(e) {
        // console.log(e.detail)
        this.setData({
            timeData: e.detail,
        });
    },
    finished(e) {
        this.setData({
            activityTime: 0,
        })
    },
    getGoodDetail(data) {
        console.log(data)
        let goodsData = data.currentTarget.dataset
        wx.navigateTo({
           url: "../barginGood/barginGood?goodsId=" + goodsData.goodsid+"&marketingGoodsId="+goodsData.marketinggoodsid
        })
     },
     getBargain(){
         let param ={
            cutPriceId:App.getShareData().cutPriceId,
            wxAvatar: App.getWxUserInfo().avatarUrl,
            wxUsername: App.getWxUserInfo().nickName
         }
        $api.cutBargainPrice(param).then(res=>{
            console.log(res)
            wx.navigateTo({
                url: "../bargain/bargainResult?datas=" + JSON.stringify(this.data.bargainInfoData)+'&state=1'
             })
        }).catch(err=>{
            console.log(err)
            wx.showToast({
                title: "砍价失败",
                icon: "none"
              })
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