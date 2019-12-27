!function(exports,prdInfo,$,templateSimple){
    //搭配购
    var prdAssort = {
    init: function () {
        this.similarDom = $("#similarDom");
        this.obj = $("#pedAssort");
        this.url = "//ss" + (cookieDomain || "") + (contextPath || "");
        this.bid = "";
        this.cid = "11010000";
        this.dataCache = null;
        this.selectDat = {};
        this.chooseSize = 0;

        this.similarDom.show();
        //prdInfo.prdType==1 上架,prdInfo.prdType == 2下架
        //console.log("prdInfo.hasGoods="+prdInfo.hasGoods);
        //console.log("prdInfo.prdType="+prdInfo.prdType);
        if (prdInfo.hasGoods == "N" || prdInfo.prdType == 2 || allStore.userStore.phase) {
            this.obj.hide();
            this.similarPrd();
            return false;
        }
        if (prdInfo.hasGoods == "Y" && !allStore.userStore.phase) {
            if(prdInfo.skuType=="ZHK" || prdInfo.skuType=="ZLH" || prdInfo.skuType=="ZHYJ" || prdInfo.skuType=="ZJXK" || prdInfo.skuType=="ZJXJ" || prdInfo.skuType=="ECTZ"  || prdInfo.skuType=="ZDZK" || prdInfo.skuType=="ZSTK" ){
                this.obj.hide();
                this.similarPrd();
                return false;
            }
            this.templateFn();
            this.getAssort();
        }
    },
    getAssort: function () {
        if ($.cookie('atgregion'))this.cid = $.cookie('atgregion').split("|")[2];
        var _this = this,
            _url = "//ss" + cookieDomain + "/item/v1/d/suits/p/detail/" + prdInfo.prdId + "/" + prdInfo.sku + "/" + _this.cid + "/flag/item/suits";
        //"http://ss.atguat.com.cn/item/v1/d/suits/p/detail/9100039231/1000060206/11010100/flag/item/suits";
        //_dat = { "pid": prdInfo.prdId, "sid": prdInfo.sku, threeD: (prdInfo.isprd3d ? '3D' : ''), cid: _this.cid };
        //if($.trim(prdInfo.shopNo)=="")_dat["cid"]=_this.cid;
        $.ajax({
            type: 'get',
            url: _url,
            dataType: 'jsonp',
            jsonpName: 'suits',
            success: function (data) {
                if (data.success && data.result && data.result.groups && data.result.groups[0].n != 0) {
                    _this.lodAssort(data.result);
                    _this.similarDom.hide();
                    _this.box_group();
                    _this.obj.show();
                    $(".similar-wrapper").remove();
                } else {
                    _this.similarDom.show();
                    _this.similarPrd();
                    $('#pedAssort').css('height','0px')
                }
            },
            error: function () {
                _this.similarPrd();
            }
        })
    },
    /*最佳组合*/
    box_group:function(){
        var _this=this;
        //搭配购和最佳组合的事件
        $('#suitsTab').on('click','a',function(){
            if($(this).hasClass('cur')){
                return false;
            }
            $(this).addClass('cur').siblings().removeClass('cur');
            _this.backDetail();
        });
    },
    backDetail:function(){
        var _this=this;
        var curBox=$('#suitsTab').find('a.cur').index();
        if(curBox==0){
            $('#similarDom_boether').hide();
            $('#suitsTab_box').show();
        }else{
            $('#similarDom_boether').show();
            $('#suitsTab_box').hide();
            prdAssort.randerS_b();
        }
    },
    randerS_b:function(){
        var _this = this, _url = "//bigd.gome.com.cn/gome/rec";
        var boxid = '';
        (prdInfo.firstCategoryId=="cat31665542" || prdInfo.firstCategoryId=="cat10000001")?boxid = 'box26':boxid = 'box28';
        (prdInfo.firstCategoryId=="cat10000004")?boxid = 'box26':boxid = 'box28';
        
        var ajaxParam = {
            boxid: boxid,
            pid: prdInfo.prdId,
            area: g.cityCode(),
            cid: $.cookie('__clickidc'),
            uid: loginData.loginId,
            imagesize: 130,
            brid: prdInfo.brandID,
            shopid: prdInfo.shopNo,
            c1id: prdInfo.firstCategoryId,
            c3id: prdInfo.thirdCategoryId,
            sid: prdInfo.sku
        };
        $.ajax({
            url: _url,
            type: "get",
            data: ajaxParam,
            timeout: 5000,
            dataType: "jsonp",
            jsonpName: "jsonpname_qitaleisi",
            success: function (data) {
                var self = this;
                if (data && data.lst && data.lst.length > 0) {
                    var htm = '<div class="andBuyOut">\
                        <div class="andBuy-btnout">\
                            <a data-btn="tlRight" href="javascript:;"><b></b></a>\
                            <a data-btn="tlLeft" href="javascript:;"><s></s></a>\
                        </div>\
                        <div class="andBuy-cont">\
                            <ul class="pushul clearfix">\
                            <% for(var i=0,j=lst.length; i<j; i++){ \
                                var prd = lst[i];\
                                var href = "/"+prd.pid+"-"+prd.sid+".html";\
                                var point = i<j-1?",":"";\
                                bigData(prd.pid+point);\
                            %>\
                                <li>\
                                <a track="5:<%= prd.pid %>" href="<%= prd.purl  %>"  target="_blank" title="<%= prd.pn %>" maima_param="<%=prd.maima_param%>">\
                                <img gome-src="<%= prd.iurl %>"  height="130" width="130"></a>\
                                <a track="5:<%= prd.pid %>" href="<%= prd.purl  %>"  target="_blank" title="<%= prd.pn %>" maima_param="<%=prd.maima_param%>"><h2><%= prd.pn %></h2></a>\
                                <p class="yuan colprice fb">¥<span><%= prd.price %></span></p>\
                                </li>\
                            <% } %>\
                            </ul>\
                        </div>\
                    </div>';
                    var products = "";
                    var tlscroll = $('body').hasClass('w990') ? 5 : 6;
                    template.helper('bigData', function (pid) {
                        products += pid;
                    });
                    $("#similarDom_boether").attr('maima_param', data.maima_param).addClass("pushbox similar")
                        .html(template.compile(htm)(data))
                        .gLoad({
                            df: 200,
                            e: function () {
                                if (typeof trackEvent != "undefined") {
                                    trackEvent(5, products);
                                }
                            }
                        });
                        for(var i=0,k=tlscroll;i<k;i++){
                            $('.pushul').find('li').eq(i).loadsrc('gome-src');
                        }
                    if (data.size > tlscroll) {
                        $('.andBuy-cont').gSlider({
                            isAuto: false,
                            isImgLoad: false,
                            dataOriginal: "gome-src",
                            showNum: tlscroll,
                            stepLen: tlscroll,
                            time: 3000,
                            btnGo: {left: '[data-btn="tlLeft"]', right: '[data-btn="tlRight"]'},
                            callback:function(){
                               $('.pushul').loadsrc('gome-src');
                            }
                        });
                    } else {
                        $("#similarDom_boether").loadsrc('gome-src');
                        $("#similarDom_boether .andBuy-btnout").children().addClass("dn");
                    }
                }
             
            }
        });

    },
    /*无货、下架：大数据-其他类似商品*/
    similarPrd: function () {

        var _this = this, _url = "//bigd.gome.com.cn/gome/rec";
        var boxid = 'box38';
        if (parseInt(prdInfo.shopFlag) > 1) {
            boxid = 'box42';
        }
        var ajaxParam = {
            boxid: boxid,
            pid: prdInfo.prdId,
            area: g.cityCode(),
            cid: $.cookie('__clickidc'),
            uid: loginData.loginId,
            imagesize: 130,
            brid: prdInfo.brandID,
            shopid: prdInfo.shopNo,
            c1id: prdInfo.firstCategoryId,
            c3id: prdInfo.thirdCategoryId,
            sid: prdInfo.sku
        };
        $.ajax({
            url: _url,
            type: "get",
            data: ajaxParam,
            dataType: "jsonp",
            timeout: 5000,
            jsonpName: "jsonpname_qitaleisi",
            success: function (data) {
                var self = this;
                if (data && data.lst && data.lst.length > 0) {
                    var htm = '\
                    <h3>其他类似商品</h3>\
                    <div class="andBuyOut">\
                        <div class="andBuy-btnout">\
                            <a data-btn="tlRight" href="javascript:;"><b></b></a>\
                            <a data-btn="tlLeft" href="javascript:;"><s></s></a>\
                        </div>\
                        <div class="andBuy-cont">\
                            <ul class="pushul clearfix">\
                            <% for(var i=0,j=lst.length; i<j; i++){ \
                                var prd = lst[i];\
                                var href = "/"+prd.pid+"-"+prd.sid+".html";\
                                var point = i<j-1?",":"";\
                                bigData(prd.pid+point);\
                            %>\
                                <li>\
                                <a track="5:<%= prd.pid %>" href="<%= prd.purl  %>"  target="_blank" title="<%= prd.pn %>" maima_param="<%=prd.maima_param%>">\
                                <img gome-src="<%= prd.iurl %>"  height="130" width="130"></a>\
                                <a track="5:<%= prd.pid %>" href="<%= prd.purl  %>"  target="_blank" title="<%= prd.pn %>" maima_param="<%=prd.maima_param%>"><h2><%= prd.pn %></h2></a>\
                                <p class="yuan colprice fb">¥<span><%= prd.price %></span></p>\
                                </li>\
                            <% } %>\
                            </ul>\
                        </div>\
                    </div>';
                    var products = "";
                    var tlscroll = $('body').hasClass('w990') ? 5 : 6;
                    template.helper('bigData', function (pid) {
                        products += pid;
                    });
                    $("#similarDom").attr('maima_param', data.maima_param).addClass("pushbox similar")
                        .html(template.compile(htm)(data))
                        .gLoad({
                            df: 200,
                            e: function () {
                                if (typeof trackEvent != "undefined") {
                                    trackEvent(5, products);
                                }
                            }
                        });
                        for(var i=0,k=tlscroll;i<k;i++){
                            $('.pushul').find('li').eq(i).loadsrc('gome-src');
                        }
                    if (data.size > tlscroll) {
                        $('.andBuy-cont').gSlider({
                            isAuto: false,
                            isImgLoad: false,
                            dataOriginal: "gome-src",
                            showNum: tlscroll,
                            stepLen: tlscroll,
                            time: 3000,
                            btnGo: {left: '[data-btn="tlLeft"]', right: '[data-btn="tlRight"]'},
                            callback:function(){
                               $('.pushul').loadsrc('gome-src');
                            }
                        });
                    } else {
                        $("#similarDom").loadsrc('gome-src');
                        $("#similarDom .andBuy-btnout").children().addClass("disable");
                    };
                    //埋码 先注释
                    maiMaRecTrack({
                        ele: '#similarDom',
                        links: '#similarDom li a'
                    });
                }else {
                     
                    $(".similar-wrapper").remove();
                    if(prdInfo.loadbot){
                        return false;
                    };
                    $.ajax(stageJsServer+'/??/gmpro/1.0.0/item/2.0.0/item/1.0.0/js/appraisal.min.js,/gmlib/ui/gpage/1.0.1/gpage.min.js,/js/n/detail/productAdvice.min.js,/gmpro/1.0.0/item/2.0.0/item/1.0.1/js/dtcommend.min.js,/gmlib/ui/gfixed/1.0.0/gfixed.min.js',{
                        dataType: "script",
                        cache: true
                    }).then(function(){
                        seajs.use(['/js/prdParts.js']);
                    });
                    prdInfo.loadbot=true;  //搭配购和其他类似商品都没有 

                }
               
               
            },
            error: function(){
                $(".similar-wrapper").remove();
            }
        });
    },
    lodAssort: function (data) {
        var _this = this;
        data["shopType"] = ($.trim(prdInfo.shopNo) == "" ? 2 : 1);
        /* 自营2 联营1 */
        _this.bid = data.bid;
        _this.dataCache = data;
        _this.obj.html(template.compile(_this.templet())(data)).show();
        _this.productPrice = $("#prdRendPrice").attr("data-price");
        _this.productTaogo = $("#prdRendPrice").attr("data-tp");
        _this.bindEvent();
    },
    bindEvent: function () {
        var _this = this,
            tabA = $("#tablink").find("a"),
            tabSuits = $("#suitsBox"),
            tabB = tabSuits.children();
        /* tab切换 */
        $('#pedAssort dt').loadsrc("gome-src");  //主商品搭配图片懒加载
        //搭配商品图片首屏懒加载
        for (var i = 0; i < 5; i++) {
            $('#suitsBox li').eq(i).loadsrc("gome-src");
            $('#suitsBox li[data-type=1]').eq(i).loadsrc("gome-src");
        }

        function rtnAr(tabB) {         //返回首屏之外的数组
            var tabBLen = tabSuits.children('li').length,
                rtnAr = [];
            for (var i = 1, k = tabBLen - 5; i <= k; i++) {
                rtnAr.push(i * 80)
            }
            return rtnAr;
        }

        var rtnAr = rtnAr(tabB);

        $('.prd_rend_prd').on('scroll', function (e) {
            var curLeft = $(this).scrollLeft();
            for (var i = 0, k = rtnAr.length; i < k; i++) {
                if (curLeft > rtnAr[i]) {
                    var cur = rtnAr.indexOf(rtnAr[i]) + 5;
                    $('#suitsBox li').eq(cur).loadsrc("gome-src");
                }
            }

        })


        tabA.each(function (k, v) {
            $(this).click(function () {
                var cur = $(this).attr('data-cat');
                if (cur != 0 && cur != 1) {
                    $('#suitsBox li[data-cat=' + cur + ']').loadsrc("gome-src")
                }

                if (!$(this).hasClass("cur")) {
                    $("#rendDialog").hide();
                    tabA.removeClass("cur");
                    $(this).addClass("cur");
                    if ($(this).attr("data-cat") == "0") {
                        if ($(this).attr("data-type") != "1") {
                            tabB.show();
                            tabSuits.css("width", tabSuits.children('li').length * 206+ "px");
                        } else {
                            tabB.hide();
                            tabSuits.css("width", tabSuits.find("[data-type=1]").length * 206 + "px").find("[data-type=1]").show().prev().show();
                        }
                    } else {
                        var hidObj = $("#suitsBox li[data-cat='" + $(this).attr("data-cat") + "']");
                        tabB.hide();
                        hidObj.show().prev().show();
                        tabSuits.css("width", hidObj.length * 206 + "px");
                    }
                }
            });
        });
        /* 商品选择 */
        tabB.each(function () {
            _this.changeCheckbox($(this));
            _this.changeMorebox($(this));
        });

        $("#rendBuy").unbind("click").click(function () {
            if (_this.chooseSize == 0 && !$(this).hasClass("disab")) {
                /* 将主商品添加到购物车并跳转到购物和页面 */
                var cartUtil = prdMain || new prdInfoMain();
                cartUtil.addCart(true);
            }
        });
        _this.createHref();
    },
    /* checkBox事件处理器 */
    changeCheckbox: function (suitsObj) {
        var _this = this;
        suitsObj.find("input").unbind("click").click(function () {
            _this.changeInputPrice($(this), suitsObj);
        });
    },
    /* checkBox价格处理器 */
    changeInputPrice: function (inputObj, suitsObj) {
        var _this = this,
            collocObj = $("#collocPrice"),
            collocPce = new Number(collocObj.attr("data-price")),
            saveMoney = $("#saveMoney"),
            savePrice = new Number(saveMoney.attr("data-price"));
        if (_this.chooseSize == 0) {
            collocPce = new Number(_this.productTaogo);
            savePrice = _this.fmartCountPrice(_this.productPrice, _this.productTaogo);
        }
        if (inputObj.attr("checked") == 'checked') {
            _this.chooseSize += 1;
            collocPce += new Number(inputObj.attr("data-tp"));
            /* 为了解决1157.31+3899.00*/
            collocPce = Math.round(collocPce * 100) / 100;
            savePrice += _this.fmartCountPrice(inputObj.val(), inputObj.attr("data-tp"));
            if (suitsObj)suitsObj.find(".choose").click();
        } else {
            _this.chooseSize -= 1;
            collocPce -= new Number(inputObj.attr("data-tp"));
            /* 为了解决1157.31+3899.00*/
            collocPce = Math.round(collocPce * 100) / 100;
            savePrice -= _this.fmartCountPrice(inputObj.val(), inputObj.attr("data-tp"));
            if (suitsObj && suitsObj.find(".rend_assort_save").length == 0)suitsObj.find(".prd_rend_version").html("");
        }
        _this.countPrice(collocPce, savePrice, collocObj, saveMoney);
        _this.createHref();
    },
    /* 计算搭配价、节省金额 */
    countPrice: function (collocPce, savePrice, collocObj, saveMoney) {
        savePrice = new Number(savePrice).toFixed(2);
        if (this.chooseSize > 0) {
            collocPce = this.fmartPrice(collocPce);
            savePrice = this.fmartPrice(savePrice);
            collocObj.attr("data-price", collocPce).html("¥" + collocPce);
            saveMoney.attr("data-price", savePrice).html("¥" + savePrice);
            $("#prdRendPrice").html("¥" + $("#prdRendPrice").attr("data-tp"));
            $("#prdRendSave").css("visibility", "visible");
        } else {
            collocPce = this.fmartPrice(this.productPrice);
            savePrice = this.fmartPrice(0);
            collocObj.attr("data-price", collocPce).html("¥" + collocPce);
            saveMoney.attr("data-price", savePrice).html("¥" + savePrice);
            $("#prdRendPrice").html("¥" + $("#prdRendPrice").attr("data-price"));
            $("#prdRendSave").css("visibility", "hidden");
        }

        if (new Number(savePrice) != 0) {
            $("#saveModel").show();
        } else {
            $("#saveModel").hide();
        }
        $("#chooseSize").html(this.chooseSize > 0 ? this.chooseSize : "0");
        //立即购买按钮控制
        var $rendBuy = $("#rendBuy");
        this.chooseSize > 0 ? $rendBuy.removeClass("disab") : $rendBuy.addClass("disab");

    },
    /* 选择更多商品处理器 */
    changeMorebox: function (suitsObj) {
        var _this = this;
        suitsObj.find(".choose").unbind("click").click(function () {
            var liID = 0;
            suitsObj.prevAll().each(function () {
                if ($(this).css("display") != "none")liID += 1;
            });
            var dat = null,
                obj = $(this),
                key = obj.attr("data-key");
            for (var i = 0; i < _this.dataCache.suits.length; i++) {
                if (_this.dataCache.suits[i].pid == key)dat = _this.dataCache.suits[i];
            }
            if (dat) {
                var diaObj = $("#rendDialog"),
                    diaData = null;
                if (obj.attr("data-skuid")) {
                    diaData = {
                        "color": obj.attr("data-color"),
                        "model": obj.attr("data-model"),
                        "skuid": obj.attr("data-skuid")
                    };
                    dat["diaData"] = diaData;
                }
                diaObj.html(template.compile(_this.templetDialog())(dat)).show();

                var _srol = _this.obj.find(".prd_rend_prd").scrollLeft();
                var _left = parseInt(210 + (liID + 1) * 150 - (diaObj.width() + 30) / 2 - 75 - _srol);
                diaObj.css("left", _left + "px");
                /* 确定 */
                diaObj.find(".dialog_red").click(function () {
                    if ($(this).hasClass("linkDisable")) {
                        return false;
                    }
                    diaObj.hide();
                    if (_this.selectDat["prdtp"]) {
                        obj.attr({
                            "data-color": _this.selectDat["color"],
                            "data-model": _this.selectDat["model"],
                            "data-skuid": _this.selectDat["skuid"]
                        }).html("修改商品");
                        var selectTxt = "", colorFlag = false;
                        if (_this.selectDat["color"] != "" && _this.selectDat["color"] != undefined) {
                            selectTxt += _this.selectDat["color"];
                            colorFlag = true;
                        }
                        if (_this.selectDat["model"] != "" && _this.selectDat["model"] != undefined) {
                            if (colorFlag)selectTxt += "、";
                            selectTxt += _this.selectDat["model"];
                        }
                        suitsObj.find(".prdimg img").attr("src", _this.selectDat["prdimage"] + "_100.jpg");
                        suitsObj.find(".prd_rend_version").html(selectTxt);
                        var checked = false;
                        if (suitsObj.find("input").attr("checked") == 'checked')checked = true;

                        if (checked) {
                            suitsObj.find("input").attr("checked", false);
                            _this.changeInputPrice(suitsObj.find("input"));
                        }

                        suitsObj.find(".price").html('<input type="checkbox" \
                                                                                value="' + _this.selectDat["prdprice"] + '" \
                                                                                data-tp="' + _this.selectDat["prdtp"] + '" \
                                                                                data-sku="' + _this.selectDat["skuid"] + '" \
                                                                                data-pid="' + key + '" \
                                                                                class="check">¥' + _this.selectDat["prdprice"]);
                        suitsObj.find("input").attr("checked", true);
                        suitsObj.find(".prdimg,.prdnam").attr({
                            "title": _this.selectDat["prdtitle"],
                            "href": g.url.item + (prdInfo.isprd3d ? '/3dproduct/' : '/product/') + key + "-" + _this.selectDat["skuid"] + ".html"
                        });
                        suitsObj.find(".prdnam").html(_this.selectDat["prdtitle"]);
                        _this.changeCheckbox(suitsObj);
                        _this.changeInputPrice(suitsObj.find("input"));
                    }
                    _this.selectDat = {};
                });
                /* 取消 && 关闭 */
                diaObj.find(".dialog_gray,.rend_dialog_close").click(function () {
                    _this.selectDat = {};
                    diaObj.hide();
                });
                _this.changeVersion(dat);
            }
        });
    },
    /* 切换颜色版本 */
    changeVersion: function (dat) {
        var obj = $("#rendDialog"),
            objColor = $("#rendcol").find(".prdcol"),
            objModel = $("#rendmod").find(".prdmod"),
            objError = $("#rendTip"),
            _this = this;
        objColor.each(function () {
            if ($(this).find("a").hasClass("select")) {
                var col = $(this).find("a.select").attr("title");
                if (col == undefined)col = "";
                var mod = objModel.find(".select").attr("title");
                if (mod == undefined)mod = "";
                _this.selectDat["color"] = col;
                _this.resetPrdPrice(dat, dat.ColorVersion[col + mod]);
            }
            $(this).unbind("click").click(function () {
                var col = $(this).find("a").attr("title");
                if (col == undefined)col = "";
                var mod = objModel.find(".select").attr("title");
                if (mod == undefined)mod = "";
                objColor.find("a").removeClass("select");
                $(this).find("a").addClass("select");
                _this.selectDat["color"] = col;
                if (dat.ColorVersion[col + mod]) {
                    _this.resetPrdPrice(dat, dat.ColorVersion[col + mod]);
                    objError.html("");
                    obj.find(".dialog_red").removeClass("linkDisable");
                } else {
                    objError.html("暂无此颜色");
                    obj.find(".dialog_red").addClass("linkDisable");
                }
            });
        });
        objModel.each(function () {
            if ($(this).find("a").hasClass("select")) {
                var col = objColor.find(".select").attr("title");
                if (col == undefined)col = "";
                var mod = $(this).find(".select").attr("title");
                if (mod == undefined)mod = "";
                _this.selectDat["model"] = mod;
                _this.resetPrdPrice(dat, dat.ColorVersion[col + mod]);
            }
            $(this).unbind("click").click(function () {
                var col = objColor.find(".select").attr("title");
                if (col == undefined)col = "";
                var mod = $(this).find("a").attr("title");
                if (mod == undefined)mod = "";
                objModel.find("a").removeClass("select");
                $(this).find("a").addClass("select");
                _this.selectDat["model"] = mod;
                if (dat.ColorVersion[col + mod]) {
                    _this.resetPrdPrice(dat, dat.ColorVersion[col + mod]);
                    objError.html("");
                    obj.find(".dialog_red").removeClass("linkDisable");
                } else {
                    objError.html("暂无此版本");
                    obj.find(".dialog_red").addClass("linkDisable");
                }
            });
        });
    },
    /* 计算弹层切换后的商品价格 */
    resetPrdPrice: function (data, verison) {
        for (var i = 0; i < data.pArr.length; i++) {
            if (data.pArr[i].sid == verison) {
                $("#miniPrdPrice").html("¥" + this.fmartPrice(data.pArr[i].price));
                this.selectDat["skuid"] = data.pArr[i].sid;
                this.selectDat["prdimage"] = data.pArr[i].img;
                this.selectDat["prdprice"] = data.pArr[i].price;
                this.selectDat["prdtp"] = data.pArr[i].tp;
                this.selectDat["prdtitle"] = data.pArr[i].title;
            }
        }
    },
    /* 创建立即购买链接 */
    createHref: function () {
        var rendBuy = $("#rendBuy"),
            rendUrls = "javascript:;",
            sps = "",
            bid = this.bid,
            skuprd_data = {},
            locationUrl = '//cart' + cookieDomain;
        rendBuy.unbind("click");
        if (this.chooseSize > 0 && prdInfo.hasGoods == "Y") {


            this.obj.find('input:checked').each(function () {
                var str = ',' + $(this).attr('data-sku') + '_' + $(this).attr('data-pid');
                sps += str;

            });
            sps = sps.substring(1);
            skuprd_data.type = 3;
            skuprd_data.pid = prdInfo.prdId;
            skuprd_data.sid = prdInfo.sku;
            skuprd_data.spid = bid;
            skuprd_data.sps = sps;


            rendBuy.click(function () {


                var url = '//cart' + cookieDomain + '/home/api/cart/addToCart';
                $.createProgress({
                    Jump: false,
                    url: url,
                    data: skuprd_data,
                    callback: function (data) {

                        if (data.success) {//添加成功
                            window.location.href = '//cart' + cookieDomain;
                            //window.location.href = u.g + "/ec/homeus/checkout/shipping.jsp";
                        } else {

                            alert(data.errMsg)
                        }
                    }
                });

                try {
                   /* var s = s_gi(s_account);
                    s.linkTrackVars = "events,products";
                    s.linkTrackEvents = "scAdd,event24";
                    s.products = bigData;
                    s.events = "scAdd,event24";
                    s.tl(this, 'o', 'imm_buy');*/


                } catch (e) {
                }
            });
        }

        //这个逻辑仅用于3d详情页
        if (prdInfo.isprd3d) {
            if (this.chooseSize < 1) {//
                $("#rendBuy").css({
                    'background': '#ccc',
                    'cursor': 'default'
                })
                $('#threeD_rendBuy_limit').removeClass('hide');
                rendBuy.unbind("click");
            } else {//
                $("#rendBuy").css({
                    'background': '#c00',
                    'cursor': 'pointer'
                })
                $('#threeD_rendBuy_limit').addClass('hide');
            }
        }
    },
    templet: function () {
        return '\
            <div class="prd_rend_tabtit" id="suitsTab">\
                <a class="cur">搭配购</a>\
                <a id="box_group">最佳组合</a>\
            </div>\
            <div id="suitsTab_box">\
            <div class="tablink" id="tablink">\
            <% \
                var allSize = 0;\
                var title = "全部搭配";\
                if(type==1){\
                    title = "精选搭配";\
                    for(var i=0; i<suits.length; i++){\
                        if(suits[i].type==1)allSize+=1;\
                    }\
                }else{\
                    for(var i=0; i<groups.length; i++){ allSize+=groups[i].n; }\
                }\
            %>\
                <a href="javascript:;" data-cat="0" data-type="<%= type %>" class="cur allSuits"><%= title %>(<%= allSize %>)</a>\
            <% for(var i=0; i<groups.length; i++){ %>\
                |　<a href="javascript:;" data-cat="<%= groups[i].cat %>"><%= groups[i].title %>(<%= groups[i].n %>)</a>\
            <%  } %>\
            </div>\
            <dl class="clearfix">\
                <dt>\
                    <span class="prd_rend_prdBox">\
                        <a href="javascript:;"><img width="100" height="100" gome-src="<%= curprd.img %>_100.jpg"/></a>\
                        <a href="javascript:;" class="alink" title="<%= curprd.title %>"><%= curprd.title %></a>\
                        <span id="prdRendPrice" class="price" data-price="<%= TempPrice(curprd.listprice) %>" data-tp="<%= TempPrice(curprd.price) %>">¥<%= TempPrice(curprd.listprice) %></span>\
                        <% if(curprd.price!=0 && curprd.price!="0.0" && TempCountPrice(curprd.listprice,curprd.price)>0){ %>\
                            <div class="prd_rend_version rend_assort_save" id="prdRendSave">搭配省 ¥<%= TempPrice(TempCountPrice(curprd.listprice,curprd.price)) %></div>\
                        <% } %>\
                    </span>\
                </dt>\
                <dd class="prd_rend_prd">\
                <ul id="suitsBox" style="width:<%= allSize*206 %>px" style="clear:both">\
                    <% for(var i=0; i<suits.length; i++){\
                        if(suits[i].pArr.length>0){\
                        var prdHref = "' + g.url.item + (prdInfo.threeDflag ? "/3dproduct/" : "/") + '"+suits[i].pid;\
                        var prdDisplay = "display:block";\
                        if(type==1){\
                            prdDisplay = "display:none";\
                            if(suits[i].type==1)prdDisplay="display:block";\
                        }\
                    %>\
                        <span class="prd_rend_sign" style="<%= prdDisplay %>">+</span>\
                        <li data-cat="<%= suits[i].cat %>" data-type="<%= suits[i].type %>" style="<%= prdDisplay %>">\
                            <span class="prd_rend_prdBox">\
                                <a href="<%= prdHref+"-"+suits[i].pArr[0].sid+".html" %>" \
                                   title="<%= suits[i].pArr[0].title %>" target="_blank" class="prdimg"><img width="100" height="100" gome-src="<%= suits[i].pArr[0].img %>_100.jpg"/></a>\
                                <a href="<%= prdHref+"-"+suits[i].pArr[0].sid+".html" %>" title="<%= suits[i].pArr[0].title %>" target="_blank" class="prdnam"><%= suits[i].pArr[0].title %></a>\
                            </span>\
                            <label class="price"><input type="checkbox" class="check" \
                                                        data-pid="<%= suits[i].pid %>" \
                                                        data-sku="<%= suits[i].pArr[0].sid %>" \
                                                        data-tp="<%= suits[i].pArr[0].tp %>" \
                                                        value="<%=  TempPrice(suits[i].pArr[0].price) %>" />¥<%=  TempPrice(suits[i].pArr[0].tp) %></label>\
                            <%\
                                var className = "";\
                                var defaultTxt = "";\
                                if(suits[i].pArr.length>1){\
                                    className=" rend_version_hid";\
                            %>\
                                    <a href="javascript:;" class="choose" data-key="<%= suits[i].pid %>">选择商品</a>\
                            <% }\
                                if( suits[i].pArr.length<=1){\
                                    var par = suits[i].pArr[0];\
                                        if(par.price-par.tp>0){\
                                            className+=" rend_assort_save";\
                                            defaultTxt = "搭配省 ¥"+TempPrice(TempCountPrice(par.price,par.tp));\
                                        }\
                                }\
                            %>\
                            <div class="prd_rend_version<%= className %>"><%= defaultTxt %></div>\
                        </li>\
                    <% } } %>\
                </ul>\
                </dd>\
                <dd class="prd_rend_cart">\
                    <span class="prd_rend_sign prd_rend_sign_init">=</span>\
                    <div class="count">\
                        <p>已搭配<strong id="chooseSize">0</strong>件</p>\
                        <p>搭&nbsp;配&nbsp;价：<strong class="f16" id="collocPrice" data-price="0">¥<%= TempPrice(curprd.listprice) %></strong></p>\
                        <% if(shopType==2){ %>\
                        <p id="saveModel" style="display:none; margin-top: 6px;">为您节省：<strong class="f14" id="saveMoney" data-price="0">¥0.00</strong></p>\
                        <% } %>\
                        <a href="javascript:;" class="<%= TempToBuy %> disab" id="rendBuy">立即购买</a>\
                        <p id="threeD_rendBuy_limit" class="hide">搭配2件以上商品可享受套餐价</p>\
                    </div>\
                </dd>\
            </dl>\
            <div class="prd_rend_dialog" id="rendDialog"></div>\
            </div><div id="similarDom_boether" class="similarDom_boether"></div>';
    },
    templetDialog: function () {
        return '\
                    <%\
                    var gomePrice = "";\
                    var gomeColor = "";\
                    var gomeModel = "";\
                    if(Color.length>0){ %>\
                        <dl class="clearfix" id="rendcol">\
                        <dt>选择颜色：</dt>\
                        <% for(var i=0; i<Color.length; i++){\
                            var slt = "";\
                            if(Color[i].select && diaData==null){\
                                slt = "class=select";\
                                gomeColor = Color[i].color;\
                            }if(diaData!=null && Color[i].color == diaData.color){\
                                slt = "class=select";\
                                gomeColor = Color[i].color;\
                            }\
                            %>\
                            <dd class="prdcol">\
                                <a title="<%= Color[i].color %>" <%= slt %> href="javascript:;">\
                                    <img alt="<%= Color[i].color %>" src="<%= Color[i].img %>_60.jpg">\
                                    <i></i>\
                                </a>\
                            </dd>\
                        <%  } %>\
                        </dl>\
                    <% } %>\
                    \
                    <% if(Model.length>0){ %>\
                        <dl class="clearfix" id="rendmod">\
                        <dt>选择版本：</dt>\
                        <% for(var i=0; i<Model.length; i++){\
                            var slt = "";\
                            if(Model[i].select && diaData==null){\
                                slt = "class=select";\
                                gomeModel = Model[i].version;\
                            }if(diaData!=null && Model[i].version == diaData.model){\
                                slt = "class=select";\
                                gomeModel = Model[i].version;\
                            }\
                        %>\
                            <dd class="prdmod">\
                                <a title="<%= Model[i].version %>" <%= slt %> href="javascript:;"><%= Model[i].version %><i></i></a>\
                            </dd>\
                        <%  } %>\
                        </dl>\
                    <% } %>\
                    <dl>\
                        <dt class="rend_dialog_price">\
                        <%\
                            for(var i=0; i<pArr.length; i++){\
                                if(pArr[i].sid==ColorVersion[gomeColor+gomeModel]){\
                                    gomePrice=pArr[i].tp;\
                                }\
                            }\
                        %>\
                            国&nbsp;&nbsp;美&nbsp;&nbsp;价：<strong id="miniPrdPrice">¥<%=  TempPrice(gomePrice) %></strong>\
                        </dt>\
                        <dd>\
                            <a class="redlink dialog_red" href="javascript:;">确定</a>\
                            <a class="redlink dialog_gray" href="javascript:;">取消</a>\
                            <em id="rendTip"></em>\
                        </dd>\
                    </dl>\
                    <div class="rend_dialog_icon">▲</div>\
                    <div class="rend_dialog_close">╳</div>';
    },
    templateFn: function () {
        var _this = this;
        template.helper('TempPrice', function (price) {
            return _this.fmartPrice(price);
        });

        template.helper('TempCountPrice', function (price, tp) {
            return _this.fmartCountPrice(price, tp);
        });

        template.helper('TempToBuy', function () {
            var cssName = "redlink";
            if (prdInfo.hasGoods != "Y")cssName += " disab";
            return cssName;
        });
    },
    /* 计算节省金额 */
    fmartCountPrice: function (oldPrice, newPrice) {
        return new Number((new Number(oldPrice) - new Number(newPrice)).toFixed(2));
    },
    /* 格式化价格 */
    fmartPrice: function (price) {
        price += "";
        var priceArray = price.split(".");
        if (priceArray.length > 1) {
            price = priceArray[0];
            if (priceArray[1].length > 1) {
                price += "." + priceArray[1].substring(0, 2);
            } else {
                price += "." + priceArray[1] + "0";
            }
        } else {
            price += ".00";
        }
        return price;
    }
}

exports.prdAssort=prdAssort;
}(window,prdInfo,$,templateSimple);