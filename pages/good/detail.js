const App = getApp();
const $api = require('../../utils/api.js').API;
import util from '../../utils/util.js';
let scrollDdirection = 0; // 用来计算滚动的方向
Page({
  data: {
    parameter2:{
      navSty:'relitive',   //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
      navbar:1,  //不同顶部的内容 如 文字/搜索框/logo 
      fontColor:'#1A1A1A', //中间字的颜色
      title:'商品详情',   
      bgcolor:'#fff',   //整个头部背景色，支持透明
      textL:"center",   //居中或者居左 
      isLeftIcon:true,  //是否显示左侧返回按钮，自定义左侧图标需要再定义变量  
    },

    goodsData: {},
    goodsImgUrlList: [],
    activeIndex: '',
    goodsContentDetail: '',
    isShow: false,
    simulatedDATA: {
      "difference": [],
      "specifications": []
    },
    selectItem: [],
    selectArr: [], //存放被选中的值
    shopItemInfo: {}, //存放要和选中的值进行匹配的数据
    subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
    price: '',
    skuText: '',
    selectedSkuText:'',
    skuGoodsImgUrl:'',
    buynums: 1,

    pageSize:10,
    pageNum:1,
    totalPage:0,
    swiperCurrent: 0,
    goodsId: '',
    commentNum: 0,
    commentList: [],
    imgsList: [],
    nodes: '',
    maxLength: 60,
    maxLength_: 100,
    swiperCurrentNum: '1',
    imgListFile: [],
    indicatorDots: true,
    autoplay: false, // 自动播放
    // 轮播数据 + 效果 E
    controls: false,

  },
  attached: function () {
    let systemInfo = wx.getSystemInfoSync()
    // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    this.setData({
      navTop: (getApp().globalData.statusBarHeight + 2) * pxToRpxScale,
      navH: (getApp().globalData.navCapsuleHeight - 1) * pxToRpxScale,
    });
  },
  onLoad(options) {
    let _this = this;
    let goodsId = options.goodsId;
    _this.attached()
    // 获取设备信息
    wx.getSystemInfo({
      success: res => {
        _this.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
    _this.setData({
      goodsId: goodsId
    })
    //初始化商品数据
    _this.initData()
    // //评论数量 
    // _this.commentNum()
    // //评论列表
    _this.commentList()
  },
  onShow() {

  },
  onReady() {

  },
  // 播放
  videoPlay: function () {
    var videoplay = wx.createVideoContext("video");
    videoplay.play()
    this.setData({
      controls: true,
    })
  },
  /**
   * Api：获取商品详情
   */


  initData: function () {
    var that = this;
    $api.goodDetail({goodsId:that.data.goodsId})
      .then(res => {
        //请求成功
        if (res.errCode == '0' || res.errCode == 0) {
          let datas = res.data;
          let imgListFile = res.data.goodsImgUrlList
          if (res.data.goodsVideoUrl&&res.data.goodsVideoUrl!='') {
            let videoUrl = {
              cover: res.data.goodsCoverImgUrl,
              url: res.data.goodsVideoUrl,
              type: 'video'
            }
            imgListFile.reverse()
            imgListFile.push(videoUrl)
            imgListFile.reverse()
          }
          //富文本图片放大
          let nodes=''
          if (datas.goodsContentDetail) {
            let goodsContentDetail = datas.goodsContentDetail.replace(/\<img/g,'<img style="width:100%;height:100%"')
            nodes = goodsContentDetail;
          }
          that.setData({
            nodes: nodes,
            goodsData: datas,
            imgListFile: imgListFile,

          })
        }
      })
      .catch(err => {
        //请求失败
        console.log(err)
      })

  },
  pophide: function() {
    this.setData({
      isShow:false
    })
  },
  minu() {
    let num = Number(this.data.buynums) - 1
    if (num <= 0) {
      num = 1
    }
    this.setData({
      buynums:num
    })
  },
  plus() {
    let num = Number(this.data.buynums) + 1
    if (num >= 999) {
      num = 999
    }
    this.setData({
      buynums:num
    })
  },

  //修改SKU彈框
  popup() {
    this.setData({
      isShow:true
    })
    let skuSelList = this.data.goodsData.specificationList
    let skuPriceList = this.data.goodsData.skuList
    skuSelList.forEach((e, i) => {
      e.skuTextArr = e.specificationValueList
      let arr = []
      let txtarr = e.skuTextArr
      txtarr.forEach((m, n) => {
        let ndatas = {
          name: m.specificationValue,
          isShow: true
        }
        arr.push(ndatas)
      })
      e.name = e.specificationName
      e.item = arr
    })
    skuPriceList.forEach((e, i) => {
      e.price = e.salePrice
      e.difference = e.skuText
    })
    this.setData({
      simulatedDATA : {
      'difference': skuPriceList,
      'specifications': skuSelList
    }
    })
    

    // })
  },
  enterSku() {
    let skuText = this.data.selectArr.join(";")
    let arr = this.data.simulatedDATA.difference
    let skuId = ''
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].skuText == skuText) {
        skuId = arr[j].skuId
      }
    }
    console.log('选择的是这个规格》》》'+skuText,'······skuId为》》》'+skuId)
    // if (skuId != '') {
    // 	let param = {
    // 		skuId: skuId,
    // 		ordDtlId: this.goodDtlList.ordDtlId
    // 	}
    // 	postMethod('/order/changeSkuAttr', param).then(res => {
    // 		if (res.code == 200) {
    // 			this.$message({
    // 				message: '修改成功',
    // 				type: 'success'
    // 			})
    // 			let datas = {
    // 				operationObject: this.ordDtl.orderNo,
    // 				operationContent: '修改商品规格'
    // 			}
    // 			this.saveOperation(datas)
    // 			this.skuClose()
    // 			let obj = {
    // 				orderId: this.ordDtl.orderId
    // 			}
    // 			this.getOrdDtl(obj)
    // 		} else {
    // 			this.$message({
    // 				message: res.message,
    // 				type: 'error'
    // 			})
    // 		}
    // 	})
    // } else {
    // 	this.$message({
    // 		message: "请选择商品规格",
    // 		type: 'warning'
    // 	})
    // }
  },
  specificationBtn: function(data) {
    console.log(data)
    let that = this;
    let item =data.currentTarget.dataset.item
    let index =data.currentTarget.dataset.index
    let n =data.currentTarget.dataset.n
    let name =data.currentTarget.dataset.name

    let selectArr= that.data.selectArr;
    let selectItem = that.data.selectItem;
    let subIndex = that.data.subIndex;

    if (that.data.selectArr[index] != item) {
      let arr = name + ":" + item
      selectArr[index] = arr;
      selectItem[index] = item;
      subIndex[index] = n;
      this.setData({
        selectArr:selectArr,
        selectItem:selectItem,
        subIndex:subIndex,
      })
    } else {
      selectArr[index] = '';
      selectItem[index] = '';
      subIndex[index] = -1;
      this.setData({
        selectArr:selectArr,
        selectItem:selectItem,
        subIndex:subIndex,
      })
    }
    // console.log(that.data.selectArr,that.data.selectItem,that.data.subIndex)
    // that.$forceUpdate(); //重绘
    that.checkItem();
  },
  checkItem: function() {
    let skuText = this.data.selectArr.join(";")
    let arr = this.data.simulatedDATA.difference
    let skuId = '' 
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].skuText == skuText) {
        skuId = arr[j].skuId
        this.setData({
          price:arr[j].price,
          skuText:arr[j].skuText,
          skuGoodsImgUrl:arr[j].goodsImgUrl,
          selectedSkuText:this.data.selectItem.join(",")

        })
      }
    }
    // this.$forceUpdate(); //重绘
  },


   //滑块滑动
   moveServerProSwiper: function (e) {
    var that = this;
    that.setData({
      swiperCurrent: e.detail.current,
      swiperCurrentNum: e.detail.current + 1
    })
  },

  chooseImg_: function (e) { //预览
    var src = e.currentTarget.dataset.src;
    var urls = this.data.imgsList;
    // urls[0] = src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接 
      urls: urls
    })
  },
  preImg(e) {
    let img = []
    img.push(e.currentTarget.dataset.img)
    wx.previewImage({
      urls: img, // 当前显示图片的http链接 
    })
  },
  //获取评论列表
  commentList() {
    var that = this
    let datas = {
      goodsId: that.data.goodsId,
      pageSize: '10',
      pageNum: '1',
      type:'1'
    }
    $api.getCommentList(
      datas).then(res => {
        //请求成功
        let arr = res.data.records
        let commentImgList=[]
        // console.log(res)
        if(res.data.records.length>0&&res.data.records[0].imagesUrl&&res.data.records[0].imagesUrl!=''){
          commentImgList=res.data.records[0].imagesUrl.split(',')
          // console.log(commentImgList)
          arr[0].commentImgList=commentImgList
        }
        // console.log(arr)
          that.setData({
            commentList: arr
          })
      })
      .catch(err => {
        //请求失败
        console.log(err)
      })
  },


  previewImage: function (e) {
    var imgs = e.target.dataset.imgs
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  onOpenGoodImg() {
    this.setData({
      showGoodImg: true
    });
  },
  onCloseGoodImg() {
    this.setData({
      showGoodImg: false
    });
  },
  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    // return {
    //   title: "详情页",
    //   path: "/pages/good/detail"
    // };
  }

});