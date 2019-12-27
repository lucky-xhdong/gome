var WxParse = require('../../wxParse/wxParse.js');
var MarkInfoConfig = require('../../common/MarkInfoConfig');
var app = getApp();
var infoUrl = '';
var productId, skuId;
var scn;
var isAddCart; //加入购物车
var isClick;
var kid; //购买返kid，用于加入购物车和立即购买
var fxKid = ""; //为空时没有分享
var userId; //分享接口要用到
var click = [];
var maxTuanNum; //最大购买多少
Page({
  data: {
    indicatorDots: false, //是否显示面板指示点
    autoplay: false, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    currentTab: 0,
    arrowright: 'arrowdown', //合并展开
    height: '',
    listImg: '', //商品详情页数据
    isPrdPackTemplate: false, //判断配件返回的是不是html.false表示不是html
    isServiceTemplate: false, //判断保修返回的是不是html.false表示不是html
    //loadMore: false,
    isStatus: '1', //1是上架可以购买商品，2是下架，6是商品页面没有
    buyNow: true, //true是该商品库存不为0，可以购买
    isSale: '',
    saleTab: 'arrowright',
    num: '1', //商品数量
    maxNum: '', //商品最大可选择数量
    choice: [], //选择的商品参数
    prodPrice: {}, //商品价格，走单独接口
    vip: {},
    attr: [], //已选参数
    salesProperty: [], //参数
    address: ["北京", "北京", "朝阳区", "朝外街道"],
    addressId: ["11000000", "11010000", "11010200", "110102002"],
    numTips: '',
    numTipShow: false,
    appr: {}, //评价
    sales: [], //促销
    items: {},
    prod: {}, //商品信息
    cartNum: 0,
    rebate: '0.00', //购买返
    // sharerebate:'1.40'//分享返
    preHeatState: false, //是否团购
    startTime: '', //开始时间,
    endTime: '', //结束倒计时
    showEndTime: false //是否大于48小时

  },
  ourHost: app.ourHost,
  ourHostCart: app.ourHostCart,
  ssUrl: app.ssUrl,
  fanliUrl: app.fanliUrl,
  goHeader: app.goHeader,

  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({ //获取系统信息
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px' //窗口高度
        })
      }
    });

    productId = options.productId; //取到上一页传入的参数productid
    skuId = options.skuId; //取到上一页传入的skuid
    scn = app.getScn();
    new app.WeToast();

    /*---清空四级区域cookie  start---*/
    var firstLogin = wx.getStorageSync('firstLogin');

    if (firstLogin == 0) {
      wx.setStorageSync("firstLogin", 1);
      wx.removeStorageSync("codeCookies");
      wx.removeStorageSync("labelCookies");
    } else {
      //return
    }
    /*---清空四级区域cookie  end---*/



  },
  onShow: function(e) {
    var that = this;
    scn = wx.getStorageSync('scn');
    isAddCart = true;
    isClick = true;
    that.initUserId();
    if (wx.getStorageSync('codeCookies')) {
      var codeCookies = wx.getStorageSync('codeCookies');
      that.setData({
        addressId: codeCookies
      })
    }
    if (wx.getStorageSync('labelCookies')) {
      var labelCookies = wx.getStorageSync('labelCookies');


      that.setData({
        address: labelCookies
      })
    }
    that.setData({
      preHeatState: false
    })
    that.getAsync();
    that.getAppr();
    that.getRebate();
    that.getAsynchronous();
    that.getPrice();
    that.cartCount();
  },
  /*商品介绍、规格参数、包装清单、售后服务的tab切换*/
  bottomNavTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /*同步接口-商品描述、参数、商品介绍、规格参数、包装清单、售后服务 */
  getAsync: function() {
    var that = this;
    wx.request({
      url: that.ourHost + '/product/query',
      data: {
        productId: productId,
        skuId: skuId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        if (res.data.prdInfo) {
          var property = res.data.prdInfo.salesProperty;
          that.setData({
            prod: res.data,
            salesProperty: property
          });
          infoUrl = res.data.prdInfo.htmlHref;
          that.prodInfoImg();
          that.prodTab(that.data.prod.prdPack.modeInfo, that.data.prod.prdService.modeInfo);
          // 商品选择
          if (res.data.prdInfo.salesProperty.length > 0) {
            that.productEventInit();
          }

        }


      },
      fail: function() {
        // fail  
      },
      complete: function() {
        // complete  
      }
    })
  },
  /*异步接口-价格、促销、上下架、库存、区域ID、发货地、预计到达时间、运费标签等*/
  getAsynchronous: function() {
    var that = this;
    var adressId = that.data.addressId;
    wx.request({
      url: that.ourHost + '/common/item/v1',
      data: {
        productId: productId,
        skuId: skuId,
        skuFlag: 'N',
        city: adressId[2],
        district: adressId[3],
        userId: 'null'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'POST',
      success: function(res) {
        if (res.data.result) {

          var result = res.data.result;

          // result.preHeatSlogan = {
          //   preheatPrice: 163.00,
          //   realStartTime: 2431312030,
          //   realEndTime: 1512413123,
          //   currentTime: 1231231231,
          //   status: 1,//0：预热中，1：抢购中
          //   buyerCount: 200,
          //   lineation: 989.00
          // };
          if (result.preHeatSlogan && result.preHeatSlogan.lineation) {
            result.preHeatSlogan.preheatPriceStr = result.preHeatSlogan.preheatPriceStr;
            result.preHeatSlogan.lineation = result.preHeatSlogan.lineation;
            // maxTuanNum = result.preHeatSlogan.limitNum;
          }

          that.setData({
            items: result,
            sales: res.data.result.promArray, //促销的字段
            isStatus: res.data.result.status,
            maxNum: res.data.result.stock.amount,
            buyNow: res.data.result.stock.status
          })

          if (result.preHeatSlogan) {
            that.setData({
              preHeatState: true
            })
            if (result.preHeatSlogan && result.preHeatSlogan.status == 0) {
              that.getData(result.preHeatSlogan.realStartTime, result.preHeatSlogan.currentTime);
            } else {
              that.countDown(result.preHeatSlogan.realEndTime - result.preHeatSlogan.currentTime);
            }

          }
        }

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /*返利接口*/
  getRebate: function() {
    var that = this;
    var areaCodeId = that.data.addressId[1];
    wx.request({
      url: that.ssUrl + '/item/v1/d/reserve/p/detail/' + productId + '/' + skuId + '/null/' + areaCodeId + '/flag/item/',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      method: 'GET',
      success: function(res) {
        // console.log(res)
        if (res.data.result.rebate) {
          that.setData({
            rebate: res.data.result.rebate
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })

  },
  // 获取日期
  //lastDay 为倒计时还有几天。为1时显示明天 为0时显示今天 大于1显示日期
  getData: function(timmer, nowTime) {
    var that = this;
    var lastTime = parseInt(timmer) - parseInt(nowTime);
    var lastDay = parseInt(lastTime / 86400000);
    var lastH = parseInt((lastTime - lastDay * 86400000) / 3600000);
    var newDate = new Date();
    newDate.setTime(timmer);
    var Y = newDate.getFullYear()
    var M = newDate.getMonth() + 1;
    var d = newDate.getDate();
    var h = newDate.getHours();
    var m = newDate.getMinutes();
    if (M < 10) {
      M = "0" + M;
    }
    if (d < 10) {
      d = "0" + d;
    }
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }

    if (that.data.preHeatState) {
      var times = setTimeout(function() {
        if (lastTime > 100) {
          if (lastDay == 0) {
            if (lastH - h < 0) {
              var startTime = '今天' + h + ':' + m;
            } else {
              var startTime = '明天' + h + ':' + m;
            }

          } else if (lastDay == 1) {
            if (lastH - h < 0) {
              var startTime = '明天' + h + ':' + m;
            } else {
              var startTime = M + '月' + d + '日 ' + h + ':' + m;
            }
          } else {
            var startTime = M + '月' + d + '日 ' + h + ':' + m;
          }
          that.setData({
            startTime: startTime
          })
          nowTime += 100;
          that.getData(timmer, nowTime);
        } else {
          clearTimeout(times);
          that.getAsynchronous();
        }
      }, 100)
    }

  },
  // 获取日期
  countDown: function(time) {
    var that = this;

    if (that.data.preHeatState && time != 0) {
      var times = setTimeout(function() {
        time = parseInt(time - 100);
        if (time > 100) {
          that.countDownEvent(time);
          that.countDown(time);
        } else {
          clearTimeout(times);
          that.getAsynchronous();
        }
      }, 100)
    } else {
      that.getAsynchronous();
      return;
    }

  },
  /*团购开始倒计时*/
  countDownEvent: function(newTime) {
    var that = this;
    var d = parseInt(newTime / 86400000),
      h = parseInt((newTime - d * 86400000) / 3600000),
      m = parseInt((newTime - d * 86400000 - h * 3600000) / 60000),
      // s = ((newTime - d * 86400000 - h * 3600000 - m * 60000) / 1000).toFixed(1);
      s = parseInt((newTime - d * 86400000 - h * 3600000 - m * 60000) / 1000);
    if (d < 10) {
      d = "0" + d;
    }
    if (h < 10) {
      h = "0" + h;
    }
    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    if (d > 2) {
      that.setData({
        showEndTime: false,
        endTime: d + "天" + h + "小时"
      })
    } else {
      var hours = parseInt(d * 24) + parseInt(h);
      var endTime = [hours, m, s];
      that.setData({
        showEndTime: true,
        endTime: endTime
      })
    }

  },
  getPrice: function() {
    var that = this;
    var adressId = that.data.addressId;
    //价格接口 
    wx.request({
      // url: that.ourHost + '/priceInfo/query',
      url: that.ourHost + '/price/mobilePrice',
      data: {
        productId: productId,
        skuId: skuId,
        areaCode: adressId[1],
        scn: scn
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            prodPrice: res.data.result
          })
        }

        // that.getVipPrice(res.data.finalPrice);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  productEventInit: function() {
    var that = this;
    var sku = [], //   所有的数组
      attr = [], //当前的主属性下的数组
      arra = []; // 匹配到点击当前按钮的相关的数组
    var attry = [];
    sku = that.data.salesProperty;
    var affixAttr = that.data.prod.prdInfo.affixAttr;
    var index = Object.keys(affixAttr); //返回数组，内容为对象的键名

    //获取当前主属性下数组attr 
    for (var a = 0; a < sku.length; a++) {
      for (var b = 0; b < sku[a].skutions.length; b++) {
        if (a == 0 & sku[a].skutions[b].target != 'cur') {
          sku[a].skutions[b].target = 'set';
        }
        if (sku[a].skutions[b].target == "cur") {
          attr.push(sku[a].skutions[b].alt);
        }
      }
    }

    for (var i = 0; i < index.length; i++) {
      index[i] = index[i].split('&'); //二维数组
      if (index[i][0] == attr[0]) {
        for (var h = 1; h < index[i].length; h++) {
          arra.push(index[i][h]);
        }
      }
    }
  

    //匹配affixAttr第一列主属性的所有相关数组
    for (var z = 0; z < arra.length; z++) {
      for (var x = 0; x < sku.length; x++) {
        for (var y = 0; y < sku[x].skutions.length; y++) {
          if (sku[x].skutions[y].target != 'cur' && sku[x].skutions[y].alt == arra[z]) {
            sku[x].skutions[y].target = 'set';
          }
        }
      }
    }
    that.setData({
      attr: attr,
      salesProperty: sku
    })
  },
  /*商品参数*/
  productEvent: function(e) {
    var that = this;
    var text = e.target.dataset.alt;
    var sku = [];
    sku = that.data.salesProperty;
    var skuText = [];
    var idx = e.target.dataset.parentidx;
    var weight = e.target.dataset.index;
    var b, c;
    if (sku[idx].skutions[weight].target == null || sku[idx].skutions[weight].target == 'cur') {
      return false;
    }
    var arra = [];
    weight = parseInt(weight);
    var affixAttr = that.data.prod.prdInfo.affixAttr;
    var index = Object.keys(affixAttr);

    for (var i = 0; i < sku.length; ++i) {
      for (var h = 0; h < sku[i].skutions.length; ++h) {
        if (sku[i].skutions[h].target == "cur") {
          skuText.push(sku[i].skutions[h].alt);
          for (var j = 0; j < sku[i].skutions.length; ++j) {
            if (sku[i].skutions[j].alt == text) {
              b = i;
              c = j;
              skuText.splice(-1, 1, text);
            } else {
              if (i == idx && sku[i].skutions[j].target == 'cur') {
                sku[i].skutions[j].target = 'set';
              }
            }
          }
        }
      }
    }
    // skuText.splice(idx, 0, text);
    var skuTitle = '';
    for (var a = 0; a < skuText.length; ++a) {
      skuTitle += skuText[a] + '&';
    }
    skuTitle = skuTitle.substring(0, skuTitle.length - 1);
    /*重新开始计算*/
    if (affixAttr[skuTitle]) {
      productId = that.data.prod.productId;
      skuId = affixAttr[skuTitle];
      that.productInit();
    } else {
      // 选择第一行参数时下列参数为空
      if (idx == 0) {

        for (var i = 0; i < index.length; i++) {
          index[i] = index[i].split('&');
          if (index[i][0] == text) {
            for (var h = 1; h < index[i].length; h++) {
              arra.push(index[i][h]);
            }
          }
        }

        for (var a = 0; a < sku.length; a++) {
          for (var b = 0; b < sku[a].skutions.length; b++) {
            if (a == 0) {
              sku[a].skutions[b].target = 'set';
            } else {
              sku[a].skutions[b].target = 'null';
            }
            sku[idx].skutions[weight].target = 'cur';
            for (var c = 0; c < arra.length; c++) {
              if (sku[a].skutions[b].alt == arra[c]) {
                sku[a].skutions[b].target = 'set';
              }
            }
          }
        }
        sku[idx].skutions[weight].target = 'cur';
        that.setData({
          salesProperty: sku
        })
        click = [];
        click[0] = text;
      } else {
        if (sku[idx].skutions[weight].target != 'cur') {
          sku[idx].skutions[weight].target = 'cur';
          for (var a = 0; a < sku[0].skutions.length; a++) {
            if (sku[0].skutions[a].target == 'cur' && click[0] != sku[0].skutions[a].alt) {
              click.push(sku[0].skutions[a].alt);
            }
          }
          // 此时click为第一行主属性和每次选择其他行的主属性
          click[idx] = text;

          var clickIdx = [];
          // 获取可以显示的属性的index
          var len = click.length;
          for (var i = 0; i < index.length; i++) {
            var valueArr = index[i].split('&');
            if (click[0] == valueArr[0]) {
              var onOff = true;
              for (var m = 1; m < valueArr.length; m++) {
                if (m <= len - 1) {
                  if (click[m] != undefined && valueArr[m] != click[m]) {
                    onOff = false;
                  }
                }
              }
              if (onOff) {
                clickIdx.push(i);
              }
            }
          }
          // 重新计算属性是否置灰显示置红
          for (var i = 0; i < index.length; i++) {
            index[i] = index[i].split('&');
          }
          for (var a = 0; a < clickIdx.length; a++) {
            var c = clickIdx[a];
            for (var b = 0; b < index[c].length; b++) {
              for (var d = 0; d < sku[b].skutions.length; d++) {
                if (sku[b].skutions[d].alt == index[c][b]) {
                  sku[b].skutions[d].target = 'set';
                  if (sku[b].skutions[d].alt == click[b]) {
                    sku[b].skutions[d].target = 'cur';
                  }
                } else {
                  if (b != 0) {
                    sku[b].skutions[d].target = null;
                  } else {
                    sku[b].skutions[d].target = 'set';
                  }
                }
              }
            }
          }
          skuTitle = '';
          for (var a = 0; a < click.length; ++a) {
            skuTitle += click[a] + '&';
          }
          // 计算affixAttr属性所用
          skuTitle = skuTitle.substring(0, skuTitle.length - 1);
          if (affixAttr[skuTitle]) {
            productId = that.data.prod.productId;
            skuId = affixAttr[skuTitle];
            that.productInit();
          } else {
            that.setData({
              salesProperty: sku
            })
          }
        }
      }
    }

  },
  productInit: function(e) {
    var that = this;
    that.setData({
      preHeatState: false
    });
    wx.request({
      url: that.ourHost + '/product/query',
      data: {
        productId: productId,
        skuId: skuId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        that.setData({
          prod: res.data,
          salesProperty: res.data.prdInfo.salesProperty
        });
        if (res.data.prdInfo.salesProperty.length > 0) {
          that.productEventInit();
          click = [];
        }
        that.getRebate();
        that.getAppr();
        that.getAsynchronous();
        that.getPrice();
      },
      fail: function() {
        // fail  
      },
      complete: function() {
        // complete  
      }
    })
  },
  /*评价*/
  getAppr: function() {
    var that = this;
    wx.request({
      url: that.ourHost + '/evaluate/query',
      data: {
        productId: productId,
        pageCur: 1,
        pageType: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        that.setData({
          appr: res.data
        })
      },
      fail: function() {

      },
      complete: function() {

      }
    })
  },
  /*商品详情*/
  prodInfoImg: function() {
    var that = this;
    wx.request({
      url: 'https:' + infoUrl,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        var list = [];
        var imgList = res.data.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
          var listImg = capture;
          if (listImg.indexOf("http:") != -1) {
            listImg = listImg.replace("http:", "");
          } else if (listImg.indexOf("https:") != -1) {
            listImg = listImg.replace("https:", "");
          } else {

          }
          list.push(listImg);
        });

      
        that.setData({
          listImg: list
          // loadMore: false
        });
      },
      fail: function() {},
      complete: function() {
        // complete
      }
    })
  },
  /*包装清单、售后服务*/
  prodTab: function(prdPack, prdService) {
    /*包装清单*/
    var that = this;
    console.log(prdPack, '---11')
    if (prdPack.indexOf("/P") > 0) {
      that.setData({
        isPrdPackTemplate: true
      })
      console.log(prdPack,'---')
      WxParse.wxParse('prdPack', 'html', prdPack, that, 5);
    } else {
      that.setData({
        isPrdPackTemplate: false
      })
    }
    /*售后服务 */
    if (prdService.indexOf("/P") > 0) {
      that.setData({
        isServiceTemplate: true
      })
      WxParse.wxParse('prdService', 'html', prdService, that, 5);
    } else {
      that.setData({
        isServiceTemplate: false
      })
    }
  },
  /*已选标签闭合 */
  closeParameter: function(e) {
    var that = this;
    if (that.data.arrowright == 'arrowright') {
      that.setData({
        arrowright: 'arrowdown'
      });
    } else {
      that.setData({
        arrowright: 'arrowright'
      });
    }
  },
  /*选择数量-减*/
  reduceNum: function(e) {
    var that = this;
    var num = this.data.num;
    if (num > 1) {
      that.setData({
        num: num - 1,
        numTipShow: false
      })
      num = num - 1;
      if (that.data.items.preHeatSlogan && num > that.data.items.preHeatSlogan.limitNum) {
        that.setData({
          numTips: '抢购（团购）商品限购' + that.data.items.preHeatSlogan.limitNum + '件，超出将全部以￥' + that.data.items.preHeatSlogan.lineation + '/件结算',
          numTipShow: true
        })
      }
    } else {
      that.setData({
        num: 1,
        numTipShow: false
      })

    }
  },
  /*选择数量*/
  changeNum: function(e) {
    var that = this;
    var num = parseInt(e.detail.value);
    var maxNum = parseInt(that.data.maxNum);
    if (that.data.items.others.merchantLimit) {
      var limit = parseInt(that.data.items.others.merchantLimit);
      if (limit < maxNum) {
        maxNum = limit;
      }
    }


    if (num < 1) {
      that.setData({
        num: 1,
        numTipShow: false
      })
    } else if (num > maxNum) {
      that.setData({
        num: maxNum,
        numTips: '仅剩' + maxNum + '件',
        numTipShow: true
      })
    } else {
      that.setData({
        num: num,
        numTipShow: false
      })
      if (that.data.items.preHeatSlogan && num > that.data.items.preHeatSlogan.limitNum) {
        that.setData({
          numTips: '抢购（团购）商品限购' + that.data.items.preHeatSlogan.limitNum + '件，超出将全部以￥' + that.data.items.preHeatSlogan.lineation + '/件结算',
          numTipShow: true
        })
      }
    }
  },
  /*选择数量-加*/
  addNum: function(e) {
    var that = this;
    var num = parseInt(that.data.num);
    var maxNum = parseInt(that.data.maxNum);
    if (that.data.items.others.merchantLimit) {
      var limit = parseInt(that.data.items.others.merchantLimit);
      if (limit < maxNum) {
        maxNum = limit;
      }
    }
    if (num < maxNum) {
      that.setData({
        num: num + 1,
        numTipShow: false
      })
      num = num + 1;
      if (that.data.items.preHeatSlogan && num > that.data.items.preHeatSlogan.limitNum) {
        that.setData({
          numTips: '抢购（团购）商品限购' + that.data.items.preHeatSlogan.limitNum + '件，超出将全部以￥' + that.data.items.preHeatSlogan.lineation + '/件结算',
          numTipShow: true
        })
      }
    } else {
      that.setData({
        num: maxNum,
        numTipShow: true,
        numTips: '仅剩' + maxNum + '件',
      })
    }
  },
  /*促销切换*/
  getSalesDesc: function(e) {
    var that = this;
    if (that.data.saleTab == 'arrowright') {
      that.setData({
        isSale: 'sales-spread',
        saleTab: 'arrowdown'
      })
    } else {
      that.setData({
        isSale: '',
        saleTab: 'arrowright'
      })
    }
  },
  /*立即购买*/
  buyNowEvent: function(e) {
    var that = this;
    if (!scn) {
      scn = app.getScn();
    } else {
      var num = that.data.num;
      if (isClick) {
        isClick = false;
        wx.request({
          url: that.ourHostCart + '/wxmp/api/cart/quickBuy',
          data: {
            type: 0,
            pid: productId,
            sid: skuId,
            pcount: num,
            k: kid
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Cookie': 'SCN=' + scn,
            'gome-header': that.goHeader
          },
          success: function(res) {
            // success
            // console.log('立即购买', fxKid)
            if (res.data.success == true) {
              wx.navigateTo({
                url: '../confirmOrder/confirmOrder?pid=' + productId + '&sid=' + skuId + '&pcount=' + num
              });
              isClick = false;
              that.cartCount();
            } else {
              isClick = true;
              if (res.data.errCode == '008000001') {
                wx.removeStorageSync('scn');
                scn = app.getScn();
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.errMsg,
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      return;
                    }
                  }
                });
              }


            }
          },
          fail: function() {},
          complete: function() {
            // complete
          }
        })
      }
    }



  },
  /*分享链条-kid*/
  getShareKid: function() {
    var that = this;
    wx.request({
      url: that.fanliUrl + '/v3/rebate/shareChain/kid',
      data: {
        userId: userId,
        callfrom: 14,
        parentKid: fxKid,
        itemId: productId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=utf-8'
      },
      success: function(res) {
        // console.log(res.data.data.kid)
        if (res.data.data) {
          kid = res.data.data.kid
        }

      },
      fail: function(res) {
        console.log(res)
      }

    })
  },
  /*获取分享返利的userId*/
  initUserId: function() {
    var that = this;
    wx.request({
      url: that.ourHost + '/shareKid',
      data: {
        scn: scn
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': 'SCN=' + scn
      },
      success: function(res) {
        if (res.data.userId) {
          userId = res.data.userId;
          that.getShareKid();
        }
      },
      fail: function(res) {

      }
    })
  },
  /*分享*/
  onShareAppMessage: function() {
    var that = this;
    return {
      title: that.data.prodPrice.price + "元  " + that.data.prod.prdInfo.name,
      path: '/pages/prod/prod?productId=' + productId + '&skuId=' + skuId
    }

  },
  /*加入购物车*/
  addCart: function(e) {
    var that = this;
    if (!scn) {
      scn = app.getScn();
    } else {
      var num = that.data.num;
      if (isAddCart) {
        isAddCart = false;
        wx.request({
          url: that.ourHostCart + '/wxmp/api/cart/addToCart',
          data: {
            type: 0,
            pid: productId,
            sid: skuId,
            pcount: num
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'gome-header': that.goHeader,
            'Cookie': 'SCN=' + scn
          },
          success: function(res) {
            if (res.data.success == true) {
              wx.showToast({
                title: "添加成功！",
                icon: "success",
                duration: 1000
              });
              that.cartCount();
            } else {
              if (res.data.errCode == '008000001') {
                wx.removeStorageSync('scn');
                scn = app.getScn();
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.errMsg,
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {

                      return;
                    }
                  }
                });
              }



            }
            isAddCart = true;
          },
          fail: function(res) {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      }
    }


  },
  /*查询购物车商品数量*/
  cartCount: function() {
    var that = this;
    wx.request({
      url: that.ourHostCart + '/wxmp/api/cart/getCartItemCount',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader,
        'Cookie': 'SCN=' + scn
      },
      success: function(ress) {
        var num;
        if (ress.data.success == true) {
          num = ress.data.data;
        } else if (ress.data.success == false) {
          num = "x";
        }
        that.setData({
          cartNum: num
        })
      }
    })
  },
  /**点击购物车跳转到购物车 */
  cliCart: function() {
    wx.switchTab({
      url: '../cart/cart'
    })
  }


});