var app = getApp();
var goHeader = app.goHeader;
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
Page({
  data: {
    information: {},//后台传过来的数据放在此字段里
    addressInfo: {},//配送地址信息
    goodList: [],//商品清单、赠品、返券信息
    returnedCouponVOs: [],//返券信息
    reduce: 0,//促销优惠金额，对应的是PC端的已节省
    deliveryMethod: {},//配送方式
    ivh: {},//发票信息
    vrbsos: {},//券信息
    checkoutSummary: {},//商品总计信息处理
    payInfor: {},
    defaultImg: '../../images/default1.jpg',
    loading: false,
    loadingInit: true,//初始化的loding
    productList: {},//新的商品清单
    state: {},
    hasCouponList: true,//表示是否有优惠券列表展示，true表示有，false表示没有,
    freightState: false,
    freight: [],
    noProdStatus: true,//不支持购买商品是否展示
    noList: [],//不能提交的商品列表
    backSkip: false,//防止支付成功后回到确认订单页再次请求接口报错
    protocol: app.protocol
  },

  _ourHost: app.ourHostCart,

  _ourPay: app.ourPay,

  _scn: '',

  _isPayOnOff: false,//不允许客户一直点击支付按钮，只有失败，或异常操作等才能再次点击

  onLoad: function (options) {
    /**
     * options.wxm用来区分不同的站点,从详情页跳转时带的参数
     * 从主站过来的的是 不传此参数
     * 团购：wxmgo，抢购：wxmrb
     */
     var wxmField = options.wxm;
    var website = 'wxmp'; //用以表示不同的站点，默认是主站
    var hasCouponList = true;

    if (wxmField) {
      website = wxmField;
      hasCouponList = false;
    }
    websiteUrl = this._ourHost + '/' + website;

    this.setData({
      hasCouponList: hasCouponList
    });
    /**
     * 存取不同的站点，以便在确认订单页下的其他子页面使用
     * 确认订单页下的子页面有：
     *  地址：address editAdress newAddress
     *  商品清单：productList
     *  发票：invoice
     *  配送方式：delivery
     *  优惠券：chooseCoupon 以及他下面的 couponUseRule，抢购没有没有优惠券，所以请求站点的地址不需要修改
     */
     wx.setStorageSync("website", website);
    // this.initNoListEvent();
  },

  onShow: function (options) {//地址栏传递的参数在options里
    var that = this;
      if(that.data.backSkip) {return false;}
      that.setData({
        backSkip: false
      })
      that._isPayOnOff = false;
      that.init();

    },

  /**
   * @description 初事化<br />
   * @method init
   * @param {Object} opt 参数集 (必传)
   */
   init: function () {
   
    var that = this;
    that.setData({
      loading: true
    })
    that._scn = app.getScn();
    var para = {
      url: websiteUrl,
      scn: that._scn
    };

    //2.调用初始化ajax，获取数据，执行回调函数
    app.initConfirmOrder(para, that._resetConfirmOrderData);

  },

  /**
   * @method _resetConfirmOrderData
   * @param {Object} opt 参数集 (必传)，后台传递确认订单页的数据
   */
   _resetConfirmOrderData: function (opt) {
    var that = this;
    // 放开
    that.setData({
      information: opt,
      loading: false,
      loadingInit: false
    })

    that.initDeal();//设置数据处理页面
  },
  /**
   * @description 初事化数据后的处理页面结构<br />
   */
   initDeal: function () {
    var that = this;

    //1.配送地址的展示和逻辑处理
    that._deliveryAddress();

    //2.商品清单、返券、赠品、配送时间、配送方式信息的展示和逻辑处理
    that._goodOrDeliveryList();

    //3.调用发票处理函数
    that._invoice();

    //4.优惠券的展示和逻辑处理
    that._discountCoupon();

    //5.商品总计信息函数处理
    that._sellingTotal();

    //6.支付方式调用
    that._payInfor();

    //7.展示运费信息 
    that._freightData();

  },
  /**
   * @description 展示运费信息,将运费转化为小数点后两位
   * @method _freightData
   * @since 2017-12-20
   * @author lily
   */
   _freightData: function () {
    var that = this,
      freight = that.data.information.data.cProfile.freightProfileVO;//获取地址信息
      freight.freight = (freight.freight).toFixed(2);
      if (freight.freightForShopVOs) {
        for (var i = 0; i < freight.freightForShopVOs.length; i++) {
          if (freight.freightForShopVOs[i].freightForGroupVOs && freight.freightForShopVOs[i].freightForGroupVOs.length > 0) {
            for (var j = 0; j < freight.freightForShopVOs[i].freightForGroupVOs.length; j++) {
              var newF = freight.freightForShopVOs[i].freightForGroupVOs[j].freight;
              freight.freightForShopVOs[i].freightForGroupVOs[j].freight = parseFloat(newF).toFixed(2);
            }
          }

        }
      }
      that.setData({
        freight: freight
      })
    },

  /**
   * @description 配送地址的展示和逻辑处理<br />
   * @method _deliveryAddress
   */
   _deliveryAddress: function () {

    //参考购物车代码cart-node\cart\js\js\cart下的cart2.js
    var that = this,
      addressInfo = {},//用以存放要显示的地址信息
      cis = that.data.information.data.consig,//获取地址信息
      consigneeInfos = cis.consigneeInfos,
      num = cis.consigneeCount;//获取配送地址数量

    /**
     * 1.如果普通配送地址数量为0则显示"请填写收货地址"，否则显示收货地址
     * 2.如果显示收货地址，则需判断具体显示哪个地址
     *   1）如果地址列表里的selected值为真表示当前列表数据为选择的地址
     * 3.每次地址变化后，当前所在地区会自动变化价格
     * 4.判断当前所在区域是否有货、下架等？
     */

    //1.如果普通配送地址数量为0则显示“请填写收货地址”，否则显示收货地址
    if (num == 0) {
      that.setData({
        addressInfo: {
          num: num
        }
      })

      return false;
    }

    //2.如果地址列表里的selected值为真表示当前列表数据为选择的地址
    for (var i = 0; i < num; i++) {
      if (consigneeInfos[i].selected) {
        addressInfo = consigneeInfos[i];
        break;
      }
    }

    //3.赋值操作，渲染页面
    addressInfo.num = num;
    that.setData({
      addressInfo: addressInfo
    })
  },

  /**
   * @description 商品清单、返券、赠品、配送时间、配送方式信息的展示和逻辑处理<br />
   * @method _goodOrDeliveryList
   */
   _goodOrDeliveryList: function () {

    //参考购物车代码cart-node\cart\js\template\shopping\listOfItem的listOfItem_method.tpl

    //赋值
    var that = this,
      dsgs = that.data.information.data.shops;//获取信息

    wx.setStorageSync("dsgs", dsgs);//把商品信息存入缓存，供商品清单页使用

    //调用商品清单、返券、赠品处理函数
    that._goodList(dsgs);


    //3.调用配送处理函数
    that._deliveryMethod(dsgs);

  },

  /**
   * @description 商品清单信息、返券、赠品的展示和逻辑处理以及调用订单异常处理<br />
   * @method _goodList
   * @param {Array} dsgs 表示商品清单
   */
   _goodList: function (dsgs) {
    /* var that = this,
        allItems = dsgs.allItems,
        returnedCouponVOs = allItems[0].returnedCouponVOs,//返券信息
        dealReturnedCouponVOs = [],//处理页面展示的返券信息
        reduce = ( Number(dsgs.reduce) == 0 ? 0 :  dsgs.reduce.toFixed(2) ),
        zpCount = Number(dsgs.zpCount),
        reduceTip = '',//已节省和赠品提示
        labelJson = {//各种券代码对应的汉字描述
            'BLUECOUPON': '蓝券',
            'REDCOUPON': '红券',
            'OFFLINECOUPON': '美券',
            'SHOPCOUPON': '店铺券',
            'POINT': '积分',
            'GOU_WU_COUPON': '店铺平台券',
            'SHI_WU': '实物',
            'G_D': '线下门店促销赠美豆',
            'UNKNOWN': '未知的券类型'
        };

        if(reduce) {
            reduceTip = '已节省¥'+reduce;
        }
        if(zpCount) {
            if(reduce) {
                reduceTip += '，';
            }
             reduceTip += '赠品×'+zpCount;
        }
        
    for(var i=0; i<returnedCouponVOs.length; i++) {
        dealReturnedCouponVOs.push(returnedCouponVOs[i]);
        dealReturnedCouponVOs[i].label = labelJson[returnedCouponVOs[i].couponType];
        dealReturnedCouponVOs[i].faceValue = Number(returnedCouponVOs[i].faceValue).toFixed(2);
    }

    //1.直接赋值，展示商品清单、返券、赠品
    that.setData({
        goodList: allItems,
        returnedCouponVOs: dealReturnedCouponVOs,
        reduceTip: reduceTip,
        salePrice: allItems[0].items[0].salePrice.toFixed(2)   
      }) */


      var that = this;
    var dsgs = that.data.information.data.shops;//获取信息
    var aa = app._goodDeal(dsgs);

    //  if(aa.len == 1) {
    //     aa.detail = dsgs[0].groups[0].commerceItemsGroup[0];
    //     // console.log(aa.detail.salePrice)
    //     // var ss = aa.detail.salePrice.toFixed(2);
    //     // aa.detail.salePrice = ss;
    //     //reduce = 
    // }
    //直接赋值，展示商品清单
    that.setData({
      productList: {
        len: aa.len,
        isY: aa.isY,
        proImg: aa.proImg,
        detail: dsgs[0].groups[0].commerceItemsGroup[0]
      },
      state: aa.state
    })

  },
  /*
      * 调用订单异常处理 state表示商品库存的几种情况
      * OFF:表示已下架
      * NO_GOODS：表示无货
      * INVENTORY_TENSION：库存紧张
      * DELIVERY_NOT_SUPPORTED：该区域暂不支持配送
      * 已下架、无货、该区域暂不支持配送都需提示且不能生产订单,订单确认页只有无货和有货两种情况
      */

      _nooff: function () {
        var that = this;
    if (that.data.state.noGoods.length > 0 && that.data.state.off.length > 0) {//无货和下架同时存在
      that._abnormalOrdersTip('', '部分无货');
    } else if (that.data.state.noGoods.length === 0 && that.data.state.off.length > 0) {//无货不存在
      that._abnormalOrdersTip('', '部分下架');
    } else if (that.data.state.off.length === 0 && that.data.state.noGoods.length > 0) {//下架不存在
      that._abnormalOrdersTip('', '部分无货');
    }
  },
  /**
   * @description 配送方式展示和逻辑处理，以及处理支付初始和展示信息<br />
   * @method _deliveryMethod
   * @param {Array} dsgs 表示商品清单
   */
   _deliveryMethod: function (dsgs) {
    var that = this;
    var expressLabels = {//code码对应的汉字描述
      "Gome Express": "国美快递",
      "Gome Picking Up": "门店自提",
      "EMS": "EMS快递",
      "Express": "普通快递"
    };
    var expressJson = {};//存放所有不重复配送方式(code)
    var expressStr = ""; //存放最终显示的配送方式字符串
    var timeLabels = {//普通配送时间code码对应的汉字描述
      "WEEKDAY": "工作日送货",
      "ALL": "时间不限",
      "WEEKEND": "双休/节假日送货"
    };
    var timesJson = {};//存放配送时间(code)
    var timeP = "";//存放最终显示的配送时间字符串

    for (var i = 0; i < dsgs.length; i++) {
      var shippinginfo = dsgs[i].shippinginfo;
      for (var j = 0; j < shippinginfo.length; j++) {
        var express = shippinginfo[j].express;//配送方式
        var times = dsgs[i].groups[j].commerceItemsGroup[0].times;//配送时间
        /*
         * 获取配送方式，配送方式可能存在国美配送、门店自提、EMS快递、普通快递
         * 需要循环逐一判断是选择了哪种配送方式，通过selected
         */
         for (var m = 0; m < express.length; m++) {
          if (express[m].selected) {
            if (!expressJson[express[m].code]) {
              expressJson[express[m].code] = express[m].code;
            }
          }
        }

        /*
        *日期：2017.8.28
        *更新后的配送时间
        * */
        if (times.code && times.code != null) {
          // 普通配送时间,判断普通配送时间的字段里是否有selected=true,如果有获取对应的配送时间，并转换格式
          if (times.code == "DAY") {
            var items = times.items;
            for (var o = 0; o < items.length; o++) {
              if (items[o].selected) {
                timesJson.DAY = items[o].code;
                break;
              }
            }
          }
          if (times.code == "SLOT") {
            //运能
            var concrete = times.concrete;
            for (var p = 0; p < concrete.length; p++) {
              for (var q = 0; q < concrete[p].items.length; q++) {
                var item = concrete[p].items[q];
                if (item.selected) {
                  //转换格式需要对时间进行处理
                  timesJson.SLOT = app.formatmmdd(concrete[p].yd) + ' ' + concrete[p].label + ' ' + app.formathhmm(item.startTime) + '-' + app.formathhmm(item.endTime);
                  break;
                }
              }
            }

          }
        }

        /*
        *日期：2017.8.28 之前所使用的
        * 获取配送时间，配送时间可能存在的情况有三种，普通配送时间、计时达、限时达
        * 需要逐一判断是选择了哪种配送时间，通过selected
        */
        /*for(var n=0;n<times.length;n++){
            if(times[n].code && times[n].code!=null){
                // 普通配送时间,判断普通配送时间的字段里是否有selected=true,如果有获取对应的配送时间，并转换格式
                if(times[n].code=="DAY"){
                    var items = times[n].items;
                    for(var o=0;o<items.length;o++){
                        if(items[o].selected){
                            timesJson.DAY = items[o].code;
                            break;
                        }
                    }
                }else if(times[n].code=="XSD"){//限时达,判断限时达的字段里是否有selected=true,如果有获取对应的配送时间，并转换格式
                    var concrete = times[n].concrete;
                    for(var p=0; p<concrete.length; p++) {
                        for(var q=0; q<concrete[p].items.length; q++) {
                            var item = concrete[p].items[q];
                            if(item.selected) {
                                //转换格式需要对时间进行处理
                                timesJson.XSD = app.formatmmdd(concrete[p].yd)+' '+ concrete[p].label + ' ' + app.formathhmm(item.startTime)+'-'+app.formathhmm(item.endTime);
                                break;
                            }
                        }
                    }

                }else if(times[n].code=="JSD"){//计时达,判断计时达的字段里是否有selected=true,如果有获取对应的配送时间，并转换格式

                }
            }
          }*/
        }
      }

    //配送快递类型方式处理(把code转化为汉字，并通过"+"号连接，去掉最后一个"+"号)
    for (var attr in expressJson) {
      expressJson[attr] = expressLabels[attr];
      expressStr += expressJson[attr] + '+';
    }
    expressStr = expressStr.slice(0, -1);
    //普通配送时间
    if (timesJson.DAY) {
      timeP = timeLabels[timesJson.DAY];
    }
    if (timesJson.SLOT) {
      timeP = timesJson.SLOT;
    }

    //配送时间(如果配送时间中有限时达，则优先限时限时达)
    /*if(timesJson.XSD){
        time = timesJson.XSD;
    }else if(timesJson.DAY){
        time = timeLabels[timesJson.DAY];
      }*/

      that.setData({
        deliveryMethod: {
          expressStr: expressStr,
          time: timeP
        }
      });

    //     //3.2 计时达,判断计时达的字段里是否有selected=true,如果有获取对应的配送时间，并转换格式
    //     if(times[i].code=="JSD") {
    //         if(times[i].selected) {
    //             if(times[i].day == 0) {
    //                 time = '预计将在今天' +times[i].hours+ '前送达';
    //             }else if(times[i].day == 1) {
    //                 time = '预计将在明天' +times[i].hours+ '前送达';
    //             }
    //             break;
    //         }
    //     }

  },

  /**
   * @description 发票信息的展示和逻辑处理<br />
   * @method _invoice
   */
   _invoice: function () {

    //参考购物车代码cart-node\cart\js\template\shopping\invoice的invoice_main.tpl和invoice_modify.tpl

    //1.变量
    var that = this,
      addressInfo = {},//用以存放要显示的地址信息
      ivh = that.data.information.data.invoices,//获取发票信息
      dealIvh = {};//发票页面使用数据

    //2.处理发票信息，过滤不需要的子段
    for (var attr in ivh) {
      if (attr != 'invoices') { dealIvh[attr] = ivh[attr]; }
    }

    /*
     * 3.默认发票内容的显示数据
     * 3.1 如果invoiceNeedType为N默认显示“不开发票”
     * 3.2 如果invoiceNeedType为Y或者YN，则默认显示开具体的发票，可以通过selected是否true来判断
     */
     if (dealIvh.invoiceNeedType != 'N') {
      for (var i = 0; i < ivh.invoices.length; i++) {
        var item = ivh.invoices[i];

        //发票类型
        if (item.invoiceType.selected) {
          dealIvh.invoiceType = item.invoiceType.label;

          //抬头内容
          for (var m = 0; m < item.headTypes.length; m++) {
            if (item.headTypes[m].selected) {
              dealIvh.headType = item.headTypes[m].content;
              break;
            }
          }

          //发票内容
          for (var n = 0; n < item.invoiceContentTypes.length; n++) {
            if (item.invoiceContentTypes[n].selected) {
              dealIvh.invoiceContentType = item.invoiceContentTypes[n].label;
              break;
            }
          }

          break;

        }
      }
    }

    //4.赋值操作，渲染页面
    that.setData({
      ivh: dealIvh
    })
  },

  /**
   * @description 优惠券的展示和逻辑处理<br />
   * @method _discountCoupon
   */
   _discountCoupon: function () {

    //变量
    var that = this,
      vrbsos = that.data.information.data.coupons.vrbsos,//购物券信息
      shops = that.data.information.data.shops,
      RGBSTip = '',//优惠券信息提示
      FeeTip = '',//运费券提示语
     
      dealCvs = {//展示优惠券信息字段
        reduceAmount: vrbsos.reduceAmount ? vrbsos.reduceAmount.toFixed(2) : 0,//所有已用卡券抵用金额
        reduceRGBSAmount: vrbsos.reduceRGBSAmount ? vrbsos.reduceRGBSAmount.toFixed(2) : 0,//除运费券外的已用卡券抵用金额
        usedRGBSNum: vrbsos.usedRGBSNum || 0,//除运费券外的已用卡券数量
        availableRGBSNum: vrbsos.availableRGBSNum || 0,//除了运费券的优惠券可用数量（不包含已用）
        reduceFeeAmount: vrbsos.reduceFeeAmount ? vrbsos.reduceFeeAmount.toFixed(2) : 0,//运费券抵用金额
        usedFeeNum: vrbsos.usedFeeNum || 0,//已用运费券数
        availableFeeNum: vrbsos.availableFeeNum || 0//可用运费券数（不包含已用）
      },
      
      allAvailableRGBSNum = dealCvs.usedRGBSNum + dealCvs.availableRGBSNum,
      allAvailableFeeNum = dealCvs.usedFeeNum + dealCvs.availableFeeNum;

     vrbsos.gomehaulage = 0;

     
      for (let i=0; i<shops.length; i++) {
        let shopId = shops[i].shopId;
        if (shopId == 'GOME' || shopId == 'guomeidianqi' || shopId == 'dazhongdianqi' || shopId == 'yongledianqi' || shopId == 'beifangdianqi' || shopId == 'heitianedianqi' || shopId == 'tengdadianqi' || shopId == 'fengxingdianqi' || shopId == 'sanxingdianqi' ) {
          vrbsos.gomehaulage += shops[i].profile.freight.total;
          break;
        }
      }

      if(allAvailableFeeNum) {
        if(dealCvs.usedFeeNum) {
          FeeTip = `已选${dealCvs.usedFeeNum}张运费券，-￥${dealCvs.reduceFeeAmount}`;
        }else if(dealCvs.availableFeeNum) {
          FeeTip = `${dealCvs.availableFeeNum}张运费券可用`;
        }
      }

      if(allAvailableRGBSNum) {
        if(dealCvs.usedRGBSNum) {
          RGBSTip = `已选${dealCvs.usedRGBSNum}张优惠券，-￥${dealCvs.reduceRGBSAmount}`;
        }else if(dealCvs.availableRGBSNum && !FeeTip) {
          RGBSTip = '请选择';
        }
      }
     if (!allAvailableRGBSNum && !allAvailableFeeNum && !dealCvs.usedRGBSNum && !dealCvs.usedFeeNum) {
        RGBSTip = '无可用优惠券';
      }

      dealCvs.RGBSTip = RGBSTip;
      dealCvs.FeeTip = FeeTip;

      
    //把优惠券信息存入缓存，供选择优惠券页面使用
    wx.setStorageSync('vrbsos', vrbsos);
    
    that.setData({
      vrbsos: dealCvs
    })
  },

  /**
   * @description 商品的展示和逻辑处理<br />
   * @method _sellingTotal
   */
   _sellingTotal: function () {

    //参考购物车代码\cart-node\cart\js\template\shopping\commitOrder下的commitOrder_main.tpl

    //1.变量
    var that = this,
      checkoutSummary = that.data.information.data.cProfile,//商品总计信息
      DealCheckoutSummary = {};

    //2.处理小时点，保留两位小数，amount：商品金额，applyAmount：实付金额，coupon：优惠券总金额，haulage：运费
    for (var attr in checkoutSummary) {

      if (attr == 'amount' || attr == 'applyAmount' || attr == 'coupon' || attr == 'haulage' || attr == 'reduceHaulage') {
        DealCheckoutSummary[attr] = checkoutSummary[attr].toFixed(2);
      } else {
        DealCheckoutSummary[attr] = checkoutSummary[attr];
      }
    }

    //3.赋值操作，渲染页面
    that.setData({
      checkoutSummary: DealCheckoutSummary
    })

  },


  /**
   * @description 订单异常处理提示<br />
   * @method _abnormalOrdersTip
   * @param {String} name 商品名称
   * @param {String} state 提示是无货还是下架
   */
   _abnormalOrdersTip: function (name, stateName) {
    var that = this;
    //1.如果出现订单异常，则弹窗提示
    if (stateName === "无货") {
      wx.showModal({
        title: '以下商品暂时无货!',
        content: name,
        cancelText: "去购物车",
        confirmText: '修改地址',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../address/address'
            })
          } else {
            wx.switchTab({
              url: '../cart/cart'
            })
          }
        }
      })
    } else if (stateName === "部分无货") {
      wx.showModal({
        title: '部分商品暂时无货!',
        content: name,
        cancelText: "去购物车",
        confirmText: '修改地址',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../address/address'
            })
          } else {
            wx.switchTab({
              url: '../cart/cart'
            })
          }
        }
      })
    } else if (stateName === "部分下架") {
      wx.showModal({
        title: '部分商品已下架!',
        content: name,
        cancelText: "",
        confirmText: '去购物车',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../cart/cart'
            })
          }
        }
      })
    } else if (stateName === "下架") {
      wx.showModal({
        title: '以下商品已下架!',
        content: name,
        cancelText: "",
        confirmText: '去购物车',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../cart/cart'
            })
          }
        }
      })
    }
  },



  /**
   * @description 处理支付初始和展示信息<br />
   * @method _payInfor
   */
   _payInfor: function (payments) {

    //1.配置变量信息
    var that = this,
      paymentMethods = that.data.information.data.pg.paymentMethods,//支付方式
      payInfor = {},//展示支付信息字段
      payLabel = {
        'onlinePayment': '微信支付',
        'cashOnDelivery': '货到付款'
      };
      payInfor.paymentMethods = paymentMethods;

    //2.寻找到默认的支付方式和修改所有支付方式
    for (var i = 0; i < paymentMethods.length; i++) {
      payInfor.paymentMethods[i].label = payLabel[paymentMethods[i].c]
      // if(paymentMethods[i].selected) {
      //     payInfor.paymentMethod = paymentMethods[i].c;
      // }
    }

    //3.赋值操作，渲染页面
    that.setData({

      payInfor: payInfor
    })
  },

  /**
   * @description 点击支付<br />
   * @method bindPayMents
   */
   bindPayMents: function (e) {
    //1.配置变量信息
    var that = this,
    way = e.target.dataset.pay;//付款方式
    if (that.data.loading) {
      return false;
    }
    that._initPay(way);

    },


    _initPay: function (way) {
      var that = this;
    //判断是否有配送地址，如果没有配送地址则需弹窗提示
    if (that.data.information.data.consig.consigneeCount == 0) {
      wx.showModal({
        content: '请填写收货人信息',
        confirmText: '修改地址',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../newAddress/newAddress'
            })
          }
        }
      })
      return false;
    }
    // if (that.data.state.nooff.length > 0) {
    //   that._nooff();
    //   return false;
    // }

    //2.判断是微信付款还是货到付款，通过way变量
    that._diffPayWay(way);
  },

  /**
   * @description 不同支付方式的处理<br />
   * @method _diffPayWay
   * @param {String} way 区分哪种付款方式
   */
   _diffPayWay: function (way) {
    var that = this;

    if (that._isPayOnOff) { return false; }//不允许用户重复点击支付按钮，调用ajax
    that._isPayOnOff = true;

    //1.判断是微信付款还是货到付款，通过pay变量
    if (way == 'cashOnDelivery') {//表示货到付款

      //1.1 显示模态窗,判断是何种方式支付，是现金还是POS机，或者是取消，如果取消则只修改支付方式，不生成订单
      wx.showActionSheet({
        itemList: ['现金支付', 'POS刷卡支付'],
        success: function (res) {
          if (res.cancel) {
            that._isPayOnOff = false;
            return false;
          }
          var code = (res.tapIndex == 0 ? 'cash' : 'pos');//cash表示“现金支付”，pos表示“POS刷卡支付”
          //2.1.1 货到付款支付
          that._payCommit({
            dt: code,
            type: 0
          });

        },
        fail: function (res) {
          that._isPayOnOff = false;
        }
      })

    } else {//表示微信支付

      //1.2 微信支付
      that._payCommit({
        type: 1
      });
    }
  },


  _payCommit: function (para) {
    var that = this;
    that._scn = app.getScn();
    if(!that._scn) {
      return false;
    }
    wx.request({
      url: websiteUrl + '/api/checkout/commit',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader,
        'Cookie': 'SCN=' + that._scn
      },
      data: para,
      method: 'GET',
      success: function (res) {
        // that._payResult(res.data, para.type);
        that._isPayOnOff = true;
        if (res.data.success) {
          if (para.type == 1) {//微信支付
            that._weiXinPay(res.data.data.cartId);
          } else {//货到付款
            wx.redirectTo({
              url: '../paySuccess/paySuccess'
            })
          }
        } else {
          that._isPayOnOff = false;
          if ( res.data.errCode === "0010222222") {
            that.setData({
              noList: res.data.data,
              noProdStatus:false
            })

          }else {
            wx.showToast({
              title: '对不起！系统繁忙，请稍后重试！',
              icon: 'none',
              duration: 2000
            })
          
          }
        }

      },
      error: function (res) {
        that._isPayOnOff = false;
        wx.showToast({
          title: '对不起！系统繁忙，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * @description 支付结果的处理<br />
   * @method _payResult
   * @param {Object} data 后台传过来的数据
   * @param {String} way 支付方式，有有两种：微信支付/onlinePayment,货到付款/cashOnDelivery。（必传）
   */
   _payResult: function (data, type) {
    var that = this;

    if (data.success) {

      if (type == 1) {//微信支付
        that._weiXinPay(data.data.cartId);
      } else {//货到付款
        wx.redirectTo({
          url: '../paySuccess/paySuccess'
        })
      }
    } else {
      that._isPayOnOff = false;
      if (!data.status) {
        if (data.errCode === "0010222222") {
          that.setData({
            noList: data.data,
            noProdStatus: false
          })

        }
      }
    }
    // } else {
    //   that._isPayOnOff = false;
    //   if (!data.status) {
    //     if (data.errCode === "0010070050") {//订单信息发生变化
    //       wx.showModal({
    //         title: "订单信息变化，请返回购物车",
    //         content: '',
    //         confirmText: '去购物车',
    //         cancelText: "",
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.switchTab({
    //               url: '../cart/cart'
    //             })
    //           }
    //         }
    //       })
    //     } else if (data.errCode === "0010360050") {
    //       wx.showToast({
    //         title: "部分商品正在预约中，暂不可购买",
    //         duration: 2000
    //       })
    //     } else if (data.errCode === "0010360040") {
    //       wx.showToast({
    //         title: "部分商品正在预约中，请返回购物车修改",
    //         duration: 2000
    //       })
    //     } else if (data.errCode === "0010010200") {
    //       wx.switchTab({
    //         url: '../cart/cart'
    //       })
    //     } else {
    //       wx.showToast({
    //         title: data.errMsg || "对不起！系统繁忙，请稍后重试！",
    //         duration: 2000
    //       })
    //     }
    //   } else {
    //     // var name = data.data[0].displayName;
    //     if (data.status == 'NE_P') {//库存不足
    //       that._abnormalOrdersTip('', '部分无货');
    //     } else if (data.status == 'NE_G') {// 赠品不足
    //       wx.showModal({
    //         title: '以下赠品不足',
    //         content: '',
    //         confirmText: '继续支付',
    //         cancelText: "去购物车",
    //         success: function (res) {
    //           if (res.confirm) {
    //             that._payCommit({
    //               type: 1
    //             });
    //           } else {
    //             wx.switchTab({
    //               url: '../cart/cart'
    //             })
    //           }
    //         }
    //       })
    //     } else if (data.status == 'GO_CART') {
    //       wx.switchTab({
    //         url: '../cart/cart'
    //       })
    //     } else if (data.status == 'CLICK_GO_CART' || data.status == 'GO_LOGIN') {
    //       wx.showModal({
    //         title: '',
    //         content: '',
    //         confirmText: '去购物车',
    //         success: function (res) {
    //           if (res.confirm) {
    //             wx.switchTab({
    //               url: '../cart/cart'
    //             })
    //           }
    //         }
    //       })
    //     } else if (data.status == 'GO_SKU_PAGE') {
    //       wx.navigateTo({
    //         url: '../prod/prod'
    //       })
    //     }
    //   }
    // }
  },

  /**
   * @description 微信支付<br />
   * @method _weiXinPay
   * @param {String} cartId 订单编号。（必传）
   */
   _weiXinPay: function (cartId) {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        var model = res.model;

        wx.login({
          success: function (ress) {
            if (ress.code) {
              //发起网络请求
              wx.request({
                url: that._ourPay + '/api/wechat/cashier/pay',
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                  'gome-header': goHeader,
                  'Cookie': 'SCN=' + that._scn
                },
                data: {
                  type: 0,
                  orderId: cartId,
                  msv: model,
                  code: ress.code
                },
                method: 'GET',
                success: function (res) {
                  var data = res.data;
                  if (data != null && data.success) {
                    //调起微信支付控件
                    wx.requestPayment({
                      'timeStamp': data.data.timeStamp,
                      'nonceStr': data.data.nonceStr,
                      'package': data.data.package,
                      'signType': data.data.signType,
                      'paySign': data.data.paySign,
                      'success': function (res) {
                        that.setData({
                          backSkip: true
                        })
                        wx.redirectTo({
                          url: '../paySuccess/paySuccess'
                        })
                      },
                      'fail': function (res) {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'none',
                          duration: 2000,
                          success: function () {
                            wx.redirectTo({
                              url: '../order/order?type=2'
                            })
                          }
                        })
                      }
                    })
                  }else {
                    that._isPayOnOff = false;
                    wx.showToast({
                      title: '对不起！系统繁忙，请稍后重试！',
                      icon: 'none',
                      duration: 2000
                    })
                  
                  }
                },
                error: function (res) {
                  that._isPayOnOff = false;
                  wx.showToast({
                    title: '对不起！系统繁忙，请稍后重试！',
                    icon: 'none',
                    duration: 2000
                  })
                }
              });

            } else {
              that._isPayOnOff = false;
              wx.showToast({
                title: '获取用户登录态失败，请稍后重试！',
                icon: 'none',
                duration: 2000
              })
            }

          }
        });


      }
    })
  },
  // 返回购物车
  returnCart: function () {
    var that = this;
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  /**
   * 如果移除的商品中含有加价换购子品（type=HG），需要走/{siteId}/api/cart/batchRemoveItem
   * 其他商品调用如下请求 请求URL：/{siteId}/api/cart/ cancelItems
   * */
   delNoProd: function () {
    var that = this;
    var list = that.data.noList;
    var hg = '';
    var other = '';
    for (var value of list) {
      for (var items of value.items) {
        if (value.group == 'HG') {
          hg = items.itemId + ',';
        } else {
          other += items.itemId + ',';
        }
      }
    }
    // 如果移除的商品中含有加价换购子品（type=HG）
    if (hg.length > 0) {
      wx.request({
        url: websiteUrl + '/api/cart/batchRemoveItem',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': goHeader,
          'Cookie': 'SCN=' + that._scn
        },
        data: {
          'cids': hg
        },
        method: 'GET',
        success: function (res) {

          if (other.length > 0) {
            that.delOtherProdEvent(other);
          } else {
            that.setData({
              noProdStatus: true
            })
            that.init();
          }

        },
        error: function (res) {
          wx.showToast({
            title: '对不起！系统繁忙，请稍后重试！',
            icon: 'none',
            duration: 2000
          })
        }
      })
      // url: /{siteId}/api/cart/batchRemoveItem
    } else {
      if (other.length > 0) {
        that.delOtherProdEvent(other);
      }

    }
  },
  /**
   * 删除除加价购外商品
   * */
   delOtherProdEvent: function (itemId) {
    var that = this;
    wx.request({
      url: websiteUrl + '/api/cart/cancelItems',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader,
        'Cookie': 'SCN=' + that._scn
      },
      data: {
        'cids': itemId
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          noProdStatus: true
        })
        that.init();
      },
      error: function (res) {
        wx.showToast({
          title: '对不起！系统繁忙，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  showFreight: function () {
    var that = this;
    that.setData({
      freightState: true
    })
  },
  closeFreight: function () {
    var that = this;
    that.setData({
      freightState: false
    })
  }

});