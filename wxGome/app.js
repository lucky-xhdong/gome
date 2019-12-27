//app.js
let { WeToast } = require('wetoast/wetoast.js');
App({
  //生产
  ourHost: "https://wxa.gome.com.cn",
  ourHostCart: "https://wxacart.gome.com.cn",
  ourHistoryHost: "https://search.gome.com.cn",
  apisUrl: "https://apis.gome.com.cn",
  goHeader: 'wxa.gome.com.cn',
  ourPay: 'https://success.gome.com.cn',
  bigData: 'https://bigd.gome.com.cn',
  vipHost: 'https://login.gome.com.cn',
  ssUrl: "https://ss.gome.com.cn",
  tuanUrl: "https://ajaxtuan.gome.com.cn",
  fanliUrl: "https://api-bs.gomeplus.com",
  areaUrl: "https://hd.gome.com.cn",
  cmsUrl: "https://sault.gome.com.cn",
  hdCmsUrl: "https://prom.mobile.gome.com.cn",
  protocol:'https:',
  //uat
  // ourHost:"http://wxa.atguat.com.cn",
  // ourHostCart:"http://wxacart.atguat.com.cn",
  // ourHistoryHost:"http://search.atguat.com.cn",
  // apisUrl:"http://apis.atguat.com.cn",
  // goHeader: 'wxa.gome.com.cn',
  // ourPay:'http://success.atguat.com.cn',
  // bigData:'https://bigd.gome.com.cn',
  // vipHost:'http://login.atguat.com.cn',
  // ssUrl:"http://ss.atguat.com.cn",
  // tuanUrl:"http://ajaxtuan.atguat.com.cn",
  // areaUrl: "http://hd.atguat.com.cn",
  // fanliUrl: "https://api-bs.gomeplus.com",
  // cmsUrl: "http://sault-cms.pre.video.api",
  // cmsUrl:"http://sault-cms.pre.ds.gome.com.cn",
  // hdCmsUrl: "http://prom.mobile.atguat.com.cn",
  // protocol:'http:',
  WeToast,
  onShow: function () {

    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    
    var isScn = wx.getStorageSync('scn');
    if (!isScn) {
      wx.removeStorageSync('firstAuth');
    }
    // }else{
    //   that.commonLogin();

    // }

   

  },
  commonLogin:function(){
    let that=this;
    var detail = wx.getStorageSync('detail');
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: that.vipHost + '/quicklogin/weAppLogin.no',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
              userInfo: JSON.stringify(detail.userInfo),
              rawData: detail.rawData,
              signature: detail.signature,
              encryptedData: detail.encryptedData,
              iv: detail.iv,
              code: res.code
            },
            method: 'POST',
            success: function (data) {
              wx.setStorageSync("code", res.code);
              wx.setStorageSync("userInfo", e.detail.userInfo);
              if (data.data.code == 200) {
                wx.setStorageSync("scn", data.data.SCN);
                wx.setStorageSync('date', Date.now());
                wx.setStorageSync("memberInfo", {
                  gradeNO: data.data.gradeNO || '',
                  gradeName: data.data.gradeName || '',
                  loginName: data.data.loginName || ''
                });
                wx.setStorageSync("detail", e.detail);
              } else if (data.data.code == 105) {
                wx.setStorageSync("scn", data.data.SCN);
                wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                wx.setStorageSync("identifyLevel", data.data.identifyLevel); //控制等级，是否跳过绑定（1直接登录成功，2可以跳过，3不可以）
                wx.setStorageSync("isShowWarning", data.data.isShowWarning); //是否弹提示框，Y表示弹框，N不弹框
                wx.navigateTo({
                  url: '../oldUserAccount/oldUserAccount?code=105',
                })

              } else if (data.data.code == 106) {
                wx.setStorageSync("scn", data.data.SCN);
                wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                wx.setStorageSync("identifyLevel", data.data.identifyLevel); //控制等级，是否跳过绑定（1直接登录成功，2可以跳过，3不可以）
                wx.setStorageSync("isShowWarning", data.data.isShowWarning); //是否弹提示框，Y表示弹框，N不弹框
                wx.navigateTo({
                  url: '../oldUserAccount/oldUserAccount?code=106',
                })
              } else if (data.data.code == 6001) { //表示新用户
                wx.setStorageSync("openId", data.data.snsUserId);
                wx.setStorageSync("dsessionId", data.data.DSESSIONID);
                this.getSkipLoginUrl();
                wx.reLaunch({
                  url: '/pages/accountGuide/accountGuide'
                })

              }else{
                
              }

            },
            fail: function (data) {

            }
          });

        } else {
          console.log('登录失败！' + res.errMsg)
        }

      },
      fail: function (res) {

      }
    });
  },
  fnLogin: function () {
    var that = this;
    var firstAuth = wx.getStorageSync('firstAuth');
    if (!firstAuth) {
      wx.setStorageSync("firstAuth", 1);
    }

    /*---清空四级区域cookie  start---*/
    //firstLogin = 0表示第一次登录，2表示不是第一次登录
    var firstLogin = wx.getStorageSync('firstLogin');
    if (!firstLogin) {
      wx.setStorageSync("firstLogin", 0);
    }
    wx.navigateTo({
      url: '../loginEmpower/loginEmpower',
    })
  },
  getScn: function () {
    var flag;
    var isScn = wx.getStorageSync('scn');  //取到缓存中的scn;
    if (!isScn) {
      this.fnLogin();
    } else {
      flag = isScn;
     
    }
    return flag;
  },
  httpClient(url, callback) {
    wx.request({
      url,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        callback(null, res.data)
      }
      , fail: function (error) {
        callback(error)
      }
    })
  },
  globalData: {
    userInfo: null
  },

  /**
   * @description 确认订单页初始化接口<br />
   * @method initConfirmOrder
   * @param {Object} para 参数集 (必传)
   * @param {String} para.scn 微信小程序所用，从缓存中获取
   * @param {String} para.url 请求接口域名
   * @param {Function} callback 回调函数，用以处理数据
   * @since 2017-01-20
   * @author liusuling
   */
  initConfirmOrder: function (para, callback) {
    var that = this;
    //1.发起ajax请求，获取确认订单页的数据
    wx.request({
      url: para.url + '/api/order/initOrder',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
        'Cookie': 'SCN=' + wx.getStorageSync("scn")
      },
      data: {},
      method: 'GET',
      success: function (res) {
        var data = res.data;
        
        if (data.success) {
          callback(data);
        } else {
          if (data.errCode === '0010010070') {
            wx.showModal({
              showCancel: false,
              content: '已无可购买商品，请返回购物车' || '系统失败，请稍后重试',
              success: function (res) {
                wx.switchTab({
                  url: '../cart/cart'
                })
              }
            })
          }else {
            wx.showToast({
              title: data.errMsg || '对不起！系统繁忙，请稍后重试！',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }

        }

      },
      error: function (res) {
        /*wx.showToast({
            title:'系统失败，请稍后重试',
            duration: 2000
          })*/
      }
    })
  },

  //日期格式化：参数格式1486602000000
  formathhmm: function (time) {
    return this.fromatDate(new Date(time), "hh:mm");
  },
  //日期格式化：参数格式1486602000000
  formatLong: function (time) {
    return this.fromatDate(new Date(time), "yyyy-MM-dd hh:mm:ss");
  },
  //日期格式化：参数格式2017-02-09 13:00:00
  formatmmdd: function (time) {
    var Times = time.split(' ')[0].split('-');
    return Times[1] + '-' + Times[2];
  },

  fromatDate: function (date1, yyyyMMdd) {
    if (typeof date1 !== "object") date1 = new Date(+date1);
    var month = date1.getMonth() + 1
      , date = date1.getDate()
      , hours = date1.getHours()
      , min = date1.getMinutes()
      , sec = date1.getSeconds();

    return yyyyMMdd.replace(/yyyy/g, date1.getFullYear())
      .replace(/yy/g, String(date1.getFullYear()).substr(2, 2))
      .replace(/MM/g, month >= 10 ? month : "0" + month)
      .replace(/M\*/g, month)
      .replace(/dd/g, date >= 10 ? date : "0" + date)
      .replace(/d\*/g, date)
      .replace(/hh/g, hours >= 10 ? hours : "0" + hours)
      .replace(/h\*/g, hours)
      .replace(/m\*/g, min)
      .replace(/mm/g, min >= 10 ? min : "0" + min)
      .replace(/ss/g, sec >= 10 ? sec : "0" + sec)
      .replace(/s\*/g, sec)
  },
  //处理商品
  _goodDeal: function (dsgs) {
    var that = this,
      len = 0,//表示所有商品的数量(区分一件还是多件)
      isY = false,//七天无理由退货 true-不支持 false-支持
      state = {
        noGoods: [],//无货(把无货商品存入数组，存入无货商品的全部信息)
        off: [],//下架(把下架商品存入数组，存入下架商品的全部信息)
        nooff: []
      },//表示无货或下架(无货或者下架需要弹窗提示)
      detail = {},//一个商品的详情信息(只有一件商品时，存入该件商品的全部信息)
      reduce = 0,//已节省(暂时接口无字段),
      mId = [],//美店ID
      proImg = [];//商品所有图片
    proImg = [];//商品所有图片(商品数量大于一件的时候，需要只显示商品图片)
    for (var i = 0; i < dsgs.length; i++) {
      var shop = dsgs[i];
      if (shop.shopId == "GOME") { dsgs[i].shopName = '国美自营'; }
      //处理已节省等字段
      for (var attr in shop.profile) {
        if (attr == "reduce") {
          var reducePri = parseFloat(shop.profile[attr]);
          shop.profile[attr] = reducePri.toFixed(2);
        }
      }

      var allItems = shop.groups;
      for (var j = 0; j < allItems.length; j++) {
        var allItem = allItems[j].commerceItemsGroup;
        for (var m = 0; m < allItem.length; m++) {
          len++;
          proImg.push(allItem[m].itemImageURL);
          //处理价格取两位小数
          var ss = allItem[m].salePrice.toFixed(2);
          allItem[m].salePrice = ss;
          //是否不支持七天无理由退货
          if (!isY) {
            if (allItem[m].serviceTagFlag && allItem[m].serviceTagFlag.length) {
              for (var n = 0; n < allItem[m].serviceTagFlag.length; n++) {
                if (allItem[m].serviceTagFlag[n] == "i7N") {
                  isY = true;
                  break;
                }
              }
            }
          }
          //处理延保里面的价格
          var increPrice = allItem[m].incre;
          if (increPrice) {
            for (var t = 0; t < increPrice.length; t++) {
              for (var attr in increPrice[t]) {
                if (attr == "price") {
                  var increPri = parseFloat(increPrice[t][attr]);
                  increPrice[t][attr] = increPri.toFixed(2);
                }
              }
            }
          }

          //该商品来自的美店的信息
          if (allItem[m].meidianId !== null) {
            mId.push(allItem[m].meidianId);
          }

          //判断无货商品，存入noGoods
          if (allItem[m].state == "NO_GOODS" || allItem[m].state == "OFF") {
            state.nooff.push(allItem[m]);
          }
          if (allItem[m].state == "NO_GOODS") {
            state.noGoods.push(allItem[m]);
          } else if (allItem[m].state == "OFF") {
            state.off.push(allItem[m]);
          }


          //处理促销盒子里的价格
          var promo = allItems[j].profile;
          if (promo) {
            for (var attr in promo) {
              if (attr == "tzSubAmount" || attr == "postC") {
                var num = parseFloat(promo[attr]);
                promo[attr] = num.toFixed(2);
              }
              var coupons = promo.coupons;
              if (attr == "coupons" && coupons && coupons.length > 0) {
                for (var k = 0; k < coupons.length; k++) {
                  for (var attr in coupons[k]) {
                    if (attr == "couponUnitPrice") {
                      var couponPrice = parseFloat(coupons[k][attr]);
                      coupons[k][attr] = couponPrice.toFixed(2);
                    }
                  }
                }
              }
            }
          }

        }
      }
    }
    return {
      dsgs: dsgs,
      len: len,
      isY: isY,
      state: state,
      detail: detail,
      proImg: proImg,
      mId: mId
    }
  },
  //二维码扫描
  QRScan: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var skuId = res.result;
        var idArr = [];

        if (skuId.indexOf('.gomeplus.com/') != -1) {//gomeplus的分享
          skuId = skuId.substring(skuId.indexOf('p-') + 2, skuId.indexOf('.html'));
          idArr = skuId.split('-');
          if (idArr.length && idArr.length == 1) {
            skuId = idArr[0];
          } else {
            skuId = idArr[1];
          }
          wx.request({
            url: that.ourHost + '/skuChange2product',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
              'gome-header': 'wxa.gome.com.cn'
            },
            data: {
              skuId: skuId
            },
            method: 'POST',
            complete: function (ssssres) {
              that.getProd(ssssres.data.productId, skuId);
            }
          });
        } else if (skuId.indexOf('.gome.com.cn/') != -1) {//gome的分享
          var productId;
          skuId = skuId.substring(skuId.indexOf('gome.com.cn/') + 12, skuId.indexOf('.html'));
          idArr = skuId.split('-');
          //console.log(idArr);
          if (skuId.indexOf('product-') != -1) {//m.gome.com.cn的分享
            productId = idArr[1];
            skuId = idArr[2];
          } else {//gome.com.cn的分享
            productId = idArr[0];
            skuId = idArr[1];
          }

          that.getProd(productId, skuId);

        } else if (skuId.indexOf('.gomehigo.hk/') != -1) {//海外购分享
          /*if(skuId.indexOf('p/') != -1){//m.gome.com.cn的分享
              skuId = 'pop' + skuId.substring(skuId.indexOf('p/') + 2,skuId.indexOf('.html'));
              wx.request({
                  url: that.ourHost + '/skuChange2product',
                  header: {
                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                      'gome-header': 'wxa.gome.com.cn'
                  },
                  data: {
                      skuId: skuId
                  },
                  method: 'POST',
                  complete: function (ssssres) {

                      that.getProd(ssssres.data.productId,skuId);

                  }
              });
          }else{//item.gome.com.cn的分享
              skuId = 'pop' + skuId.substring(skuId.indexOf('hk/') + 3,skuId.indexOf('.html'));
              idArr = skuId.split('-');
              wx.request({
                  url: that.ourHost + '/skuChange2product',
                  header: {
                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                      'gome-header': 'wxa.gome.com.cn'
                  },
                  data: {
                      skuId: idArr[1]
                  },
                  method: 'POST',
                  complete: function (ssssres) {

                      that.getProd(idArr[0],idArr[1]);

                  }
              });
            }*/
          wx.showModal({
            title: '扫码提示',
            content: '抱歉，该商品暂不支持在此购买',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //return;
              }
            }
          });
        } else {
          console.log("扫码失败")
          that.showCodeModal();
        }
      },
      fail: (res) => {
        //that.showCodeModal();
      }
    });
  },
  showCodeModal: function () {
    wx.showModal({
      title: '扫码提示',
      content: '抱歉，没有找到对应的商品',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          return;
        }
      }
    });
  },
  getProd: function (productId, skuId) {
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
        'gome-header': 'wxa.gome.com.cn'
      },
      success: function (ress) {
        if (ress.data == '查询数据出错，未查询到数据("message");') {
          that.showCodeModal();
          wx.navigateTo({
            url: '/pages/index/index'
          });
          return;
        } else {
          wx.navigateTo({
            url: '/pages/prod/prod?' + 'productId=' + productId + '&skuId=' + skuId
          });
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //购物车请求地址因站点不同而不同，
  //如https://wxacart.gome.com.cn/wxmp(后面的wxmp会不一样，主站：wxmp，团购：wxmgo，抢购：wxmrb)
  //站点会在确认订单页里存到缓存中
  getCartWebsite: function (host) {
    var website = wx.getStorageSync('website');
    return host + '/' + website;
  },

  //手机号校验，校验成功返回false，失败返回true
  checkPhone: function (str) {
    var reg = /^(1[34578]\d{9})|(19[89]\d{8})|(166\d{8})$/;
    return !(reg.test(str));
  },
  //存储获取当前跳转登陆的路径
  getSkipLoginUrl: function () {
    var pages = getCurrentPages();

    var currentPage = pages[pages.length -1];
    console.log(pages, currentPage);
    var url = currentPage.route;
    var options = currentPage.options;
    var opt = '', loginBackUrl = '';
    if (options) {
      for (var attr in options) {
        opt += attr + '=' + options[attr] + '&';
      }
      opt = opt ? ('?' + opt.slice(0, -1)) : '';
    }


    var loginBackUrl = '/' + url + opt;
    wx.setStorageSync("loginBackUrl", loginBackUrl);
  }

});