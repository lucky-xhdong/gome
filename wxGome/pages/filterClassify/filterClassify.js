var app = getApp();
var goHeader = app.goHeader;
var ALL = 'ALL';//全部
var L1Id = ALL;//热门的一级分类
var L2Id = ALL;//热门的二级分类
var ALL_ITEM = {
    "name": "全部",
    "id": "ALL",
    "items": [
        {
            "name": "全部",
            "id": "ALL"
        }
    ]
};

var oldIndex = { 
    l1Idx: 0,
    l2Idx: 0
};
var curIndex = { 
    l1Idx: 0,
    l2Idx: 0
};
var selectedFilter = {};//已选择的筛选项
Page({
    data: {
    	classify: []
    },
    onLoad: function() {
        this.resetData();
    	this._init();
    },

    /**
     * @description 初始化数据结构<br />
     * @method _init
     * @since 2017-05-24
     * @author liusuling
     */
    _init: function() {
    	this._dealData();
    },

    /**
     * @description 存入page前面的变量，会被缓存，所以需要重新部分数据
     * @method restData
     * @since 2017-05-31
     * @author liusuling
     * */
    resetData: function() {
        oldIndex = { 
            l1Idx: 0,
            l2Idx: 0
        };
        curIndex = { 
            l1Idx: 0,
            l2Idx: 0
        };
        selectedFilter = {};
    },

    /**
     * @description 通过获取数据，展示客户选择的项
     * @method _dealData
     * @since 2017-05-26
     * @author liusuling
     * */
    _dealData: function() {
    	var that = this;
    	//获取缓存，并设初始值
    	var hotCategory = wx.getStorageSync("facets").hotCategory;
    	selectedFilter = wx.getStorageSync("selectedFilter") || {};

        if(!selectedFilter.selectClassify || !selectedFilter.selectClassify.item) { 
            selectedFilter.selectClassify = { //已选的分类
                "name": ALL_ITEM.name,
                "id": ALL_ITEM.id,
                "index": 0,
                "item":ALL_ITEM.items[0]
            };
            selectedFilter.selectClassify.item.index = 0;
        }
    	var selectClassify = selectedFilter.selectClassify;
    	var classify = hotCategory;
    	//放入全部的数据
    	classify.unshift(ALL_ITEM);

        for(var i=0; i<classify.length; i++) {
            classify[i].selected = false;
            //如果选中的项是全部，则分类一展开,如果选择的其他的分类则选中的分类展开.全部项始终是展开的
            if(classify[i].items && classify[i].items.length>0) {
                for(var j=0; j<classify[i].items.length; j++) {
                    classify[i].items[j].selected = false;
                }
            }
        }
        classify[0].selected = true;
        
        //设置默认的选择，如果没有选择默认是全部，第一分类展开，如果有选择，则默认保留上一次的选择，只限在搜索范围类
        if(selectClassify.id == ALL) {
            classify[1].selected = true;
            classify[0].items[0].selected = true;
            curIndex.l1Idx = oldIndex.l1Idx = 1;
        }else {
            curIndex.l1Idx = oldIndex.l1Idx = selectClassify.index;
            curIndex.l2Idx = oldIndex.l2Idx = selectClassify.item.index;
            classify[curIndex.l1Idx].selected = true;
            classify[curIndex.l1Idx].items[curIndex.l2Idx].selected = true;
        }

    	that.setData({
            classify: classify
        })
    },

    /**
     * @description 一级分类事件
     * @method _FirstClassifyEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    _FirstClassifyEvt: function(ev) {
    	curIndex.l1Idx = ev.currentTarget.dataset.oneIdx;
    	this._dealSelectedData(1);
    },

    /**
     * @description 选择分类
     * @method _selectedClassifyEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    _selectedClassifyEvt: function(ev) {
    	//获取分类id
        curIndex.l1Idx = ev.currentTarget.dataset.oneIdx;
        curIndex.l2Idx = ev.currentTarget.dataset.twoIdx;
    	this._dealSelectedData(2);
    },

    /**
     * @description 点击后数据的变化<br />
     * @method _dealSelectedData
     * @param {Number} level 1：一级分类，2：二级分类 (必传)
     * @since 2017-05-22
     * @author liusuling
     */
    _dealSelectedData: function(level) {
    	var that = this;
    	var classify = that.data.classify;
    	var selectClassify = {};

        if(level ==1) {
            classify[curIndex.l1Idx].selected = !classify[curIndex.l1Idx].selected;
            if(curIndex.l1Idx !== oldIndex.l1Idx) {
                classify[oldIndex.l1Idx].selected = false;
                oldIndex.l1Idx = curIndex.l1Idx;
            }

            classify[0].selected = true;
            that.setData({
                classify: classify
            });
        }
        if(level == 2) {
            //点击后就回退
            classify[curIndex.l1Idx].items[curIndex.l2Idx].selected = true;
                
            if(classify[curIndex.l1Idx].id == ALL) {
                selectClassify = {};
            }else {
                selectClassify = {
                    id: classify[curIndex.l1Idx].id,
                    name: classify[curIndex.l1Idx].id,
                    index: curIndex.l1Idx,
                    item: {
                        id: classify[curIndex.l1Idx].items[curIndex.l2Idx].id,
                        name: classify[curIndex.l1Idx].items[curIndex.l2Idx].name,
                        index: curIndex.l2Idx
                    }
                }
            }
            selectedFilter.selectClassify = selectClassify;
            wx.setStorageSync("selectedFilter",selectedFilter);
            wx.navigateBack({
                delta: 1
            })
        }
    }
});