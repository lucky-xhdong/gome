// 引入SDK核心类
var QQMapWX = require('../../lib/map/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app = getApp();
var goHeader = app.goHeader;
var scn;

Page({
  data: {
    showFixed:false,//默认不展示弹层
    fixedTitle:'',//弹层title
    fixedTicketId:'',//弹层券编号
    fixedImage:'',//弹层图片地址
    fixedCanUse:'',//弹层是否可使用
    ticketList:[],//我的门票列表
    nearTicketList:[], //附近门店列表
    ajaxNoNearTicket:false //默认没有请求附近门店门票信息
  },
  onLoad:function(options){
    var _this=this;
    qqmapsdk = new QQMapWX({
      key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3'//此处使用你自己申请的key
    });

  },
  onShow:function(){
    var _this = this;
     scn = app.getScn();
      wx.showLoading({
        title: '加载中...',
      });
    //隐藏加载中
    wx.hideLoading();
    //获取门票列表
    _this.ajaxTicket(function(data){
      _this.setData({
         ticketList: data || []
       });
    
      //如果没有领取的门票，需要查询附近的门票
      if(_this.data.ticketList.length==0){
        var lat= wx.getStorageSync("latCookies");
        var lng = wx.getStorageSync("lngCookies");
        
        if (lat && lng){ //如果在附近门店页面授权过位置，则可以得到经纬度
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: lat,
              longitude: lng
            },
            success: function (res) {
              var city = res.result.address_component.city;
              var district = res.result.address_component.district;
              //附近门店门票活动
              _this.ajaxNearTicket(city, district, lat, lng);
            },
            fail: function (res) {
              //默认北京市朝阳区附近门店门票活动
              _this.ajaxNearTicket('北京市', '朝阳区');
            }
          });
        }else{
          //默认北京市朝阳区附近门店门票活动
          _this.ajaxNearTicket('北京市', '朝阳区');
        }
        
      }
    });

  },
  showDetail: function (event){
    var _this = this,
      dataSet = event.currentTarget.dataset;

    _this.setData({
      showFixed: true,
      fixedTitle: dataSet.title,//弹层title
      fixedTicketId: dataSet.ticketcode,//弹层券编号
      fixedImage: dataSet.image,//弹层图片地址
      fixedStatus: dataSet.status,//弹层是否可使用 1 未使用 4 已使用
    });
    //获取二维码
    _this.ajaxQrcode();
  },
  //请求我的门票
  ajaxTicket:function(completeCallback){
    var _this = this;
    wx.request({
      url: app.ourHost+"/ticket/queryReceiveList",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data:{
        scn: scn
      },
      method: 'POST',
      success: function (data) {
         completeCallback && completeCallback(data.data.data);
      }, fail: function () {
        //隐藏加载中
        wx.hideLoading();
      }
    });
  },
  //获取二维码数据流base64数据格式
  ajaxQrcode(){
    var _this = this;
    wx.request({
      // url: app.ourHost + "/ticket/getQRcode",
      url: app.ourHost + "/ticket/getQRcodeStream",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: {
        scn: scn,
        code: _this.data.fixedTicketId
      },
      method: 'POST',
      success: function (data) {
        if (data.data.errCode == 'success') {
          var base64 = encodeURI(data.data.data);
         _this.setData({
           fixedQrImg: 'data:image/png;base64,' + base64
         });
        }
      }, fail: function () {
      }
    });
  },
  //获取附近门票信息
  ajaxNearTicket: function (city, district, lat, lng) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: app.ourHost+"/ticket/nearList",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: {
        cityName: city,
        threeName: district,
        latitude: lat||'', //有经纬度是当前定位，没有经纬度后端走 北京市朝阳区朝外大街的经纬度
        longitude: lng||''
      },
      method: 'POST',
      success: function (data) {
          //隐藏加载中
          wx.hideLoading();
          if(data.data.data){ //获得数据        
            _this.setData({
              nearTicketList: data.data.data
            });
          }else{
            _this.setData({
              ajaxNoNearTicket: true //没有获得数据
            });
          }
      }, fail: function () {
        //隐藏加载中
        wx.hideLoading();
        _this.setData({
          ajaxNoNearTicket: true //没有获得数据
        });
      }
    });
  },
  closeFixed:function(){
    var _this = this;

    _this.setData({
      showFixed: false,
      fixedTitle: '',
      fixedTicketId: '',
      fixedImage: '',
      fixedStatus: '',
      fixedQrImg:''
    });
    
  },
  goIndex:function(){
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})