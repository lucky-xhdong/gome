

let app = getApp();
var startTime;
var mode;
var salt;//启动图盐值
var data_type ='';
Page({
  data: {
    currentTab: 0,//tab切换
    indicatorDots: false,
    autoplay: true,//自动切换
    interval: 5000,
    duration: 500,
    height: 0,//页面高度
    bannerList: [],//banner
    enterList: [],//快捷入口
    adList: [],//首页自定义广告
    startStatus: false,
    startList: [],//启动图广告
    bgsrc: "../../img/index/logo.png",
    hint: false,
    bestGoodsBig: [],//猜你喜欢数据
    bestGoods: [],//上屏的商品
    goodsAll: [],//总商品
    skus: "",
    uuid: "",
    percent: "67",
    timeSwitch: '',  //时间切换
    countDownAry: [], //tab里的倒计时
    curtSelected: '', //当前选中时间tab的下文说明
    countdown: 0, //倒计时数
    h: '00',
    m: '00',
    s: '00',
    isNoData: false,
    shoppingFlow: ""//等于mainSite时是主站 跳普通详情页;等于independent是独立 跳团抢详情页

  },
  cmsUrl: app.cmsUrl,
  ourHost: app.ourHost,
  ourHost1: app.ourHost,
  bigData: app.bigData,
  price: app.ssUrl + '/item/v1/price/promogen/',
  tuanUrl: app.tuanUrl,
  goHeader: app.goHeader,
  codeClick: function () {
    app.QRScan();
  },
  onLoad: function (options) {
    var that = this;

    if (options.data_type =='preview'){
      data_type ='preview';
    }
    wx.getSystemInfo({ //获取系统信息
      success: function (res) {
        that.setData({
          height: res.screenHeight + 'px'  //窗口高度
        })
      }
    });

    that.hiRushBuy();//默认加载hi抢购
    var uuid = that.uuid();
    that.setData({
      uuid: uuid
    });
  },
  onShow: function () {
    var that = this;
    startTime = wx.getStorageSync('startAdTime') || 0;
    mode = wx.getStorageSync('mode') || 0;
    salt = wx.getStorageSync('salt') || '';
    that.getHomeStartList();
    that.getBannerList();
    that.getHomeEnterList();
    that.getHomeAdList();

  },
  /**
   * 首页banner图
   * @pammer slot.is_effective String 推荐位生效状态，0生效， -1不生效
   */
  getBannerList: function () {
    var that = this;
    wx.request({
      url: that.cmsUrl + '/v1/cms/slot?unique_key=appletshomebanner',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      data:{
        data_type: data_type
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.slot.is_effective == 0 && res.data.data.list.length > 0) {
            that.setData({
              bannerList: res.data.data.list
            })
          }
        }
      },
      fail: function (res) {

      }
    })
  },
  /**
   * 首页banner图
   * @pammer type	String	跳转类型：1 key，2 url，3 普通商品，4 抢购商品，5 团购商品
   *  @pammer url 跳转url
   */
  getBannerEvent: function (e) {
    var key = e.currentTarget.dataset.key;
    var type = e.currentTarget.dataset.type;
    var url = e.currentTarget.dataset.url;

    if (type == 1) {
      if (key != '') {
        wx.navigateTo({
          url: '../activePage/activePage?key=' + key,
        })
      }
    } else if (type == 2) {
      var text = "http";
      if (url && url.indexOf(text) == -1) {
        wx.navigateTo({
          url: url,
        })
      } else {
        wx.navigateTo({
          url: '../active/active?url=' + url,
        })
      }
    } else if (type == 3) {
      var text = "-";
      if (key != '' && key.indexOf(text) != -1) {
        key = key.split("-");
        wx.navigateTo({
          url: '../prod/prod?productId=' + key[0] + '&skuId=' + key[1],
        })
      }

    } else {
      if (key != '') {
        wx.navigateTo({
          url: '../groupProd/groupProd?itemId=' + key,
        })
      }

    }


  },
  // 打开国美管家小程序
  getOpenMina: function () {
    wx.navigateToMiniProgram({
      appId: 'wxe25ab88328c0cdca',
      path: '',
      extraData: {
        foo: 'gomeMina'
      },
      success(res) {
        console.log(res)
      }
    })
  },
  /**
   * 首页快捷入口
   * @pammer slot.is_effective String 推荐位生效状态，0生效， -1不生效
   */
  getHomeEnterList: function () {
    var that = this;
    wx.request({
      url: that.cmsUrl + '/v1/cms/slot?unique_key=appletshomeenter',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      data: {
        data_type: data_type
      },
      method: 'GET',
      success: function (res) {

        if (res.data.code == 0) {
          if (res.data.data.slot.is_effective == 0 && res.data.data.list.length > 0) {
            that.setData({
              enterList: res.data.data.list
            })
          }
        }

      },
      fail: function (res) {

      }
    })
  },
  /**
  * 快捷入口事件
  */
  getEnterEvent: function (e) {
    var key = e.currentTarget.dataset.key;
    var type = e.currentTarget.dataset.type;
    var url = e.currentTarget.dataset.url;
    var name = e.currentTarget.dataset.name;
    var that=this;

    if (name == '扫码购物' || name == '购物扫码') {
      that.codeClick();
    } else if (name == '国美管家' || name == '管家小程序') {
      that.getOpenMina();
    } else {
      if (type == 1) {
        if (key != '') {
          wx.navigateTo({
            url: '../activePage/activePage?key=' + key,
          })
        }
      } else if (type == 2) {
        var text = "http";
        if (url && url.indexOf(text) == -1) {
          wx.navigateTo({
            url: url,
          })
        } else {
          wx.navigateTo({
            url: '../active/active?url=' + url,
          })
        }
      } else if (type == 3) {
        var text = "-";
        if (key != '' && key.indexOf(text) != -1) {
          key = key.split("-");
          wx.navigateTo({
            url: '../prod/prod?productId=' + key[0] + '&skuId=' + key[1],
          })
        }
      } else {
        if (key != '') {
          wx.navigateTo({
            url: '../groupProd/groupProd?itemId=' + key,
          })
        }

      }

    }



  },
  /**
   * 启动图
   * @pammer slot.is_effective String 推荐位生效状态，0生效， -1不生效
   * @pammer mode int 弹出方式：1 只弹出一次浮层，2 每三小时弹出一次
   */
  getHomeStartList: function () {
    var that = this;
    wx.request({
      url: that.cmsUrl + '/v1/cms/slot?unique_key=appletsstartad',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      data: {
        data_type: data_type
      },
      method: 'GET',
      success: function (res) {

        if (res.data.code == 0) {
          if (res.data.data.slot.is_effective == 0 && res.data.data.list.length > 0) {
            var list = res.data.data.list;
            that.setData({
              startList: list[0]
            })
            wx.setStorageSync('mode', list[0].mode);
            if (salt != '' && salt == list[0].salt) {

              if (list[0].mode == 2) {
                if ((res.data._t - startTime) > 10800) {
                  that.setData({
                    startStatus: true
                  })
                  wx.setStorageSync('startAdTime', res.data._t);
                } else {
                  that.setData({
                    startStatus: false
                  })
                }
                // wx.setStorageSync('startAdTime', list[0].update_time);
              } else {
            
                if (mode != 1) {
                  if (list[0].mode == 2) {
                    wx.setStorageSync('startAdTime', res.data._t);
                  }
                  that.setData({
                    startStatus: true
                  })
                } else {
                  that.setData({
                    startStatus: false
                  })
                }

              }


            } else {
              wx.setStorageSync('mode', list[0].mode);
              if (list[0].mode == 2) {
                wx.setStorageSync('startAdTime', res.data._t);
              }
              that.setData({
                startStatus: true
              })

              wx.setStorageSync('salt', list[0].salt);

            }



          }else{
            that.setData({
              startStatus:false
            })
          }
        }
      },
      fail: function (res) {

      }
    })
  },
  /**
 * 首页自定义广告
 * @pammer slot.is_effective String 推荐位生效状态，0生效， -1不生效
 */
  getHomeAdList: function () {
    var that = this;
    wx.request({
      url: that.cmsUrl + '/v1/cms/slot?unique_key=appletshomead',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      data: {
        data_type: data_type
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.slot.is_effective == 0 && res.data.data.list.length > 0) {
            that.setData({
              adList: res.data.data.list
            })
          }
        }

      },
      fail: function (res) {

      }
    })
  },
  /**
  * 首页快捷入口
  * @pammer slot.is_effective String 推荐位生效状态，0生效， -1不生效
  */
  getHomeEnterList: function () {
    var that = this;
    wx.request({
      url: that.cmsUrl + '/v1/cms/slot?unique_key=appletshomeenter',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'GET',
      data: {
        data_type: data_type
      },
      success: function (res) {

        if (res.data.code == 0) {
          if (res.data.data.slot.is_effective == 0 && res.data.data.list.length > 0) {
            that.setData({
              enterList: res.data.data.list
            })
          }
        }

      },
      fail: function (res) {

      }
    })
  },
  /**
  * 关闭启动图
  */
  delAdEvent: function (e) {
    var that = this;
    that.setData({
      startStatus: false
    })

  },
  /**
   * 点击tab切换:hi抢购/精品推荐
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      });
      if (that.data.currentTab == 1) {
        that.business();//精选推荐
      }
      else {
        var num = that.data.timeSwitch;
        that.hiRushBuySwitch(num);
      }
    }
  },
  /**
   * 时间切换
   * */
  timeNav: function (e) {
    var that = this;
    var num = e.currentTarget.dataset.num;
    if (that.data.timeSwitch === num) {
      return false;
    } else {
      that.setData({
        timeSwitch: num,
        curtSelected: that.data.countDownAry[num].description
      });
      //请求对应的接口数据
      that.hiRushBuySwitch(num);
    }
  },
  //数组切割分组
  chunk: function (array, size) {
    var result = [];
    for (var x = 0; x < Math.ceil(array.length / size); x++) {
      var start = x * size;
      var end = start + size;
      result.push(array.slice(start, end));
    }
    return result;
  },
  showLoading: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  },
  cancelLoading: function () {
    wx.hideLoading();
  },
  //根据商品itemId查询商品信息
  productsByitemId: function (data, param) {
    var that = this;
    var goodsList = [];
    if (param == 0) {
      var tempList = data;
      goodsList = tempList.length <= 10 ? tempList : that.chunk(tempList, 10)[0];
    }
    if (param == 1) {
      var tempA = that.data.bestGoods;
      var tempB = that.data.goodsAll;
      goodsList = tempB[data];
    }

    var itemIds = '';
    for (var b = 0; b < goodsList.length; b++) {
      itemIds += ',' + goodsList[b].itemId;
    }
    itemIds = itemIds.substr(1, itemIds.length);

    wx.request({
      url: that.tuanUrl + '/cheap/getCheapItemsStatus',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'GET',
      data: { itemIds: itemIds },
      success: function (res) {
        for (var c = 0; c < goodsList.length; c++) {
          goodsList[c].cheapPrice = res.data.data[c].cheapPrice;
          goodsList[c].Jstatus = res.data.data[c].status;
          goodsList[c].salePercent = res.data.data[c].salePercent;
          goodsList[c].saleNum = res.data.data[c].saleNum;
          goodsList[c].gomePrd = res.data.data[c].gomePrd;
          if (res.data.data[c].shoppingFlow == "mainSite") {
            goodsList[c].proUrl = "../prod/prod?productId=" + goodsList[c].productId + "&skuId=" + goodsList[c].skuId;
          } else {
            goodsList[c].proUrl = "../groupProd/groupProd?itemId=" + goodsList[c].itemId;
          }

        }
        if (param == 0) {
          that.setData({
            bestGoods: goodsList,
            goodsAll: that.chunk(tempList, 10)
          });
        }
        if (param == 1) {
          that.setData({
            bestGoods: tempA.concat(goodsList)
          });
        }
        that.cancelLoading();
      }
    });
  },
  //hi抢购初始化接口
  hiRushBuy: function () {
    var that = this;
    that.showLoading();
    that.setData({
      timeSwitch: '',
      bestGoods: [],
      goodsAll: [],
      countDownAry: [],
      countdown: 0,
      h: '00',
      m: '00',
      s: '00',
      isNoData: false
    });
    wx.request({
      url: that.ourHost + '/cheap/index',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'GET',
      success: function (data) {
        if (data.data.times) {
          for (var a = 0; a < data.data.times.length; a++) {
            data.data.times[a].content = data.data.times[a].content.substr(0, data.data.times[a].content.length - 1);
            if (data.data.times[a].current == true) {
              that.setData({
                timeSwitch: data.data.times[a].timeCode,
                curtSelected: data.data.times[a].description,
                countdown: data.data.times[a].countdown
              });
              that.getSETime(data.data.times[a].countdown);
            }
          }
          that.setData({
            countDownAry: data.data.times
          });
          if (data.data.goods.length > 0) {
            that.productsByitemId(data.data.goods, 0);
          }
          else {
            that.setData({
              isNoData: true
            });
            that.cancelLoading();
          }
        }


      }
    });
  },
  //hi抢购时间切换接口
  hiRushBuySwitch: function (num) {
    var that = this;
    that.showLoading();
    that.setData({
      bestGoods: [],
      goodsAll: [],
      isNoData: false
    });
    wx.request({
      url: that.tuanUrl + '/cheap/getRushBuyTimeGoods',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'GET',
      data: { timeCode: num },
      success: function (data) {
        if (data.data.code == 200 && data.data.data.length > 0) {
          that.productsByitemId(data.data.data, 0);
        }
        else {
          that.cancelLoading();
          that.setData({
            isNoData: true
          });
        }
      },
      fail: function (e) {
        that.cancelLoading();
        that.setData({
          isNoData: true
        });
      }
    });
  },
  //获取接口返回的倒计时时间
  getSETime: function (countD) {
    var that = this;
    if (countD == 0) {
      that.hiRushBuy();
      return;
    }
    else {
      var times = setTimeout(function () {
        countD = parseInt(countD - 1000);
        that.countDownEvent(countD);
        that.getSETime(countD);
      }, 1000);
    }
  },
  /*倒计时*/
  countDownEvent: function (newTime) {
    var that = this;
    var second = Math.floor(newTime / 1000);
    var h = Math.floor(second / 3600);
    var m = Math.floor((second - h * 3600) / 60);
    var s = (second - h * 3600 - m * 60);

    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    that.setData({
      h: h,
      m: m,
      s: s
    });
  },
  //上拉加载数据
  onReachBottom: function () {
    var that = this;
    if (that.data.currentTab == 0) {
      var bestG = that.chunk(that.data.bestGoods, 10).length;
      if (bestG == that.data.goodsAll.length) {
        wx.showToast({
          title: "没有更多抢购商品了",
          icon: "success",
          duration: 1000
        });
      }
      else {
        that.productsByitemId(bestG, 1);
      }
    }
  },
  // 精选里的业务接口
  business: function () {
    var that = this;
    that.routineProducts();
  },
  //常规精品推荐接口数据
  routineProducts: function () {
    var that = this;
    that.setData({
      tempBestGoods: []
    });
    wx.request({
      url: that.ourHost + '/cheap/mock',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'POST',
      success: function (data) {
        if (data.data.length > 0) {
          for (var i = 3; i < data.data.length; i++) {
            data.data[i].flagMessage = "";
          }
          that.setData({
            bestGoods: data.data
          });
          that.linkSku();
        }

      }
    });
  },
  // 拼接skuId的，用来调取价格接口
  linkSku: function () {
    var that = this;
    var bestGood = that.data.bestGoods;
    var skuStr = [];
    for (var i = 0; i < bestGood.length; i++) {
      skuStr.push(bestGood[i].skuId);
    }
    skuStr = skuStr.join(",").slice(0);
    that.setData({
      skus: skuStr
    });
    that.goodPrice();
  },
  // 通过拼接好的skuId，调价格接口
  goodPrice: function () {
    var that = this;
    var areaCode = "";
    if (wx.getStorageSync('codeCookies')) {
      var codeCookies = wx.getStorageSync('codeCookies');
      areaCode = codeCookies[1];
    } else {
      areaCode = "11010000";
    }
    wx.request({
      url: that.price + that.data.skus + '/' + areaCode + '/flag/item',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'GET',
      success: function (data) {
        var bestGoodY = that.data.bestGoods;
        var result = data.data.result;
        for (var i = 0; i < result.length; i++) {
          var item = result[i].skuId;
          for (var j = 0; j < bestGoodY.length; j++) {
            if (bestGoodY[j].skuId == item) {
              bestGoodY[j].originalPrice = result[i].originalPrice;
              bestGoodY[j].minPrice = '¥' + result[i].minPrice;
            }
          }
        }
        that.setData({
          bestGoods: bestGoodY
        });
        that.cancelLoading();
      }
    });

  },
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      wx.showModal({
        title: '提示',
        content: '这是一个模态弹窗',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    }
    return {
      title: '国美，品质、低价、速达',
      desc: '品质、低价、速达',
      path: '/pages/index/index'
    }
  },

  uuid: function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
})