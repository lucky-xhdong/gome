let app = getApp();
let goHeader = app.goHeader;
let priceUrl = app.ourHost + '/cheap/listrushPrice';//价格接口
Page({
  data: {
   listData:[],
   key:'appletshomeactivity' //默认接口key 值
  },
  onLoad: function (option) {

    let _this = this;
    if (option.key){
      _this.setData({
        key: option.key
      });
    }
  },
  onShow:function(){
    let _this = this;
    //获取列表数据
    _this.getList({
      successCallback: function (data) {
        let listData = data;
        let priceData = [];
        //20个数据分组
        let groupingData = [];

        for (let i = 0; i < listData.length; i++) {
          let list = listData[i];
          if (list.type == 2 || list.type == 3 || list.type == 4) {
            for (let j = 0; j < list.data.length; j++) {
              if (list.data[j].type == 0) { //商品数据
                //设置商品数据的默认跳转地址
                list.data[j].wxaUrl = `../prod/prod?productId=${list.data[j].mix_id}&skuId=${list.data[j].skuid}`;
                //设置关键值用于查找价格对应关系
                list.data[j].pro_sku = list.data[j].mix_id + '_' + list.data[j].skuid;
                //默认没有被搜索过,对比价格
                list.data[j].isSearch = false;
                //默认没有价格，有价格时进行覆盖
                //list.data[j].price = "暂无价格";
                priceData.push(list.data[j].pro_sku);
                list.data[j].image = list.data[j].image.replace('.jpg', '_210.jpg');
              }
            }
          }
        }

        //先设置数据
        _this.setData({
          listData: listData
        });

        if (!priceData){ //如果没有商品数据不做下面处理
          return false;
        }
        //过程数组
        for (let i = 0, len = priceData.length; i < len;i+=20){
          groupingData.push(priceData.slice(i,i+20));
        }
        let groupingLength = groupingData.length;
        let forNumber = 0;
        // 定义回调函数
        let fn = function (forNumber,listData,groupingLength){
                _this.priceMatch({
                  group: groupingData[forNumber],
                  listData: listData,
                  successCallback: function () {//成功后回调下一个
                    forNumber++;
                    if (forNumber < groupingLength) { 
                      fn(forNumber, listData, groupingLength);
                    }else{
                      return false;
                    }
                  },
                  failCallback: function () { //失败后回调下一个
                    forNumber++;
                    if (forNumber < groupingLength) {
                      fn(forNumber, listData, groupingLength);
                    } else {
                      return false;
                    }
                  }
                });
            };
        
        fn(forNumber, listData, groupingLength);

        
      },
      failCallback: function () {
        _this.priceError();
      }
    });
  },
  /*
  * @description 价格匹配
  * @method priceMatch
  * @param {object} object 函数调用的传参
  * @param {array} object.group 请求需要的参数 价格数组
  * @param {array} object.listData 所有商品数据集合
  * @param {function} object.successCallback 表示成功后的回调函数
  * @param {function} object.failCallback 表示失败后的回调函数
  * @since 2018-04-16
  * @author xiejunmei
  */
  priceMatch: function (object){
    let _this = this;
    //获取价格列表
    _this.getPriceList({
      proSkuLists: object.group,
      successCallback: function (data) {
        let result = data.result,
            listData = object.listData;

        for (let i = 0; i < listData.length; i++) {
          let list = listData[i];
          if (list.type == 2 || list.type == 3 || list.type == 4) {

            for (let j = 0; j < list.data.length; j++) {
              if (list.data[j].type == 0 && !list.data[j].isSearch) { //商品数据 且没有被查找过

                for (let x = 0; x < result.length; x++) {

                  result[x].pro_sku = result[x].productId + '_' + result[x].skuId;

                  if (list.data[j].pro_sku == result[x].pro_sku) {
                    if (result[x].price) {
                      list.data[j].price = result[x].price;
                      //抢购需要/** * 团购价格：TUANPRICE， 抢购价格：RUSHBUYPRICE
                      list.data[j].priceType = result[x].priceType;
                      list.data[j].promotionUrl = result[x].promotionUrl;
                      if (list.data[j].promotionUrl && list.data[j].priceType == 'RUSHBUYPRICE') {
                        list.data[j].wxaUrl = `../groupProd/groupProd?itemId=${list.data[j].promotionUrl}`;
                      }
                    } else {
                      list.data[j].price = "暂无价格";
                    }
                    list.data[j].isSearch = true;
                    break;
                  }
                }
              }
            }
          }
        }
        //设置数据
        _this.setData({
          listData: listData
        });
        object.successCallback && object.successCallback();
      },
      failCallback: function () {
        _this.priceError();
        object.failCallback && object.failCallback();
      }
    });

  },
  hrefToLink:function(data){
    if (!data.currentTarget.dataset.wxaurl){
        return false;
    }
    wx.navigateTo({
      url: data.currentTarget.dataset.wxaurl
    });
  },
   /**
     * @description 获取价格列表
     * @method getPriceList
     * @param {object} object 函数调用的传参
     * @param {object} object.proSkuLists 请求传过去的数组【productid_skuid】集合
     * @param {function} object.successCallback 表示成功后的回调函数
     * @param {function} object.failCallback 表示失败后的回调函数
     * @since 2018-03-16
     * @author xiejunmei
     * */
  getPriceList: function (object){
    let _this = this;
    let areaCode = _this.getAreaCode();
    let proSkuLists = object.proSkuLists;
    if (!proSkuLists) {
      return false;
    }
    wx.request({
      url: priceUrl,
      data: {
        prodAndSku: proSkuLists.join(','),
        areaCode: areaCode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      success: function (res) {
        if (res.statusCode == 404) {
          object.failCallback && object.failCallback();
          return false;
        }
        let data = res.data;
        let dealData = {};
        if (data.success) {
          object.successCallback && object.successCallback(data);
        } else {
          object.failCallback && object.failCallback();
          return false;
        }
      },
      fail: function () {
        _this.priceError();
      }
    })
  },
  /**
   * @description 价格错误
   * @method priceError
   * @since 2018-03-16
   * @author xiejunmei
   * */
  priceError:function(){
    let _this = this;

    _this.setData({
      listData: []
    });
    _this.cancell

    wx.showToast({
      title: '很抱歉，服务器繁忙请稍后再试',
      icon: 'loading',
      mask: true,
      duration: 2000
    });
  },
  /**
     * @description 获取地址区域，先从缓存中获取区域，如果获取不到取默认的北京
     * @method getAreaCode
     * @return {String} cookieCode 区域码
     * @since 2018-03-16
     * @author xiejunmei
     * */
  getAreaCode: function () {
    //取cookie
    let codeCookies = wx.getStorageSync('codeCookies');
    let cookieCode;
    //如果cookie存在
    if (codeCookies && codeCookies[1]) {
      cookieCode = codeCookies[1];//取第2级（第1个）
    } else {
      cookieCode = 11010000 //默认北京市（2级）
    }
    return cookieCode;
  },
  /**
   *
     * @description 获取自定义活动页信息<br />
     * @method getList
     * @param {function} object.successCallback 表示成功后的回调函数
     * @param {function} object.failCallback 表示失败后的回调函数
     * @since 2018-04-12
     * @author 谢俊梅
     */
  getList: function (object) {
    let _this = this;
    let app = getApp();

    //加载中
    _this.showLoading();

    wx.request({
      url: app.cmsUrl + '/v1/cms/slot?unique_key='+_this.data.key,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': goHeader
      },
      method: 'GET',
      success: function (data) {
        if (data.statusCode == 200) {
          let listData = data.data.data.list;
          _this.cancelLoading();
          object.successCallback && object.successCallback(listData);
          
        } else {
          _this.cancelLoading();
          object.failCallback && object.failCallback();
        }
      }, fail: function () {
        _this.cancelLoading();
        object.failCallback && object.failCallback();
      }
    });
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
  onShareAppMessage: function () {
    var that=this;
    return {
      title: '国美，品质、低价、速达',
      desc: '品质、低价、速达',
      path: '/pages/activePage/activePage?key='+that.data.key
    }
  }
});