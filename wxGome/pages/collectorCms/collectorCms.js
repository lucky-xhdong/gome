var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
var goHeader = app.goHeader;
var scn;
var interval;

Page({
  data: {
    showFixed:false,//默认不展示弹层
    isOverTime:false,//活动已结束
    isNotStart:false,//活动未开始
    goodsList:[],//商品列表
    countDownDay:0,//天
    countDownHour:0,//时
    countDownMinute:0,//分
    countDownSecond: 0,
    key: 'saleNg885fbfbb', //页面活动key
    pageData:{} //页面数据
  },
  onLoad:function(options){
    var _this=this;
    if (options.userId){ //分享过来的页面数据
      _this.setData({
        key: 'saleNg' + options.activityId, //页面活动key
        activityId: options.activityId,//活动id
        userId: options.userId,     //员工id
        storeId: options.storeId,   //门店
        branch1Code: options.branch1Code,  //一级分部
        branch2Code: options.branch2Code, //二级分部
        regionCode: options.regionCode,   //大区
        activeType: options.activeType || '2',//活动类型
      });
    }
    //获取cms数据
    _this.getCmsData(function(){
        //动态设置标题
        wx.setNavigationBarTitle({
          title: _this.data.pageData.pageInfo.promoName
        });

      var currentTime,startTime,endTime;
      currentTime = _this.newDate(_this.data.pageData.serverTime).getTime(); //当前时间戳
      startTime = _this.newDate(_this.data.pageData.pageInfo.startDate).getTime(); //活动开始时间
      endTime = _this.newDate(_this.data.pageData.pageInfo.endDate).getTime();   //活动结束时间
      

  
        if (currentTime < startTime) { //活动未开始
          var totalSecond = (startTime - currentTime) / 1000;

          interval = setInterval(function () {
            //倒计时时间
            _this.date_format(totalSecond);
            totalSecond--;
            if (totalSecond < 0) {
              clearInterval(interval);
         
              _this.setData({
                showFixed: false,
                isNotStart: false,
                countDownDay: '00',
                countDownHour: '00',
                countDownMinute: '00',
                countDownSecond: '00',
              });
            }
          }.bind(this), 1000);
        } else if (currentTime > endTime) { //活动已结束
          _this.setData({
            showFixed: true,
            isOverTime: true,
            countDownDay: '00',
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          });
        } 
         //正常活动进行中
          //处理商品数据
          for (var i = 0; i < _this.data.pageData.templetList.length;i++){
            var templet = _this.data.pageData.templetList[i];
            if (templet.templetCode =='goodsTemplet'){
              var goodsList = templet.goodsTemplet.goodsList;
              for (var j = 0; j < goodsList.length;j++){
                //商品是否可预约，默认可预约
                goodsList[j].isYy =true;
                //内购价
                goodsList[j].promoWord_sub = goodsList[j].promoWord.split('.')[0];
                goodsList[j].promoWord_after = goodsList[j].promoWord.split('.')[1]||'00';
                //原价
                goodsList[j].shortWord = Number(goodsList[j].shortWord).toFixed(2);
              }
              // //设置数据
              // _this.setData({
              //   goodsList: goodsList
              // });
            }
            if (templet.templetCode == 'customTemplet'){
              _this.getRuleData({
                url: app.protocol+templet.coustomTemplet.promsUrl,
                callback:function(data){
                  //异步设置规则内容
                  if (data.indexOf('活动规则说明')!=-1){
                    var textList = [];
                    data.replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*<\/p>/gi, function (match, capture) {
                      var text = match;
                      textList.push(match);
                    });
                    WxParse.wxParse('arrival', 'html', textList.join(''), _this, 5);
                    // var ruleHtml = data.split("活动规则说明")[1];
                    // WxParse.wxParse('arrival', 'html', ruleHtml, _this, 5);
                  }
                }
              });
            }
          }
          //设置数据
          _this.setData({
            pageData: _this.data.pageData
          });

    });
    
  },
  //商品预约，取消预约处理
  goodsOrder: function (event){
    var _this = this,
        dataSet = event.currentTarget.dataset,
        goodsId = dataSet.goodsid;

    if (dataSet.isyy) { //点击预约按钮
      //改状态为已预约
      _this.data.pageData.templetList.forEach((templet)=>{
        if (templet.templetCode =='goodsTemplet'){
          templet.goodsTemplet.goodsList.forEach((goods) => {
            if (goods.goodsId == goodsId) {
              goods.isYy = false;
            }
          });
        }
      });
     
    } else { //取消预约
      _this.data.pageData.templetList.forEach((templet) => {
        if (templet.templetCode == 'goodsTemplet') {
          templet.goodsTemplet.goodsList.forEach((goods) => {
            if (goods.goodsId == goodsId) {
              goods.isYy = true;
            }
          });
        }
      });
    }
    _this.setData({
      pageData: _this.data.pageData
    });
  },
  /**
   *
     * @description 获取规则信息<br />
     * @method getRuleData
     * @since 2017-02-17
     * @author 谢俊梅
     */
  getRuleData: function (object) {
    var _this = this;
    var app = getApp();
    wx.request({
      url: object.url,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      method: 'get',
      success: function (data) {
        
        if (data.statusCode == '200') {
          object.callback && object.callback(data.data);
        }
      }, fail: function () {
      }
    });
  },
  /**
   *
     * @description 获取cms活动信息<br />
     * @method getCmsData
     * @since 2017-02-17
     * @author 谢俊梅
     */
  getCmsData: function (callback) {
    var _this = this;
    wx.request({
      url: app.hdCmsUrl+"/wap/promotion/promscms/"+_this.data.key+".jsp",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      method: 'POST',
      success: function (data) {
        if (data.data.isSuccess == 'Y') {
            _this.setData({
              pageData: data.data
            });
          callback && callback();
        }
      }, fail: function () {
      }
    });
  },
  //立即领取跳转
  getTicket: function(){
    var _this = this,
        bespokeProduct = []; //预约商品skuno 信息组
        
    _this.data.pageData.templetList.forEach((templet) => {
      if (templet.templetCode == 'goodsTemplet') {
        templet.goodsTemplet.goodsList.forEach((goods) => {
          if (!goods.isYy) { //选中已预约的商品数据
            bespokeProduct.push(goods.goodsBean.productID + '_' + goods.goodsBean.skuID + '_' + goods.goodsBean.skuName);
          }
        });
      }
    });

    //跳转到领票页面
    wx.navigateTo({
      url: '/pages/getTicket/getTicket?activityId='+_this.data.activityId+'&storeCode='+_this.data.storeId+'&userId='+_this.data.userId+'&branch1Code='+_this.data.branch1Code+'&branch2Code='+_this.data.branch2Code+'&regionCode='+_this.data.regionCode+'&activeType='+_this.data.activeType+'&bookGoodsInfo='+bespokeProduct.join('|')
    });

  },
  closeFixed:function(){
    var _this = this;

    _this.setData({
      showFixed: false
    });
  },
  date_format: function (second){
    var _this = this;
    // 天数位
    var day = _this.fill_zero_prefix(Math.floor(second / 3600 / 24));

    // 小时位
    var hr = _this.fill_zero_prefix(Math.floor((second - day * 3600 * 24) / 3600));
    // 分钟位
    var min = _this.fill_zero_prefix(Math.floor((second - day * 3600 * 24 - hr * 3600) / 60));
    // 秒位
    var sec = _this.fill_zero_prefix(Math.floor(second - day * 3600 * 24 - hr * 3600 - min * 60));

    // return day+":"+hr + ":" + min + ":" + sec;

    _this.setData({
      showFixed: true,
      isNotStart: true,
      countDownDay: day,
      countDownHour: hr,
      countDownMinute: min,
      countDownSecond: sec
    });
  },
  fill_zero_prefix:function(num){
    return num < 10 ? "0" + num : num;
  },
  newDate: function (str) { //解决new Date()IE10不支持参数
    //首先将日期分隔 ，获取到日期部分 和 时间部分
    var day = str.split(' ');
    //获取日期部分的年月日
    var days = day[0].split('-');
    //获取时间部分的 时分秒
    var mi = day[day.length - 1].split(':');
    //获取当前date类型日期
    var date = new Date(days[0], days[1] - 1, days[2], mi[0], mi[1], mi[2]);
  
    return date;
  }
})