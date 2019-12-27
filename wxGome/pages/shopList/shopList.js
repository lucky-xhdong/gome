// 引入SDK核心类
var QQMapWX = require('../../lib/map/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var app = getApp();
var areaId;
Page({
  data: {
    loading: true, //初始化的loding
    height: '',
    shopList: [], //门店
    isShop: true, //门店数量大于1
    isShow: true, //是否授权
    showTip: 1, //等于1时显示您周边的门店，等于2时显示具体区域地址，等于3时未获取您的地理位置，允许授权展示附近门店
    area: '' //具体区域地址
  },
  ssUrl: app.ssUrl,
  ourHost: app.ourHost,
  goHeader: app.goHeader,
  onLoad: function(options) {
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' //此处使用你自己申请的key
    });
  },
  onShow: function() {
    var that = this;
    wx.getSystemInfo({ //获取系统信息
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px' //窗口高度
        })
      }
    });
    var countryCookies = wx.getStorageSync('countryCookies');
    var areaCookies = wx.getStorageSync('areaCookies');
    var area = areaCookies[0] + '   ' + areaCookies[1] + '  ' + areaCookies[2];
    that.setData({
      shopList: [],
      area: area
    })
    /**
     * 如果存在countryCookies,显示区域地址；
     * 如果不存在，未授权的时候展示朝阳区地址，授权展示附近区域
     * */
    if (countryCookies) {
      areaId = countryCookies;
      that.setData({
        showTip: 2
      })
      that.getNoDistance();
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          var lat = res.latitude;
          var lng = res.longitude;
          wx.setStorageSync("latCookies", res.latitude);
          wx.setStorageSync("lngCookies", res.longitude);
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: lat,
              longitude: lng
            },
            success: function(res) {
              var city = res.result.address_component.city;
              var district = res.result.address_component.district;
              that.setData({
                showTip: 1
              })
              that.getAreaId(city, district, lat, lng);
            },
            fail: function(res) {
              console.log(res);
            }
          });

        },
        fail: function(res) {
          areaId = 11010200;
          that.setData({
            showTip: 3
          })
          that.getNoDistance();
        }
      })
    }
  },
  //获取区域ID 
  getAreaId: function(city, district, lat, lng) {
    var that = this;
    wx.request({
      url: that.ourHost + '/divisionMst/findMstDivision',
      method: 'POST',
      data: {
        threeName: district,
        cityName: city

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        areaId = res.data.threeDivisionMst;
        that.getDistance(lat, lng);
      }
    })
  },
  /**
   * 获取门店列表，按照距离远近排序
   */
  getDistance: function(lat, lng) {
    var that = this;
    var radLat1 = that.Rad(lat);
    wx.request({
      url: that.ssUrl + '/item/v1/d/extends/regionable/' + areaId + '/0/flag/item',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        var sList = res.data.result;
        if (sList && sList.length > 0) {
          that.setData({
            isShop: true
          })
          for (var i = 0; i < sList.length; i++) {
            var radLat2 = that.Rad(sList[i].lat);
            var a = radLat1 - radLat2;
            var b = that.Rad(lng) - that.Rad(sList[i].lng);
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378.137; // EARTH_RADIUS;
            s = Math.floor(s * 10000) / 10000; //输出为公里
            sList[i].distance = s;
          }
          /**
           * 按照距离进行门店排序
           * compare.prop为按照什么样的属性来进行排序
           * 先把属性值转化为数字（有可能为NaN），转换为数字后比较
           * **/
          var compare = function(prop) {
            return function(obj1, obj2) {
              var val1 = obj1[prop];
              var val2 = obj2[prop];
              if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
              }
              if (val1 < val2) {
                return -1;
              } else if (val1 > val2) {
                return 1;
              } else {
                return 0;
              }
            }
          }
          sList.sort(compare("distance"));

          /**
           * 如果门店距离低于1千米，显示多少米。整数
           * 如果门店距离大于1千米，显示多少千米，两位数。
           * **/
          for (var h = 0; h < sList.length; h++) {
            if (sList[h].distance < 1) {
              sList[h].distance = parseInt(sList[h].distance * 1000) + '米'
            } else {
              sList[h].distance = sList[h].distance.toFixed(2) + '千米';
            }
          }

          that.setData({
            loading: false,
            shopList: sList,
            isShow: true
          })

        } else {
          that.setData({
            loading: false,
            isShop: false
          })
        }
      },
      fail: function() {
        // fail  
      },
      complete: function() {
        // complete  
      }
    })
  },
  /*拒绝授权时获取门店展示*/
  getNoDistance: function() {
    var that = this;
    wx.request({
      url: that.ssUrl + '/item/v1/d/extends/regionable/' + areaId + '/0/flag/item',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      success: function(res) {
        var sList = res.data.result;
        if (sList && sList.length > 0) {
          that.setData({
            isShop: true,
            loading: false,
            shopList: sList,
            isShow: false
          })
        } else {
          that.setData({
            loading: false,
            isShop: false,
            isShow: false
          })
        }
      },
      fail: function() {
        // fail  
      },
      complete: function() {
        // complete  
      }
    })
  },
  Rad: function(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  },
  //拨打电话 
  callPhone: function(e) {
    var num = e.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: num
    })
  },
  // 查看地图
  shopMap: function(e) {
    var lat = Number(e.currentTarget.dataset.lat),
      lng = Number(e.currentTarget.dataset.lng),
      name = e.currentTarget.dataset.name,
      address = e.currentTarget.dataset.address;
    console.log(lat, lng, name, address)
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 18,
      name: name,
      address: address,
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      }
    })


  },
  // 点击允许授权
  getEmpower: function(e) {
    var that = this;
    wx.openSetting({
      success: (re) => {
        re.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true
        };
        wx.getLocation({
          type: 'wgs84',
          success: function(res) {
            var lat = res.latitude;
            var lng = res.longitude;
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: lat,
                longitude: lng
              },
              success: function(ress) {
                var city = ress.result.address_component.city;
                var district = ress.result.address_component.district;
                that.setData({
                  showTip: 1
                })
                that.getAreaId(city, district, lat, lng);
              },
              fail: function(res) {
                console.log(res);
              }
            });

          },
          fail: function(res) {
            areaId = 11010200;
            that.setData({
              showTip: 3
            })
            that.getNoDistance();
          }
        })
      }
    })
  }
})