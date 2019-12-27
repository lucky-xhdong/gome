var app = getApp();
var goHeader = app.goHeader;
var selectedFilter = {};//已选择的筛选项

Page({
  data: {
    brand: [],
    selectBrand: [],
    addressId: ["11000000", "11010000", "11010200", "110102002"]
  },
  onLoad: function () {
    this._init();
  },
  onShow: function () {
    if (wx.getStorageSync('codeCookies')) {
      var codeCookies = wx.getStorageSync('codeCookies');
      that.setData({
        addressId: codeCookies
      })
    }
  },

  /**
   * @description 初始化数据结构<br />
   * @method _init
   * @since 2017-05-24
   * @author liusuling
   */
  _init: function () {
    selectedFilter = {};
    this._dealData();
  },

  /**
   * @description 通过获取数据，展示客户选择的项
   * @method _dealData
   * @since 2017-05-26
   * @author liusuling
   * */
  _dealData: function () {
    var that = this;
    var brand = wx.getStorageSync("facets").brand.items;
    selectedFilter = wx.getStorageSync("selectedFilter") || {};
    if (!selectedFilter.selectBrand) { selectedFilter.selectBrand = []; }
    var selectBrand = selectedFilter.selectBrand;

    var selectArr = [];
    for (var i = 0; i < selectBrand.length; i++) {
      selectArr.push(selectBrand[i].id);
    }
    that.setData({
      brand: brand
    })

    that._dealSelectedData(selectArr);

  },

  /**
   * @description 选择品牌事件
   * @method _selectChangeEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _selectChangeEvt: function (ev) {
    var selectArr = ev.detail.value;

    this._dealSelectedData(selectArr);

  },

  /**
   * @description 重置事件
   * @method _resetEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _resetEvt: function (ev) {
    this._dealSelectedData([]);
  },

  /**
   * @description 确认事件
   * @method _confirmEvt
   * @since 2017-05-26
   * @author liusuling
   * */
  _confirmEvt: function (ev) {
    selectedFilter.selectBrand = this.data.selectBrand;
    wx.setStorageSync("selectedFilter", selectedFilter);
    var selectBrandId = '';
    if (selectedFilter.selectBrand.length > 0 && selectedFilter.selectBrand.length < 16) {
      for (var i = 0; i < selectedFilter.selectBrand.length; i++) {
        selectBrandId += selectedFilter.selectBrand[i].id;
      }
    } else if (selectedFilter.selectBrand.length > 15) {
      wx.showToast({
        title: '最多选择15个品牌',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      selectBrandId = 0;
    }
    this.getClassList(selectBrandId);

  },
  /**
   * @description 如果券类型为非全场时，搜索分类列表
   * @method _confirmEvt
   * @since 2018-02-05
   * @author lily
   * */
  getClassList: function (selectBrandId) {
    var that = this;
    var couponUrl = app.apisUrl + '/p/blue';//蓝券反查接口
    var paras = wx.getStorageSync("blueSerchList");
    if (paras && paras.couponType == 0) {
      var searchListsUrl = `${couponUrl}/${paras.pageSize}/${paras.pageNumber}/${paras.sort}/${paras.copid}/${paras.catId}/${selectBrandId}/${paras.priceTag}/${paras.price}/${paras.question}/${paras.productTag}/${paras.instock}/${paras.promoFlag}/${paras.couponType}?from=${paras.from}`;
      wx.request({
        url: searchListsUrl,
        data: {},
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': goHeader,
          'Cookie': 'atgregion=' + that.data.addressId[2]
        },
        success: function (res) {
          if (res.data.content.category.categoryTree) {
            var category = res.data.content.category.categoryTree;
            var categoryList = [];
            for (var i = 0; i < category.length; i++) {
              if (category[i].childs.length > 0) {
                for (var j = 0; j < category[i].childs.length; j++) {
                  if (category[i].childs[j].childs.length > 0) {
                    for (var k = 0; k < category[i].childs[j].childs.length; k++) {
                      categoryList.push({
                        "id": category[i].childs[j].childs[k].id,
                        "name": category[i].childs[j].childs[k].name,
                        "select": false
                      });

                    }
                  }
                }
              }
            }
            var facets = wx.getStorageSync("facets");
            facets.hotCategory = categoryList;
            wx.setStorageSync('facets', facets);
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }

  },

  /**
   * @description 处理被选中的值<br />
   * @method _dealSelectedData
   * @param {Array} selectArr 选中值的id集合
   * @since 2017-05-23
   * @author liusuling
   */
  _dealSelectedData: function (selectArr) {
    var that = this;

    var brand = that.data.brand;
    var selectBrand = [];
    for (var i = 0; i < brand.length; i++) {
      for (var j = 0; j < selectArr.length; j++) {
        if (brand[i].id == selectArr[j]) {
          selectBrand.push({
            id: brand[i].id,
            value: brand[i].value
          });
          brand[i].selected = true;
          break;
        } else {
          brand[i].selected = false;
        }
      }
      if (selectArr.length == 0) {
        brand[i].selected = false;
      } else if (selectArr.length > 15){
        wx.showToast({
          title: '最多选择15个品牌',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }

    that.setData({
      brand: brand,
      selectBrand: selectBrand
    })
  }

});