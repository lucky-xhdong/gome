var app = getApp();
var regionUrl = app.ssUrl + '/item/v1/region/';//4级区域接口
var QQMapWX = require('../../lib/map/qqmap-wx-jssdk.min.js');
var provinceJson = [
  { code: "11000000", label: "北京" },
  { code: "12000000", label: "天津" },
  { code: "13000000", label: "河北省" },
  { code: "14000000", label: "山西省" },
  { code: "15000000", label: "内蒙古" },
  { code: "21000000", label: "上海" },
  { code: "22000000", label: "浙江省" },
  { code: "23000000", label: "江苏省" },
  { code: "24000000", label: "安徽省" },
  { code: "25000000", label: "福建省" },
  { code: "26000000", label: "山东省" },
  { code: "31000000", label: "广东省" },
  { code: "32000000", label: "广西" },
  { code: "33000000", label: "海南省" },
  { code: "41000000", label: "湖北省" },
  { code: "42000000", label: "湖南省" },
  { code: "43000000", label: "河南省" },
  { code: "44000000", label: "江西省" },
  { code: "51000000", label: "黑龙江省" },
  { code: "52000000", label: "吉林省" },
  { code: "53000000", label: "辽宁省" },
  { code: "61000000", label: "宁夏" },
  { code: "62000000", label: "新疆" },
  { code: "63000000", label: "青海省" },
  { code: "64000000", label: "陕西省" },
  { code: "65000000", label: "甘肃省" },
  { code: "71000000", label: "四川省" },
  { code: "72000000", label: "云南省" },
  { code: "73000000", label: "贵州省" },
  { code: "74000000", label: "重庆市" },
  { code: "75000000", label: "西藏" },
  { code: "81000000", label: "台湾省" },
  { code: "82000000", label: "香港" },
  { code: "83000000", label: "澳门" },
  { code: "84000000", label: "钓鱼岛" }
], province = [];//省级容器
var cityJson = [], city = [];//市级容器
var countryJson = [], country = [];//区县级容器

Page({
  data: {
    height: '',
    province: [],//省
    provinceJson: [],
    provinceIndex: 0,
    provinceFlag: false,

    city: [],//市
    cityJson: [],
    cityIndex: 0,
    cityFlag: false,
    cityDisabled: false,

    country: [],//区
    countryJson: [],
    countryIndex: 0,
    countryFlag: false
  },
  goHeader: app.goHeader,
  ourHost: app.ourHost,
  ssUrl: app.ssUrl,
  onLoad: function (options) {
    var that = this;
    that.setData({
      city: city,
      province: ["北京", "天津", "河北省", "山西省", "内蒙古", "上海", "浙江省", "江苏省", "安徽省", "福建省", "山东省", "广东省", "广西", "海南省", "湖北省", "湖南省", "河南省", "江西省", "黑龙江省", "吉林省", "辽宁省", "宁夏", "新疆", "青海省", "陕西省", "甘肃省", "四川省", "云南省", "贵州省", "重庆市", "西藏", "台湾省", "香港", "澳门", "钓鱼岛"],
      provinceJson: [{ code: "", label: "-- 请选择 --" }],
      cityJson: [{ code: "", label: "-- 请选择 --" }],
      cityIndex: 0,
      countryJson: [{ code: "", label: "-- 请选择 --" }],
      cityFlag: true,
      countryFlag: true
    });
    wx.getSystemInfo({ //获取系统信息
      success: function (res) {
        that.setData({
          height: res.windowHeight + 'px'  //窗口高度
        })
      }
    });

  },
  /**选择省份得出对应市级* */
  bindPickerProvince: function (e) {
    var that = this;
    that.setData({
      city: [],
      country: [],
      provinceJson: provinceJson,
      provinceIndex: e.detail.value
    });

    //请求市级
    wx.request({
      url: regionUrl + that.data.provinceJson[that.data.provinceIndex].code + "/2/flag/item_web/",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      complete: function (res) {
        cityJson = res.data.result.division;
        city = [];//清空
        for (var i = 0; i < cityJson.length; i++) {
          city.push(cityJson[i].label);
        }
        that.setData({
          city: city,
          cityJson: [{ code: "", label: "-- 请选择 --" }],
          cityIndex: 0,
          countryJson: [{ code: "", label: "-- 请选择 --" }],
          cityFlag: true,
          countryFlag: true
        });
      }
    });
  },
  /**选择市级得出对应区/县*/
  bindPickerCity: function (e) {
    var that = this;
    if (this.data.provinceJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的省份',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else {
      this.setData({
        country: [],
        street: [],
        city: city,
        cityJson: cityJson,
        cityIndex: e.detail.value
      });
      //请求区/县级
      wx.request({
        url: regionUrl + that.data.cityJson[that.data.cityIndex].code + "/3/flag/item_web/",
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': that.goHeader
        },
        complete: function (res) {
          countryJson = res.data.result.division;
          country = [];
          for (var i = 0; i < countryJson.length; i++) {
            country.push(countryJson[i].label);
          }
          that.setData({
            country: country,
            countryJson: [{ code: "", label: "-- 请选择 --" }],
            countryIndex: 0,
            streetJson: [],
            countryFlag: true
          });
        }
      });
    }
  },
  /**选择区/县*/
  bindPickerCountry: function (e) {
    var that = this;
    if (this.data.provinceJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的省份',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else if (this.data.cityJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的市',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else {
      this.setData({
        street: [],
        country: country,
        countryJson: countryJson,
        countryIndex: e.detail.value
      });
    }

  },
  //确认地址
  confirmCheck: function () {
    var that = this;
    if (that.data.provinceJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的省份',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else if (that.data.cityJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的市',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else if (that.data.countryJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的区/县',
        icon: 'loading',
        duration: 1000
      });
      return false;
    } else {
      console.log(that.data.countryJson[that.data.countryIndex].code);
      var countryCookies = that.data.countryJson[that.data.countryIndex].code;
      wx.setStorageSync("countryCookies", countryCookies);
      var areaCookies = [that.data.provinceJson[that.data.provinceIndex].label, that.data.cityJson[that.data.cityIndex].label, that.data.countryJson[that.data.countryIndex].label];
      wx.setStorageSync("areaCookies", areaCookies);
      wx.navigateBack({
        delta: 1
      })
    }

  },
  /**
   * 点击附近门店，如果已经授权过，清楚countryCookies,并关闭当前页面
   * 未授权的话默认在当前页面
   * */ 
  getEmpowerShop: function (e) {
    var that = this;
    var lat = wx.getStorageSync('latCookies');
    var lng = wx.getStorageSync('lngCookies');
    if (lat && lng) {
      wx.removeStorageSync('countryCookies');
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.openSetting({
        success: (ress) => {
          ress.authSetting = {
            "scope.userInfo": true,
            "scope.userLocation": true
          }
          wx.getLocation({
            success: function (res) {
              wx.setStorageSync("latCookies", res.latitude);
              wx.setStorageSync("lngCookies", res.longitude);
              wx.removeStorageSync('countryCookies');
              wx.navigateBack({
                delta: 1
              })
            },
            fail: function (res) {
             console.log(res)
            }
          })
        }

      })

    }
  }
})