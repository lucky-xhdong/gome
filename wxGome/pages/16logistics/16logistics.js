// pages/orderTracking/orderTracking.js
var app = getApp();
var goHeader = app.goHeader;
var scn;
Page({
  data: {
    protocol: app.protocol,
    imgUrl: "", //商品图片地址
    number: 0, //商品件数
    orderId: "", //订单ID
    shippingGroupId: "", //从订单列表页传过来的配送单ID，用来发请求
    isAppraise: "", //是否人员可评价,默认不可评价  DONE("已经评价过"),NOTDONE("没有评价过"),NoExist("数据不存在"),Exception("异常")
    courierImg: "", //物流人员图片
    price: '', //物流配送单价格
    sgId: '', //pc端右侧的配送单信息
    shipDeliveryInfo: {}, //订单配送信息
    orderHistories: [] //订单跟踪信息
  },
  onLoad: function(options) {
    var _this = this;
    scn = app.getScn();
    _this.setData({
      orderId: options.orderId,
      shippingGroupId: options.shippingGroupId,
      number: options.number,
      imgUrl: options.imgUrl,
      sgId: options.shippingGroupId,
      price: options.price //物流配送单价格
    });
  },
  onShow: function() {
    var _this = this;
    //获取物流信息
    _this.getLogisticsdetails();
  },
  /**
   *
   * @description  获取物流信息
   * @method getLogisticsdetails
   * @since 2018-08-23
   * @author 谢俊梅
   */
  getLogisticsdetails: function() {
    var _this = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/logisticsdetails',
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
      success: function(data) {
        if (data.data.code == 200) {
          _this.setData({
            shipDeliveryInfo: data.data.shipDelivery.shipDeliveryInfo[0],
            orderHistories: data.data.shipTrack.orderHistories.reverse(),
            isAppraise: data.data.isAppraise,
            courierImg: app.protocol + data.data.courierImg
          });
        }
      }
    });
  },
  copy: function(event) {
    wx.setClipboardData({
      data: event.target.dataset.msg,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        });
      }
    });
  },
  callphone: function(event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  logisticsEvaluate: function() { //安装评价的访问路径  userType　配送:1 安装:2  导购员:3
    var _this = this;
    wx.navigateTo({
      url: '/pages/16impression/16impression?userType=1&courierNo=' + _this.data.shipDeliveryInfo.deliveryStaffCode + '&orderId=' + _this.data.orderId + '&deliverId=' + _this.data.shippingGroupId + '&price=' + _this.data.price + '&isAppraise=' + _this.data.isAppraise
    });
  }
})