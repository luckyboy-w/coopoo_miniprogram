var app = getApp();
Component({
  properties: {
    parameter:{
      type: Object,
      value:{},
    },
  },
  data: {
    navH: "",
    aindex:'1',
  },
  ready: function(){
    var pages = getCurrentPages();
    if (pages.length <= 1) this.setData({'parameter.return':0});
  },
  attached: function () {
    let systemInfo = wx.getSystemInfoSync()
	  // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    this.setData({
      navTop: (getApp().globalData.statusBarHeight +2) * pxToRpxScale,
      navH: (getApp().globalData.navCapsuleHeight-1) * pxToRpxScale,
    });
  },
  methods: {
    goBack:function(){
      // console.log('888',this.data.parameter.urls)
      wx.redirectTo({
        url: this.data.parameter.urls,
        success:function(){
          console.log('跳成功')
        },
        fail: function(){
          console.log('失败')
          wx.navigateBack({
            fail:function(){
              wx.switchTab({
                url:'/pages/index/index'
              })
            }
          });    
        } 
      })
    },
    //跳转message
    goMessage(){
      wx.navigateTo({
        url: '/pages/message/message'
      })
    },
    bindTabTop(e){
      var index = e.currentTarget.dataset.index;
      var aa = this.data.parameter
      aa.tabinx = index
     this.setData({
       parameter: aa
     })
      this.setData({
        aindex: index
      })
     this.triggerEvent('customevent', { aindex:index}, { bubbles: true })
    },
  }
})