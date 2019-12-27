// pages/orderdetails/orderdetails.js
var app = getApp();
var goHeader = app.goHeader;
Page({
    data: {
        datatype:1, //选择配送中
        isHaveUnExProduct: 'Y', //Y:有待出库发货商品 N:无待出库发货商品 为Y时无线端显示待发货tab
        shippingGroupId: '',  //配送单号，默认没有拆单的为null
        orderId: '', //订单编号
        shipPackagList:[] //配送当前信息列表
       
    },
    /* 页面加载时只传过来参数*/
    onLoad: function(options) {
        var _this = this;

        //当前页面的订单号、配送单号、是否展示包裹信息
        if (options) {
          _this.setData({
            orderId: options.orderId,
            shippingGroupId: options.shippingGroupId,
            scn: app.getScn()
          });
        }
        if(!_this.data.scn){
          return false;
        }
        _this.init();
    },
    init: function() {
        var _this = this;
        //获取配送包裹信息
        _this.ShipPackagListForApp();
    },
  /**
   *
   * @description  tab切换
   * @method packageTapEven
   * @since 2018-04-03
   * @author 谢俊梅
   */
    packageTapEven:function(event){
      var _this = this;
      if (_this.data.datatype === event.target.dataset.type) {
        return false;
      } else {
        //先清空当前列表，数据重新渲染显示
        _this.setData({
          datatype: event.target.dataset.type,
          shipPackagList:[]
        });
        //初始化显示列表情况，初始化发请求
        if (event.target.dataset.type ==2) {
          //待发货列表
          _this.getUnexShipPackage();
        } else if (event.target.dataset.type == 1){
          //配送列表
          _this.ShipPackagListForApp();
        }
      } 
    },
  /**
   *
   * @description  获取配送包裹信息
   * @method ShipPackagListForApp
   * @since 2018-03-30
   * @author 谢俊梅
   */
    ShipPackagListForApp:function(){
      var _this = this;
      var reqData = {
        orderId: _this.data.orderId,
        shippingGroupId: _this.data.shippingGroupId,
        scn: _this.data.scn,
        currentPage:1,
        pageSize:20
      }

      wx.request({
        url: app.ourHost + '/order/ShipPackagListForApp',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': goHeader
        },
        data: reqData,
        method: 'POST',
        success: function (data) {
          if (data.data.success) {
            
            var shipPackageResult = data.data.result.shipPackageResult,
                shipPackageList = shipPackageResult.shipPackagList;

            //计算包裹数量
            _this.computedPackageNumber(shipPackageList);

            _this.setData({
              shipPackagList: shipPackageList,
              isHaveUnExProduct: shipPackageResult.isHaveUnExProduct
           
            });
          
          }
        }
      });
    },
    /**
     *
     * @description  获取未出库包裹商品列表
     * @method getUnexShipPackage
     * @since 2018-04-03
     * @author 谢俊梅
     */
    getUnexShipPackage: function() {
        var _this = this;
        //发送详情页接口前，整理需传过去的参数
        var reqData = {
            scn: _this.data.scn,
            orderId: _this.data.orderId,
            shippingGroupId: _this.data.shippingGroupId
        };
       
        wx.request({
          url: app.ourHost + '/order/UnExShipPackage',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            data: reqData,
            method: 'POST',
            success: function(data) {
              if (data.data.success) {
                var shipPackageResult = data.data.result.shipPackage,
                  shipPackageList = [shipPackageResult];

                //计算包裹数量
                _this.computedPackageNumber(shipPackageList);

                _this.setData({
                  shipPackagList: shipPackageList,
                });

              }
            }
        });
    },
    computedPackageNumber: function (shipPackageList){
      for (let i = 0; i < shipPackageList.length; i++) {
        let shipPackage = shipPackageList[i],
          num = 0; //商品总数量
        if (shipPackage.packageProductList.length) {
          for (let j = 0; j < shipPackage.packageProductList.length; j++) {
            num += Number(shipPackage.packageProductList[j].productQuantity);
          }
        }
        shipPackage.packageNumber = num;
      }
      return shipPackageList;
    }
})