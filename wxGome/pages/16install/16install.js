// pages/orderTracking/orderTracking.js
var app = getApp();
var goHeader = app.goHeader;
var scn;
Page({
  data: {
    protocol: app.protocol,
    imgUrl:"", //商品图片地址
    number:0, //商品件数
    orderId:"", //订单ID
    shippingGroupId:"", //从订单列表页传过来的配送单ID，用来发请求
    isAppraise: "",//是否人员可评价,默认不可评价  DONE("已经评价过"),NOTDONE("没有评价过"),NoExist("数据不存在"),Exception("异常")
    courierImg: "",//安装人员图片
    price:"",//安装单的价格
    orderInstallHistory: {}, //安装历史信息集合,
    orderHistoryModelsList:[] //安装履历消息
  },
  onLoad:function(options){
    var _this=this;

    scn = app.getScn();

    _this.setData({
      orderId:options.orderId,
      shippingGroupId:options.shippingGroupId,
      number:options.number,
      imgUrl:options.imgUrl,
      price:options.price //安装单价格
    });
  },
  onShow:function(){
    var _this = this;
    //获取安装历时信息
    _this.getInstallHistory();
  },
  /**
    *
     * @description  获取安装历时信息
     * @method getInstallHistory
     * @since 2018-08-22
     * @author 谢俊梅
  */
  //获取安装历时信息
  getInstallHistory: function () {
    var _this = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/installHistory',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: {
        scn: scn,
        orderId: _this.data.orderId,
        shippingGroupId: _this.data.shippingGroupId
      },
      method: 'POST',
      success: function (data) {
        if (data.statusCode == 200) {
          _this.setData({
            orderInstallHistory: data.data.result.orderInstallHistory,
            orderHistoryModelsList: data.data.result.orderInstallHistory.orderHistoryModels.reverse(),
            isAppraise: data.data.result.isAppraise,
            courierImg: app.protocol+data.data.result.courierImg
          });
        }
      }
    });
  },
  copy: function (event){
    wx.setClipboardData({
      data: event.target.dataset.msg,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        });
      }
    });
  },
  callphone:function(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  installEvaluate: function () { //安装评价的访问路径  userType　配送:1 安装:2  导购员:3
    var _this = this;
    wx.navigateTo({
      url: '/pages/16impression/16impression?userType=2&courierNo=' + _this.data.orderInstallHistory.installStaffCode + '&orderId=' + _this.data.orderId + '&deliverId=' + _this.data.shippingGroupId + '&installId=' + _this.data.orderInstallHistory.installNumber + '&price=' + _this.data.price + '&isAppraise=' + _this.data.isAppraise
    })
  }
})