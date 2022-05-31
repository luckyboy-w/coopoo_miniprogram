// components/wxLogin/wxLogin.js
var App = getApp();
const $api = require('../../utils/api.js').API;
Component({
    properties: {
        showLogin: {
            type: Boolean,
            value: '',
        },
    },
    /**
     * 页面的初始数据
     */
    data: {
        codeTxt: '获取验证码',
        phoneVal: '',
        phoneCode: '',
        inviteMemberId: '',
        showTap: false,
        // showLogin:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    methods: {
        onClose() {
            this.setData({
                showLogin: false
            })
        },
        onChange(event) {
            this.setData({
                checked: event.detail,
            });
            if (event.detail == true) {
                this.setData({
                    showTap: true
                });
            } else {
                this.setData({
                    showTap: false
                });
            }
        },
        toAgreement() {
            wx.navigateTo({
                url: '/pages/agreement/agreement',
            })
        },
        blurInput(e) {
            this.setData({
                phoneVal: e.detail.value
            })
        },
        blurInputCode(e) {
            this.setData({
                phoneCode: e.detail.value
            })
        },

        sendCms() {
            let that = this
            if (that.data.phoneVal == '' || !(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(that.data.phoneVal))) {
                wx.showToast({
                    icon: 'none',
                    title: '请填写正确的手机号',
                })
                return false
            }
            if (that.data.codeTxt != '获取验证码') {
                return false
            }
            $api.sendSms({
                phoneNo: that.data.phoneVal
            })
                .then(res => {
                    //请求成功
                    that.getPhoneCode()
                })
                .catch(err => {
                    //请求失败
                    //console.log(err)
                })
        },
        //获取验证码
        getPhoneCode() {
            let timer = 60,
                txt = '60s'
            this.setData({
                codeTxt: txt
            })
            let getNewTime = setInterval(() => {
                timer -= 1
                txt = `${timer}s`
                if (timer <= 0) {
                    timer = '获取验证码'
                    clearInterval(getNewTime)
                    txt = `${timer}`
                }
                this.setData({
                    codeTxt: txt
                })
            }, 1000)

        },
        handZlogin() {
            //todo 登陆接口 验证码等  =》  模拟存储一下 跳转
            var that = this
            //存储登录信息
            if (!that.data.showTap) {
                wx.showToast({
                    title: '请勾选同意靠谱家服务协议',
                    icon: 'none'
                })
                return false;
            }
            if (that.data.phoneVal == '' || !(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(that.data.phoneVal))) {
                wx.showToast({
                    icon: 'none',
                    title: '请填写正确的手机号',
                })
                return false
            }
            if (!that.data.phoneCode) {
                wx.showToast({
                    title: '请填写正确的验证码',
                    icon: 'none'
                })
                return false;
            }
            $api.loginBySmsCode({
                phoneNo: that.data.phoneVal,
                verifyCode: that.data.phoneCode,
                inviteMemberId: App.getShareData().inviteMemberId
            })
                .then(res => {
                    console.log(res)
                    wx.setStorage({
                        data: res.data.token,
                        key: 'token',
                    })
                    wx.setStorage({
                        data: JSON.stringify(res.data),
                        key: 'userData',
                    })
                    this.onClose()
                    wx.showToast({
                        icon: 'none',
                        title: '登录成功',
                    })
                    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
                    let prevPage = pages[pages.length - 1];
                    console.log(prevPage)
                    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
                    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                        userData: res.data
                    })
                })
                .catch(err => {
                    //请求失败
                    //console.log(err)
                })


        },

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