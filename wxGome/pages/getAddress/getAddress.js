var app = getApp();
var goHeader = app.goHeader;
var regionUrl = app.ssUrl + '/item/v1/region/';//4级区域接口
var provinceJson = [
    {code:"11000000",label:"北京"},
    {code:"12000000",label:"天津"},
    {code:"13000000",label:"河北省"},
    {code:"14000000",label:"山西省"},
    {code:"15000000",label:"内蒙古"},
    {code:"21000000",label:"上海"},
    {code:"22000000",label:"浙江省"},
    {code:"23000000",label:"江苏省"},
    {code:"24000000",label:"安徽省"},
    {code:"25000000",label:"福建省"},
    {code:"26000000",label:"山东省"},
    {code:"31000000",label:"广东省"},
    {code:"32000000",label:"广西"},
    {code:"33000000",label:"海南省"},
    {code:"41000000",label:"湖北省"},
    {code:"42000000",label:"湖南省"},
    {code:"43000000",label:"河南省"},
    {code:"44000000",label:"江西省"},
    {code:"51000000",label:"黑龙江省"},
    {code:"52000000",label:"吉林省"},
    {code:"53000000",label:"辽宁省"},
    {code:"61000000",label:"宁夏"},
    {code:"62000000",label:"新疆"},
    {code:"63000000",label:"青海省"},
    {code:"64000000",label:"陕西省"},
    {code:"65000000",label:"甘肃省"},
    {code:"71000000",label:"四川省"},
    {code:"72000000",label:"云南省"},
    {code:"73000000",label:"贵州省"},
    {code:"74000000",label:"重庆"},
    {code:"75000000",label:"西藏"},
    {code:"81000000",label:"台湾省"},
    {code:"82000000",label:"香港"},
    {code:"83000000",label:"澳门"},
    {code:"84000000",label:"钓鱼岛"}
],province = [];//省级容器

var cityJson = [],city = [];//市级容器

var countryJson = [],country = [];//区县级容器

var streetJson = [],street = [];//乡镇级容器
Page({
    data:{
        information: {},//后台传过来的数据放在此字段里
    
        province: [],//省
        provinceJson: [],
        provinceIndex: 0,
        provinceFlag:true,

        city: [],//市
        cityJson: [],
        cityIndex: 0,
        cityFlag:false,

        country: [],//区
        countryJson: [],
        countryIndex: 0,
        countryFlag:false,

        street: [],//乡镇
        streetJson: [],
        streetIndex: 0,
        streetFlag:false,

        provinceCode:"",//省code
        cityCode:"",//市code
        countyCode:"",//区、县code
        townCode:"",//乡、镇code
        isSelected:"",

        loading: true,//初始化的loding

        checked:0, //是否为默认地址 默认为不是默认地址
        ownerId:""//Request URL:http://wxacart.atguat.com.cn/wxmp/api/consignee/updateAddress?name=lids&address=22222222222&mobile=133****3015&province=14000000&city=14070000&county=14070400&town=140704006&type=0&id=803336607
    },

    _ourHost: app.ourHostCart,
     _scn: '',

    onShow: function (options) {
        var that = this;
        that.init(options);
    },

    init: function(options) {
        var that = this;
        that._scn = app.getScn();
        var para = {
            url: that._ourHost,
            scn: that._scn
        };

        this.setData({
            cityFlag:true,
            countryFlag:true,
            streetFlag:true
        });
        //请求省级
        that.setData({
            province: ["北京", "天津", "河北省", "山西省","内蒙古","上海","浙江省","江苏省","安徽省","福建省","山东省","广东省","广西","海南省","湖北省","湖南省","河南省","江西省","黑龙江省","吉林省","辽宁省","宁夏","新疆","青海省","陕西省","甘肃省","四川省","云南省","贵州省","重庆","西藏","台湾省","香港","澳门","钓鱼岛"],
            provinceJson:provinceJson
        });

        //取cookie
        var codeCookies = wx.getStorageSync('codeCookies');
        var storageProvinceCode = codeCookies[0];//取第一级（第0个）

        //如果有cookie
        if(storageProvinceCode){
            var codeIndex;
            for(var i=0; i<that.data.provinceJson.length; i++){
                if(that.data.provinceJson[i].code == storageProvinceCode){
                    codeIndex = i;
                    that.setData({
                        provinceIndex: codeIndex
                    });
                }
            }
        }else{
            that.setData({
                provinceIndex: 0//默认设置0
            });
        }

        /*//请求省级
        this.setData({
            province: ["北京", "天津", "河北省", "山西省","内蒙古","上海","浙江省","江苏省","安徽省","福建省","山东省","广东省","广西","海南省","湖北省","湖南省","河南省","江西省","黑龙江省","吉林省","辽宁省","宁夏","新疆","青海省","陕西省","甘肃省","四川省","云南省","贵州省","重庆","西藏","台湾省","香港","澳门","钓鱼岛"],
            provinceJson:provinceJson,
            provinceIndex:0//默认设置0
        });*/

        //请求市级
        wx.request({
            url: regionUrl+that.data.provinceJson[that.data.provinceIndex].code+"/2/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8'
            },
            complete: function(res) {
                cityJson = res.data.result.division;
                city = [];//清空
                for(var i=0 ;i<cityJson.length; i++){
                    city.push(cityJson[i].label);
                }
                that.setData({
                    city: city,
                    cityJson:cityJson
                });
                //取cookie
                var codeCookies = wx.getStorageSync('codeCookies');
                var storageCityCode = codeCookies[1];//取第2级（第1个）

                //如果有cookie
                if(storageCityCode){
                    var codeIndex;
                    for(var i=0; i<that.data.cityJson.length; i++){
                        if(that.data.cityJson[i].code == storageCityCode){
                            codeIndex = i;
                        }
                        that.setData({
                            cityIndex: codeIndex
                        });
                    }
                }else{
                    that.setData({
                        cityIndex: 0//默认设置0
                    });
                }
                /*that.setData({
                    city: city,
                    cityJson:cityJson,
                    cityIndex:0//默认设置0
                });*/

                //请求区/县级
                wx.request({
                    url: regionUrl+that.data.cityJson[that.data.cityIndex].code+"/3/flag/item_web/",
                    header: {
                        'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                        'gome-header':goHeader
                    },
                    complete: function(res) {
                        countryJson = res.data.result.division;
                        country = [];
                        for(var i=0 ;i<countryJson.length; i++){
                            country.push(countryJson[i].label);
                        }
                        that.setData({
                            country: country,
                            countryJson:countryJson,
                            //countryIndex:0//默认设置0
                        });
                        //取cookie
                        var codeCookies = wx.getStorageSync('codeCookies');
                        var storageCountryCode = codeCookies[2];//取第3级（第2个）

                        //如果有cookie
                        if(storageCountryCode){
                            var codeIndex;
                            for(var i=0; i<that.data.countryJson.length; i++){
                                if(that.data.countryJson[i].code == storageCountryCode){
                                    codeIndex = i;
                                }
                                that.setData({
                                    countryIndex: codeIndex
                                });
                            }
                        }else{
                            that.setData({
                                countryIndex: 0//默认设置0
                            });
                        }
                        //请求乡镇级
                        wx.request({
                            url: regionUrl+that.data.countryJson[that.data.countryIndex].code+"/4/flag/item_web/",
                            header: {
                                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                                'gome-header':goHeader
                            },
                            complete: function(res) {
                                streetJson = res.data.result.division;
                                street = [];
                                for(var i=0 ;i<streetJson.length; i++){
                                    street.push(streetJson[i].label);
                                }
                                that.setData({
                                    street: street,
                                    streetJson:streetJson,
                                    //streetIndex:0,//默认设置0

                                    loading: false//loading加载完毕
                                });
                                //取cookie
                                var codeCookies = wx.getStorageSync('codeCookies');
                                var storageStreetCode = codeCookies[3];//取第4级（第3个）

                                //如果有cookie
                                if(storageStreetCode){
                                    var codeIndex;
                                    for(var i=0; i<that.data.streetJson.length; i++){
                                        if(that.data.streetJson[i].code == storageStreetCode){
                                            codeIndex = i;
                                        }
                                        that.setData({
                                            streetIndex: codeIndex
                                        });
                                    }
                                }else{
                                    that.setData({
                                        streetIndex: 0//默认设置0
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });

    },

    bindPickerProvince: function(e) {
        var that = this;

        this.setData({
            city: [],
            country:[],
            street:[],
            provinceJson: provinceJson,
            provinceIndex: e.detail.value
        });

        //请求市级
        wx.request({
            url: regionUrl+that.data.provinceJson[that.data.provinceIndex].code+"/2/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader
            },
            complete: function(res) {
                cityJson = res.data.result.division;
                city = [];//清空
                for(var i=0 ;i<cityJson.length; i++){
                    city.push(cityJson[i].label);
                }
                that.setData({
                    city: city,
                    cityJson:[{code:"",label:"-- 请选择 --"}],
                    cityIndex:0,
                    countryJson:[],
                    streetJson:[],
                    cityFlag:true,
                    countryFlag:false,
                    streetFlag:false
                });
            }
        });
    },
    bindPickerCity: function(e) {
        var that = this;
        this.setData({
            country:[],
            street:[],
            city: city,
            cityJson: cityJson,
            cityIndex: e.detail.value
        });
        //请求区/县级
        wx.request({
            url: regionUrl+that.data.cityJson[that.data.cityIndex].code+"/3/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader
            },
            complete: function(res) {
                countryJson = res.data.result.division;
                country = [];
                for(var i=0 ;i<countryJson.length; i++){
                    country.push(countryJson[i].label);
                }
                that.setData({
                    country: country,
                    countryJson:[{code:"",label:"-- 请选择 --"}],
                    countryIndex:0,
                    streetJson:[],
                    countryFlag:true,
                    streetFlag:false
                });
            }
        });
    },
    bindPickerCountry: function(e) {
        var that = this;
        this.setData({
            street:[],
            country: country,
            countryJson: countryJson,
            countryIndex: e.detail.value
        });
        //请求乡镇级
        wx.request({
            url: regionUrl+that.data.countryJson[that.data.countryIndex].code+"/4/flag/item_web/",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader
            },
            complete: function(res) {
                streetJson = res.data.result.division;
                street = [];
                for(var i=0 ;i<streetJson.length; i++){
                    street.push(streetJson[i].label);
                }
                that.setData({
                    street: street,
                    streetJson:[{code:"",label:"-- 请选择 --"}],
                    streetIndex:0,
                    streetFlag:true
                });
            }
        });
    },
    bindPickerStreet: function(e) {
        var that = this;
        this.setData({
            country:[],
            street: street,
            streetJson: streetJson,
            streetIndex: e.detail.value
        });

    },
    checkName: function(e){
        this.setData({
            name:e.detail.value
        });
    },
    checkNumber: function(e){
        this.setData({
            number:e.detail.value
        });
    },
    getAddress: function(e){
        this.setData({
            address:e.detail.value
        });
    },

    clearName(){
        this.setData({
            name:''
        });
    },
    clearNum(){
        this.setData({
            number:''
        });
    },
    clearAddr(){
        this.setData({
            address:''
        });
    },
    //确认地址
    confirmCheck:function(){
        var that = this;
        if(this.data.provinceJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的省份',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.cityJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的市',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.countryJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的区/县',
                icon: 'loading',
                duration: 1000
            });
            return false;
        }else if(this.data.streetJson[0].code == ""){
            wx.showToast({
                title: '请选择正确的乡/镇',
                icon: 'loading',
                duration: 2000
            });
            return false;
        }
        var checkProvince = that.data.provinceJson[that.data.provinceIndex].code,
            checkCity = that.data.cityJson[that.data.cityIndex].code,
            checkCounty = that.data.countryJson[that.data.countryIndex].code,
            checkTown = that.data.streetJson[that.data.streetIndex].code,
            checkType = that.data.checked
        wx.request({
            url:that._ourHost+"/wxmp/api/consignee/addAddress",
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader,
                'Cookie':'SCN='+that._scn
            },
            method:'GET',
            data:{
                province:checkProvince,
                city:checkCity,
                county:checkCounty,
                town:checkTown,
                type:checkType
            },
            complete:function(res){

                //存放地址code
                var codeCookies = [
                    that.data.provinceJson[that.data.provinceIndex].code,//一级
                    that.data.cityJson[that.data.cityIndex].code,//二级
                    that.data.countryJson[that.data.countryIndex].code,//三级
                    that.data.streetJson[that.data.streetIndex].code//四级
                ];
                wx.setStorageSync("codeCookies",codeCookies);

                //存放地址label
                var labelCookies = [
                    that.data.provinceJson[that.data.provinceIndex].label,//一级
                    that.data.cityJson[that.data.cityIndex].label,//二级
                    that.data.countryJson[that.data.countryIndex].label,//三级
                    that.data.streetJson[that.data.streetIndex].label//四级
                ];
                wx.setStorageSync("labelCookies",labelCookies);

                wx.navigateBack({
                    delta: 1
                })
            }
        });
    }
})
