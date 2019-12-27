/*
 * 16渠道我的评价
 * @since 2018-10-15
 * @author liusuling
 * @产品  周涛
 */
let app = getApp();
let scn;
Page({
  data: {
    tabs: ["全部评价", "有图评价"],
    activeIndex: 0,
    sliderLeft: 0,
    oldIndex: 0,
    scrollHeight: 0,
    scrollTop: 0,
    listData: [],
    protocol: app.protocol,
    isBack: false//是否是从其它页面回退
  },
  onLoad: function(options) {
    let that = this;
    that.star = that.selectComponent("#star");
    this.init();
  },

  onShow: function() {
    if(this.data.isBack) {
      this.init();
    }
    
  },

  // 初始化事件
  init: function() {
    let that = this;
    scn = app.getScn();
    that.resetData();
    that.data.oldIndex = that.data.activeIndex;
    wx.getSystemInfo({
      success(res) {
        let windowWidth = res.windowWidth, windowHeight = res.windowHeight;
        that.setData({
          scrollHeight: windowHeight,
          sliderLeft: (windowWidth / that.data.tabs.length) / 2,
        });
      }
    });
    this.getAppraiseData();
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
    that.getAppraiseData();
  },

  // 绑定预览图片事件
  bindPreviewImage: function(e) {
    let current=e.target.dataset.src,
        urls = e.target.dataset.imagelists;
    for (let i = 0; i < urls.length; i++) {
      urls[i] = this.data.protocol + urls[i];
    }
		wx.previewImage({
      current: current, 
      urls: urls
		})
  },

  //获取评价接口数据
  getAppraiseData: function() {
    let that = this, curPage, isPicAppraise = false, activeIndex = that.data.activeIndex;
    if(!that.getPrevAppraiseData()) {
      return false;
    };

    if(activeIndex == 1) {isPicAppraise = true;}
    curPage = that.data.listData[activeIndex].curPage;
    wx.request({
      url: app.ourHost + '/sixteenAppraise/getMyAppraiseList',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': 'wxa.gome.com.cn',
      },
      data: {
        scn: scn,
        pageSize: 5,
        currentPage: curPage,
        isPicAppraise: isPicAppraise,
      },
      method: 'POST',
      success: function(res) {
        that.getBehindAppraiseData(res.data);
      },
      fail: function(res) {
        wx.showToast({
          title: '加载失败，请稍后再试',
          icon: 'none'
        })
        
      }
    })
  },

  //获取评价接口前的处理函数
  getPrevAppraiseData: function() {
    var that = this, activeIndex = that.data.activeIndex, cur = 'listData[' + activeIndex + ']';
    if(!that.data.listData[activeIndex].isHasData) {return false;}
    that.setData({
      [cur + '.curPage']: ++that.data.listData[activeIndex].curPage
    })
    that.setData({
      [cur + '.curLoading']: true
    })
    
    return true;
  },

  //获取评价接口后的处理函数
  getBehindAppraiseData: function(requestData) {
    let that = this, activeIndex = that.data.activeIndex, cur = 'listData[' + activeIndex + ']', goodsAppraises;

    if(requestData.result && requestData.result.goodsAppraises) {

      goodsAppraises = requestData.result.goodsAppraises;
      if(goodsAppraises.length == 0) {//说明没有数据了
        
        that.setData({
          [cur + '.isHasData']: false
        })
      }
      if(that.data.listData[activeIndex].appraiseData.length>0 && goodsAppraises.length == 0) {
        that.setData({
          [cur + '.loadMore']: true
        })
      }
      that.setData({
        [cur + '.appraiseData']: that.data.listData[activeIndex].appraiseData.concat(goodsAppraises)
      })
    }

    that.setData({
      [cur + '.curLoading']: false,
      [cur + '.isFirstLoad']: false
    })

  },

  //滚动到底部触发的事件
  bindscrollEvt: function() {
    this.getAppraiseData();
  },

  //跳转到增加评价页面
  bindSkipAddAppraise: function(e) {
    let appriseId = e.currentTarget.dataset.appriseid;
    this.setData({
      isBack: true
    })
    wx.navigateTo({
      url: '../16addApprise/16addApprise?appriseId=' + appriseId
    })
    
  },

  //数据重置
  resetData: function() {
    let _listData = [];

    for(let i=0; i<this.data.tabs.length; i++) {
      _listData[i] = {
        appraiseData: [],//评论的数据列表
        curPage: 0,//当前加载的页数
        loadMore: false,//评价数据已加载完
        isFirstLoad: true,//第一次加载数据
        curLoading: false,//正在加载中
        isHasData: true//数据是否加载完
      };
    }

    this.setData({
      activeIndex: 0,
      sliderLeft: 0,
      oldIndex: 0,
      scrollTop: 0,
      listData: _listData,
      isBack: false
    })
  }

})