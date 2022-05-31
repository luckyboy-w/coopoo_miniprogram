// pages/collage/collageResult.js
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
            title: '拼团结果',
            urls: '',
            bgcolor: '#fff', //整个头部背景色，支持透明
            textL: "center", //居中或者居左 
            isLeftIcon: true, //是否显示左侧返回按钮，自定义左侧图标需要再定义变量
        },
        resultData: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let parameter = this.data.parameter
        parameter.urls = '/pages/collage/collage?datas=' + JSON.stringify(App.getShareData())
        if (options) {
            this.setData({
                parameter: parameter,
                resultData: JSON.parse(options.datas)
            })
        }
    },
    getGoodDetail(data) {
        console.log(data)
        let goodsData = data.currentTarget.dataset
        wx.navigateTo({
            url: "../collageGood/collageGood?goodsId=" + goodsData.goodsid + "&marketingGoodsId=" + goodsData.marketinggoodsid
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