// pages/collage/collage.js
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
         title: '活动名称',
         urls: '',
         bgcolor: '#fff', //整个头部背景色，支持透明
         textL: "center", //居中或者居左 
         isLeftIcon: false, //是否显示左侧返回按钮，自定义左侧图标需要再定义变量
      },
      activityTime: 0,
      timeData: {},
      showLogin: false,
      showShare:true,
      activityId: '',
      storeId: '',
      userId:'',
      activityData:{},
      goodsList: [],
      storeInfo: {},
      myAvatar:'',
      browseRecordList_:[
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
         {wxAvatar: '../../images/logo.png',}, 
      ],
      browseRecordList:[],
      orderRecordList:[],
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options.datas,App.getShareData().inviteMemberId)
      let optionData = JSON.parse(options.datas)
      // wx.setStorageSync('loctionActivityData', loctionActivityData)
      this.setData({
         activityId: optionData.activityId,
         myAvatar:App.getWxUserInfo().avatarUrl
      })
      if(App.checkIsLogin()){
         if (App.getUserData().storeId) {
            this.setData({
               storeId:App.getUserData().storeId
            })
         } else {
            this.setData({
               storeId:optionData.storeId
            })
         }
      }else{
         this.setData({
            storeId:optionData.storeId,
         })
      }
      this.initActivity()
      App.browseRecords({
            activityId:optionData.activityId,
            wxAvatar:App.getWxUserInfo().avatarUrl,
            wxUserName:App.getWxUserInfo().nickName,
         }).then(res=>{})
   },

   initActivity() {
      $api.initActivity({
         activityId: this.data.activityId,
         storeId: this.data.storeId
      })
         .then(res => {
            //请求成功
            console.log(res)
            wx.stopPullDownRefresh();
            let parameter = this.data.parameter
            parameter.title = res.data.activityName
            this.setData({
               parameter: parameter,
               goodsList: res.data.goodsList,
               storeInfo: res.data.storeInfo,
               activityData:res.data,
               activityTime:res.data.leftTime*1000,
               browseRecordList:res.data.browseRecordList.length>=1?res.data.browseRecordList:this.data.browseRecordList_,
            })
            let orderRecordList_ =  [
               // {
               //    createTime: "2022-12-12 12:12:12",
               //    goodsName: "商品名称是这个",
               //    payAmount: "888",
               //    wxAvatar: '../../images/logo.png',
               //    wxUsername: '用户昵称',
               // }, {
               //    createTime: "2022-12-12 12:12:12",
               //    goodsName: "商品名称是这个",
               //    payAmount: "888",
               //    wxAvatar: '../../images/logo.png',
               //    wxUsername: '用户昵称',
               // }, {
               //    createTime: "2022-12-12 12:12:12",
               //    goodsName: "商品名称是这个",
               //    payAmount: "888",
               //    wxAvatar: '../../images/logo.png',
               //    wxUsername: '用户昵称',
               // }, {
               //    createTime: "2022-12-12 12:12:12",
               //    goodsName: "商品名称是这个",
               //    payAmount: "888",
               //    wxAvatar: '../../images/logo.png',
               //    wxUsername: '用户昵称',
               // }, {
               //    createTime: "2022-12-12 12:12:12",
               //    goodsName: "商品名称是这个",
               //    payAmount: "888",
               //    wxAvatar: '../../images/logo.png',
               //    wxUsername: '用户昵称',
               // }, {
               //    createTime: "2022-12-12 12:12:12",
               //    goodsName: "商品名称是这个",
               //    payAmount: "888",
               //    wxAvatar: '../../images/logo.png',
               //    wxUsername: '用户昵称',
               // },
      
            ]
            if (res.data.orderRecordList.length>=1) {
               let arr = orderRecordList_
               res.data.orderRecordList.forEach(item => {
                  console.log(item)
                  arr.push(item)
                  console.log(arr)
               });
               this.setData({
                  orderRecordList:arr
               })
            }else{
               this.setData({
                  orderRecordList:orderRecordList_
               })
            }
         })
         .catch(err => {
            wx.stopPullDownRefresh();
            console.log(err)
            wx.showModal({
               // title: '提示',
               content: '活动不存在',
               showCancel: false,
               success(res) {
                  wx.switchTab({
                    url: '../index/index',
                  })
               }
            })
            //请求失败
            //console.log(err)
         })
   },

   testlogin() {
      this.setData({
         showLogin: true
      })
   },
   getGoodDetail(data) {
      console.log(data)
      let goodsData = data.currentTarget.dataset
      wx.navigateTo({
         url: "../collageGood/collageGood?goodsId=" + goodsData.goodsid+"&marketingGoodsId="+goodsData.marketinggoodsid
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
      this.shareState()
   },
   shareState(){
      if (App.checkIsLogin()) {
         this.setData({
            showShare:false
         })
      }
   },
   onChange(e) {
      // console.log(e.detail)
      this.setData({
         timeData: e.detail,
      });
   },
   // finished(e) {
   //    this.setData({
   //       activityTime: 0,
   //    })
   // },

   shareUrl() {
      if (App.checkIsLogin()==false) {
         this.setData({
            showLogin:true
         })
      }
      this.shareState()
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
      this.initActivity()
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {

   },
   catchTouchMove:function(res){
      return false
    },
   goPay(data){
      if (App.checkIsLogin()==false) {
         this.setData({
            showLogin:true
         })
         return false
      }
      
      // console.log(datas)
      console.log(data.currentTarget.dataset.orderno)
      let orderArr=[]
      orderArr.push(data.currentTarget.dataset.orderno)
      // return false;
      let params={
         orderNoList:orderArr,
         payChannel:3
      }
      wx.requestSubscribeMessage({
         tmplIds: ['hrf20vRLVftr5U8pA6XoWa-5_-6wOi1pXC1cwJHgfGE'],
         success (res) {},
         complete (){
      $api.payGoodsOrder(params).then(res => {
           //请求成功
           console.log(res.data)
           if (res.data.orderFlag==1) {
            wx.redirectTo({
               url: '/pages/paySuccess/collagaePaySuccess?payPrice='+data.currentTarget.dataset.payprice+"&collageId="+data.currentTarget.dataset.collageid+"&goodsId="+data.currentTarget.dataset.goodsId+"&marketingGoodsId="+data.currentTarget.dataset.marketinggoodsid+"&activityId="+App.getShareData().activityId+"&activityType="+App.getShareData().activityType+"&goodsImg="+data.currentTarget.dataset.goodsimg
             })
           } else{
           let payParams=JSON.parse(res.data.wxPayInfo)
           App.wxRequestPayment(payParams).then(res=>{
             console.log('7777',res)
             if (res.errMsg=='requestPayment:ok') {
                wx.redirectTo({
                  url: '/pages/paySuccess/collagaePaySuccess?payPrice='+data.currentTarget.dataset.payprice+"&collageId="+data.currentTarget.dataset.collageid+"&goodsId="+data.currentTarget.dataset.goodsId+"&marketingGoodsId="+data.currentTarget.dataset.marketinggoodsid+"&activityId="+App.getShareData().activityId+"&activityType="+App.getShareData().activityType+"&goodsImg="+data.currentTarget.dataset.goodsimg
                })
             } else if(res.errMsg=='requestPayment:fail cancel'){
                
             }
           }).fail(err=>{
             console.log('8888',err)
           }).catch(data=>{
             console.log('9999',data)

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
   goMyOrder(){
      wx.navigateTo({
         url: '/pages/myOrder/myOrder'
       })
   },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
     console.log('8888888',ops)
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    let datas
    let title ='靠谱家'
    let img=''
    if (ops.from === 'button'&&ops.target.dataset.type=="inviteCollage") {
       console.log(ops.target.dataset)
       img = ops.target.dataset.goodsimg
       title='我参加了一个拼团活动，赶紧和我一起参加'
       datas = {
         activityId:App.getShareData().activityId,//活动id
         activityType: App.getShareData().activityType,//活动类型
         collageId: ops.target.dataset.collageid,//拼团id
         goodsId: ops.target.dataset.goodsid,//商品id
         marketingGoodsId: ops.target.dataset.marketinggoodsid,//活动商品id
         sourceType: 'wxminiprogram',//来源标识
         type: 'inviteCollage'//邀请拼团的类型
        }
    } else {
      title='这里有个拼团活动 一起来参加~'
       datas = {
         activityId: this.data.activityId,//活动id
         activityType: App.getShareData().activityType,//活动类型
         sourceType: 'wxminiprogram',//来源标识
         type:'shareCollage'//分享拼团活动的类型
        }
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
      console.log(datas,img)
      let path = '/pages/index/index?datas='+JSON.stringify(datas)
    return {
      title: title,
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
  },
})