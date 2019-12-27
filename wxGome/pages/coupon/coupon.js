var app = getApp();
var goHeader = app.goHeader;
var scn;
Page({
  data: {
    height: 0,
    datatype: 1, // 1待使用/ 2已使用/ 3已过期
    currentList: [], //当前是属于 待使用/已使用/已过期
    toUseCoupon: [], //待使用
    alreadyUseCoupon: [], //已使用
    expiredCoupon: [], //已过期
    toUseCouponNumber: 0, //待使用
    alreadyUseCouponNumber: 0, //已使用
    expiredCouponNumber: 0, //已过期
    currentPage: 1, //当前分页数 默认为1
    currentTotalPage: 1, //默认总分页数1
    toUseCouponCurrentPage: 1, //待使用当前分页数
    alreadyUseCouponCurrentPage: 1, //已使用 当前分页数
    expiredCouponCurrentPage: 1, //已过期当前分页数
    toUseCouponTotalPage: 1, //待使用 总分页数
    alreadyUseCouponTotalPage: 1, //已使用 总分页数
    expiredCouponTotalPage: 1, //已过期 总分页数
    isMore: false, //加载更多提示
    pageSize: 5, //每页显示的个数
    coupon_box_grey: '', //已过期，已使用 对应的新增的样式
    moreText: '查看更多', //查看更多或没有更多了
    text_tips: '立即使用', //按钮文字描述
    couponType: {
      shop: '店铺券',
      red: '红券',
      blue: '蓝券',
      platform: '购物券',
      offlineBlue: '美券',
      freight: '运费券',
      financial: '理财券',
      selfred: '红券'
    }
  },
  onLoad: function(options) {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        //适配iPhoneX 
        if (res, res.windowHeight >= 724) {
          _this.setData({
            height: (res.windowHeight - 110) + 'px'
          })
        } else {
          _this.setData({
            height: res.windowHeight + 'px'
          })
        }

      },
    })
    //当前页面的选项
    if (options.type) {
      _this.setData({
        datatype: options.type,
        toUseCouponNumber: options.totalCouponCount
      });
    }


  },
  onShow: function() {
    var _this = this;
    scn = app.getScn();
    _this.setData({
      datatype: 1, // 1待使用/ 2已使用/ 3已过期
      currentList: [], //当前是属于 待使用/已使用/已过期
      toUseCoupon: [], //待使用
      alreadyUseCoupon: [], //已使用
      expiredCoupon: [], //已过期
      currentPage: 1, //当前分页数 默认为1
      currentTotalPage: 1, //默认总分页数1
      toUseCouponCurrentPage: 1, //待使用当前分页数
      alreadyUseCouponCurrentPage: 1, //已使用 当前分页数
      expiredCouponCurrentPage: 1, //已过期当前分页数
      toUseCouponTotalPage: 1, //待使用 总分页数
      alreadyUseCouponTotalPage: 1, //已使用 总分页数
      expiredCouponTotalPage: 1, //已过期 总分页数
      isMore: true, //加载更多提示
    })

    //获取（待使用）状态下优惠券列表信息
    _this.getCouponInformation({
      data: {
        scn: scn,
        pageSize: _this.data.pageSize,
        currentPage: 1,
        t: _this.data.datatype //待使用
      },
      successCallback: function(couponsUnused) {
        _this.setData({
          toUseCoupon: couponsUnused,
          currentList: couponsUnused
        });
      }
    });

    //获取不同状态下优惠券券数量
    _this.getCouponNumber(2, function(number) { //已使用
      _this.setData({
        alreadyUseCouponNumber: number
      });
    });
    //获取不同状态下优惠券券数量
    _this.getCouponNumber(3, function(number) { //已过期
      _this.setData({
        expiredCouponNumber: number
      });
    });
    //文字状态处理
    _this.moreTxtState();


  },
  /**
   * @description 获取当前分类下文字状态<br />
   * @method moreTxtState
   * @since 2018-03-01
   * @author 谢俊梅
   */
  moreTxtState() {
    var _this = this;
    //判断当前分页数如果小于 当前类别总分页数，则显示加载更多文字
    if (_this.currentPage < _this.currentTotalPage) {
      _this.setData({
        isMore: true,
      });
    } else {
      _this.setData({
        isMore: false,
        moreText: '没有更多了'
      });
    }

  },
  /**
   * @description 跳转链接地址<br />
   * @method hrefLink
   * @since 2018-01-18
   * @author 谢俊梅
   */
  hrefLink(event) {
    var _this = this;
    if (_this.data.datatype == '1') {
      if (event.currentTarget.dataset.coupon != 'blue') {
        // _this.wetoast.toast({
        //   title: '抱歉，该券只能在国美商城pc端或app端使用',
        //   duration: 1000
        // });
      } else {
        wx.navigateTo({
          url: '../listBlue/listBlue?data=' + event.currentTarget.dataset.refpromotionid + '&couponName=' + event.currentTarget.dataset.couponname,
        });
      }
    }
  },
  /**
   * @description 获取不同状态下优惠券券数量<br />
   * @method getCouponNumber
   * @t {string} t 表示优惠券的状态 1 待使用 、2 已使用 、3 已过期
   * @param {function} callback 表示成功后的回调函数
   * @since 2017-02-17
   * @author 谢俊梅
   */
  getCouponNumber: function(t, callback) {
    var _this = this;

    wx.request({
      url: app.ourHost + '/ticket/summary',
      header: {
        'content-type':   'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: {
        scn: scn,
        t: t
      },
      method: 'POST',
      success: function(data) {
        if (data.data.success && data.statusCode == 200) {
          var resultList = data.data.buessObj.result;
          var number = 0;
          for (var i in resultList) {
            if (i != 'totalCouponCount' && i != 'oneWeek') {
              number += Number(resultList[i]);
            }
          }
          callback(number);
        }
      }
    });
  },
  /**
   *
   * @description 获取不同状态下优惠券列表信息<br />
   * @method getCouponInformation
   * @param {object} object 函数调用的传参
   * @param {object} object.data 请求接口需传过去的数据
   * @param {string} object.data.pageSize 表示一页显示多少条数据
   * @param {string} object.data.scn  表示用户唯一标识
   * @param {string} object.data.currentPage 表示当前页数
   * @param {string} object.data.t 表示当前传入的状态 1待使用/ 2已使用/ 3已过期
   * @param {function} object.successCallback 表示成功后的回调函数
   * @param {function} object.failCallback 表示失败后的回调函数
   * @since 2017-02-17
   * @author 谢俊梅
   */
  getCouponInformation: function(object) {
    var _this = this;

    wx.request({
      url: app.ourHost + '/ticket/home/query',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      data: object.data,
      method: 'POST',
      success: function(data) {
        if (data.statusCode == 200) {
          var couponsUnused = data.data.buessObj.couponsUnused;

          if (couponsUnused.length >= _this.data.pageSize) {
            _this.setData({
              moreText:'查看更多'
            })
          }else{
            _this.setData({
              moreText:'没有更多了'
            })
          }

          //每次请求的总分页数
          var couponsTotalPageNum = data.data.buessObj.pagination.totalPageNum;
          var couponsUnuseds = [];
          /* 对于平台券计算对应的优惠券数量，之前平台券的数量是写在count 属性上的，同一券的数量计算方式 */
          for (var i = 0; i < couponsUnused.length; i++) {
            couponsUnuseds.push(couponsUnused[i]);
            if (couponsUnused[i].type == 'platform') {
              couponsUnused[i].count = Number(couponsUnused[i].count);
              if (couponsUnused[i].count > 1) {
                for (var j = 1; j < couponsUnused[i].count; j++) {
                  couponsUnuseds.push(couponsUnused[i]);
                }
              }
            } else {
              couponsUnused[i].count = 1;
            }

            couponsUnused[i].amount = Number(couponsUnused[i].amount);
            if (Number.isInteger(couponsUnused[i].amount)) {
              couponsUnused[i].amount = parseInt(couponsUnused[i].amount);

            }
            /* 处理时间格式*/
            couponsUnused[i].startDateNew = _this.timeChange(couponsUnused[i].startDate);
            couponsUnused[i].endDateNew = _this.timeChange(couponsUnused[i].endDate);
          }

          object.successCallback && object.successCallback(couponsUnuseds, couponsTotalPageNum);
        } else {
          object.failCallback && object.failCallback();
        }


      },
      fail: function() {
        /* Act on the event */
        object.failCallback && object.failCallback();
      }
    });
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  /**
   * @description 时间格式转换，<br />
   * @method timeChange
   * @pram time 入参时间格式 2018-03-16 23:59:59
   * @return string 返回时间格式  2018.03.16 23:59
   * @since 2018-03-01
   * @author 谢俊梅
   */
  timeChange: function(time) {
    var timeList = time.split(' '),
      hoursList = timeList[1];
    return timeList[0].replace(/-/g, '.') + ' ' + hoursList.substr(0, hoursList.lastIndexOf(':'));
  },
  /**
   *
   * @description 点击tap切换,会判断第一次切换还是后期多次切换,第一次加载走请求,第二次走对应数组存储过的数据<br />
   * @method couponTapEven
   * @param {object} event 点击对象上的事件对象
   * @since 2017-02-17
   * @author 谢俊梅
   */
  couponTapEven: function(event) {
    var _this = this;
    if (this.data.datatype === event.target.dataset.type) {
      return false;
    } else {

      //先清空当前列表，数据重新渲染显示
      this.setData({
        currentList: [],
        datatype: event.target.dataset.type
      });

      //初始化显示列表情况，初始化发请求
      if (!_this.data.toUseCoupon.length && event.target.dataset.type == 1 || !_this.data.alreadyUseCoupon.length && event.target.dataset.type == 2 || !_this.data.expiredCoupon.length && event.target.dataset.type == 3) {
        _this.queryCouponAjax(event);
      } else {
        //后期多次切换走这里
        if (event.target.dataset.type == 1) {
          _this.setData({
            currentList: _this.data.toUseCoupon,
            currentPage: _this.data.toUseCouponCurrentPage,
            currentTotalPage: _this.data.toUseCouponTotalPage,
            text_tips: '立即使用',
            coupon_box_grey: ''
          });
        } else if (event.target.dataset.type == 2) {

          _this.setData({
            currentList: _this.data.alreadyUseCoupon,
            currentPage: _this.data.alreadyUseCouponCurrentPage,
            currentTotalPage: _this.data.alreadyUseCouponTotalPage,
            coupon_box_grey: 'coupon_box_grey coupon_box_used',
            text_tips: '已使用'
          });
        } else {

          _this.setData({
            currentList: _this.data.expiredCoupon,
            currentPage: _this.data.expiredCouponCurrentPage,
            currentTotalPage: _this.data.expiredCouponCurrentPage,
            coupon_box_grey: 'coupon_box_grey coupon_box_expired',
            text_tips: '已过期'
          });
        }
      }
      //文字状态处理
      _this.moreTxtState();
    }
  },
  /**
   *
   * @description 待使用、已使用、已过期3个选项切换过程中，每个第一次切换时加载发请求<br />
   * @method queryCouponAjax
   * @param {object} event 点击对象上的事件对象
   * @since 2017-02-17
   * @author 谢俊梅
   */
  queryCouponAjax: function(event) {
    var _this = this;

    //获取不同状态下优惠券列表信息
    _this.getCouponInformation({
      data: {
        scn: scn,
        pageSize: _this.data.pageSize,
        currentPage: 1,
        t: event.target.dataset.type //待使用
      },
      successCallback: function(couponsUnused, couponsTotalPageNum) {
        if (event.target.dataset.type == 1) {
          _this.setData({
            toUseCoupon: couponsUnused,
            currentList: couponsUnused,
            toUseCouponTotalPage: couponsTotalPageNum,
            currentToTalPage: couponsTotalPageNum,
            coupon_box_grey: '',
            text_tips: '立即使用'
          });
        } else if (event.target.dataset.type == 2) {
          _this.setData({
            alreadyUseCoupon: couponsUnused,
            currentList: couponsUnused,
            alreadyUseCouponTotalPage: couponsTotalPageNum,
            currentToTalPage: couponsTotalPageNum,
            coupon_box_grey: 'coupon_box_grey coupon_box_used',
            text_tips: '已使用'
          });
        } else {
          _this.setData({
            expiredCoupon: couponsUnused,
            currentList: couponsUnused,
            expiredCouponTotalPage: couponsTotalPageNum,
            currentToTalPage: couponsTotalPageNum,
            coupon_box_grey: 'coupon_box_grey coupon_box_expired',
            text_tips: '已过期'
          });
        }
      }
    });
  },
  /**
   *
   * @description 滑动到底部，加载更多，根据每个类型 分别计算对应的分页数、对新增的数据加入到对应的数组中<br />
   * @method lower
   * @since 2017-02-17
   * @author 谢俊梅
   */
  lower: function() {
    var _this = this;


    //var ischudi = event.detail.scrollHeight - event.detail.scrollTop==576?true:false;
    //if (ischudi){

    _this.setData({
      isMore: true
    });
    //在待使用优惠券分类，处理上滑操作
    if (_this.data.datatype == 1) {
      //默认加载更多，当前分页+1
      _this.setData({
        toUseCouponCurrentPage: _this.data.toUseCouponCurrentPage + 1
      })

      //获取不同状态下优惠券列表信息，对应的数组加数据、计算分页数
      _this.getCouponInformation({
        data: {
          scn: scn,
          pageSize: _this.data.pageSize,
          currentPage: _this.data.toUseCouponCurrentPage,
          t: _this.data.datatype //待使用
        },
        successCallback: function(couponsUnused) {
          if (!couponsUnused.length) {
            var toUseCouponCurrentPage = _this.data.toUseCouponCurrentPage - 1;

            _this.setData({
              isMore: false,
              toUseCouponCurrentPage: toUseCouponCurrentPage,
              currentPage: toUseCouponCurrentPage
            });
          }

          //新请求得到的数据，加到对应数组里
          _this.setData({
            currentList: _this.data.toUseCoupon.concat(couponsUnused),
            toUseCoupon: _this.data.toUseCoupon.concat(couponsUnused)
          });
        },
        failCallback: function() {
          var toUseCouponCurrentPage = _this.data.toUseCouponCurrentPage - 1;
          _this.setData({
            toUseCouponCurrentPage: toUseCouponCurrentPage,
            currentPage: toUseCouponCurrentPage
          });
        }
      });


    } else if (_this.data.datatype == 2) { //在已使用优惠券分类，处理上滑操作 
      //默认加载更多，当前分页+1
      _this.setData({
        alreadyUseCouponCurrentPage: _this.data.alreadyUseCouponCurrentPage + 1
      })

      //获取不同状态下优惠券列表信息，对应的数组加数据、计算分页数
      _this.getCouponInformation({
        data: {
          scn: scn,
          pageSize: _this.data.pageSize,
          currentPage: _this.data.alreadyUseCouponCurrentPage,
          t: _this.data.datatype //待使用
        },
        successCallback: function(couponsUnused) {
          //如果没有任何数据的时候
          if (!couponsUnused.length) {
            var alreadyUseCouponCurrentPage = _this.data.alreadyUseCouponCurrentPage - 1;
            _this.setData({
              isMore: false,
              alreadyUseCouponCurrentPage: alreadyUseCouponCurrentPage,
              currentPage: alreadyUseCouponCurrentPage
            });
          }

          //新请求得到的数据，加到对应数组里
          _this.setData({
            currentList: _this.data.alreadyUseCoupon.concat(couponsUnused),
            alreadyUseCoupon: _this.data.alreadyUseCoupon.concat(couponsUnused)
          });
        },
        failCallback: function() {
          var alreadyUseCouponCurrentPage = _this.data.alreadyUseCouponCurrentPage - 1;
          _this.setData({
            alreadyUseCouponCurrentPage: alreadyUseCouponCurrentPage,
            currentPage: alreadyUseCouponCurrentPage
          });
        }
      });

    } else { //在已过期优惠券分类，处理上滑操作 
      //默认加载更多，当前分页+1
      _this.setData({
        expiredCouponCurrentPage: _this.data.expiredCouponCurrentPage + 1
      });

      //获取不同状态下优惠券列表信息，对应的数组加数据、计算分页数
      _this.getCouponInformation({
        data: {
          scn: scn,
          pageSize: _this.data.pageSize,
          currentPage: _this.data.expiredCouponCurrentPage,
          t: _this.data.datatype //待使用
        },
        successCallback: function(couponsUnused) {
          //如果没有任何数据的时候
          if (!couponsUnused.length) {
            var expiredCouponCurrentPage = _this.data.expiredCouponCurrentPage - 1;
            _this.setData({
              isMore: false,
              expiredCouponCurrentPage: expiredCouponCurrentPage,
              currentPage: expiredCouponCurrentPage
            });
          }

          //新请求得到的数据，加到对应数组里
          _this.setData({
            currentList: _this.data.expiredCoupon.concat(couponsUnused),
            expiredCoupon: _this.data.expiredCoupon.concat(couponsUnused)
          });
        },
        failCallback: function() {
          var expiredCouponCurrentPage = _this.data.expiredCouponCurrentPage - 1;
          _this.setData({
            expiredCouponCurrentPage: expiredCouponCurrentPage,
            currentPage: expiredCouponCurrentPage
          });
        }
      });
    }
    // }
  }
})