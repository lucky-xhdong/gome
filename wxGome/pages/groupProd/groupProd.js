var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
var itemId;
var isClick, productId, skuId, scn, cityCode;
var click = [];
Page({
  data: {
    indicatorDots: false,//是否显示面板指示点
    autoplay: false,//是否自动切换
    interval: 5000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    currentTab: 0,
    arrowright: 'arrowdown',//合并展开
    num: '1',//商品数量
    maxNum: '',//商品最大可选择数量
    isStatus: '1',//1是上架可以购买商品，2是下架，6是商品页面没有
    show: '',
    isServiceTemplate: false,     //判断保修返回的是不是html.false表示不是html
    arrival: '',//配送时间
    address: ["北京", "北京", "朝阳区", "朝外街道"],
    addressId: ["11000000", "11010000", "11010200", "110102002"],
    appr: {},//评价
    prod: {},
    prodStatus: {}, //真划算获取商品状态
    attr: [],//已选参数
    service: {},//有货无货和标签
    salesProperty: [],//参数
    startTime: '',//距离开售还有多久
    endTime: '',//距离结束还有多久
    buyStatus: '',
  },
  ourHost: app.ourHost,
  ourHostCart: app.ourHostCart,
  ssUrl: app.ssUrl,
  tuanUrl: app.tuanUrl,
  goHeader: app.goHeader,
  onLoad: function (options) {
    var that = this;
    scn = app.getScn();
    itemId = options.itemId;
    // itemId = 'Q8800486949';
    wx.getSystemInfo({ //获取系统信息
      success: function (res) {
        that.setData({
          height: res.windowHeight + 'px'  //窗口高度
        })
      }
    });

  },
  onShow: function () {
    var that = this;
    scn = wx.getStorageSync('scn') || '';
    isClick = true;
    /*获取区域ID*/
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
    that.getProdInfo();
  },
  /*获取团购详情页接口*/
  getProdInfo: function () {
    var that = this;
    wx.request({
      url: that.ourHost + '/cheap/detail',
      data: {
        itemId: itemId
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function (res) {
        that.setData({
          prod: res.data,
          salesProperty: res.data.salePropers
        })
        productId = res.data.itemDetailInfo.productId;
        skuId = res.data.itemDetailInfo.skuId;
        that.getAppr();
        if (res.data.salePropers && res.data.salePropers.length > 0) {
          that.productEventInit();
          click = [];
        }
        var imgUrl = that.data.prod.productDetailUrl;
        cityCode = res.data.itemDetailInfo.restrictCityCode;
        that.prodInfoImg(imgUrl);
        that.getTag();

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  /*获取团购商品状态 */
  getProdStatus: function () {
    var that = this;
    wx.request({
      url: that.tuanUrl + '/cheap/getCheapItemsStatus',
      data: {
        itemIds: itemId,
        areaCode: that.data.addressId[1]
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function (res) {
        if (res.data.message == "SUCCESS") {
          that.setData({
            prodStatus: res.data.data[0]
          })
          that.getGrouponTime();
        }


      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  /*获取标签*/
  getTag: function () {
    var that = this;
    var areasId = that.data.addressId;
    wx.request({
      url: that.ssUrl + "/item/v1/grouponDetailAsyn/stockdelivery/" + productId + "/" + skuId + "/N/" + that.data.addressId[2] + "/" + that.data.addressId[3] + "/flag/item",
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function (res) {
        console.log(areasId[1])
        if (cityCode.length > 0 && res.data.result.stock.status == true) {
          res.data.result.stock.status = false;
          for (var i = 0; i < cityCode.length; i++) {
            if (cityCode[i] == areasId[1]) {
              res.data.result.stock.status = true
            }
          }
        }
        that.setData({
          service: res.data.result
        })
        that.getProdStatus();
        if (res.data.result.stock.deliverable && res.data.result.arrival && res.data.result.arrival.indexOf("</span>")) {
          WxParse.wxParse('arrival', 'html', res.data.result.arrival, that, 5);
        }
      },
      fail: function (res) {

      }
    })
  },
  /*商品介绍、规格参数、包装清单、售后服务的tab切换*/
  bottomNavTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /*商品详情*/
  prodInfoImg: function (imgUrl) {
    var that = this;
    wx.request({
      url: 'https:' + imgUrl,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function (res) {
        var list = [];
        var imgList = res.data.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
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
      fail: function () {
      },
      complete: function () {
        // complete
      }
    })
  },
  // 获取日期
  getData: function (timmer) {
    var that = this;
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
    var startTime = M + '月' + d + '日 ' + h + ':' + m;
    that.setData({
      startTime: startTime
    })
  },
  //获取商品倒计时的时间
  getGrouponTime: function () {
    var that = this;
    var startDate = that.data.prod.itemDetailInfo.startDate,
      endDate = that.data.prod.itemDetailInfo.endDate,
      tuanTime = that.data.prodStatus.time,
      tuanStatus = that.data.prodStatus.status;
    var tuanDate;

    /*未开始状态*/
    if (startDate >= tuanTime) {
      if (tuanStatus == "notStarted") {
        that.getData(startDate);
        that.setData({
          buyStatus: '预计' + that.data.startTime + '开售',
          show: 'show'
        })
      }
    }
    /*抢购中*/
    else if (startDate < tuanTime && tuanTime < endDate) {
      /*判定状态*/
      if (tuanStatus == "buying") {
        var areaId = that.data.prod.itemDetailInfo.restrictCityCode;
        if (!that.data.service.stock.status) {
          that.setData({
            buyStatus: '暂不可送',
            show: 'show'
          })
        } else {
          var newTime = parseInt(endDate) - parseInt(tuanTime);
          that.countDown(newTime);
        }
      } else if (tuanStatus == "soldOut") {
        that.setData({
          buyStatus: '已抢光',
          show: 'show'
        })
      } else if (tuanStatus == "areaSoldOut") {
        that.setData({
          buyStatus: '该区域已抢光',
          show: 'show'
        })
      } else {
        that.setData({
          buyStatus: '已结束',
          show: 'show'
        })
      }
    } else {
      // 已结束
      that.setData({
        buyStatus: '已结束',
        show: 'show'
      })
      return;
    }
  },
  countDown: function (time) {
    var that = this;
    if (time == 0) {
      that.getProdInfo();
      return;
    } else {
      var times = setTimeout(function () {
        time = parseInt(time - 100);
        if (time > 100) {
          that.countDownEvent(time);
          that.countDown(time);
        } else {
          clearTimeout(times);
          that.getProdInfo();
        }
      }, 100)
    }
  },
  /*倒计时*/
  countDownEvent: function (newTime) {
    var that = this;

    var d = parseInt(newTime / 86400000),
      h = parseInt((newTime - d * 86400000) / 3600000),
      m = parseInt((newTime - d * 86400000 - h * 3600000) / 60000),
      s = ((newTime - d * 86400000 - h * 3600000 - m * 60000) / 1000).toFixed(1);
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


    if (that.data.prodStatus.status == 'buying' && that.data.prod.itemDetailInfo.groupPrice != 0 && that.data.service.stock.status) {
      if (d > 3) {
        that.setData({
          buyStatus: "距结束还剩三天以上",
          show: 'show'
        })
      } else {
        that.setData({
          buyStatus: "还剩" + d + "天" + h + "小时" + m + "分钟" + s + "秒",
          show: 'show'
        })
      }
    }

  },
  /*商品属性初始化*/
  productEventInit: function () {
    var that = this;
    var sku = that.data.prod.salePropers, //求salesNameNo，即参数值
      attr = [],//当前的主属性下的数组
      arra = [];//匹配到点击当前按钮的相关的数组

    var affixAttr = that.data.prod.properForItem;
    var skuPropers = that.data.prod.skuPropers;
    var index = Object.keys(affixAttr); //返回数组，内容为对象的键名
    for (var a = 0; a < sku.length; a++) {
      var salesName = sku[a].salesNameNo;
      for (var b = 0; b < skuPropers[salesName].length; b++) {
        if (a == 0 & skuPropers[salesName][b].target != 'curr') {
          skuPropers[salesName][b].target = 'set';
        }
        if (skuPropers[salesName][b].target == "curr") {
          attr.push(skuPropers[salesName][b].alt);
        }
      }
    }


    for (var i = 0; i < index.length; i++) {
      index[i] = index[i].split('&');  //二维数组
      if (index[i][0] == attr[0]) {
        for (var h = 1; h < index[i].length; h++) {
          arra.push(index[i][h]);
        }
      }
    }

    //匹配affixAttr第一列主属性的所有相关数组
    for (var z = 0; z < arra.length; z++) {
      for (var x = 0; x < sku.length; x++) {
        var salesName = sku[x].salesNameNo;
        for (var y = 0; y < skuPropers[salesName].length; y++) {
          if (skuPropers[salesName][y].target != 'curr' && skuPropers[salesName][y].alt == arra[z]) {
            skuPropers[salesName][y].target = 'set';
          }
        }
      }
    }

    that.setData({
      attr: attr,
      salesProperty: skuPropers
    })

    // console.log(attr, 'attr-------------', arra, skuPropers);
  },
  /*点击商品属性事件*/
  productEvent: function (e) {
    var that = this;
    var text = e.target.dataset.alt,
      idx = e.target.dataset.parentidx,
      weight = parseInt(e.target.dataset.index);
    var sku = that.data.prod.salePropers;
    var skuPropers = that.data.prod.skuPropers;
    var skuText = [];
    var b, c;
    var arra = [];
    var affixAttr = that.data.prod.properForItem;
    var skuPropers = that.data.prod.skuPropers;
    var index = Object.keys(affixAttr);

    var salesName = sku[idx].salesNameNo;
    if (skuPropers[salesName][weight].target == null || skuPropers[salesName][weight].target == 'curr') {
      return false;
    }


    for (var i = 0; i < sku.length; ++i) {
      var saleName = sku[i].salesNameNo;
      for (var h = 0; h < skuPropers[saleName].length; ++h) {
        if (skuPropers[saleName][h].target == "curr") {
          skuText.push(skuPropers[saleName][h].alt);
          for (var j = 0; j < skuPropers[saleName].length; ++j) {
            if (skuPropers[saleName][j].alt == text) {
              b = i; c = j;
              skuText.splice(-1, 1, text);

            } else {
              if (i == idx && skuPropers[saleName][j].target == 'curr') {
                skuPropers[saleName][j].target = 'set';
              }
            }
          }
        }
      }
    }
    var skuTitle = '';
    for (var a = 0; a < skuText.length; ++a) {
      skuTitle += skuText[a] + '&';
    }
    skuTitle = skuTitle.substring(0, skuTitle.length - 1);

    // 判断
    if (affixAttr[skuTitle]) {
      /*匹配成功*/
      itemId = affixAttr[skuTitle];
      that.getProdInfo();
    } else {
      // 选择第一行时下列参数为空
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
          var saleName = sku[a].salesNameNo;
          for (var b = 0; b < skuPropers[saleName].length; b++) {
            if (a == 0) {
              skuPropers[saleName][b].target = 'set';
            } else {
              skuPropers[saleName][b].target = 'null';
            }
            // skuPropers[saleName][weight].target = 'curr';
            for (var c = 0; c < arra.length; c++) {
              if (skuPropers[saleName][b].alt == arra[c]) {
                skuPropers[saleName][b].target = 'set';
              }
            }
          }
        }

        skuPropers[salesName][weight].target = 'curr';
        that.setData({
          salesProperty: skuPropers
        })
        click = [];
        click[0] = text;
      } else {
        //选择其他行参数 
        if (skuPropers[salesName][weight].target != 'curr') {
          skuPropers[salesName][weight].target = 'curr';
          var saleName = sku[0].salesNameNo;
          for (var a = 0; a < skuPropers[saleName].length; a++) {
            if (skuPropers[saleName][a].target == 'curr' && click[0] != skuPropers[saleName][a].alt) {
              click.push(skuPropers[saleName][a].alt);
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
              var sales = sku[b].salesNameNo;
              for (var d = 0; d < skuPropers[sales].length; d++) {
                if (skuPropers[sales][d].alt == index[c][b]) {
                  skuPropers[sales][d].target = 'set';
                  if (skuPropers[sales][d].alt == click[b]) {
                    skuPropers[sales][d].target = 'curr';
                  }
                } else {
                  if (b != 0) {
                    skuPropers[sales][d].target = null;
                  } else {
                    skuPropers[sales][d].target = 'set';
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
            itemId = affixAttr[skuTitle];
            that.getProdInfo();
          } else {
            that.setData({
              salesProperty: skuPropers
            })
          }

          // console.log(arra, skuPropers, '第二行');

        }
      }
    }
  },
  /*已选标签闭合 */
  closeParameter: function (e) {
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
  reduceNum: function (e) {
    var that = this;
    var num = this.data.num;
    if (num > 1) {
      that.setData({
        num: num - 1
      })
    } else {
      that.setData({
        num: 1
      })

    }
  },
  /*选择数量*/
  changeNum: function (e) {
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
        num: 1
      })
    } else if (num > maxNum) {
      that.setData({
        num: maxNum
      })
    } else {
      that.setData({
        num: num
      })
    }

  },
  /*选择数量-加*/
  addNum: function (e) {
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
        num: num + 1
      })
    } else {
      that.setData({
        num: maxNum
      })
    }
  },
  /*评价*/
  getAppr: function () {
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
      success: function (res) {
        that.setData({
          appr: res.data
        })
      },
      fail: function () {

      },
      complete: function () {

      }
    })
  },
  /*立即抢购*/
  buyNowEvent: function (e) {
    var that = this;
    if (!scn) {
      scn = app.getScn();
    }else{
      var num = that.data.num;
      if (isClick) {
        isClick = false;
        wx.request({
          url: that.ourHostCart + '/wxmrb/api/cart/addToCart',
          data: {
            type: 7,
            pid: productId,
            sid: skuId,
            spid: itemId
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Cookie': 'SCN=' + scn,
            'gome-header': that.goHeader
          },
          success: function (res) {
            that.checkOut();
          },
          fail: function () {
          },
          complete: function () {
            // complete
          }
        })
      }
    }
    
    
  },
  checkOut: function () {
    var that = this;
    var num = that.data.num;
    wx.request({
      url: that.ourHostCart + '/wxmrb/api/checkout/checkout',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': 'SCN=' + scn,
        'gome-header': that.goHeader
      },
      success: function (res) {
        // success
        if (res.data.success == true) {
          wx.navigateTo({
            url: '../confirmOrder/confirmOrder?pid=' + productId + '&sid=' + skuId + '&pcount=' + num + '&wxm=wxmrb'
          });
          isClick = false;
        } else {
          isClick = true;
          if (res.data.errCode == '0010010110') {
            wx.showToast({
              title: '该商品已抢光',
              icon: 'loading',
              duration: 1000
            });
          } else {
            if(!scn){
              app.loginAginWarn();
            }else{
              wx.showToast({
                title: res.data.errMsg ? res.data.errMsg : '立即购买凉快去啦！',
                icon: 'loading',
                duration: 1000
              });
            }
            
          }
          that.getProdInfo();
        }
      },
      fail: function () {

      }
    })
  },
  /*分享*/
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '国美商城-' + that.data.prod.itemDetailInfo.itemName,
      path: '/pages/groupProd/groupProd?itemId=' + itemId
    }

  }
})