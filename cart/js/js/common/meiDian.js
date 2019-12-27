/**
 * Created by caoyi on 2017/1/23.
 * 得到美店key-value
 */
!function (exports) {
    var meiDian            = (function () {
        var data         = {},
            //TODO url 地址有问题
            opens        = {
                url   : '/api/shop/getGomePlusShops'
                /* url:'/home/api/shop/getGomePlusShops'*/
                , type: 'POST'
                , data: ''
            },
            cacheRequest = {};

        function getId(id) {
            return data[id + ''];
        }

        /**
         * 添加key value键值对
         * @param id
         * @param value
         */
        function put(id, value) {
            data[id + ''] = value;
        }

        /**
         * 添加多个key value键值对
         * @param obj
         * @returns {boolean}
         */
        function puts(obj) {
            if (!obj) {
                return false
            }
            for (var prop in obj) {
                if (obj[prop]) this.put(prop, obj[prop]);
            }
        }

        /**
         * 得到所有的 value
         * @returns {Array}
         */
        function getValues() {
            var result = [];
            for (var prop in data) {
                result.push(data[prop]);
            }
            return result;
        }

        /**
         * 得到所有的value
         * @returns {Array}
         */
        function getIds() {
            var result = [];
            for (var prop in data) {
                result.push(prop);
            }
            return result;
        }

        /**
         * 得到meiDian 存储的所有key-value
         * @returns {{}}
         */
        function getDatas() {
            return data;
        }

        /**
         * 判断key 对应的value是否为空
         * @param key
         * @returns {boolean}
         */
        function isValue(key) {
            if (!key) {
                return false
            }
            ;
            return Boolean(data[key]);
        }

        /**
         * 设置key 但value 为空
         * @param id
         */
        function setId(id) {
            if (!id || id + ''.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
                return '';
            }
            if (!data[id + '']) {
                data[id + ''] = ''
            }
            ;
        }


        /**
         * 通过keys得到美店的value
         */
        function callVlauesByKeys(call) {
            //如果keys 为空，则直接返回this
            var ids    = this.getIds() //得到全部的key
                , _ids = []; //存放 没有value的key，供查询（有value的可以认为已经查询过了，缓存了）
            if (!ids || !ids.length > 0) {
                return this;
            }
            //清除已经请求过的
            for (var i = 0, len = ids.length; i < len; i++) {
                if (!this.isValue(ids[i])) {
                    _ids.push(ids[i]);
                }
            }
            if (!_ids || !_ids.length > 0) {
                if (call) {
                    call(meiDian.getDatas());
                }
                return this;
            }

            //处理请求参数
            opens.data = {
                "ss": _ids.join(",") || ''
            };

            //添加请求缓存
            if (cacheRequest[opens.data.ss]) {
                return this;
            }
            cacheRequest[opens.data.ss] = 1;

            var jqxhr = $.ajax({
                url       : opens.url,
                type      : opens.type || "POST",      // 默认值GET，可根据需要配置
                cache     : true,      // 默认值true, dataType是'script'或'jsonp'时为false，可根据需要配置
                data      : opens.data || {},         // 请求参数对象
                statusCode: {     // 针对特定错误码的回调处理函数
                    404: function (e) {
                        console.log(url + '--接口报404--' + e)
                    },
                    500: function (e) {
                        console.log(url + '--接口报500--' + e)
                    }
                }
            });
            jqxhr.done(function (data) {
                // data = JSON.parse('{"success":true,"errCode":"0","errMsg":null,"data":{"1111":"哇哈哈","2222":"百事可乐","4444":"徐福记"},"status":null}');
                if (data.success) {
                    meiDian.puts(data.data);
                    call(meiDian.getDatas());
                } else {
                    // console.log('接口异常：'+ opens.url + data);
                }
            });
            jqxhr.fail(function (data) {
                // console.log('接口异常：'+ opens.url + data);
            });

            /* $.ajax(opens)
             .done(function(data){
             data = JSON.parse('{"success":true,"errCode":"0","errMsg":null,"data":{"1111":"哇哈哈","2222":"百事可乐","4444":"徐福记"},"status":null}');
             if(data.success){
             meiDian.puts(data.data);
             call(data.data);
             }else{
             console.log('接口异常：'+ opens.url + data);
             }
             })
             .fail(function(data){
             console.log('接口异常：'+ opens.url + data);
             });*/
        }

        /**
         * 得到全部数据
         * @returns {{}}
         */
        function getMap() {
            return data;
        }

        ;
        return {
            put         : put
            , puts      : puts
            , setId     : setId
            , getIds    : getIds
            , getMap    : getMap
            , getDatas  : getDatas
            , getValues : getValues
            , isValue   : isValue
            , callVlaues: callVlauesByKeys
        }
    })();

    //父类 封装了基本异步请求参数及
    function RemindAsy(url,type,dataAttr){
        this.opens = {
            url: url
            ,type: type||'POST'
            ,dataAttr: dataAttr || null
            ,data:{}//默认data是 {dataAttr:'id1,id2...'}
        };
        this.data = {};
        this.cacheRequest = {};
    }
    RemindAsy.prototype = {
        constructor : RemindAsy
        , put       : function (id, value) {
            if(!id){
                return ;
            }
            this.data[id + ''] = value ? value : null
        }
        /**
         * 得到所有的value
         * @returns {Array}
         */
        , getIds    : function () {
            var result = [];
            for (var prop in this.data) {
                result.push(prop);
            }
            return result;
        }
        , callValues: function (callback) {
            var req ={};
            if (!this.data) {
                return {};
            }
            var ids = this.getIds();
            if (!ids || ids.length <1) {
                return {}
            }
            req ={
                url: this.opens.url,
                type: this.opens.type,
                data: {}
            };
            if(this.opens.dataAttr){
                req.data[this.opens.dataAttr] = this.getIds().join(",") || null;
            }
            _ajax(req,callback);
        }
        , callValue : function (key,callback) {
            if(!/^[0-9]*$/.test(key)){//排除非数字（业务排除自营）
                return ;
            }
            req ={
                url: this.opens.url,
                type: this.opens.type,
                data: {}
            };
            if(this.opens.dataAttr){
                req.data[this.opens.dataAttr] = key || null;
            }
            _ajax(req,callback);
        }
    };

    function _ajax(opens,callback){
        var jqxhr  = $.ajax({
            url       : opens.url,
            type      : opens.type || "GET",      // 默认值GET，可根据需要配置
            cache     : true,      // 默认值true, dataType是'script'或'jsonp'时为false，可根据需要配置
            data      : opens.data || {},         // 请求参数对象
            statusCode: {     // 针对特定错误码的回调处理函数
                404: function (e) {
                    console.log(opens.url + '--接口报404--' + e)
                },
                500: function (e) {
                    console.log(opens.url + '--接口报500--' + e)
                }
            }
        });
        jqxhr.done(function (data) {
            // data = JSON.parse('{"success":true,"errCode":"0","errMsg":null,"data":{"1111":"哇哈哈","2222":"百事可乐","4444":"徐福记"},"status":null}');
            if (data.success) {
                callback(data.data);
            } else {
                console.log('接口异常：'+ opens.url + data);
            }
        });
        jqxhr.fail(function (data) {
            console.log('接口异常：'+ opens.url + data);
            return false;
        });
    }


    function ShoppingCoupon(url, type, dataAttr) {
        RemindAsy.call(this, url, type, dataAttr);
    }

    ShoppingCoupon.prototype             = new RemindAsy();
    ShoppingCoupon.prototype.constructor = ShoppingCoupon;

    ShoppingCoupon.prototype.put         = function (id, value) {
        if (!/^[0-9]*$/.test(id)) {//排除非数字（业务排除自营）
            return;
        }
        RemindAsy.prototype.put.call(this, id, value);
    };

    //将传入的电话号码转化为数组
    function numToArr(str){
        if(str == ""){
            return
        }
        var arr = [];
        if(str.indexOf(" ") !== -1){//有可能是空格隔开
            arr = str.split(" ");
        }
        if(str.indexOf("、") !== -1){//有可能是、隔开
            arr = str.split("、");
        }
        return arr;
    }

    /**
     * 此方法 调用在address.js中
     * @param url url地址
     * @param threeArea 三级区域code
     * @constructor
     */
    function InstallRemind(url, threeArea) {
        RemindAsy.call(this, url);
        if (!this.opens) {
            this.opens = {}
        }

        this.opens.threeArea = threeArea || null;
        this.responseData = [];//异步请求后数据
    }

    InstallRemind.prototype             = new RemindAsy();
    InstallRemind.prototype.constructor = InstallRemind;

    InstallRemind.prototype.setThreeArea = function (threeArea) {
        this.opens.threeArea = threeArea;
    };
    /**
     * 异步请求成功后，调用的callback方法 ---在商品列表中 全部商品与收起是处理
     * @param data
     */
    InstallRemind.prototype.callValuesFn = function(data){
        if(!data){
            data = this.responseData;
        }
        if(!data || data.length<1){
            return ;
        }
        this.responseData  = data;
        for(var i=0; i<data.length; i++){
            var html = InstallRemind.getTpl(data[i]);
            $('.js-install-remind-'+data[i].skuId).html(html);
        }
    };
    /**
     * 回调函数 调用的是callValuesFn （此处不是太和谐）
     * @returns {{}}
     */
    InstallRemind.prototype.callValues   = function () {
        var req = {};
        if (!this.data) {
            return {};
        }
        var ids = this.getIds();
        if (!ids || ids.length < 1) {
            return {}
        }
        req            = {
            url : this.opens.url,
            type: this.opens.type,
            data: {}
        };
        req.data['ss'] = this.getIds().join(",") || null;
        req.data['ac'] = this.opens.threeArea || null;


        _ajax(req, this.callValuesFn);
    };
    InstallRemind.prototype.callValue    = function (key, callback) {

    };
    /**
     * 得到显示模板
     * @param data
     * @returns {string}
     */
    InstallRemind.getTpl = function (data) {
        if (!data) {
            return '';
        }
        //安装电话有可能2个
        var num = numToArr(data.phoneNumber),
            html = "";
        if(num.length == 2){
            html = '<div class="support-server mt10 clearfix hoverup" style="position: relative;" >'
                + '<i class="icon-zhuang">装</i>'
                + '<span class="" style="color:#a5a5a5;width: 145px;">安装电话：' + num[0] + '</span>'
                + '</br>'
                + '<span class="" style="color:#a5a5a5;width: 145px; padding-left: 86px;">' + num[1] + '</span>';
        }else{
            html = '<div class="support-server mt10 clearfix hoverup" >'
                + '<i class="icon-zhuang">装</i>'
                + '<span class="" style="color:#a5a5a5;width: 145px;">安装电话：' + data.phoneNumber + '</span>';
        }
        //如果没有描述信息data.instructions，则不显示 提示框
        if (data.instructions) {
            html += '<i class="c-i tips_icon " style="position: absolute;margin-left: 3px;left: 172px;top: 1px;"></i>'
                + '<div class="pabs box-sd1 hide zi1000 box-title-hover " style="color:#a5a5a5; position: absolute; left: 20px;top: 5px; width: auto; min-width: 100px;" hover>'
                + '<div class="white-arrow content" style="left: 58px;">◆</div>'
                + data.instructions
                + '</div>';
        }
        html += '</div>';

        return html;
    };

    var GiftHead = (function(){
        function callValue(proId,arr,callback){
            if(!proId){
                return new Error('请传入proId');
            }
            var gp = [];
            gp.push(proId);
            gp.push(arr);
            var opens = {
                url: '/home/api/gift/getCartGiftInfo',
                data: {'gp': gp.join(';')},
                type: "POST"
            };

            _ajax(opens,callback);
        }

        return {
            callValue: callValue//请求ajax
        }
    })();

    exports.MeiDian        = meiDian;
    exports.ShoppingCoupon = new ShoppingCoupon('/'+$page.site+'/api/couponQuery/shoppingCoupon', 'POST', "shopNos");
    exports.InstallRemind  = new InstallRemind('/'+$page.site+'/api/product/getInstallInfos');//安装信息请求
    exports.GiftHead = GiftHead;
}(this);