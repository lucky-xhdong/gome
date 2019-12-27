/**
 * @description 确认订单页选择优化券页面
 * @since 2018-10-25 重新改版
 * @author liusuling
 * @产品 梁艳
 */
import {COUPON_LABELS, COUPON_TIPS, COUPON_URL } from './config';
let app = getApp(),
    goHeader = app.goHeader,
    ourHost = app.ourHostCart;
 
Page({
  data: {
    tabs: [
      {title: "可用优惠券", len: 0}, 
      {title: "不可用优惠券", len: 0}
    ],
    activeIndex: 0,
    sliderLeft: 0,
    oldIndex: 0,
    scrollHeight: 0,
    scrollPaddingTop: 0,
    scrollTop: 0,
    listData: [],
    loading: true,
    isShowRule: false,
    usedCouponRxplain: '',//使用券说明
    counponAmount: 0,//使用券总金额
    cProfile: {}//确认订单页金额
  },

  
  onLoad: function (options) {//地址栏传递的参数在options里
    let that = this;
    wx.getSystemInfo({
      success(res) {
        let windowWidth = res.windowWidth, windowHeight = res.windowHeight;
          that.setData({
          scrollHeight: windowHeight,
          sliderLeft: (windowWidth / that.data.tabs.length)/2,
        });
      }
    });
    
    
    that.init();
  },

  // 初事化
  init: function() {
    let vrbsos = wx.getStorageSync('vrbsos');
    this._resetConfirmOrderData(vrbsos);
  },

  // 绑定tab卡事件
  bindNavbar: function (e) {
    let that = this;
    that.setData({
      activeIndex: Number(e.currentTarget.id)
    });
    wx.getSystemInfo({
      success(res) {
        let windowWidth = res.windowWidth;
        that.setData({
          sliderLeft: e.currentTarget.offsetLeft + (windowWidth / that.data.tabs.length)/2,
        });
      }
    });
    if(that.data.activeIndex == that.data.oldIndex) {return false;}
    
    that.data.oldIndex = that.data.activeIndex;
  },

  /**
   * @description 获取券数据
   * @param {Object} opt 参数集 (必传)，两种情况：一种是确认订单页的整体数据，二：只是优惠券的信息
   */
  _resetConfirmOrderData: function(opt) {
    let that = this,
        vrbsos,
        cvs = [],//可用优化券
        ucvs = [],//不可用优惠券
      reduceAmount, usedRGBSNum, usedFeeNum, gomehaulage = 0, reduceFeeAmount, availableRGBSNum, availableFeeNum,  usedCouponRxplain = '已选择';

    if(opt.success && opt.data &&  opt.data.coupons && opt.data.coupons.vrbsos) {
      vrbsos = opt.data.coupons.vrbsos;
      let shops = opt.data.shops;
      
      for (let i = 0; i < shops.length; i++) {
        let shopId = shops[i].shopId;
        if (shopId == 'GOME' || shopId == 'guomeidianqi' || shopId == 'dazhongdianqi' || shopId == 'yongledianqi' || shopId == 'beifangdianqi' || shopId == 'heitianedianqi' || shopId == 'tengdadianqi' || shopId == 'fengxingdianqi' || shopId == 'sanxingdianqi') {
          gomehaulage += shops[i].profile.freight.total;
          break;
        }
      }
    }else {
      vrbsos = opt;
      gomehaulage = opt.gomehaulage;
    }
    cvs = vrbsos.cvs || [];
    ucvs = vrbsos.ucvs || [];
    reduceAmount = vrbsos.reduceAmount ? vrbsos.reduceAmount.toFixed(2) : 0;
    reduceFeeAmount =  vrbsos.reduceFeeAmount ? vrbsos.reduceFeeAmount.toFixed(2) : 0;
    usedRGBSNum = vrbsos.usedRGBSNum || 0;
    usedFeeNum = vrbsos.usedFeeNum || 0;
    availableRGBSNum =  vrbsos.availableRGBSNum || 0;
    availableFeeNum = vrbsos.availableFeeNum || 0;

    if (usedRGBSNum || (!usedRGBSNum && availableRGBSNum)) {
      usedCouponRxplain += `${usedRGBSNum}张优惠券，`;
    }
    
    if (usedFeeNum || (!usedFeeNum && availableFeeNum)) {
      usedCouponRxplain += `${usedFeeNum}张运费券，`;
    }

    that.dealData(cvs,ucvs);
    that.setData({
      usedCouponRxplain: usedCouponRxplain,
      gomehaulage: gomehaulage || 0,
      reduceAmount: reduceAmount,
      reduceFeeAmount: reduceFeeAmount,
      loading: false
    })
      
  },

  /**
   * @description 处理数据<br />
   * @param  优惠券(必传) 里面用arguments替代
   */
  dealData: function() {
    
    let that = this,
        _listData = [],
        tabs = this.data.tabs;
    for(let i = 0; i<arguments.length; i++) {
      _listData.push(this.classifyCoupon(arguments[i]));
      tabs[i].len = arguments[i].length || 0;
    }
    this.setData({
      tabs: tabs,
      listData: _listData
    }, function() {
      let query = wx.createSelectorQuery();
      
      query.select('.weui-navbar').boundingClientRect();
      query.select('.use-explain-wrap').boundingClientRect();
      query.exec(function (res) {
        that.setData({
          scrollPaddingTop: res[0].height + (res[1] ? res[1].height : 0)
        })
      })
 
    })
  },

  /**
   * @description 将券进行分类处理
   * @param {Object} vrbsos 参数集,可用券或不可用券 (必传)
   */
  classifyCoupon: function(opt) {

    let coupon = {},
        arr = [];

    opt.forEach((item, idx) => {
      let type = item.type,
          couponApplyDetailInfoVO = item.couponApplyDetailInfoVO,
          max = couponApplyDetailInfoVO.reasonSupplyment || 1,
          price = couponApplyDetailInfoVO.reasonSupplyment || 0,
          code = couponApplyDetailInfoVO.unavailReasonType,
          start, end,name;
      if(!coupon[type]) {
        coupon[type] = {};
        coupon[type].type = type;
        coupon[type].label = COUPON_LABELS[type];
        coupon[type].items = [];
      }
      name = item.label = COUPON_LABELS[type]; 
      item.codeDesc = COUPON_TIPS(max,name,price)[code] || '';
      start = app.fromatDate(new Date(item.dateRange.start), "yyyy.MM.dd");
      end = app.fromatDate(new Date(item.dateRange.end), "yyyy.MM.dd");
      item.validity = start + ' - ' + end;
      coupon[type].items.push(item);
    })

    for(var attr in coupon) {
      arr.push(coupon[attr]);
    }
    
    return arr;
  },

  /**
   * @description 选择券事件
   */
  bindSelectedCoupon: function(e) {
    let that = this,
        item = e.currentTarget.dataset.item,
        type = item.type,
        name = item.label,
        couponUnitPrice = item.couponUnitPrice,
        isUsed = e.currentTarget.dataset.isUsed,
        url = ourHost + '/wxmp/api/coupon/',
        param = {};
    if(!isUsed) { return false;}
    that.setData({
      loading: true
    })
    if(type == 'BLUE') {
      param.tid = item.id;
    }else if (type == 'FEE') {
      param.cid = item.id;
    }else {
      param.tid = item.couponNO;
      item.shopNo && (param.shopno = item.shopNo);
      item.sgid && (param.sgid = item.sgid);
    }

    // 以下默认ShopCoupon的原因是联营券都是ShopCoupon，后端后加的并没有通知前端，为了容错走了一个默认,而且联营券的参数也是一样的
    if(!item.checked) {//选择券
      param.couponType = type;
      url += 'select' + (COUPON_URL[type] || COUPON_URL.SHOP);
      that._isSelectedCoupon(param,url,name,couponUnitPrice,!item.checked,type);
    }else { //取消券
      url += 'cancel' + (COUPON_URL[type] || COUPON_URL.SHOP);
      that._isSelectedCoupon(param,url,name,couponUnitPrice,!item.checked,type);
    }

    //缺加载loading
  },

  /**
   * @description 使用券或者取消券接口<br />
   * @param {Object} param 参数集 (必传)，接口所需参数
   * @param {String} param.tid (必传)
   * @param {String} param.shopno (必传)
   * @param {String} param.sgid (必传)
   * @param {String} url 接口地址 (必传)
   * @param {String} name 券名 (必传)
   * @param {Number} price 券金额 (必传)
   * @param {Boolean} isSelected true表示使用券，false表示取消券 (必传)
   * @param {String} type 券类型 (必传)
   */
  _isSelectedCoupon: function(param,url,name,price,isSelected,type) {
    let that = this,
        scn = app.getScn(); 
    wx.request({
      url: url, 
      header: {
        'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header':goHeader,
        'Cookie':'SCN='+ scn
      },
      data: param,
      method:'GET',
      success: function(res) {
        let data = res.data;
        let paraOrder = {
          url: ourHost + '/wxmp',
          scn: scn
        };
        if(data.success) {//加载确认订单页的接口，重新刷新数据
          
          if(isSelected && type == 'FEE') {
            console.log(that.data.gomehaulage, that.data.reduceFeeAmount)
            if (that.data.gomehaulage - that.data.reduceFeeAmount - price < 0) {
              wx.showToast({
                title: '运费券金额大于剩余运费金额，差额不予退回哦',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          }
          app.initConfirmOrder(paraOrder,that._resetConfirmOrderData);
        }else {
          
          wx.showToast({
            title: data.errMsg || '对不起！系统繁忙，请稍后重试！',
            icon: 'none',
            duration: 2000,
            mask: true
          })
          app.initConfirmOrder(paraOrder, that._resetConfirmOrderData);
          
        }
      },
      error: function(res) {
        let tip = '';
        if(isSelected) {
            tip = name + '使用失败（系统失败）';
        }else {
            tip = name + '取消失败（系统失败）';
        }
        that.setData({
          loading: false
        })
        wx.showToast({
            title: tip || '对不起！系统繁忙，请稍后重试！',
            icon: 'none',
            duration: 2000,
            mask: true
        })
        
      }
    })
  },

  bindConfirm: function() {
      wx.navigateBack({
          delta: 1
      });
  }

});
