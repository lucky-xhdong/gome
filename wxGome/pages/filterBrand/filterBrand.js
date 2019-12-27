var app = getApp();
var goHeader = app.goHeader;
var selectedFilter = {};//已选择的筛选项

Page({
    data: {
    	brand: [],
		selectBrand: []
    },
    onLoad: function() {
    	this._init();
    },

    /**
     * @description 初始化数据结构<br />
     * @method _init
     * @since 2017-05-24
     * @author liusuling
     */
    _init: function() {
        selectedFilter = {};
    	this._dealData();
    },

    /**
     * @description 通过获取数据，展示客户选择的项
     * @method _dealData
     * @since 2017-05-26
     * @author liusuling
     * */
    _dealData: function() {
    	var that = this;
    	var brand = wx.getStorageSync("facets").brand.items;
    	selectedFilter = wx.getStorageSync("selectedFilter") || {};
    	if(!selectedFilter.selectBrand) { selectedFilter.selectBrand = [];}
    	var selectBrand = selectedFilter.selectBrand;

    	var selectArr = [];
    	for(var i=0; i<selectBrand.length; i++) {
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
    _selectChangeEvt: function(ev) {
    	var selectArr = ev.detail.value;
    	this._dealSelectedData(selectArr);
    },

    /**
     * @description 重置事件
     * @method _resetEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    _resetEvt: function(ev) {
    	this._dealSelectedData([]);
    },

    /**
     * @description 确认事件
     * @method _confirmEvt
     * @since 2017-05-26
     * @author liusuling
     * */
    _confirmEvt: function(ev) {
    	selectedFilter.selectBrand = this.data.selectBrand;
    	wx.setStorageSync("selectedFilter",selectedFilter);
    	wx.navigateBack({
            delta: 1
        })
    },

    /**
     * @description 处理被选中的值<br />
     * @method _dealSelectedData
     * @param {Array} selectArr 选中值的id集合
     * @since 2017-05-23
     * @author liusuling
     */
    _dealSelectedData: function(selectArr) {
    	var that = this;

    	var brand = that.data.brand;
    	var selectBrand = [];

    	for(var i=0; i<brand.length; i++) {
    		for(var j=0; j<selectArr.length; j++) {
    			if(brand[i].id == selectArr[j]) {
    				selectBrand.push({
    					id: brand[i].id,
    					value: brand[i].value
    				});
    				brand[i].selected = true;
    				break;
    			}else {
					brand[i].selected = false;
    			}
    		}
    		if(selectArr.length == 0) {
    			brand[i].selected = false;
    		}
    	}

    	that.setData({
            brand: brand,
            selectBrand: selectBrand
        })
    }

});