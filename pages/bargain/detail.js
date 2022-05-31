// pages/bargain/detail.js
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
        cutPriceId: '',
        bargainInfoData: {},
        activityId: '',
        activityTime: 0,
        timeData: {},
        shortPrice:'',
        shortPercent:'',
        orderList:[],
        showLogin:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let datas=JSON.parse(options.datas)
        console.log(datas)
        // let datas = {
        //     activityId: "eec8c98572f2459caf1723fc46ccd89c",
        //     addressId: null,
        //     cutPersonNum: 3,
        //     goodsId: "84d1cbeda1204030b2bd56679cd2c6ed",
        //     id: 10,
        //     marketingGoodsId: "65b95578e8ff46ec9e5934ab6cc2ce36",
        //     marketingGoodsSkuId: "d28aabdd64db4779b8fcf41cab62ce8b",
        //     memberId: "1441047134546825216",
        //     storeId: 9,
        //     wxOpenId: "ota0a453Z11kCV-IvUxSKPgi_RwY",

        // }
        this.setData({
            cutPriceId: datas.id,
            activityId: datas.activityId,
        })
        this.initBargainData()
    },
    initBargainData() {
        let param = {
            cutPriceId: this.data.cutPriceId,
            activityId: this.data.activityId
        }
        $api.getBargainData(param).then(res => {
            console.log(res)
            let shortPrice = (res.data.leftPayPrice-res.data.floorPrice).toFixed(2)
            console.log(((res.data.partPrice/res.data.cutPrice)*100).toFixed(2))
            this.setData({
                bargainInfoData: res.data,
                shortPrice:shortPrice,
                shortPercent:((res.data.partPrice/res.data.cutPrice)*100).toFixed(2),
                activityTime: res.data.leftTime * 1000,
            })
            console.log(res.data.orderNo)
            if (res.data.orderNo!='') {
                let arr = res.data.orderNo.split(' ')
                this.setData({
                    orderList:arr
                })
                console.log(this.data.orderList,res.data.orderNo.split(' '))
            }
        }).catch(err => {
            console.log(err)
        })
    },
    createPayOrder() {
        if (App.checkIsLogin() == false) {
            this.setData({
              showLogin: true
            })
            return false;
          }
        let params={
            addressId:this.data.bargainInfoData.addressId?this.data.bargainInfoData.addressId:'',
            cutPriceId:this.data.bargainInfoData.id,
            goodsId:this.data.bargainInfoData.goodsId,
            goodsNum:1,
            marketingGoodsId:this.data.bargainInfoData.marketingGoodsId,
            memberId:App.getUserData().pkMemberId,
            skuId:this.data.bargainInfoData.skuId,
            wxAvatar:this.data.bargainInfoData.wxAvatar,
            wxUsername:this.data.bargainInfoData.wxUsername
        }
        var date1 = new Date();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate() + 10);
        var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
        console.log(time2 + ' 16:00:00')
        if (this.data.bargainInfoData.deliveryMethod == 2) {
            params.deliveryMethod = 1
          } else if (this.data.bargainInfoData.deliveryMethod == 3) {
            params.deliveryMethod = 2
            params.appointmentDate = time2 + ' 16:00:00'
            params.storeId = App.getUserData().storeId
        }
        console.log(this.data.orderList,'88888')
        if (this.data.orderList==[]||this.data.orderList.length <=0) {
            $api.createBargainOrder(params).then(res=>{
                console.log(res)
                this.setData({
                    orderList:res.data.orderNoList
                })
                this.payOrder(res.data.orderNoList)
            }).catch(err=>{
                console.log(err)
            })
        } else if (this.data.orderList.length>=1&&this.data.orderList){
            this.payOrder(this.data.orderList)
        }
    },

    payOrder(datas){
            console.log(datas)
            let that= this
            let params={
              orderNoList:datas,
              payChannel:3
            }
            $api.payGoodsOrder(params).then(res => {
              //请求成功
              console.log(res.data)
              if (res.data.orderFlag==1) {
                wx.redirectTo({
                    url: '/pages/paySuccess/bargainPaySuccess?payPrice='+that.data.bargainInfoData.leftPayPrice
                  })
               } else{
              let payParams=JSON.parse(res.data.wxPayInfo)
              App.wxRequestPayment(payParams).then(res=>{
                console.log(res)
                if (res.errMsg=='requestPayment:ok') {
                    wx.redirectTo({
                        url: '/pages/paySuccess/bargainPaySuccess?payPrice='+that.data.bargainInfoData.leftPayPrice
                      })
                 } else if(res.errMsg=='requestPayment:fail cancel'){
                     console.log('取消支付')
                 }
              }).fail(err=>{
                console.log(err)
              })
            }
            })
              .catch(err => {
                if (err.message=='订单不存在') {
                    that.setData({
                        orderList:[]
                    })
                    that.initBargainData()
                   }
                //请求失败
                //console.log(err)
        
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
    onShareAppMessage: function (ops) {
        let datas = {
            activityId: this.data.bargainInfoData.activityId,//活动id
            activityType: this.data.bargainInfoData.activityType,//活动类型
            cutPriceId: this.data.bargainInfoData.id,//砍价id
            sourceType: 'wxminiprogram',//来源标识
            type: 'inviteBargain'//邀请砍价的类型
        }
        if (App.checkIsLogin()==false) {
            datas.storeId= App.getShareData().storeId //门店id
            datas.inviteMemberId= App.getShareData().inviteMemberId //用户id
         }else if(App.checkIsLogin()==true){
            if (App.getUserData().storeId) {
                datas.storeId=App.getUserData().storeId
             } else {
                datas.storeId= App.getShareData().storeId //门店id
             }
            datas.inviteMemberId= App.getUserData().pkMemberId //用户id
         }
        let img = this.data.bargainInfoData.goodsImg
        // if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops.target,datas)
        let path = '/pages/index/index?datas=' + JSON.stringify(datas)
        return {
            title: '快来帮我砍一刀~',
            imageUrl:img,
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