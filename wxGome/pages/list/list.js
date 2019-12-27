/**
 * 搜索页和搜索结果页在同一个页面   
*/
var app = getApp();
var goHeader = app.goHeader;

// var SEARCH_HOST = app.ourHistoryHost;
var SEARCH_HOST = app.apisUrl;
var searchUrl = app.apisUrl + '/p/product';//搜索接口
var couponUrl = app.apisUrl + '/p/blue';//蓝券反查接口
var priceUrl = app.ourHost + '/cheap/listrushPrice';//价格接口
var SEARCH_LISTS_PARAS = {//搜索列表接口默认参数值
    pageSize: 20,
    pageNumber: 1,
    sort: 0,
    question: '',
    catId: 0,
    facets: 0,
    productTag: 0,
    market: 12,
    priceTag: 0,
    price: "0",
    instock: 0,
    from: 'webchat'
};
var searchLists = [];//搜索结果列表数据
var proSkuLists = [];//存放的是pId和skuId,组成pId_skuId这样的形式存入数组中
var totalPage = 1;//加这个是为了判断当pageNumber>totalPage时不再请求ajax
var pageNumber = 1; //当前页码  参数值范围：1-100
var sort = 0; //排序字段 20：价格降序 21：价格升序 10：销量数 0：默认值 综合排序
var question = '';//搜索词
var goodsTypeId=0;//商品分类ID
Page({
    data: {
        searchLists: [],//搜索结果列表数据
        hotSearch: {}, // 热词搜索结果
        searchHistory: [], //搜索历史
        searchTips: [],//搜索提示数据
        inputValue: '',//搜索词对应的input框的值
        flagQestion: 0, //加载哪些模块, 0代表加载热门搜索和历史搜索, 1代表加载搜索列表, 2代表什么都不加载
        copid: '',//优惠券id
        copname: '',//优惠券名称
        delBtnIfShow: false,//是否显示输入框清除小图标
        focus:false,//是否获取焦点
        searchBtnIfShow: true,//搜索按钮是否显示
        searchBtnColor: "default",//按钮显示的颜色default:灰色，warn:红色
        loading: true,//搜索列表接口请求时显示加载，true:隐藏；false:显示
        scrollHeight: 0,//搜索列表滚动区的高度
        scrollTop: 0,//搜索列表滚动的位置
        loadMore:false,//是否展示加载更多
        sortFlag: 20,// 20为降价 21为升价
        sort: 0, //排序字段
        filterItem: true,//是否有筛选项，true表示有，false表示无
        isFilter: false,//筛选是否选中
        listNoData: false//搜索列表无数据，之所以不用searchLists的长度来判断，是因为，请求前会先展示无数据
    },

    /**
     * 从coupon页（蓝券反查）带过来的参数有data:优惠券id,couponName:优惠券名称，直接显示的是搜索结果页，title展示为：优惠券使用商品，蓝券反查没有筛选
     * 从goodClassify页（商品分类页）带过来的参数有questionCookie：搜索词，直接显示的是搜索结果页，title展示为：搜索结果
     * 从index页（首页）过来不带参数，显示的是搜索页，title展示为：搜索
     * */
    onLoad: function(option) {

        var that = this;
        //重置数据
        that.restData();
        //清除存入筛选页的缓存
        that.clearFilterStorage();

        /* ==== 热词搜索接口 ==== */
        that.dealHotSearch();

        //==== 用于搜索结果列表的输入框
        if(option.questionCookie){
            question = decodeURIComponent(option.questionCookie);
        }
        if (option.goodsTypeId){
          goodsTypeId = decodeURIComponent(option.goodsTypeId);
        }
        //==== 主要用于蓝券反查 地址栏传递的参数data=P397779&couponName=侧边栏,直接展示搜索结果页
        if(option.data){
            that.setData({
                copid: option.data,//优惠券id
                copname: option.couponName,//优惠券名称
                filterItem: false
            })
        }
    },
    
    onShow: function() {
        var that = this;
        //后退时是不会触发onLoad,且设置的全局变量值，以及this的属性值保留，如果需要重新刷新需要重置部分数据，onShow是每次进来都会触发 

         /**
          * 1.搜索历史，最多保存六条，当超过六条，会把原最后一条顶掉
          * 2.搜索历史的数据存入缓存中
          * 3.点击搜索按钮、搜索提示列表、搜索输入框失去焦点、清除搜索历史事件的时候需要重置一下数据以及存入缓存中
          */
        var searchHistory = wx.getStorageSync('searchHistory');
        //存入缓存中的搜索词和排序，之所以单独存是为了好处理数据
        var questionAndSort = wx.getStorageSync("questionAndSort");

        //这里需要清空，原因是从筛选页回退时需要重新加载数据
        that.chageResetData();

        //获取存入缓存中的搜索列表参数，这时候页面有可能是从筛选页回退
        var searchListsParas = wx.getStorageSync("searchListsParas");
        var isFilter = false;
        if(searchListsParas) {//判断筛选项是否选中
            isFilter = searchListsParas.isFilter;
        }
        var datas = {
            searchHistory: searchHistory,
            inputValue: '',
            delBtnIfShow: false,
            isFilter: isFilter,
            loadMore: false,
            scrollTop: 0
        };

        if(questionAndSort) {
            datas.question = question = questionAndSort.question;
            datas.sort = sort = questionAndSort.sort;
            datas.sortFlag = questionAndSort.sortFlag;
        }

        /**
            1.如果从地址栏里传过来搜索词，则直接搜索，展示搜索结果页。
            2.如果从其它页回退回，则显示搜索结果页。question的值如果不清空回退是存在
        */
        if(question || that.data.copid) {
            datas.inputValue = (that.data.copid ? '' : question);
            datas.focus = false;
            datas.searchBtnIfShow = false;
            datas.flagQestion = 1;
            that.setData(datas);

            that.dealSearchLists();

        }else {
            datas.focus = true;
            that.setData(datas);
        }
    },

    /**
     * @description 存入page前面的变量，会被缓存，所以需要重置部分数据
     * @method restData
     * @since 2017-05-31
     * @author liusuling
     * */
    restData: function() {
        var that = this;
        searchLists = [];
        proSkuLists = [];
        totalPage = 1;
        question = '';
        pageNumber = 1;
        sort = 0;

        wx.getSystemInfo({
            success(res) {
                that.setData({
                    scrollHeight: res.windowHeight - 100
                })
            }
        });
    },

    /**
     * @description 清除存入筛选页的缓存
     * @method clearFilterStorage
     * @since 2017-06-08
     * @author liusuling
     * */
    clearFilterStorage: function() {
        //清除存入缓存的品牌和分类
        if(wx.getStorageSync("facets")) {
            wx.removeStorageSync("facets");
        }

        //清除搜索纠错
        if(wx.getStorageSync("correctionError")) {
            wx.removeStorageSync("correctionError");
        }
        //清除存入缓存的筛选项
        if(wx.getStorageSync("selectedFilter")) {
            wx.removeStorageSync("selectedFilter");
        }

        //清除存入缓存的筛选项
        if(wx.getStorageSync("cacheSelectedFilter")) {
            wx.removeStorageSync("cacheSelectedFilter");
        }
        
        //移除存入缓存中的搜索列表请求的参数
        if(wx.getStorageSync("searchListsParas")) {
            wx.removeStorageSync("searchListsParas");
        }

        //移除存入缓存中的搜索词和排序
        if(wx.getStorageSync("questionAndSort")) {
            wx.removeStorageSync("questionAndSort");
        }
    },

    /**
     * @description 用于处理搜索热词
     * @method dealHotSearch
     * @since 2017-05-26
     * @author liusuling
     * */
    dealHotSearch: function() {
        var that = this;
        wx.request({
            // url: SEARCH_HOST + '/cloud/releQuery',
            url:SEARCH_HOST +'/p/releQuery',
            data: {
                question: '手机',
                from:'webchat'
            },
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            success: function(res) {
                if (res.statusCode == 404) {
                    that.dealRrrorToast();
                    return false;
                }
                that.setData({
                    hotSearch: res.data.releData
                })
            },
            fail: function() {
                // fail
            }
        });
    },

    /**
     * @description 搜索输入框获取焦点事件
     * @method bindKeyBlur
     * @since 2017-05-26
     * @author liusuling
     * 1.当获取到焦点时，搜索按钮展示出来
     * 2.如果有值时则：
            1.展示输入框的清除按钮
            2.展示搜索提示框，隐藏搜索历史和搜索热词以及搜索列表
     * 3.如果无值则：
            1.隐藏输入框的清除按钮
            2.如果是蓝券反查链接进来的则：除了展示搜索按钮，搜索区域其它的并无任何变化。
            不是从蓝券反查链接进来的则：展示搜索历史和搜索热词，隐藏搜索列表和搜索提示框
     * */
    bindFocusEvt: function(e) {
        var that = this;
        var value = e.detail.value;
        var flagQestion = that.data.flagQestion;
        var delBtnIfShow = false;
        var searchBtnColor = 'default';
        if (value == "") {
            if(!that.data.copid) {flagQestion == 0}
        }else{
            flagQestion = (!value.trim() ? 0 : 2);
            
            delBtnIfShow = true;
            searchBtnColor = 'warn';
        }
        that.setData({
            searchBtnIfShow: true,
            delBtnIfShow: delBtnIfShow,
            flagQestion: flagQestion,
            searchBtnColor: searchBtnColor
        });
        //调用搜索提示
        that.dealSearchTips(value.trim());
    },

    /**
     * @description 搜索输入框键盘输入时事件
     * @method bindInputEvt
     * @since 2017-05-26
     * @author liusuling
     * 2.如果有值时则：
            1.展示输入框的清除按钮
            2.展示搜索提示框，隐藏搜索历史和搜索热词以及搜索列表
     * 3.如果无值则：
            1.隐藏输入框的清除按钮
            2.展示搜索历史和搜索热词，隐藏搜索列表和搜索提示框
            3.标题变为搜索
            4.历史搜索需要重置，原因是有可能历史搜索已经变化
     * */
    bindInputEvt: function(e) {
        var that = this;
        var value = e.detail.value;
        var delBtnIfShow = false;
        var searchBtnColor = 'default';
        if (value == "") {
            that.setData({
                flagQestion: 0,
                inputValue: value,
                searchBtnColor: "default",
                delBtnIfShow: false
            });
            wx.setNavigationBarTitle({
                title: '搜索'
            });
            
        } else {
            var flagQestion = (!value.trim() ? 0 : 2);
            that.setData({
                flagQestion: flagQestion,
                inputValue: value,
                searchBtnColor: "warn",
                delBtnIfShow: true
            });
        }

        //调用搜索提示
        that.dealSearchTips(value.trim());
    },

    /**
     * @description 输入框失去焦点事件
     * @method bindBlurEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    bindBlurEvt: function(e) {
        var that = this;
        wx.hideKeyboard();
        var value = that.data.inputValue.trim();
        var data = {};
        data.focus = false;
        data.flagQestion = that.data.flagQestion;
        if(!value) {
            if(!that.data.copid) {data.flagQestion == 0}
        }
        
        that.setData(data);
    },

    /**
     * @description 对应input输入框键盘的完成事件以及点击搜索的事件
     * @method inputSearchEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    inputSearchEvt: function() {
        var that = this;
        var value = that.data.inputValue.trim();
        if(!value){
            that.dealRrrorToast('请输入正确的内容！');
            return false;
        }

        that.goSearchCom(value);
    },

    /**
     * @description 快捷搜索事件，点击热词搜索项、搜索历史项、搜索提示项
     * @method shortcutSearchEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    shortcutSearchEvt: function(e) {
        var that = this;
        var value = e.currentTarget.dataset.key;
        that.setData({
            inputValue: value
        })
        that.goSearchCom(value);
    },

    /**
     * @description 清除输入框事件
     * @method clearInputEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    clearInputEvt: function(e) {
        var that = this;
        wx.hideKeyboard();
        that.setData({
            inputValue: '',
            delBtnIfShow: false,
            searchTips: [],
            searchBtnColor: "default",
            flagQestion: 0,
        });
        wx.setNavigationBarTitle({
            title: '搜索'
        });
    },

    /**
     * @description 清除搜索历史事件
     * @method clearHistoryEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    clearHistoryEvt: function(e) {
        wx.setStorageSync('searchHistory', []);
        this.setData({
            searchHistory: [],
        })
    },

    /**
     * @description 滚动条滚动时触发的事件
     * @method bindscrolltolowerEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    bindscrolltolowerEvt: function(e) {
        pageNumber++;
        if(pageNumber<=totalPage) {
            this.dealSearchLists();
        }else {
            this.setData({
                loadMore:true
            });
        }
    },

    /**
     * @description 搜索筛选排序tab切换
     * @method bindSortEvt
     * @since 2017-05-31
     * @author liusuling
     * */
    bindSortEvt: function(e) {
        var that = this;
        var sortFlag = that.data.sortFlag;
        sort = e.currentTarget.dataset.sort;
        if(that.data.sort == sort) {
            return false;
        }
        if(sort == 20) {
            sortFlag = 21;
        }else if(sort == 21) {
            sortFlag = 20;
        }else {
            sortFlag = 20;
        }
        this.chageResetData();
        that.setData({
            scrollTop: 0,
            sort: sort,
            sortFlag: sortFlag
        })
        this.dealSearchLists();
    },

    /**
     * @description 搜索页筛选点击事件
     * @method bindFilterEvt
     * @since 2017-05-31
     * @author liusuling
     * */
    bindFilterEvt: function(e) {
        this.chageResetData();
        this.setData({
            scrollTop: 0
        })
        var paras = {
            question: question,
            sort: sort,
            sortFlag: this.data.sortFlag
        }
        wx.setStorageSync("questionAndSort",paras);

        wx.navigateTo({
            url: '../filter/filter'
        })
    },

    /**
     * @description 处理搜索提示
     * @method dealSearchTips
     * @param {String} val 搜索词 (必传)
     * @since 2017-05-26
     * @author liusuling
     * */
    dealSearchTips: function(val) {
        var that = this;
        
        if(!val) {
            that.setData({
                searchTips: []
            })
            return false;
        }
        //这个接口 只有生产有数据 uat没有数据
        wx.request({
            url: SEARCH_HOST + '/p/suggest',
            data: {
                query:val,
                from: 'webchat'
                // form: 'headSearch',
                // module: 'searchSuggest'
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            success: function(res) {
                if (res.statusCode == 404) {
                    that.dealRrrorToast();
                    return false;
                }
                var searchs = [];
                var length = res.data.length;
                for (var i = 0; i < length; ++i) {
                    if(res.data[i].length < 4){
                        searchs.push(res.data[i][0]);
                    }
                }
                that.setData({
                    searchTips: searchs
                })
            },
            fail: function() {
                // fail
            }
        });
    },

    /**
     * @description 搜索历史数据处理
     * @method dealSearchHistory
     * @param {String} value (必传)
     * @since 2017-05-26
     * @author liusuling
     * 1.搜索历史数据是前端存入缓存，只存6条，且最新的在最前面
     * 2.此函数会对搜索词进行去重，存入缓存，并且更新页面
     * 3.选择在此处更新页面，是因为存的时候处理会好控制一些，不然就需不断的在别的地方进行处理
     * */
    dealSearchHistory: function(value) {
        if(!value) {
            return false;
        }
        var searchHistory = wx.getStorageSync('searchHistory') || [];
        searchHistory.unshift(value);
        var json = {};
        var tem = [];
        var len = searchHistory.length;

        //去重
        for(var i=0; i<searchHistory.length; i++) {
            if(!json[searchHistory[i]]) {
                json[searchHistory[i]] = true;
                tem.push(searchHistory[i]);
            }
        }
        if(tem.length>6) {tem.pop();}

        wx.setStorageSync('searchHistory', tem);

        this.setData({
            searchHistory: tem,
        })
    },

    /**
     * @description 点击要去搜索的共用处理
     * @method goSearchCom
     * @param {String} value 搜索词(必传)
     * @since 2017-05-26
     * @author liusuling
     * */
    goSearchCom: function(value) {
        var that = this;
        
        question = value;
        that.setData({
            sort: 0,
            sortFlag: 20,
            delBtnIfShow: false,
            searchBtnIfShow: false,
            scrollTop: 0,
            isFilter: false
        })
        if (goodsTypeId!=0){
          goodsTypeId=0;
        }
        that.chageResetData();//重置数据
        that.clearFilterStorage();//移除存入筛选页中的缓存
        that.dealSearchHistory(value);//处理历史搜索
        that.dealSearchLists();//调用搜索列表接口，请求数据并展示
    },

    /**
     * @description 搜索列表处理
     * @method dealSearchLists
     * @since 2017-05-26
     * @author liusuling
     * */
    dealSearchLists: function() {

        var that = this;
        var url = that.dealSearchListsPara();
        this.setData({
            loading: false,
            flagQestion: 1,
            searchTips: []
        });
        //请求搜索列表
        wx.request({
            url: url,
            data: {},
            header: {
                'content-type':   'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            success: function(res) {
                if (res.statusCode == 404) {
                    that.dealSearchListsError();
                    return false;
                }

                var data = res.data;
                var content = res.data.content;
                var header = res.data.header;
                if(!header || header.status != 200) {
                    that.dealSearchListsError();
                    that.setData({
                        listNoData: true
                    })
                    return false;
                }
                if( !content || !content.pageBar || content.pageBar.totalCount == 0) {
                    that.setData({
                        listNoData: true,
                        searchLists: [],
                        loading: true
                    })
                    return false;
                }
                that.setData({
                    listNoData: false
                })

                //将筛选页需要的数据存入缓存
                if(!that.data.copid && content.facets) {
                    if(!wx.getStorageSync("facets")) {
                        wx.setStorageSync("facets",content.facets);
                    }
                }

                //纠错词处理
                that.dealCorrectionError(content);
                    
                var products = content.prodInfo.products;
                var len = products.length;
                if(content.pageBar.pageNumber <= content.pageBar.totalPage && content.pageBar.totalCount > 0 && len>0) {
                    totalPage = content.pageBar.totalPage;//加这个是为了判断当pageNumber>totalPage时不再请求ajax
                    //成功后的数据处理
                    that.dealSearchListsData(products);
                }else {
                    //加载完所有的数据
                    that.setData({
                        loading: true,
                        loadMore:true
                    });
                    return false;
                }


            },
            fail: function() {
                console.log("服务器异常");
            }
        })
    },

    /**
     * @description 搜索列表接口参数的处理
     * @method dealSearchListsPara
     * @return {Sting} searchListsUrl 搜索列表请求接口
     * @since 2017-05-26
     * @author liusuling
     * */
    dealSearchListsPara: function() {
        var that = this;
        var paras =  Object.assign({}, SEARCH_LISTS_PARAS);
        var searchListsUrl = '';
        //如果是从蓝券链接进来的，只有第一次走蓝券反查接口，当再次搜索时走普通搜索
        if(!that.data.copid || this.data.inputValue !='') {
            that.setData({
                copid: '',
                filterItem: true
            })
            wx.setNavigationBarTitle({
                title: '搜索结果'
            });
            var searchListsParas = wx.getStorageSync("searchListsParas");
            //先获取存于筛选的对象
            if(searchListsParas && searchListsParas.isFilter) {//如果存在表示已经进行过筛选
                paras = searchListsParas;
               
                //此处的处理是因为第一次搜索的时候，如果搜索词是错误的，后端会进行丢错，会将纠错的词返给前端，筛选的时候关键词需要传递纠错后的词
                //searchLevel = 2表示有纠错词
                var correctionError =  wx.getStorageSync("correctionError");
                if(correctionError && correctionError.searchLevel == 2) {
                    question = correctionError.remain;
                    that.setData({
                        inputValue: question
                    });
                }
                
            }
            if (goodsTypeId!=0){
              searchListsUrl = `${searchUrl}/${paras.pageSize}/${pageNumber}/${sort}/0/${goodsTypeId}/${paras.facets}/${paras.productTag}/${paras.market}/${paras.priceTag}/${paras.price}/${paras.instock}?from=${paras.from}`;
            }else{
              searchListsUrl = `${searchUrl}/${paras.pageSize}/${pageNumber}/${sort}/${question}/0/${paras.facets}/${paras.productTag}/${paras.market}/${paras.priceTag}/${paras.price}/${paras.instock}?from=${paras.from}`;
            }
           
        }else {
            wx.setNavigationBarTitle({
                title: '优惠券使用商品'
            });
            searchListsUrl = `${couponUrl}/${paras.pageSize}/${pageNumber}/${sort}/${that.data.copid}/${paras.catId}/${paras.facets}?from=${paras.from}`;
        }
        return searchListsUrl;
    },

    /**
     * @description 搜索词纠错处理
     * @method dealCorrectionError
     * @return {Object} content 后端返回的数据
     * @since 2017-07-03
     * @author liusuling
     * */
    dealCorrectionError: function(content) {
        //此处的处理是因为第一次搜索的时候，如果搜索词是错误的，后端会进行丢错，会将纠错的词返给前端，筛选的时候关键词需要传递纠错后的词
        //searchLevel = 2表示有纠错词
        
        var that = this;
        if(content.commonInfo &&　content.commonInfo.searchLevel == 2) {
            var correctionError = {
                remain: content.commonInfo.remain,
                searchLevel: content.commonInfo.searchLevel
            }
            wx.setStorageSync("correctionError",correctionError);
        }else {
            if(wx.getStorageSync("correctionError")) {
                wx.removeStorageSync("correctionError");
            }
        }
    },

    /**
     * @description 搜索列表接口数据相关的处理
     * @method dealSearchListsData
     * @param {Array} products 搜索列表接口数据 (必传)
     * @since 2017-05-27
     * @author liusuling
     * */
    dealSearchListsData: function(products) {
        var that = this;
        var len = products.length;
        var gomeCardType = '';
        var energyTag = 0;
        var stock = 0;
        var goodsType = '';
        for(var i=0; i<len; i++) {
            gomeCardType = products[i].gomeCardType;
            energyTag = products[i].energyTag;
            stock = products[i].stock;
            goodsType = products[i].goodsType;
            //小程序有些商品是不能被搜出来，所以要屏蔽部分商品
            //屏蔽美通卡gomeCardType == "ZSTK" "ZDZK"
            //屏蔽节能补贴 energyTag == 1
            //屏蔽预约商品 stock == 3 4 6
            //屏蔽极信通 goodsType == ZHK ZLH ZHYJ ZJXK ZJXJ
            if(gomeCardType == "ZSTK" || gomeCardType == "ZDZK" || energyTag == 1 || stock == 3 || stock == 4 || stock == 6 || goodsType == "ZHK" || goodsType == "ZLH" || goodsType == "ZHYJ" || goodsType == "ZJXK" || goodsType == "ZJXJ" ) {
                continue;
            }
            searchLists.push(products[i]);
            proSkuLists.push(products[i].pId+'_'+products[i].skuId);
        }

        
        that.dealRearchListsPrice();
    },

    /**
     * @description 获取对应的搜索列表价格数据
     * @method dealRearchListsPrice
     * @since 2017-05-27
     * @author liusuling
     * */
    dealRearchListsPrice: function() {
        var that = this;
        var areaCode = that.getAreaCode();
        wx.request({
            url: priceUrl,
            data: {
                prodAndSku: proSkuLists.join(','),
                areaCode: areaCode
            },
            header: {
                'content-type':   'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header': goHeader
            },
            success: function(res) {
                if (res.statusCode == 404) {
                    that.dealSearchListsError();
                    return false;
                }
                var data = res.data;
                var dealData = {};
                if(data.success) {
                    var result = data.result;
                    var len = result.length;
                    for(var i=0; i<len; i++) {
                        searchLists[i].wxaUrl = `../prod/prod?productId=${searchLists[i].pId}&skuId=${searchLists[i].skuId}`;
                        if(result[i].price) {
                            searchLists[i].price = result[i].price;
                            //抢购需要/** * 团购价格：TUANPRICE， 抢购价格：RUSHBUYPRICE
                            searchLists[i].priceType = result[i].priceType;
                            if(result[i].promotionUrl && searchLists[i].priceType == 'RUSHBUYPRICE') {
                                searchLists[i].promotionUrl = result[i].promotionUrl;
                                searchLists[i].wxaUrl = `../groupProd/groupProd?itemId=${searchLists[i].promotionUrl}`;
                            }
                        }else {
                            searchLists[i].price = "暂无价格";
                        }
                    }
                    if(!that.data.searchLists.length) {
                        dealData.scrollTop = 0;
                    }
                    dealData.searchLists = searchLists;
                    dealData.loading = true;
                    that.setData(dealData);

                }else {
                    that.dealSearchListsError();
                    return false;
                }
            },
            fail: function() {
                console.log("服务器异常");
            }
        })
    },

    /**
     * @description 搜索列表接口错误处理
     * @method dealSearchListsError
     * @paras {String} str 错误描述 (选传)
     * @since 2017-05-27
     * @author liusuling
     * */
    dealSearchListsError: function(str) {
        var that = this;
        str = str || '';
        this.setData({
            searchLists: [],
            loading: true
        });
        that.dealRrrorToast(str);
    },

    /**
     * @description 获取地址区域，先从缓存中获取区域，如果获取不到取默认的北京
     * @method getAreaCode
     * @return {String} cookieCode 区域码
     * @since 2017-05-26
     * @author liusuling
     * */
    getAreaCode: function() {
        //取cookie
        var codeCookies = wx.getStorageSync('codeCookies');
        var cookieCode;
        //如果cookie存在
        if (codeCookies && codeCookies[1]) {
            cookieCode = codeCookies[1];//取第2级（第1个）
        } else {
            cookieCode = 11010000 //默认北京市（2级）
        }
        return cookieCode;
    },

     /**
     * @description 搜索词发生变化或者筛选后退的数据重置
     * @method chageResetData
     * @since 2017-05-27
     * @author liusuling
     * */
    chageResetData: function() {
        var that = this;
        searchLists = [];
        proSkuLists = [];
        pageNumber = totalPage =1;
        this.setData({
            searchLists: [],
            listNoData: false,
            loading: true
        });
    },

    /**
     * @description 错误提示
     * @method dealRrrorToast
     * @param {String} str (选传)
     * @since 2017-05-26
     * @author liusuling
     * */
    dealRrrorToast: function(str) {
        str = str || '很抱歉，服务器繁忙请稍后再试';
        wx.showToast({
          title: str,
          icon: 'loading',
          mask: true,
          duration: 2000
        })
    }
});