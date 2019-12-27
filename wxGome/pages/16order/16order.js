var app = getApp();
var goHeader = app.goHeader;
var scn;
Page({
  data: {
    height:0,
    datatype:1, // 1全部订单/ 2待付款订单/ 3待收货订单
    isInit:true,//初始化进入页面，没有数据加载
    tips:true, //是否显示提示语
    isMore: true, //默认有更多数据
    pageSize:5, //每页显示的个数
    currentList:[], //当前是属于 全部订单/待付款订单/待收货订单
    allOrders:[], //全部订单
    pendingPaymentOrders:[], //待付款订单
    ordersToBereceived:[], //待收货订单
    allOrdersCurrentPage:1, //全部订单当前分页数
    pendingPayCurrentPage:1, //待付款订单当前分页数
    toBereceivedCurrentPage:1 //待收货订单当前分页数
  },
  onLoad:function(options){
    var _this=this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          height: res.windowHeight + 'px'
        })
       
      },
    })
    //设置待付款、待收货的订单数量
    if (options&&options.type){
        _this.setData({
          datatype: options.type
        });
    }

    scn = app.getScn();
    if(!scn) {return false;}
    
  },
  onShow:function(){
     var _this=this;
      wx.showLoading({
        title: '加载中...',
      });
     //页面重新加载的时候，分页数重置为1
      _this.setData({
        allOrdersCurrentPage:1, //全部订单当前分页数
        pendingPayCurrentPage:1, //待付款订单当前分页数
        toBereceivedCurrentPage:1 //待收货订单当前分页数
      })
    
      //默认获取不同状态下订单列表信息
      _this.getOrderList({
        data:{
          scn:scn,
          pageSize:_this.data.pageSize,
          orderStatus:_this.data.datatype
        },
        successCallback:function(orderlist){
          if(!orderlist){
              orderlist=[];
          }
          _this.setData({
            currentList:orderlist
          });

          //初始化显示列表情况
          if(_this.data.datatype==1){ //全部订单
               _this.setData({
                allOrders: orderlist
              });  
          }else if(_this.data.datatype==2){ //待付款
               _this.setData({
                pendingPaymentOrders: orderlist
              });
          }else{  //待收货
              _this.setData({
                ordersToBereceived: orderlist,
             }); 
          }
        }
      });
  },
  /**
  *
  * @description 点击tap切换,会判断第一次切换还是后期多次切换,第一次加载走请求,第二次走对应数组存储过的数据<br />
  * @method couponTapEven
  * @param {object} event 点击对象上的事件对象
  * @since 2018-08-22
  * @author 谢俊梅
  */
  orderTapEven:function(event){
    var _this=this;
    if(this.data.datatype === event.target.dataset.type){
      return false;
    } else {
      //切换时还未加载过数据
      _this.setData({
        isInit: true,
        isMore: true
      });
      wx.showLoading({
        title: '加载中...',
      });
      //先清空当前列表，数据重新渲染显示
      _this.setData({
        currentList:[],
        datatype: event.target.dataset.type
      });
      //初始化显示列表情况，初始化发请求
      if(!_this.data.allOrders.length&&event.target.dataset.type==1 || !_this.data.pendingPaymentOrders.length&&event.target.dataset.type==2||!_this.data.ordersToBereceived.length&&event.target.dataset.type==3){
        _this.queryAjax(event);

      }else{
          //后期多次切换走这里
         if(event.target.dataset.type==1){
            _this.setData({
              currentList:_this.data.allOrders
            });
         }else if(event.target.dataset.type==2){
          
            _this.setData({
              currentList:_this.data.pendingPaymentOrders
            });
          }else{
           
            _this.setData({
              currentList:_this.data.ordersToBereceived
            });
          }
          //隐藏加载中
          wx.hideLoading();
      }

    } 
  },
  /**
   *
   * @description 获取不同状态下16渠道订单列表信息<br />
   * @method getOrderList
   * @param {object} object 函数调用的传参
   * @param {object} object.data 请求接口需传过去的数据
       * @param {string} object.data.pageSize 表示一页显示多少条数据
       * @param {string} object.data.scn  表示用户唯一标识
       * @param {string} object.data.currentPage 表示当前页数
       * @param {string} object.data.orderStatus 表示当前传入的状态 1全部订单/ 2待支付/ 3待收货
   * @param {function} object.successCallback 表示成功后的回调函数
   * @param {function} object.failCallback 表示失败后的回调函数
   * @since 2018-08-22
   * @author 谢俊梅
  */
  getOrderList: function (object) {
    var _this = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/query',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: object.data,
      method: 'POST',
      success: function (data) {
        if (data.data.code == 200) {
          var orderlist = data.data.result.orderViewResult.orderlist;
          var orderButtonsList = data.data.result.orderButtons || [];

          if (orderlist) {
            for (var i = 0; i < orderlist.length; i++) {
              //添加订单实付金额字段
              if (orderlist[i].payAmount) {
                orderlist[i].payAmount_before = orderlist[i].payAmount.split(".")[0];
                orderlist[i].payAmount_after = orderlist[i].payAmount.split(".")[1];
              }

              if (orderlist[i] && orderlist[i].shipViewResults && orderlist[i].shipViewResults.length > 0) {

                for (var j = 0; j < orderlist[i].shipViewResults.length; j++) {
                  var num = 0,
                    shipViewResult = orderlist[i].shipViewResults[j];
                  //添加配送单实付金额字段
                  if (shipViewResult.shipPayAmount) {
                    var shipPayAmountList = shipViewResult.shipPayAmount.split(".");
                    shipViewResult.shipPayAmount_before = shipPayAmountList[0] || '0';
                    shipViewResult.shipPayAmount_after = shipPayAmountList[1] || '00';
                  }

                  for (var z = 0; z < shipViewResult.itemList.length; z++) {
                    num += Number(shipViewResult.itemList[z].quantity);
                  }
                  //配送单总商品数量
                  shipViewResult.totalQuantity = num;
                  //配送单级别确认收货按钮默认不显示
                  shipViewResult.isConfirmReceipt = 'N';
                  //配送单级别确认删除订单按钮默认不显示
                  shipViewResult.isShowDeleteButton = 'N';
                  //配送单级 查看退款
                  shipViewResult.isShowRefund = 'N';



                  //如果订单未拆单
                  if (shipViewResult.isSplit == 'N') {
                    for (var x = orderButtonsList.length-1; x >= 0; x--) {
                      if (orderlist[i].orderId == orderButtonsList[x].orderId) {
                        for (var y = orderButtonsList[x].buttonList.length-1; y >= 0; y--) {
                           if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_cfm') {
                            //配送单级别确认收货按钮
                              shipViewResult.isConfirmReceipt = 'Y';
                            }
                            if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_del') {
                              //配送单级 删除订单按钮
                              shipViewResult.isShowDeleteButton = 'Y';
                            }
                            if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_refund') {
                              //配送单级 查看退款
                              shipViewResult.isShowRefund = 'Y';
                            }
                        }

                      }
                    }

                  } else { //如果是拆单的
                    for (var x = orderButtonsList.length-1; x >= 0; x--) {
                      if (orderlist[i].orderId == orderButtonsList[x].orderId && shipViewResult.shippingGroupId == orderButtonsList[x].shippingGroupId) {
                        for (var y = orderButtonsList[x].buttonList.length-1; y >= 0; y--) {
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_cfm') {
                            //配送单级别确认收货按钮
                            shipViewResult.isConfirmReceipt = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_del') {
                            //配送单级 删除订单按钮
                            shipViewResult.isShowDeleteButton = 'Y';
                          }
                          if (orderButtonsList[x].buttonList[y].buttonCode == 'btn_refund') {
                            //配送单级 查看退款
                            shipViewResult.isShowRefund = 'Y';
                          }
                        }

                      }
                    }

                  }
                }
              }


            }
          }

         
          //隐藏加载中
          wx.hideLoading();
          object.successCallback && object.successCallback(orderlist);
        } else {
          //隐藏加载中
          wx.hideLoading();
          object.failCallback && object.failCallback();
        }
        //已经加载过数据
        _this.setData({
          isInit: false
        });
        
      }, fail: function () {
        //隐藏加载中
        wx.hideLoading();
        object.failCallback && object.failCallback();
        //已经加载过数据
        _this.setData({
          isInit: false
        });
        
      }
    });
  },
  /**
  *
  * @description 全部订单、待支付、待收货3个选项切换过程中，每个第一次切换时加载发请求<br />
  * @method queryAjax
  * @param {object} event 点击对象上的事件对象
  * @since 2018-08-22
  * @author 谢俊梅
  */
  queryAjax:function(event){
    var _this=this;

      //获取不同状态下订单列表信息
      _this.getOrderList({
        data:{
          scn:scn,
          pageSize:_this.data.pageSize,
          orderStatus:event.target.dataset.type
        },
        successCallback:function(orderlist){
          if(!orderlist){
            orderlist=[];
          }   
           if(event.target.dataset.type==1){
            _this.setData({
              allOrders: orderlist,
              currentList:orderlist
            });  
           }else if(event.target.dataset.type==2){
            _this.setData({
              pendingPaymentOrders: orderlist,
              currentList:orderlist
            });  
           }else{
             _this.setData({
              ordersToBereceived: orderlist,
              currentList:orderlist
            }); 
          }
        }
      });   
  },
  /**
  *
  * @description 滑动到底部，加载更多，根据每个类型 分别计算对应的分页数、对新增的数据加入到对应的数组中<br />
  * @method lower
  * @since 2018-08-22
  * @author 谢俊梅
  */
  lower:function() {
    var _this=this;
    wx.showLoading({
      title: '加载中...',
    });
    //在全部订单下，处理上滑操作
    if(_this.data.datatype==1){
      //默认加载更多，当前分页+1
      _this.setData({
        allOrdersCurrentPage:_this.data.allOrdersCurrentPage+1
      })
       //获取不同状态下订单列表信息
       _this.getOrderList({
          data:{
            scn:scn,
            orderStatus:_this.data.datatype,
            pageSize:_this.data.pageSize,
            currentPage:this.data.allOrdersCurrentPage
          },
          successCallback:function(orderlist){
            //如果没有任何数据的时候
              if(!orderlist){
                orderlist=[];
                //没有更多数据时，页数不增加，下次继续访问当分页数据
                _this.setData({
                  isMore:false,
                  allOrdersCurrentPage:_this.data.allOrdersCurrentPage-1
                });
              }
              //新请求得到的数据，加到对应数组里
              _this.setData({ 
                currentList: _this.data.allOrders.concat(orderlist), 
                allOrders:_this.data.allOrders.concat(orderlist)
              }); 
          },failCallback:function(){
              _this.setData({
                  allOrdersCurrentPage:_this.data.allOrdersCurrentPage-1
              });
          }
        });  
    
    }else if(_this.data.datatype==2){ //在待支付订单下，处理上滑操作   
        //默认加载更多，当前分页+1
        _this.setData({
          pendingPayCurrentPage:_this.data.pendingPayCurrentPage+1
        })
        //获取不同状态下订单列表信息
        _this.getOrderList({
          data:{
            scn:scn,
            pageSize:_this.data.pageSize,
            orderStatus:_this.data.datatype,
            currentPage:_this.data.pendingPayCurrentPage
          },
          successCallback:function(orderlist){
            //如果没有任何数据的时候
              if(!orderlist){
                orderlist=[];
                //没有更多数据时，页数不增加，下次继续访问当分页数据
                _this.setData({
                    isMore:false,
                    pendingPayCurrentPage:_this.data.pendingPayCurrentPage-1
                  });
              }
              
               //新请求得到的数据，加到对应数组里
               _this.setData({
                 currentList: _this.data.pendingPaymentOrders.concat(orderlist),
                 pendingPaymentOrders:_this.data.pendingPaymentOrders.concat(orderlist)
              }); 
          },failCallback:function(){
              _this.setData({
                allOrdersCurrentPage:_this.data.pendingPaymentOrders-1
              });
          }
        });
    
    }else{ //在待收货订单下，处理上滑操作 
       //默认加载更多，当前分页+1
      _this.setData({
          toBereceivedCurrentPage:_this.data.toBereceivedCurrentPage+1
        })
      //获取不同状态下订单列表信息
      _this.getOrderList({
          data:{
            scn:scn,
            pageSize:_this.data.pageSize,
            orderStatus:_this.data.datatype,
            currentPage:_this.data.toBereceivedCurrentPage
          },
          successCallback:function(orderlist){
            //如果没有任何数据的时候
            if(!orderlist){
              orderlist=[];
                //没有更多数据时，页数不增加，下次继续访问当分页数据
              _this.setData({
                isMore:false,
                toBereceivedCurrentPage:_this.data.toBereceivedCurrentPage-1
              });
            }
            
            //新请求得到的数据，加到对应数组里
             _this.setData({ 
              currentList: _this.data.ordersToBereceived.concat(orderlist),
              ordersToBereceived:_this.data.ordersToBereceived.concat(orderlist)
            }); 
          },failCallback:function(){
              _this.setData({
                allOrdersCurrentPage:_this.data.toBereceivedCurrentPage-1
              });
          }
        });
    }
  },
  closeEven:function(){
    //关闭
    this.setData({
      tips:false
    });
  },
  /**
   *
   * @description 删除订单ajax
   * @method deleteOrderAjax
   * @param {object} object 函数调用的传参
   * @param {object} object.data 请求接口需传过去的数据
       * @param {string} object.data.scn  表示用户唯一标识
       * @param {string} object.data.orderId 订单号
       * @param {string} object.data.shippingGroupId 配送单号
       * @param {string} object.data.deleteType  2 //删除到订单回收站
   * @param {function} object.successCallback 表示成功后的回调函数
   * @param {function} object.failCallback 表示失败后的回调函数
   * @since 2018-08-22
   * @author 谢俊梅
  */
  deleteOrderAjax:function(object){
    wx.request({
      url: app.ourHost + '/sixteen/order/delete',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: object.data,
      method: 'POST',
      success: function (data) {
        if (data.data.code == 200 && data.data.result.deleteStatus) {
          object.successCallback && object.successCallback(data.data);
        } else {
          object.failCallback && object.failCallback(data.data);
        }
      }, fail: function () {
        object.failCallback && object.failCallback(data.data);
      }
    });
  },
  /**
   *
   * @description 过滤数据处理，用来控制前台展示效果 (删除操作、确认收货操作)<br />
   * @method filterData
   * @param {object} object 函数调用的传参
   * @param {object} object.operationType 操作类型  1 删除操作 2确认收货操作
   * @param {string} object.currentOrderId 订单号
   * @param {string} object.currentShippingGroupId  配送单号
   * @since 2018-08-22
   * @author 谢俊梅
   */
  filterData:function(object){
    var newArray = [];
    for (var i = 0; i < object.list.length; i++) {
      var order = object.list[i];
      if (object.currentShippingGroupId){ //拆单的
        for (var j = 0; j < order.shipViewResults.length; j++) {
          if (order.shipViewResults[j].shippingGroupId == object.currentShippingGroupId) {
            if (object.operationType ==1){ //删除操作

              order.shipViewResults.splice(j, 1);

            }else if (object.operationType == 2){  //确认收货操作

              //不显示确认收货按钮
              order.shipViewResults[j].isConfirmReceipt='N';
            }
          }
        }

        newArray.push(order);
      }else{ //未拆单的
        if (order.orderId == object.currentOrderId) {
          if (object.operationType == 1) { //删除操作

            object.list.splice(i, 1);
            newArray = object.list;

          }else if (object.operationType == 2) {  //确认收货操作

            for (var j = 0; j < order.shipViewResults.length; j++) {
              //不显示确认收货按钮
              order.shipViewResults[j].isConfirmReceipt = 'N';
            }
            newArray.push(order);
          }
          
        }
      }
    }
    return newArray;
  },
  //删除订单操作
  deleteOrder:function(event){
    var _this = this;
    //当前订单号
    var currentOrderId = event.currentTarget.dataset.orderid;
    //当前配送单号
    var currentShippingGroupId = event.currentTarget.dataset.shippinggroupid;

    wx.showModal({
      title: '您确认要删除订单吗？',
      content: '删除的订单可在APP订单回收站中查看或恢复',
      success: function (res) {
        if (res.confirm) {
          //发起删除按钮请求
          _this.deleteOrderAjax({
            data:{
              scn: scn,
              orderId: currentOrderId,
              shippingGroupId:currentShippingGroupId,
              deleteType: 2 //删除到订单回收站
            },
            successCallback:function(){
           
              if (_this.data.datatype == 1) {
                //过滤当前的数据
                var filter = _this.filterData({
                  operationType:1,
                  list: _this.data.allOrders,
                  currentOrderId:currentOrderId,
                  currentShippingGroupId: currentShippingGroupId
                });
                
                _this.setData({
                  allOrders: filter,
                  currentList: filter
                });

              } else if (_this.data.datatype == 2) {
                //过滤当前的数据
                var filter = _this.filterData({
                  operationType: 1,
                  list: _this.data.pendingPaymentOrders,
                  currentOrderId: currentOrderId,
                  currentShippingGroupId: currentShippingGroupId
                });

                // var filter = _this.data.pendingPaymentOrders.filter((order) => { return order.orderId != currentOrderId });
                _this.setData({
                  pendingPaymentOrders: filter,
                  currentList: filter
                });
              } else {
                //过滤当前的数据
                var filter = _this.filterData({
                  operationType: 1,
                  list: _this.data.ordersToBereceived,
                  currentOrderId: currentOrderId,
                  currentShippingGroupId: currentShippingGroupId
                });
                // var filter = _this.data.ordersToBereceived.filter((order) => { return order.orderId != currentOrderId });
                _this.setData({
                    ordersToBereceived: filter,
                    currentList: filter
                }); 
              }
              wx.showToast({
                title: '已成功删除',
                icon: 'success',
                duration: 2000
              });
            },
            failCallback:function(data){
              wx.showToast({
                title: data.message || "对不起！系统繁忙，请稍后重试！",
                icon:'none',
                duration: 2000
              });
            }
          });

        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    })
  },
  /**
   *
   * @description 确认收货ajax
   * @method handleConfirmAjax
   * @param {object} object 函数调用的传参
   * @param {object} object.data 请求接口需传过去的数据
       * @param {string} object.data.scn  表示用户唯一标识
       * @param {string} object.data.orderId 订单号
       * @param {string} object.data.shippingGroupId 配送单号
   * @param {function} object.successCallback 表示成功后的回调函数
   * @param {function} object.failCallback 表示失败后的回调函数
   * @since 2018-08-22
   * @author 谢俊梅
  */
  handleConfirmAjax:function(object){
    wx.request({
      url: app.ourHost + '/sixteen/order/handleConfirm',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: object.data,
      method: 'POST',
      success: function (data) {
        if (data.data.code == 200 && data.data.result.pOrderConfirm) {
          object.successCallback && object.successCallback(data.data);
        } else {
          object.failCallback && object.failCallback(data.data);
        }
      }, fail: function () {
        object.failCallback && object.failCallback(data.data);
      }
    });
  },
  //确认收货操作
  handleConfirm:function(event){
    var _this = this;
    //当前订单号
    var currentOrderId = event.currentTarget.dataset.orderid;
    //当前配送单号
    var currentShippingGroupId = event.currentTarget.dataset.shippinggroupid;
    wx.showModal({
      title: '提示',
      content: '您确定要确认收货吗？',
      success: function (res) {
        if (res.confirm) {
          //发起确认收货请求
          _this.handleConfirmAjax({
            data: {
              scn: scn,
              orderId: currentOrderId,
              shippingGroupId: currentShippingGroupId
            },
            successCallback: function () {

              if (_this.data.datatype == 1) {
                //过滤当前的数据
                var filter = _this.filterData({
                  operationType: 2,
                  list: _this.data.allOrders,
                  currentOrderId: currentOrderId,
                  currentShippingGroupId: currentShippingGroupId
                });

                _this.setData({
                  allOrders: filter,
                  currentList: filter
                });

              } else if (_this.data.datatype == 2) {
                //过滤当前的数据
                var filter = _this.filterData({
                  operationType: 2,
                  list: _this.data.pendingPaymentOrders,
                  currentOrderId: currentOrderId,
                  currentShippingGroupId: currentShippingGroupId
                });

                _this.setData({
                  pendingPaymentOrders: filter,
                  currentList: filter
                });
              } else {
                //过滤当前的数据
                var filter = _this.filterData({
                  operationType: 2,
                  list: _this.data.ordersToBereceived,
                  currentOrderId: currentOrderId,
                  currentShippingGroupId: currentShippingGroupId
                });

                _this.setData({
                  ordersToBereceived: filter,
                  currentList: filter
                });
              }
              wx.showToast({
                title: '已确认收货',
                icon: 'success',
                duration: 2000
              });
            },
            failCallback: function (data) {
              wx.showToast({
                title: data.message || "对不起！系统繁忙，请稍后重试！",
                icon: 'none',
                duration: 2000
              });
            }
          });

        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    });
  }
})