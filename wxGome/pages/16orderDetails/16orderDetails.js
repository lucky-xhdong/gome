/*
 * 16渠道订单详情
 * @since 2018-08-23
 * @author Lilian
 * @产品  周涛
 */
let app = getApp();
let scn;
Page({
  data: {
    protocol: app.protocol,
    height: 0,
    show: true,
    showDesc: '加载失败，请稍后再试',
    orderId: '', //订单编号
    shippingGroupId: '', //配送单号
    order: {}, //订单信息
    guiderList: {}, //导购员
    installInfo: {}, //安装人员
    appraiseUsers: {}, //快递员信息
    orderHistory: {}, //订单历史信息
    gomeStore: {}, //门店信息
    orderInvoice: {}, //发票信息
    storeCode: '', //门店Id
    num: 1, //商品总数
    skuIds: {}, //skuId集合
    loading: false,
    selfPickUpCode: '', //门店自提code码
    appriseBtn: false, //评价按钮
    serverTime: '', //时
  },
  onLoad: function(options) {
    let that = this;
    let height = wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
      },
    })
    if (options.num) {
      that.setData({
        num: options.num,
      })
    }
    if (options.orderId) {
      that.setData({
        orderId: options.orderId,
      })
    }
    if (options.shippingGroupId) {
      if (options.shippingGroupId != null) {
        that.setData({
          shippingGroupId: options.shippingGroupId
        })
      }

    }


  },
  onShow: function() {
    let that = this;
    scn = app.getScn();
    // scn = 'Pc0jlCMLaagFJcWsXRuO%2FtL7HsKQCQP9HjTV3svtxH8h4asjfmWsS1Ln%2Fhvi8an1t68wZvwEsmvJt%2Bregv7qqP3YUXnfhKbJmP0UsAunqbSU1lFueZbF%2FBoRrGRY4lGf03d09453de85ca2ffcfdc664755082db';
    // that.setData({
    //   num: 1,
    //   orderId: '19014842914',
    //   shippingGroupId: '2570057912',
    // })

    wx.showLoading({
      title: '加载中...',

    })
    that.init();
  },
  // 初始化事件
  init: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/details',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        orderId: that.data.orderId,
        shippingGroupId: that.data.shippingGroupId
      },
      method: 'POST',
      success: function(res) {
        setTimeout(function() {
          wx.hideLoading();
          that.setData({
            loading: true
          })
        }, 10);
        if (res.data.code == 200) {
          let groups = res.data.orderInfo.empShippingGroups;
          if (groups.length > 0) {
            that.setData({
              serverTime: res.data.serverTime, //当前时间戳
              order: res.data.orderInfo,
              guiderList: res.data.gomeStoreFullDtos, //导购
              orderHistory: res.data.orderHistory, //历史配送数据
              gomeStore: res.data.gomeStoreFulls, //门店
              orderInvoice: res.data.orderInvoice, //发票
              storeCode: groups[0].empCommerceItems[0].storeCode,
              appriseBtn: false
            })
            if (res.data.appraiseUsers) {
              that.setData({
                appraiseUsers: res.data.appraiseUsers
              })
            }
            if (that.data.order.isSplit == 1) {
              that.getShopCodeId();
              that.getInstallInfo();
              that.getIsAppraise();
            }
            that.getAppriseBtn();
          } else {
            that.setData({
              show: false,
              showDesc: '查询出错，请稍后再试~'
            })

          }


        } else {
          that.setData({
            show: false,
            showDesc: res.data.message
          })

        }

      },
      fail: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 10);
        that.setData({
          loading: true,
          show: false,
          showDesc: '加载失败，请稍后再试'
        })
      }
    })
  },
  // 安装人员信息
  getInstallInfo: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/installHistory',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        orderId: that.data.orderId,
        shippingGroupId: that.data.shippingGroupId
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            installInfo: res.data.result.orderInstallHistory
          })
        }

      },
      fail: function(res) {

      }
    })
  },
  // 显示是否评论按钮
  getAppriseBtn: function() {
    let that = this;
    // 已拆单
    let spOrderIds = '',
      unSpOrderIds = '';
    if (that.data.order.isSplit == 1) {
      spOrderIds = that.data.orderId;
    } else {
      unSpOrderIds = that.data.orderId //未拆单的订单ID	
    }
    wx.request({
      url: app.ourHost + '/sixteen/order/getButtonList',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        spOrderIds: spOrderIds, //已拆单的订单ID	
        unSpOrderIds: unSpOrderIds //未拆单的订单ID	
      },
      success: function(res) {

        if (res.data.success) {
          if (res.data.result.orderButtons.length > 0) {
            for (var items of res.data.result.orderButtons) {
              if (items.shippingGroupId == that.data.shippingGroupId) {
                for (var item of items.buttonList) {
                  if (item.buttonCode == 'btn_ars') {
                    that.setData({
                      appriseBtn: true
                    })
                  }
                }
              }

            }
          }
        }

      }
    })
  },
  // 获得门店自提码
  getShopCodeId: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/querySelfPickUpCode',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        orderId: that.data.orderId,
        shippingGroupId: that.data.shippingGroupId
      },

      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            selfPickUpCode: res.data.result.selfPickUpCode
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '加载失败，请稍后再试',
          icon: 'none'
        })
      }
    })
  },
  // 查看物流
  goToEvetn: function() {
    let that = this;
    wx.navigateTo({
      url: '../16logistics/16logistics?orderId=' + that.data.orderId + '&sgId=' + that.data.shippingGroupId + '&shippingGroupId=' + that.data.shippingGroupId + '&number=' + that.data.num + '&imgUrl=' + that.data.order.empShippingGroups[0].empCommerceItems[0].img + '&price=' + that.data.order.empPayAmount.paymentAmount
    })
  },
  // 安装查询
  goInstallEvent: function() {
    let that = this;
    wx.navigateTo({
      url: '../16install/16install?orderId=' + that.data.orderId + '&sgId=' + that.data.shippingGroupId + '&shippingGroupId=' + that.data.shippingGroupId + '&number=' + that.data.num + '&imgUrl=' + that.data.order.empShippingGroups[0].empCommerceItems[0].img + '&price=' + that.data.order.empPayAmount.paymentAmount
    })
  },
  // 去评价
  appriseEvent: function() {
    let that = this;
    let skuIds = that.data.skuIds;
    let skuId = '';
    for (var item in skuIds) {
      let items = '';
      items = skuIds[item].join(',');
      skuId += items + ',';
    }
    skuId = skuId.slice(0, -1);
    console.log(skuId)
    wx.navigateTo({
      url: '../16apprise/16apprise?orderId=' + that.data.orderId + '&shippingGroupId=' + that.data.shippingGroupId + '&skuIds=' + skuId
    })
  },

  // 评价导购
  getApprisEmployee: function(e) {
    let that = this;

    let courierNo = e.target.dataset.salerid;
    let isAppraise = e.target.dataset.isappraise; //是否需要配送
    let gomeStore = that.data.gomeStore,
      storeCode = that.data.storeCode;
    let skuIds = that.data.skuIds;
    let skuId = skuIds[courierNo].join(',');


    wx.navigateTo({
      url: '../16impression/16impression?userType=3&orderId=' + that.data.orderId + '&deliverId=' + that.data.shippingGroupId + '&shippingGroupId=' + that.data.shippingGroupId + '&number=' + that.data.num + '&courierNo=' + courierNo + '&goodsPrice=' + that.data.order.empPayAmount.paymentAmount + '&skuId=' + skuId + '&storeId=' + gomeStore[storeCode].storeId + '&storeName=' + gomeStore[storeCode].storeName + '&isAppraise=' + isAppraise + '&deliverFlag=' + that.data.order.empShippingGroups[0].shippingMethod
    })

  },
  // 查看导购是否已评价
  getIsAppraise: function() {
    let that = this;

    let guiderList = that.data.order.empShippingGroups[0].empMemberAdress.salemanIds;
    let gomeStore = that.data.gomeStore,
      storeCode = that.data.storeCode;
    let empCommerceItems = that.data.order.empShippingGroups[0].empCommerceItems;
    let skuIds = new Object();
    for (var item of guiderList) {
      let skuItem = [];
      for (var items of empCommerceItems) {
        if (item == items.salesmanId) {
          skuItem.push(items.skuId);
          skuIds[item] = skuItem;
        }
      }
    }

    that.setData({
      skuIds: skuIds
    })

    for (var item in skuIds) {
      that.getAppriseStatus(item);
    }

  },
  getAppriseStatus: function(item) {
    let that = this;
    let skuIds = that.data.skuIds;
    wx.request({
      url: app.ourHost + '/sixteenAppraise/existsAppraise',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        userType: 3,
        userId: scn,
        orderNo: that.data.orderId,
        skuIds: skuIds[item].join(','),
        shippingGroupId: that.data.shippingGroupId
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          let isAppraise = res.data.result;
          let guiderList = that.data.guiderList;
          guiderList[item].isAppraise = isAppraise;

          that.setData({
            guiderList: guiderList
          })
          return guiderList;
        }


      },
      fail: function(res) {

      }
    })
  },
  // 查看发票
  lookInvoice: function(e) {
    let img = e.target.dataset.img;
    let urls = new Array();
    urls.push(img);
    console.log(img, urls)
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },
  // 确认收货
  confirmEvent: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/sixteen/order/handleConfirm',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        orderId: that.data.orderId
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.init();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail: function(res) {

      }
    })
  },
  // 拨打电话
  callPhone: function(e) {
    let that = this;
    let phone = e.target.dataset.phone;
    let times = new Date(that.data.serverTime);
    let hours = times.getHours();
    if (hours >= 18 || hours < 10) {
      phone = '400-870-8708';
    }
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // 复制键
  copyId: function(e) {
    wx.setClipboardData({
      data: e.target.dataset.text,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            // data
          }
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})