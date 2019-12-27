var app = getApp();
var prodList = [];
var prodAndSku = '';
var page;
Page({
  data: {
    height: '',
    name: '', //门店名
    storeCode: '', //门店ID
    address: '',//门店地址
    storePhone: '',//门店电话
    countyCode: '',//三级区域ID
    storeProd: [],
    size: '10',//每次下拉显示多少条商品
    hasMore: true,
    hasOver: false,
    isShow: true

  },
  ourHost: app.ourHost,
  goHeader: app.goHeader,
  onLoad: function (options) {
    var that = this;
    page=0;
    wx.getSystemInfo({ //获取系统信息
      success: function (res) {
        that.setData({
          height: res.windowHeight + 'px'  //窗口高度
        })
      }
    });

    that.setData({
      name: options.name,
      storeCode: options.storeCode,
      address: options.address,
      countyCode: options.countyCode,
      storePhone: options.storePhone
    })
    that.getInitData();

  },
  onShow: function () {
    var that = this;



  },
  //初始化数据 
  getInitData: function () {
    var that = this;
    wx.request({
      url: that.ourHost + '/store/findStoreProduct',
      // url: 'http://10.144.34.240:8080/tiny-weixin-bootstrap/store/findStoreProduct',
      method: 'GET',
      data: {
        storeCode: that.data.storeCode,
        page: page,
        size: that.data.size
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function (res) {
        if (res.data.length > 0) {
          if (page == 0) {
            that.setData({
              isShow: true
            })
          }
          for (var i = 0; i < res.data.length; i++) {
            prodList.push(res.data[i]);
            if (i < res.data.length) {
              prodAndSku += res.data[i].productId + '_' + res.data[i].skuId + ',';
            }
          }
          that.getInitPrice();
        } else {
          if (page == 0) {
            that.setData({
              isShow: false,
              hasMore: false,
              hasOver: false
            })
          } else {
            that.setData({
              hasMore: false,
              hasOver: true
            })
          }
          return false;
        }

      }
    })
  },
  //价格
  getInitPrice: function () {
    var that = this;
    wx.request({
      url: that.ourHost + '/cheap/listrushPrice',
      method: 'GET',
      data: {
        prodAndSku: prodAndSku,
        areaCode: that.data.countyCode,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function (res) {
        for (var i = 0; i < res.data.result.length; i++) {
          prodList[i].price = res.data.result[i].price;
        }

        that.setData({
          storeProd: prodList
        })
      }
    })
  },
  //拨打电话 
  callPhone: function (e) {
    var num = e.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: num
    })
  },
  //加载更多
  loadMore: function (e) {
    var that = this;
    if (!that.data.hasOver) {
      page = page + 1;
      that.getInitData();
    }
  },
  //访问更多门店
  returnList: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    var that = this;
    return {
      title: '门店详情-'+ that.data.name ,
      path: '/pages/shopProd/shopProd?name=' + that.data.name + '&storeCode=' + that.data.storeCode+'&address='+that.data.address+'&countyCode='+that.data.countyCode+'&storePhone='+that.data.storePhone
    }
  }
})