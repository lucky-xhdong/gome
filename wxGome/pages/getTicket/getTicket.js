/**
 *  集客门店入场券领取
 *  @since 2018-09-11
 *  @author Lilian
 *  @产品  周涛
 */
let app = getApp();
let provinceJson = [{
      code: "11000000",
      label: "北京"
    },
    {
      code: "12000000",
      label: "天津"
    },
    {
      code: "13000000",
      label: "河北省"
    },
    {
      code: "14000000",
      label: "山西省"
    },
    {
      code: "15000000",
      label: "内蒙古"
    },
    {
      code: "21000000",
      label: "上海"
    },
    {
      code: "22000000",
      label: "浙江省"
    },
    {
      code: "23000000",
      label: "江苏省"
    },
    {
      code: "24000000",
      label: "安徽省"
    },
    {
      code: "25000000",
      label: "福建省"
    },
    {
      code: "26000000",
      label: "山东省"
    },
    {
      code: "31000000",
      label: "广东省"
    },
    {
      code: "32000000",
      label: "广西"
    },
    {
      code: "33000000",
      label: "海南省"
    },
    {
      code: "41000000",
      label: "湖北省"
    },
    {
      code: "42000000",
      label: "湖南省"
    },
    {
      code: "43000000",
      label: "河南省"
    },
    {
      code: "44000000",
      label: "江西省"
    },
    {
      code: "51000000",
      label: "黑龙江省"
    },
    {
      code: "52000000",
      label: "吉林省"
    },
    {
      code: "53000000",
      label: "辽宁省"
    },
    {
      code: "61000000",
      label: "宁夏"
    },
    {
      code: "62000000",
      label: "新疆"
    },
    {
      code: "63000000",
      label: "青海省"
    },
    {
      code: "64000000",
      label: "陕西省"
    },
    {
      code: "65000000",
      label: "甘肃省"
    },
    {
      code: "71000000",
      label: "四川省"
    },
    {
      code: "72000000",
      label: "云南省"
    },
    {
      code: "73000000",
      label: "贵州省"
    },
    {
      code: "74000000",
      label: "重庆市"
    },
    {
      code: "75000000",
      label: "西藏"
    },
    {
      code: "81000000",
      label: "台湾省"
    },
    {
      code: "82000000",
      label: "香港"
    },
    {
      code: "83000000",
      label: "澳门"
    },
    {
      code: "84000000",
      label: "钓鱼岛"
    }
  ],
  province = []; //省级容器
let cityJson = [],
  city = []; //市级容器
let countryJson = [],
  country = []; //区县级容器
let streetJson = [],
  street = []; //乡镇级容器
let regionUrl = app.ssUrl + '/item/v1/region/'; //4级区域接口

let scn;
Page({
  data: {
    height: 0,
    activityId: '', //活动Id
    bespokeProduct: '', //预约商品,多个使用|线分隔
    storeCode: '', //门店Id
    staffId: '', //员工Id
    regionCode: '', //区域_大区编码
    division1Code: '', //区域_一级分部编码
    division2Code: '', //区域_二级分部编码
    imgSrc: '', //门票活动地址
    name: '', //用户名
    nameClear: '', //清除用户名
    list: [], //全部商品品类列表
    category: [], //选择的商品品类
    loading: false,
    selectShow: false, //显示关注的产品弹框
    addressShow: false, //显示区域地址弹框
    share: false,
    categoryValue: "",
    province: [], //省
    provinceJson: [],
    provinceIndex: 0,
    provinceFlag: false,

    city: [], //市
    cityJson: [],
    cityIndex: 0,
    cityFlag: false,
    cityDisabled: false,

    country: [], //区
    countryJson: [],
    countryIndex: 0,
    countryFlag: false,


    street: [], //乡镇
    streetJson: [],
    streetIndex: 0,
    streetFlag: false,

    addressInfo: '', //详细地址信息

  },
  onLoad: function(options) {
    let that = this;
    let height = wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight + 'px'
        })
      },
    })
    // 活动Id
    if (options.activityId) {
      that.setData({
        activityId: options.activityId
      })
    }
    //预约商品
    if (options.bespokeProduct) {
      that.setData({
        bespokeProduct: options.bespokeProduct
      })
    }
    if (options.storeCode) {
      that.setData({
        storeCode: options.storeCode
      })
    }
    if (options.userId) {
      that.setData({
        staffId: options.userId
      })
    }
    //区域_大区编码
    if (options.regionCode) {
      that.setData({
        regionCode: options.regionCode
      })
    }
    //区域_一级分部编码
    if (options.division1Code) {
      that.setData({
        division1Code: options.division1Code
      })
    }
    //区域_二级分部编码
    if (options.division2Code) {
      that.setData({
        division2Code: options.division2Code
      })
    }

  },
  onShow: function() {
    let that = this;
    scn = app.getScn();
    wx.showLoading({
      title: '加载中...',
    })
    that.init();

  },
  // 初始化
  init: function() {
    let that = this;

    that.setData({
      loading: true
    })
    that.getImgSrc();

    if (!wx.getStorageSync('categorylist')) {
      that.getCategoryList();
    } else {
      var list = wx.getStorageSync('categorylist');
      var categoryValue = [];
      for (var item of list) {
        if (item.select == true) {
          categoryValue.push(item);
        }
      }
      if (categoryValue.length > 0) {
        that.setData({
          categoryValue: '您已选择' + categoryValue.length + '类商品'
        })
      }
      that.setData({
        list: list
      })
    }

    // 如果四级区域有缓存，则读取缓存。没有则置空
    if (wx.getStorageSync('codeTicket')) {

      that.initAddress();
    } else {
      that.setData({
        city: city,
        province: ["北京", "天津", "河北省", "山西省", "内蒙古", "上海", "浙江省", "江苏省", "安徽省", "福建省", "山东省", "广东省", "广西", "海南省", "湖北省", "湖南省", "河南省", "江西省", "黑龙江省", "吉林省", "辽宁省", "宁夏", "新疆", "青海省", "陕西省", "甘肃省", "四川省", "云南省", "贵州省", "重庆市", "西藏", "台湾省", "香港", "澳门", "钓鱼岛"],
        provinceJson: [{
          code: "",
          label: "-- 请选择 --"
        }],
        cityJson: [{
          code: "",
          label: "-- 请选择 --"
        }],
        cityIndex: 0,
        countryJson: [{
          code: "",
          label: "-- 请选择 --"
        }],
        streetIndex: 0,
        streetJson: [{
          code: "",
          label: "-- 请选择 --"
        }],
        cityFlag: true,
        countryFlag: true,
        streetFlag: true,
        address: '',
      });
      wx.hideLoading();
    }
    // 如果详细地区有缓存，则读取缓存。没有则置空

    if (wx.getStorageSync('addressInfoTicket')) {
      var addressInfo = wx.getStorageSync('addressInfoTicket');
      that.setData({
        addressInfo: addressInfo
      })
    }


    if (wx.getStorageSync('nameTicket')) {
      var name = wx.getStorageSync('nameTicket');
      that.setData({
        name: name
      })
    }

  },
  //如果有缓存地址的选择
  initAddress: function() {
    let that = this;
    var para = {
      url: app.ourHost,
      scn: scn
    };
    var areaTicket = wx.getStorageSync('areaTicket');
    var address = areaTicket.join(' ');

    that.setData({
      cityFlag: true,
      countryFlag: true,
      streetFlag: true,
      address: address
    });
    //请求省级
    that.setData({
      province: ["北京", "天津", "河北省", "山西省", "内蒙古", "上海", "浙江省", "江苏省", "安徽省", "福建省", "山东省", "广东省", "广西", "海南省", "湖北省", "湖南省", "河南省", "江西省", "黑龙江省", "吉林省", "辽宁省", "宁夏", "新疆", "青海省", "陕西省", "甘肃省", "四川省", "云南省", "贵州省", "重庆", "西藏", "台湾省", "香港", "澳门", "钓鱼岛"],
      provinceJson: provinceJson
    });

    //取cookie
    var codeCookies = wx.getStorageSync('codeTicket');
    var storageProvinceCode = codeCookies[0]; //取第一级（第0个）

    //如果有cookie
    if (storageProvinceCode) {
      var codeIndex;
      for (var i in that.data.provinceJson) {
        if (that.data.provinceJson[i].code == storageProvinceCode) {
          codeIndex = i;
          that.setData({
            provinceIndex: codeIndex
          });
        }
      }
    } else {
      that.setData({
        provinceIndex: 0 //默认设置0
      });
    }
    //请求市级
    wx.request({
      url: regionUrl + that.data.provinceJson[that.data.provinceIndex].code + "/2/flag/item_web/",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': app.goHeader
      },
      success: function(res) {
        cityJson = res.data.result.division;
        city = []; //清空
        for (var i = 0; i < cityJson.length; i++) {
          city.push(cityJson[i].label);
        }
        that.setData({
          city: city,
          cityJson: cityJson
        });
        //取cookie
        var storageCityCode = codeCookies[1]; //取第2级（第1个）

        //如果有cookie
        if (storageCityCode) {
          var codeIndex = 0;
          for (var i = 0; i < that.data.cityJson.length; i++) {
            if (that.data.cityJson[i].code == storageCityCode) {
              codeIndex = i;
            }
            that.setData({
              cityIndex: codeIndex
            });
          }
        } else {
          that.setData({
            cityIndex: 0 //默认设置0
          });
        }


        //请求区/县级
        wx.request({
          url: regionUrl + that.data.cityJson[that.data.cityIndex].code + "/3/flag/item_web/",
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'gome-header': app.goHeader
          },
          success: function(res) {
            countryJson = res.data.result.division;
            country = [];
            for (var item of countryJson) {
              country.push(item.label);
            }
            that.setData({
              country: country,
              countryJson: countryJson,
              //countryIndex:0//默认设置0
            });
            //取cookie
            var storageCountryCode = codeCookies[2]; //取第3级（第2个）

            //如果有cookie
            if (storageCountryCode) {
              var codeIndex;
              for (var i in that.data.countryJson) {
                if (that.data.countryJson[i].code == storageCountryCode) {
                  codeIndex = i;
                  that.setData({
                    countryIndex: codeIndex
                  });
                }

              }
            } else {
              that.setData({
                countryIndex: 0 //默认设置0
              });
            }
            //请求乡镇级
            wx.request({
              url: regionUrl + that.data.countryJson[that.data.countryIndex].code + "/4/flag/item_web/",
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': app.goHeader
              },
              success: function(res) {
                streetJson = res.data.result.division;
                street = [];
                for (var i = 0; i < streetJson.length; i++) {
                  street.push(streetJson[i].label);
                }
                that.setData({
                  street: street,
                  streetJson: streetJson,
                  //streetIndex:0,//默认设置0
                });
                //取cookie

                var storageStreetCode = codeCookies[3]; //取第4级（第3个）
                wx.hideLoading();
                //如果有cookie
                if (storageStreetCode) {
                  var codeIndex = 0;
                  for (var i in that.data.streetJson) {
                    if (that.data.streetJson[i].code == storageStreetCode) {
                      codeIndex = i;
                    }
                    that.setData({
                      streetIndex: codeIndex
                    });
                  }
                } else {
                  that.setData({
                    streetIndex: 0 //默认设置0
                  });
                }
              }
            });
          }
        });
      }
    });
  },
  // 输入名字
  getName: function(e) {
    let that = this,
      value = e.detail.value,
      len = value.length;
    that.setData({
      name: value,
      nameClear: (len ? true : false)
    });
    // wx.setStorageSync('nameTicket',that.data.name)
  },
  // 清除名字
  bindClearName: function() {
    let that = this;
    that.setData({
      name: '',
      nameClear: false
    })
    wx.removeStorageSync('nameTicket');
  },
  //输入名字获取焦点
  bindNameFocus: function(e) {
    let that = this,
      len = e.detail.value;
    that.setData({
      nameClear: (len ? true : false)
    })

  },

  //输入名字失去焦点
  bindNameBlur: function(e) {
    let that = this,
      value = e.detail.value,
      len = value.length;
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    that.setData({
      name: value,
      nameClear: (len ? true : false)
    })
    wx.setStorageSync('nameTicket', that.data.name)

  },
  // 选择商品品类
  selectEvent: function() {
    let that = this;
    that.setData({
      selectShow: true
    })
  },
  // 获取关注产品列表
  getImgSrc: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '//ticket/queryActivityInfoById',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        activityId: that.data.activityId
      },
      method: 'POST',
      success: function(res) {
        if (res.data.errCode == 'success') {
          that.setData({
            imgSrc: res.data.data.ticketImg
          })
        } else if (res.data.errCode == 'no_activity_data') {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errMsg,
            confirmColor: '#f20c59',
            showCancel: false,
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }

      }
    })
  },
  // 获取关注产品列表
  getCategoryList: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/ticket/category',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'GET',
      success: function(res) {
        let list = res.data;
        for (var item of list) {
          item.select = false;
        }

        that.setData({
          list: res.data
        })
      }
    })
  },
  //关闭商品品类
  closeSelectEvent: function() {
    let that = this;
    that.setData({
      selectShow: false
    })
  },

  //选择商品品类
  selectItemEvent: function(e) {
    let that = this;
    let list = that.data.list,
      id = e.target.dataset.id,
      index = e.target.dataset.index;
    list[index].select = !list[index].select;
    that.setData({
      list: list
    })
  },
  // 重置商品品类
  resetEvent: function() {
    let that = this;
    let list = that.data.list;
    for (var item of list) {
      item.select = false;
    }
    that.setData({
      list: list,
      category: [],
      categoryValue: ''
    })
  },
  // 确定商品品类
  selectConfrimEvent: function() {
    let that = this;
    let list = that.data.list;
    let category = [];
    for (var item of list) {
      if (item.select) {
        category.push(item.goodsTypeId)
      }
    }
    if (category.length > 0) {
      that.setData({
        categoryValue: '您已选择' + category.length + '类商品'
      })
    } else {
      that.setData({
        categoryValue: ''
      })
    }
    wx.setStorageSync('categorylist', list)
    that.setData({
      selectShow: false,
      category: category
    })
  },
  // 选择地区
  selectAddress: function() {
    let that = this;
    that.setData({
      addressShow: true
    })
  },

  //关闭地址选择
  closeAddressEvent: function() {
    let that = this;
    that.setData({
      addressShow: false
    })
  },
  /**选择省份得出对应市级* */
  bindPickerProvince: function(e) {
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
      success: function(res) {
        cityJson = res.data.result.division;
        city = []; //清空
        for (var i = 0; i < cityJson.length; i++) {
          city.push(cityJson[i].label);
        }
        that.setData({
          city: city,
          cityJson: [{
            code: "",
            label: "-- 请选择 --"
          }],
          cityIndex: 0,
          countryJson: [],
          streetJson: [],
          cityFlag: true,
          countryFlag: false,
          streetFlag: false
        });
      }
    });
  },
  /**选择市级得出对应区/县*/
  bindPickerCity: function(e) {
    var that = this;
    if (this.data.provinceJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的省份',
        icon: 'none',
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
        success: function(res) {
          countryJson = res.data.result.division;
          country = [];
          for (var i in countryJson) {
            country.push(countryJson[i].label);
          }
          that.setData({
            country: country,
            countryJson: [{
              code: "",
              label: "-- 请选择 --"
            }],
            countryIndex: 0,
            streetJson: [],
            countryFlag: true,
            streetFlag: false

          });
        }
      });
    }
  },
  /**选择区/县*/
  bindPickerCountry: function(e) {
    var that = this;
    if (that.data.provinceJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的省份',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (that.data.cityJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的市',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else {
      that.setData({
        street: [],
        country: country,
        countryJson: countryJson,
        countryIndex: e.detail.value
      });
      //请求乡镇级
      wx.request({
        url: regionUrl + that.data.countryJson[that.data.countryIndex].code + "/4/flag/item_web/",
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'gome-header': that.goHeader
        },
        success: function(res) {
          streetJson = res.data.result.division;
          street = [];
          for (var i in streetJson) {
            street.push(streetJson[i].label);
          }
          that.setData({
            street: street,
            streetJson: [{
              code: "",
              label: "-- 请选择 --"
            }],
            streetIndex: 0,
            streetFlag: true
          });
        }
      });

    }

  },
  /**选择乡镇/街道*/
  bindPickerStreet: function(e) {
    var that = this;
    this.setData({
      street: street,
      streetJson: streetJson,
      streetIndex: e.detail.value
    });


  },
  //确认地址
  confirmCheck: function() {
    var that = this;
    if (that.data.provinceJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的省份',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (that.data.cityJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的市',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (that.data.countryJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的区/县',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if (that.data.streetJson[0].code == "") {
      wx.showToast({
        title: '请选择正确的乡/镇',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else {
      var codeCookies = [
        that.data.provinceJson[that.data.provinceIndex].code, //一级
        that.data.cityJson[that.data.cityIndex].code, //二级
        that.data.countryJson[that.data.countryIndex].code, //三级
        that.data.streetJson[that.data.streetIndex].code //四级
      ];
      wx.setStorageSync("codeTicket", codeCookies);
      var areaCookies = [that.data.provinceJson[that.data.provinceIndex].label, that.data.cityJson[that.data.cityIndex].label, that.data.countryJson[that.data.countryIndex].label, that.data.streetJson[that.data.streetIndex].label];
      var address = areaCookies.join(' ');
      wx.setStorageSync("areaTicket", areaCookies);
      that.setData({
        addressShow: false,
        address: address
      })
    }

  },
  // 详细信息
  getAddressInfo: function(e) {
    let that = this;
    that.setData({
      addressInfo: e.detail.value
    });

  },

  //输入名字失去焦点
  bindAddressBlur: function(e) {
    let that = this,
      value = e.detail.value,
      len = value.length;
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    that.setData({
      addressInfo: value
    })
    wx.setStorageSync('addressInfoTicket', that.data.addressInfo)
  },
  //领取门票
  getTicket: function() {
    let that = this;
    if (that.data.name == '') {
      wx.showToast({
        title: '请输入姓名~',
        icon: 'none'
      })
    } else if (that.data.name.length == 1 || (!/^[a-zA-Z\u4e00-\u9fa5 \.()\·\_]+$/.test(that.data.name))) {
      wx.showToast({
        title: '姓名请输入2-10个字以内的中、英文~',
        icon: 'none'
      })
    } else if ((that.data.addressInfo.length > 0 && (!/^[0-9a-zA-Z\u4e00-\u9fa5\.()\·\_\(\)\[\]\【\】\|\||\-\——\#\,\。\，]+$/.test(that.data.addressInfo)))) {
      wx.showToast({
        title: '详细地址请输入小于40个字的中、英文和数字~',
        icon: 'none'
      })
    } else {
      that.checkPhone();
    }

  },
  // 校验是否绑定手机号
  checkPhone: function() {
    let that = this;
    wx.request({
      url: app.ourHost + '/ticket/checkMobile',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      data: {
        scn: scn
      },
      method: 'POST',
      success: function(res) {

        if (res.data.errMsg == 'ok') {
          that.checkTicket();
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.errMsg,
            confirmColor: '#f20c59',
            showCancel: false,
            success: function() {
              wx.navigateTo({
                url: '../loginEmpower/loginEmpower',
              })
            }
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '请稍后再试~',
          icon: 'none'
        })
      }
    })
  },
  // 领取门票接口
  checkTicket: function() {
    let that = this;
    let goodsTypeId = '';
    if (that.data.list.length > 0) {
      let typeList = [];
      for (var item of that.data.list) {
        if (item.select) {
          typeList.push(item.goodsTypeId);
        }
      }
      if (typeList.length > 0) {
        goodsTypeId = typeList.join(',');
      }
    }

    wx.request({
      url: app.ourHost + '/ticket/receiveActivity',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'gome-header': that.goHeader
      },
      data: {
        activityId: that.data.activityId, //活动Id
        goodsTypeId: goodsTypeId, //关注商品id 多个用逗号,分割	
        bespokeProduct: that.data.bespokeProduct, //预约商品,多个使用|线分隔
        userName: that.data.name, //购票人姓名
        addrStateCode: that.data.provinceJson[that.data.provinceIndex].code || '', //地址_省编码
        addrCityCode: that.data.cityJson[that.data.cityIndex].code || '', //地址_市编码
        addrCountyCode: that.data.countryJson[that.data.countryIndex].code || '', //地址_区县编码
        addrTownCode: that.data.streetJson[that.data.streetIndex].code || '', //地址_乡镇编码
        userAddress: that.data.addressInfo, //详细地址
        staffId: that.data.staffId, //员工Id
        storeCode: that.data.storeCode, //门店code
        regionCode: that.data.regionCode, //区域_一级分部编码
        division2Code: that.data.division2Code, //	区域_二级分部编码
        scn: scn
      },
      method: 'POST',
      success: function(res) {
        if (res.data.success) {
          if (res.data.errCode == 'ticket_already_receive') {


            // let time = setTimeout(() => {
            //   clearTimeout(time);
            //   if (that.data.staffId != '') {
            //     wx.redirectTo({
            //       url: '../collectorTicket/collectorTicket',
            //     })
            //   } else {
            //     wx.navigateBack({
            //       delta: 1
            //     })
            //   }

            // }, 3000)

            wx.showModal({
              title: res.data.errMsg,
              content: '点击跳转至我的门票',
              confirmText: '立即前往',
              confirmColor: '#f20c59',
              showCancel: false,
              success: function () {
                // clearTimeout(time);
                if (that.data.staffId != '') {
                  wx.redirectTo({
                    url: '../collectorTicket/collectorTicket',
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              },
            })

          } else {
            wx.removeStorageSync('nameTicket');
            wx.removeStorageSync('categorylist');
            wx.removeStorageSync('codeTicket');
            wx.removeStorageSync('areaTicket');
            wx.removeStorageSync('addressInfoTicket');
            wx.showModal({
              title: res.data.errMsg,
              content: '点击跳转至我的门票',
              confirmText: '立即前往',
              confirmColor: '#f20c59',
              showCancel: false,
              success: function() {
                if (that.data.staffId != '') {
                  wx.redirectTo({
                    url: '../collectorTicket/collectorTicket',
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })

          }

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '请稍后再试~',
          icon: 'none'
        })
      }

    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})