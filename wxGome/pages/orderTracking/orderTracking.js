// pages/orderTracking/orderTracking.js
var app = getApp();
var goHeader = app.goHeader;
Page({
  data: {
    imgUrl:"", //商品图片地址
    number:0, //商品件数
    orderId:"", //订单ID
    shippingGroupId:"", //从订单列表页传过来的配送单ID，用来发请求
    sgId:'', //pc端右侧的配送单信息
    packageId:'',//包裹ID，用来查看包裹详情
    shipDeliveryInfo:{}, //订单配送信息
    orderHistoriesList:[] //订单跟踪信息
  },
  onLoad:function(options){
    var _this=this;

    _this.setData({
      orderId:options.orderId,
      shippingGroupId:options.shippingGroupId,
      number:options.number,
      imgUrl:options.imgUrl,
      sgId:options.sgId,
      packageId: options.packageId
    });
   
    if (_this.data.packageId == "null" || _this.data.packageId  == "" || _this.data.packageId == null){ //如果没有包裹ID 走订单跟踪接口，否则走 包裹详情接口
      //获取配送信息
      _this.getDistributionInfor();
      //订单跟踪信息
      _this.getOrderTracking();
    }else{
      //获取包裹详情
      _this.getPackaheInfo();
    }
  },
  //获取包裹详情
  getPackaheInfo: function () {
    var _this = this;
    wx.request({
      url: app.ourHost + '/order/ShipPackage',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: {
        scn: app.getScn(),
        orderId: _this.data.orderId,
        shippingGroupId: _this.data.shippingGroupId,
        packageId: _this.data.packageId
      },
      method: 'POST',
      success: function (data) {
        if (data.statusCode == 200) {
          let shipPackage = data.data.result.shipPackage;
          _this.setData({
            shipDeliveryInfo: [shipPackage.shippingGroupInforModel],
            orderHistoriesList: shipPackage.orderHistories.reverse()
          });
        }
      }
    });
  },
  //获取配送信息
  getDistributionInfor:function(){
      var _this=this;
       wx.request({
          url: app.ourHost+'/delivery/query',
          header: {
              'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
              'gome-header': goHeader
          },
          data:{
            scn:app.getScn(),
            orderId:_this.data.orderId,
            shippingGroupId:_this.data.shippingGroupId
          },
          method:'POST',
          success:function(data){
            if(data.statusCode==200){
                 _this.setData({
                    shipDeliveryInfo:data.data.result.shipDeliveryInfo
                });
            }
          }
      });
  },
  /**
   *
     * @description  获取订单跟踪信息
     * @method getOrderTracking
     * @since 2017-02-17
     * @author 谢俊梅
  */
  getOrderTracking:function(){
    var _this=this;
     wx.request({
        url: app.ourHost+'/order/history',
        header: {
            'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
            'gome-header': goHeader
        },
        data:{
          scn:app.getScn(),
          orderId:_this.data.orderId,
          shippingGroupId:_this.data.shippingGroupId
        },
        method:'POST',
        success:function(data){
          if(data.statusCode==200){
               _this.setData({
                 orderHistoriesList:data.data.result.orderHistories.reverse()
              });

          }
        }
    });
  }/*,
  callphone:function(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  }*/
})