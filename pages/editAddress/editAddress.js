// pages/editAddress/editAddress.js
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const areaData = require('../../utils/area');
const $api = require('../../utils/api.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter:{
      navSty:'relitive',   //fixed  通栏布局（bgcolor：transparent）   relitive 顺序布局
      navbar:1,  //不同顶部的内容 如 文字/搜索框/logo 
      fontColor:'#1A1A1A', //中间字的颜色
      title:'修改地址',   
      bgcolor:'#fff',   //整个头部背景色，支持透明
      textL:"center",   //居中或者居左 
      isLeftIcon:true,  //是否显示左侧返回按钮，自定义左侧图标需要再定义变量  
    },
    receiveUser: "",
    receivePhone: "",
    provinceId: "",
    provinceText: "",
    cityId: "",
    cityText: "",
    areaId: "",
    areaText: "",
    address: "",
    isDefault: 0,
    street: "",
    hidePicker: true,
    areaList: areaData.default,
    codes: "",
    show: false,
    editId:0,
    memId: '',
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    if(id){
      let checked = false
      if (options.isDefault == 1) {
        checked = true
      }
      this.setData({
        editId: id,
        receiveUser: options.receiveUser,
        receivePhone: options.receivePhone,
        provinceId: options.provinceId,
        provinceText: options.provinceText,
        cityId: options.cityId,
        cityText: options.cityText,
        address: `${options.provinceText}${options.cityText}${options.areaText}`,
        street: options.address,
        isDefault: options.isDefault,
        checked: checked
      })
    }
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

  // },

  setName(e) {
    this.setData({
      receiveUser: e.detail
    })
  },
  setPhone(e) {
    this.setData({
      receivePhone: e.detail
    })
  },
  setStreet(e) {
    this.setData({
      street: e.detail
    })
  },
  openPicker() {
    this.setData({
      show: true
    })
  },

  cancelArea() {
    this.setData({
      show: false
    })
  },

  confirmArea(e) {
    this.setData({
      codes: e.detail.values[2].code,
      address: `${e.detail.values[0].name} ${e.detail.values[1].name} ${e.detail.values[2].name}`,
      provinceId: e.detail.values[0].code,
      cityId: e.detail.values[1].code,
      areaId: e.detail.values[2].code,
      provinceText: e.detail.values[0].name,
      cityText: e.detail.values[1].name,
      areaText: e.detail.values[2].name,
      show: false
    });
  },
  clearFormData() {
    this.setData({
      receiveUser: "",
      receivePhone: "",
      provinceId: "",
      provinceText: "",
      cityId: "",
      cityText: "",
      areaId: "",
      areaText: "",
      address: "",
      isDefault: 0,
      street: "",
    })
  },
  add(params) {
    let that = this
    $api.addAddress(params)
      .then(res => {
        Toast.success('添加成功！')
        that.clearFormData()
        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
        let prevPage = pages[ pages.length - 2 ];
        prevPage.setData({
          pageNum: 1,
          result: []
        })
        prevPage.doRefresh()
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      })
      .catch(err => {Toast.fail(err)})
   
  },
  modify(params) {
    let that = this
    $api.editAddress(params)
      .then(res => {
        Toast.success('编辑成功！')
          that.clearFormData()
          let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[ pages.length - 2 ];
          prevPage.setData({
            pageNum: 1,
            result: []
          })
          prevPage.doRefresh()
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
      })
      .catch(err => {Toast.fail(err)})
    
  },
  save() {
    let params = {
      id: this.data.editId,
      receiveUser: this.data.receiveUser,
      receivePhone: this.data.receivePhone,
      provinceId: this.data.provinceId,
      provinceText: this.data.provinceText,
      cityId: this.data.cityId,
      cityText: this.data.cityText,
      areaId: this.data.areaId,
      areaText: this.data.areaText,
      isDefault: this.data.isDefault,
      address: this.data.street
    }

    if (this.data.receiveUser === '') {
      Toast.fail('请输入姓名')
      return false
    }
    if (this.data.receivePhone === '' || !(/^1[3456789]\d{9}$/.test(this.data.receivePhone))) {
      Toast.fail('请输入正确的手机号')
      return false
    }
    if (this.data.address === '') {
      Toast.fail('请选择省市区')
      return false
    }
    if (this.data.street === '') {
      Toast.fail('请输入详细地址')
      return false
    }
    if (this.data.editId==0) {
      delete params.id
      this.add(params)
    } else {
      params.id = this.data.editId
      this.modify(params)
    }
  },

  //获取省
  getProvince() {
    $api.getProvince()
    .then(res => {
      let province = res.data
      let province_list = {}
      province.forEach(item => {
        let obj = JSON.parse(`{"${item.provinceid}":"${item.province}"}`)
        Object.assign(province_list, obj);
      })
      // this.setData({
      //   areaList: {
      //     province_list: province_list,
      //     city_list: [],
      //     county_list: []
      //   }
      // })
      this.getCity({provinceid: 610000})
    })
    .catch(err => {
      
    })
  },
  //获取市
  getCity(params) {
    $api.getCity(params)
    .then(res => {
      let city = res.data
      let city_list = {}
      city.forEach(item => {
        let obj = JSON.parse(`"${item.cityid}": "${item.city}"`)
        Object.assign(city_list, obj);
      })
      // this.setData({
      //   areaList: {
      //     province_list: this.data.province_list,
      //     city_list: city_list,
      //     county_list: []
      //   }
      // })
    })
    .catch(err => {
      
    })
  },
  setDefault(event) {
    let isDefault = 0
    if(event.detail) {
      isDefault = 1
    } else {
      isDefault = 0
    }
    this.setData({
      checked: event.detail,
      isDefault: isDefault
    })
  }
})