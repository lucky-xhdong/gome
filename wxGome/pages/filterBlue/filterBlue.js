/**
 * modify:蓝券反查增加筛选选项
 * date:2018-01-11
 * author:lily
 * */
var app = getApp();
var goHeader = app.goHeader;
var GOME = "GOME";
var GOODS = "GOODS";
// 蓝券反查接口默认参数值
var SEARCH_BLUE_LISTS_PARAS;
var DEFAULT_OPERATION;
var DEFAULT_PRICE_RANGE = {
  minPrice: "",
  maxPrice: ""
};
var selectedFilter = {};//已选择的筛选项
var searchListsParas = {};//搜索列表参数
var couponType = 1;//券类型 1：全场 0：非全场
Page({
  data: {
    facets: {},
    operation: [],
    priceRange: Object.assign([], DEFAULT_PRICE_RANGE),
    selectClassify: [],
    selectBrand: [],
    address: ["北京", "北京", "朝阳区", "朝外街道"]
  },
  onLoad: function (options) {
    //用于筛选页后退时保留上一次从搜索页进来的数据
    var cacheSelectedFilter = wx.getStorageSync("cacheSelectedFilter") || {};//获取存入的筛选项
    wx.setStorageSync("selectedFilter", cacheSelectedFilter);

  
    couponType = wx.getStorageSync("couponType");//获取存入的筛选项
    SEARCH_BLUE_LISTS_PARAS = {
      pageSize: 20,
      pageNumber: 1,
      sort: 0,
      question: 0,
      catId: 0,
      facets: 0,
      productTag: 1,
      blueActivityId: options.copid,
      market: 12,
      priceTag: 0,
      price: "0",
      instock: 1,
      promoFlag: 0,
      couponType: couponType,
      from: 'webchat'
    };
  },

  onShow: function () {
    var that = this;
    if (wx.getStorageSync("labelCookies")) {
      var address = wx.getStorageSync("labelCookies");
      that.setData({
        address: address
      })
    }
    var facets = wx.getStorageSync("facets");//获取分类和品牌数据
    this.setData({
      facets: facets
    })

    if (facets.promoInfo) {
      this.setData({
        operation: facets.promoInfo
      })
    }
    that._dealData();
  },

  /**
   * @description 通过获取数据，展示客户选择的项
   * @method _dealData
   * @since 2017-05-26
   * @author liusuling
   * */
  _dealData: function () {

    searchListsParas = Object.assign({}, SEARCH_BLUE_LISTS_PARAS);//获取蓝券搜索列表接口默认的参数
    selectedFilter = wx.getStorageSync("selectedFilter") || {};//获取存入的筛选项
    var operation = (selectedFilter.operation ? selectedFilter.operation : this.data.operation);
    this.setData({
      operation: operation
    })

    var selectClassify = this.data.selectClassify;
    var selectBrand = this.data.selectBrand;
    //点击分类和品牌还需保留已选择的值
    //价格区间
    var priceRange = (selectedFilter.priceRange ? selectedFilter.priceRange : Object.assign({}, DEFAULT_PRICE_RANGE));
    this.setData({
      priceRange: priceRange
    })
    //分类
    if (selectedFilter.selectClassify) {
      selectClassify = selectedFilter.selectClassify;
    } else {
      selectClassify = {
        "id": "0",
        "name": "全部",
        "select": true
      };
    }
    //品牌
    selectBrand = (selectedFilter.selectBrand ? selectedFilter.selectBrand : []);
    this.setData({
      selectClassify: selectClassify,
      selectBrand: selectBrand
    })
  },

  /**
   * @description 国美自营和仅看有货事件
   * @method _optChangeEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _optChangeEvt: function (ev) {
    var types = ev.detail.value;
    var operation = this.data.operation;
    for (var i = 0; i < operation.length; i++) {
      for (var j = 0; j < types.length; j++) {
        if (operation[i].type == types[j]) {
          operation[i].selected = true;
          break;
        } else {
          operation[i].selected = false;
        }
      }

      if (types.length == 0) { operation[i].selected = false; }
    }
    selectedFilter.operation = Object.assign([], operation);
    wx.setStorageSync("selectedFilter", selectedFilter);
    this.setData({
      operation: operation
    })
  },

  /**
   * @description 价格区间失去焦点事件
   * @method _PriceEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _PriceEvt: function (ev) {
    var value = ev.detail.value;
    var mark = ev.target.dataset.priceMark;
    var priceRange = this.data.priceRange;
    if (value !== '') {
      value = Number(value.trim()) + '';//都变成字符串类型
    }

    if (mark == 'min') {
      priceRange.minPrice = value;
    } else {
      priceRange.maxPrice = value;
    }
    selectedFilter.priceRange = Object.assign({}, priceRange);
    wx.setStorageSync("selectedFilter", selectedFilter);
    this.setData({
      priceRange: priceRange
    })
  },

  /**
   * @description 重置事件
   * @method _resetEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _resetEvt: function (ev) {
    wx.removeStorageSync("selectedFilter");
    wx.removeStorageSync("cacheSelectedFilter");
    wx.removeStorageSync("searchListsParas");
    var facets = wx.getStorageSync('facets');
    if (facets.promoInfo) {
      this.setData({
        operation: facets.promoInfo
      })
    }
    this._dealData();
  },

  /**
   * @description 确定事件，为了实现存入搜索列表要接口要请求的参数
   * @method _confirmEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _confirmEvt: function (ev) {

    var operation = this.data.operation;
    var priceRange = this.data.priceRange;
    var minPrice = Number(priceRange.minPrice);
    var maxPrice = Number(priceRange.maxPrice);
    var selectClassify = this.data.selectClassify;
    var selectBrand = this.data.selectBrand;
    selectedFilter.selectClassify = selectClassify;
    selectedFilter.selectBrand = selectBrand;
    selectedFilter.operation = operation;
    /**
     价格区间：最低价、最高价，只可以填写正整数，无法输入“.”、“-”：
     1)  允许填写最大值：999999
     2)  允许填写最小值：0
     3)  输入000000，输入框失去鼠标焦点时，变为0
     4)  输入00..x，输入框失去鼠标焦点时，变为x
     5)  如果最低价数值>最高价数值，点击确定后，最低价和最高价数值换位。举例：最低价输入99，最高价输入0，点击确定，筛选出0-99之间的商品，保存最低价=0，最高价=99。
     6)  如果最低价=最高价，
         a)  最低价=最高价=0，筛选出价格大于0的商品，保存最低价=0，最高价为空
         b)  否则，即可筛选出此价格商品，保存输入的最低价和最高价
     7)  如果仅填写最高价：
         a)  最高价=0，筛选无效，保存最低价、最高价都为空
         b)  最高价=999999，筛选出价格小于999999的商品，保存最高价=999999，最低价=0
         c)  最高价=其他，筛选出小于最高价的商品，保存最高价，最低价=0
     8)  如果仅填写最低价：筛选出大于最低价的商品，保存最低价，最高价为空    

     经过以上的改变后最低价和最高价存在以下几种情况:
         ('','')、('0','')、('0','yy')、('xx','yy')且xx<=yy

     */

    if (maxPrice > 0) {//需要考虑最低价是否填写，以及最低价大于最高价
      if (minPrice > maxPrice) {//如果最低价数值>最高价数值，点击确定后，最低价和最高价数值换位
        priceRange.minPrice = maxPrice + '';
        priceRange.maxPrice = minPrice + '';
      } else {//minPrice为0、''、小于maxPrice且>0，只有为''的时候需要改变
        if (priceRange.minPrice === '') { priceRange.minPrice = '0'; }//如果仅填写最高价，最低价自动为0
      }
    } else {//maxPrice为0、'',minPrice为0、''、>0的数值
      //最低价=最高价=0，筛选出价格大于0的商品，保存最低价=0，最高价为空
      //如果仅填写最低价：筛选出大于最低价的商品，保存最低价，最高价为空
      //最高价=0，筛选无效，保存最低价、最高价都为空
      priceRange.maxPrice = '';
    }

    selectedFilter.priceRange = priceRange;

    this.dealsearchListsParas();
    wx.setStorageSync("selectedFilter", selectedFilter);
    wx.setStorageSync("cacheSelectedFilter", selectedFilter);
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * @description 处理搜索列表数据的参数<br />
   * @method dealsearchListsParas
   * @since 2017-05-24
   * @author liusuling
   */
  dealsearchListsParas: function () {

    /* var searchListsParas = {
         catId: 0,//分类 ID,默认可传 0
         market: 10,//海外购标识,10：全部商品 11：海外购商品 12 ：非海外购商品
         facets: 0,//品牌参数，默认传0
         productTag: 0,//0：全部商品 1：国美自营
         priceTag: 0,//0：不生效 1：生效
         price: "0x*",//价格区间值
         instock: 0,//0:显示所有商品 1:仅显示有货,
         isFilter: false//是否筛选
     };*/
    var operation = selectedFilter.operation;
    var priceRange = selectedFilter.priceRange;
    var selectClassify = selectedFilter.selectClassify;
    var selectBrand = selectedFilter.selectBrand;
    var minPrice = Number(priceRange.minPrice);
    var maxPrice = Number(priceRange.maxPrice);
    var isFilter = false;//是否有筛选标识

    //是否选择了国美自营以及仅看有货
    for (var i = 0; i < operation.length; i++) {
      if (operation[i].selected) {
        isFilter = true;
        if (operation[i].type) { searchListsParas.promoFlag = 1; }
      }
    }

    /*价格区间
    经过以上的改变后最低价和最高价存在以下几种情况:
        ('','')、('0','')、('0','yy')、('xx','')、('xx','yy')且xx<=yy
    */
    if (maxPrice > 0) {//表示最高价是有值
      isFilter = true;
      searchListsParas.priceTag = 1;
      searchListsParas.price = minPrice + 'x' + maxPrice;
    } else {//maxPrice = 0，表示最大值有可能为''或者为0
      if (priceRange.minPrice !== '') {
        isFilter = true;
        searchListsParas.priceTag = 1;
        searchListsParas.price = minPrice + 'x*';
      }
    }

    //分类
    if (selectClassify) {
      isFilter = true;
      searchListsParas.catId = selectClassify.id;
    }

    //品牌
    if (selectBrand.length > 0) {
      isFilter = true;
      searchListsParas.facets = '';
      for (var i = 0; i < selectBrand.length; i++) {
        searchListsParas.facets += selectBrand[i].id;
      }
    }
    searchListsParas.isFilter = isFilter;
    wx.setStorageSync("searchListsParas", searchListsParas);
  },
  // 跳转地址选择页
  goToAddress:function(){
    wx.navigateTo({
      url: '../getAddress/getAddress'
    })
  },
  // 跳转品牌选择
  goToFilterBrandBlue:function(){
    wx.navigateTo({
      url: '../filterBrandBlue/filterBrandBlue'
    })
  },
  // 跳转分类选择
  goToFilterClassifyBlue:function(){
    wx.navigateTo({
      url: '../filterClassifyBlue/filterClassifyBlue'
    })
  }

});