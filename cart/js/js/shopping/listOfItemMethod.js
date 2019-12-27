/**配送方式*/
!function (exports, req, u, ui, uw, tpl) {
    var TYPE = "7listOfItem7";
    //shopping.js中 动态设置进来的东西
    var $$   = {
        getPickingUpStores: null
    };
    var emit = uw.emit(TYPE);

    function div(im) {
        return im('div');
    }

    function datfn(im) {
        return im("data");
    }

    var _zipWith = u.curry(function (fn, arr1, arr2) {
        var r = [];
        for (var i = 0; i < arr1.length; i++) {
            if (!arr1[i]) arr1[i] = {}
            if (!arr2[i]) arr2[i] = {}
            r.push(fn(arr1[i], arr2[i]));
        }
        ;
        return r;
    })

    function transData(data) {
        //时间段头部 星期几 和余月月-日日
        function isAvailableDay(b) {
            var time = u.find(u.prop("status"), b.items);
            return time;
        }

        function headfn(a) {
            var ymd = a.yd.split(" ")[0].split("-");
            return {
                label: a.label,
                md   : ymd[1] + "-" + ymd[2]
            }
        }

        //限时达 横向数据转纵向数据
        function xsddata(xsd) {
            function groupTimeFn(data) {
                var headarr = [{label: "时间段"}];
                var range   = [];
                for (var i = 0; i < data[0].items.length; i++) range.push(i);

                function findItem(i) {
                    var bodyfn = u.map(function (a) {
                        return a.items[i];
                    })
                    return u.concat([data[0].items[i]], bodyfn(data));
                }

                headarr     = u.concat(headarr, u.map(headfn, data));
                var bodyarr = u.map(findItem, range);
                return {
                    head: headarr,
                    body: u.map(_zipWith(u.assoc("head"), headarr), bodyarr)
                }

            }
            function multipleTimeFn(data) {
                var data1      = u.filter(isAvailableDay, data)
                var totalGroup = Math.ceil(data1.length / 9)
                var start      = 0, arr = [];

                for (var i = 0; i < totalGroup; i++) {
                    if (start < totalGroup) {
                        arr.push(groupTimeFn(data1.slice(i * 9, 9 * (++start))))
                    }
                }
                return arr
            }
            return u.assoc('concrete', multipleTimeFn(xsd.concrete), xsd)
        }
        //时间
        function assocTimes(a) {
            // if (a.times.code && a.times.code == 'SLOT') {
            //     return u.assoc('times', xsddata(a.times), a)
            // } else {
            //     return a
            // }
            
            var temp = a.items;

            if (temp.length==0){
                a.items.push(data.groups[0].commerceItemsGroup[0]);
                return a;
            }
            if (temp.length>0) {
                for(var i=0;i<temp.length;i++) {
                    if (temp[i].times.code && temp[i].times.code == 'SLOT') {
                        temp[i].times = xsddata(a.items[i].times);
                    }
                }
                a.items = temp;
                return a;
            }
        }
        //支付方式
        function paymentfn(a) {
            if (a.payments == null) {
                a.payments = [];
            }
            if (a.payments.length != 0) return u.assoc("payments", [{"code": "SOME_UP", "selected": true}], a);
            return a;
        }

        var head  = u.head(data.shippinginfo);
        var tail  = u.tail(data.shippinginfo);
        var sinfo = u.concat(  [assocTimes(head)], u.pipe( u.map(paymentfn), u.map(assocTimes) )(tail)  );

        function gomeNoFee(data) {
            function fn1(info) {
                return u.assoc("express", u.map(u.assoc("shippingFee", null), info.express), info);
            }
            if (data.shopId == "GOME") {//TOOD 可能这里有问题
                return u.assoc("shippinginfo", u.map(fn1, data.shippinginfo), data);
            }
            
            return data;
        }

        //是否显示对应商品
        function visibleCorrespondItems(shopId) {
            if (!$config.isGomeShop(shopId)) return false;
            if ($page.site == "home") return true;
            if ($config.isQygSite()) return true;
            return false;
        }

        return u.pipe(
            //限时达时间转换，支付方式与上方一致转换
            u.assoc("shippinginfo", sinfo)
            //自营商品屏蔽运费
            , gomeNoFee
            //获取选中的项
            , u.assoc("selectedfn", u.find(u.prop("selected")))
            //获取限时达选中的时间并格式化如果没有选中的返回null
            , u.assoc("xsdSelectedTime", xsdSelectedTime)
            , u.assoc("visibleCorrespondItems", visibleCorrespondItems)
        )(data);
    }

    //计时达->选中的时间
    function xsdSelectedTime(data) {
        var selectedItem = u.find(u.prop("selected"));
        for (var i = 0; i < data.length; i++) {
            var item = u.reduce(function (result, itemarr) {
                if (result) return result;
                var item = selectedItem(u.tail(itemarr));
                if (item) return item;
                return null;
            }, null, data[i].body);
            if (item) break
        }
        if (item) {
            return item.head.md + "(" + item.head.label + ") " + $config.formathhmm(item.startTime) + "-" + $config.formathhmm(item.endTime);
        }
        return "";
    }

    var io              = u.curry(function (im, data) {
        im("data", data);
        return im;
    });
    //选择快递
    var selectExpressfn = u.curry(function (data, path) {
        var selectedItem   = u.path(path, data);
        var expressPath    = u.take(3, path);
        var changeSelected = u.map(u.ifn(u.eq(selectedItem), u.assoc("selected", true), u.assoc("selected", false)));
        var changeExpress  = u.pipe(u.path(expressPath), changeSelected);
        //如果是门店自提
        if (selectedItem.code == "Gome Picking Up") {
            emit("selectPickingUp", {
                shop           : data,
                selectedExpress: selectedItem
            });

        } else {
            emit("selectExpress", {
                shop           : data,
                selectedExpress: selectedItem
            });
        }
        return u.assocPath(expressPath, changeExpress(data), data);
    });


    function domOrParentHasAttr(dom,attr){
        var attrv=dom.getAttribute(attr);
        if(attrv!==null)return true;
        if(dom.parentElement==null){
            return false;
        }
        return domOrParentHasAttr(dom.parentElement,attr);
    }
    //快递配送信息、支付方式、备注模板渲染
    function render(im) {
        div(im).html(tpl.listOfItem_method(datfn(im)));
        alternation(im);

        //预约安装
		div(im).find(".yyaz-support").each(function(){
            var $this = $(this);
            var itemId = $this.attr("itemId");
            var dataWaveNum = null,dataInstallDate = null;
            var site = $this.attr("site");
            var tabBtn = $this.next().find(".btn-tab");
            var jsSelect = $this.next().find(".js-select");
            var slotSel = $this.next().find(".slotSel");
            var jsSelectTime = $this.find(".jsSelectTime");
            var slotBodyWrap = $this.next().find(".slotBodyWrap");
            function tabShow(){
                if($config.jsSelectTime == "暂缓安装"){
                    tabBtn.eq(0).removeClass("btn-checked");
                    tabBtn.eq(0).find(".chose_icon").addClass("hide");
                    tabBtn.eq(1).addClass("btn-checked");
                    tabBtn.eq(1).find(".chose_icon").removeClass("hide");

                    $(".slotTable").find(".slotHead").addClass("slotHeadGray");
                    $(".slotTable").find(".slotBodyWrap").addClass("slotBodyWrapGray");
                }else{
                    tabBtn.eq(1).removeClass("btn-checked");
                    tabBtn.eq(1).find(".chose_icon").addClass("hide");
                    tabBtn.eq(0).addClass("btn-checked");
                    tabBtn.eq(0).find(".chose_icon").removeClass("hide");

                    $(".slotTable").find(".slotHead").removeClass("slotHeadGray");
                    $(".slotTable").find(".slotBodyWrap").removeClass("slotBodyWrapGray");
                }
            }
            //安装时间(：20xx-xx-xx (周x) xx:xx-xx:xx )
            var tiVOSwaveTime = jsSelect.attr("data-installDate") + "(" + jsSelect.attr("data-installweek") + ") " + jsSelect.attr("data-waveTime");
            if(!jsSelect.attr("data-installDate") || jsSelect.attr("data-installDate") == undefined){
                $config.jsSelectTime = "暂缓安装";
            }else{
                $config.jsSelectTime = tiVOSwaveTime;
            }
            tabShow();
            if ($config.jsSelectTime =="暂缓安装") {
                jsSelectTime.html($config.jsSelectTime+'&nbsp;');
            }
            else{
                jsSelectTime.html('预计&nbsp;'+$config.jsSelectTime+'&nbsp;');
            }
            
            //tab切换
            tabBtn.each(function(){
                $(this).on("click",function(){
                    tabBtn.removeClass("btn-checked").find(".chose_icon").addClass("hide");
                    $(this).addClass("btn-checked").find(".chose_icon").removeClass("hide");

                    if($(this).parent().hasClass("zhaz")){//暂缓安装
                        $(this).closest(".slotTable").find(".slotHead").addClass("slotHeadGray");
                        $(this).closest(".slotTable").find(".slotBodyWrap").addClass("slotBodyWrapGray");
                        jsSelect.find("span").css({"background":"#eee","color":"#ccc"});
                        slotSel.removeClass("hover");
                        dataWaveNum = "N";
                        dataInstallDate = "N";
                    }else{
                        $(this).closest(".slotTable").find(".slotHead").removeClass("slotHeadGray");
                        $(this).closest(".slotTable").find(".slotBodyWrap").removeClass("slotBodyWrapGray");
                        jsSelect.find("span").css({"background":"#ff5757","color":"#fff"});
                    }
                });
            });
            //修改
            $this.find(".yyaz_modify").click(function(){
                $("[click-document-hide]").hide();
                $this.next(".yyaz-box").show();
            });
            //点选
            var iTd = $this.next().find(".js-select-can");
            var iTds = $this.next().find(".js-select");
            iTd.each(function(){
                $(this).click(function(){
                    if($(this).closest(".slotBodyWrap").hasClass("slotBodyWrapGray"))return;
                    dataWaveNum = $(this).attr("data-waveNum");
                    dataInstallDate = $(this).attr("data-installDate");
                    iTd.removeClass("hover");
                    iTds.find("span").css({"background":"none","color":"#333"});
                    $(this).addClass("hover");
                });
            });
            //暂缓安装划过问号，显示tip
            var $zhazBtn = $this.next().find(".zhaz-btn");
            $zhazBtn.each(function(){
                var $tipsBtn = $(this).find(".tipsBtn");
                var $tipsBox = $zhazBtn.next();
                $tipsBtn.hover(function(){
                    $tipsBox.show();
                },function(){
                    $tipsBox.hide();
                });
            });
            div(im).find(".card-num-t").each(function(){
                var $this = $(this)
                    ,$cardNumCons = $(".cardNumCon")
                    ,cardNumCon = $this.parent().next(".cardNumCon");
                $this.on("click",function(){
                    $cardNumCons.hide();
                    cardNumCon.show();
                });
            });
            //点选但是不点确定会初始化tab状态
            $(document).on("click",function(e){
                if(domOrParentHasAttr(e.target,"click-document-pre") || domOrParentHasAttr(e.target,"click-document-hide"))return;
                iTd.removeClass("hover");
                iTds.find("span").css({"background":"#ff5757","color":"#fff"});
                tabShow();
            });

			//鼠标滑过事件
            var slotBodyList = slotBodyWrap.find(".slotBodyList");
            slotBodyList.each(function(){
                $(this).hover(function(){
                    $(this).css("background","#fffaf4");
                },function(){
                    $(this).css("background","#fff");
                });
            });
            slotBodyList.each(function(){
                var $this = $(this);
                $this.find(".slotSel").hover(function(){
                    var index = $(this).index();
                    slotBodyList.each(function(){
                        var iSlotSel = $(this).find(".slotSel").eq(index);
                        if(iSlotSel.css("background") == "#fff5e9"){
                            iSlotSel.css("background","#fff5e9");
                        }else{
                            iSlotSel.css("background","#fffaf4");
                        }
                    });
                },function(){
                    var index = $(this).index();
                    slotBodyList.each(function(){
                        $(this).find(".slotSel").eq(index).css("background","none");
                    });
                });
            });

            //取消
            $this.next().find(".cancelBtn").click(function(){
                $(this).closest(".yyaz-box").hide();
            });
            //确定
            $this.next().find(".primaryBtn").click(function(){
                if(dataWaveNum == null || dataInstallDate == null){
                    $("[click-document-hide]").hide();
                    $(".yyaz-box").hide();
                }else{
                    emit("saveTransportInstall",{
                        site:site,
                        itemId:itemId,
                        selectedTime:dataInstallDate,
                        selectedWaveNum:dataWaveNum
                    });
                }
            });
        });
    }

    function alternation(im) {
        ui.gpipes(div(im), {
            changeComment: changeComment
        });

        //配送Day对应商品
        div(im).find('[hoverup-0').on('click',function(e){
            if ( e && e.stopPropagation ){
                e.stopPropagation();
            }else{
                window.event.cancelBubble = true;
                return false;
            }
            var el = $(this)
            $("[click-document-hide]").hide()
            el.next().find('[hover-1]').toggle()
        });

        //安装对应商品
        div(im).find('[hoverup-1]').on('click',function(){
            var $this = $(this);
            $("[click-document-hide]").hide();
            $this.parents('._alert_post_set').next().next('._hover_1').show();
        });
       
        //保存备注
        var commentTimeid = null, $deli_time = div(im).find('.deli_time');

        function changeComment(note, tip) {
            if (note.val().length > 30) {
                tip.show();
                note.addClass("error");
                return;
            }
            note.removeClass("error");

            tip.hide();
            io(im, u.assocPath(["profile", "comments"], note.val(), datfn(im)));
            commentTimeid = ui.delay(1000, function () {
                emit("saveComments", {shop: datfn(im), cm: note.val()});
            }, null, commentTimeid);
        }

        //选择快递
        div(im).find("[g-e-path]").on("click"
            , ui.jqpipe(ui.attr("g-e-path")
                , u.split(",")
                , selectExpressfn(datfn(im))
                , io(im)
                , render));
        //修改支付方式
        div(im).find("[g-p-path]").on("click"
            , ui.jqpipe(ui.attr("g-p-path")
                , u.split(",")
                , u.path(u.__, datfn(im))
                , dialogPayment));

        function dialogPayment(payments) {
            function bodyfn() {
                return tpl.listOfItem_method_payment(payments);
            }

            var dialog = panel.confirm({
                body : bodyfn,
                close: ui.hide,
                btns : []
            });
            dialog.$dialog.find("[g-list-save]").on("click", function () {
                emit("savePayment", u.find(u.prop("selected"), payments));
                ui.hide(dialog);
            });
            dialog.$dialog.find("[g-list-canel]").on("click", function () {
                ui.hide(dialog);
            });
            dialog.$dialog.find("[idx]").on("click", function () {
                dialog.hide();
                var idx = $(this).attr("idx");
                var p   = u.map(u.assoc("selected", false), payments);
                dialogPayment(u.assocPath([idx, "selected"], true, p));
            });
        }

        //鼠标点击修改运能展示
        div(im).find(".js-modify_slot_time").on('click', function () {
            var el = $(this), $eln = el.next().next();
            $("[click-document-hide]").hide()
            $eln.show().find('td').removeClass('hover');
            $eln.find('.js-selected').addClass('hover');
        })
        //配送时间选择
        div(im).find("[g-day-path]").on('click', function () {
            var el           = $(this);
            var selectedPath = el.attr("g-day-path").split(",");
            var data         = datfn(im);

            function fun0(d) {
                var p = '';
                p += d.itemId;
                return p;
            }
            var b=u.map(fun0,u.path(u.take(3, selectedPath), data)).join(',');
            emit("selectDayTime", {
                masLoc     : u.path(u.take(2, selectedPath), data).masLoc,
                shop       : data,
                selectItems: u.path(u.take(7, selectedPath), data),
                cids:      b
            });
        })
        //运能配送时间选择
        div(im).find("[g-t-path]").on("click", function () {
            var el = $(this);
            el.parents('.deli_time').find('td').removeClass('hover')
            el.addClass('hover')
        });
        div(im).find("[g-t-cancel]").on('click', function () {
            $deli_time.hide()
        })
        //运能配送时间选择
        div(im).find("[attr-slot^=g-slot-confirm_]").on('click', function () {
            var slotindex = $(this).attr('attr-slot').split('_')[1]
            var el        = $(this).parents('.deli_time').find('td.hover')
            if (el.attr("g-t-path")) {
                var selectedPath = el.attr("g-t-path").split(",");
                var data         = datfn(im);
                var selectBody   = u.path(u.take(10, selectedPath), data);
                var headArr      = u.take(7, selectedPath);
                headArr.push('head', selectedPath[selectedPath.length - 1]);
                var selectHead = u.path(headArr, data);
                function fun0(d) {
                    var p = '';
                    p += d.itemId;
                    return p;
                }
                var b;
                if (u.path(u.take(2, selectedPath), data).masLoc) {
                    b=u.map(fun0,u.path(u.take(3, selectedPath), data)).join(',');
                }
                else{
                    b=u.path(u.take(4, selectedPath), data).itemId;
                }
                $('[g-slot-calendar_' + slotindex + ']').val(selectHead.md + "(" + selectHead.label + ") " + $config.formathhmm(selectBody.startTime) + "-" + $config.formathhmm(selectBody.endTime))
                emit("selectSlotTime", {
                    masLoc    : u.path(u.take(2, selectedPath), data).masLoc,
                    shop      : data,
                    times     : u.path(u.take(5, selectedPath), data),
                    selectBody: selectBody,
                    cids      : b
                });
            } else {
                $deli_time.hide();
            }
        })
        //门店自提修改
        div(im).find("[g-picking-up]").on("click", function () {
            var path             = $(this).attr("g-picking-up").split(",");
            var selectedItem     = u.pipe(u.path(path), u.find(u.prop("selected")));
            var item             = selectedItem(datfn(im));
            var shop             = datfn(im);
            var listOfItemShopNo = shop.shopId;
            $$.getPickingUpStores(item.city, listOfItemShopNo).then(function (data) {
                if (data.success == false) return panel.alert(data.errMsg);

                function filterStores(area) {
                    var enabledStorefn      = u.pipe(u.prop("enabled"), u.eq("1"));
                    var stores              = u.filter(enabledStorefn, area.gomeStoreShippings);
                    area.gomeStoreShippings = stores;
                    return area;
                }

                function areaStorelengthGt0(a) {
                    return a.gomeStoreShippings && a.gomeStoreShippings.length > 0;
                }

                var doFilter = u.pipe(u.map(filterStores), u.filter(areaStorelengthGt0))
                dialogPickingUp(im, {pickingUP: item, list: doFilter(data.data)});
            });
        });

    }

    function dialogPickingUp(im, data) {
        var storeId = data.pickingUP.storeId;

        function isSelectArea(area) {
            if (area.gomeStoreShippings) return u.find(u.pipe(u.prop("gomeStoreId"), u.eq(storeId)), area.gomeStoreShippings);
            return false;
        }

        function isSelectStore(store) {
            return store.gomeStoreId == storeId;
        }

        function selectedArea(list) {
            var r = u.find(isSelectArea, list);
            return r == null ? list[0] : r;
        }

        data.selectedArea = selectedArea;
        data.isSelectArea = isSelectArea;
        var dialog        = $.gDialog({
            html : tpl.listOfItem_pickingUp(data),
            modal: {}
        });
        dialog.show();
        var div = dialog.$dialog;

        function renderStores(div, area) {
            area               = area || {};
            area.isSelectStore = isSelectStore;
            div.find("#store-content").html(tpl.listOfItem_pickingUp_stores(area));
            div.find("[store-idx]").on("click", function () {
                var idx   = $(this).attr("store-idx");
                var store = area.gomeStoreShippings[idx];
                storeId   = store.gomeStoreId;
                renderStores(div, area);
            });
        }

        renderStores(div, selectedArea(data.list));

        //下拉框设置
        div.find("[g-select]").on("click", function () {
            div.find("[g-select-body]").toggle();
            return false;
        });
        div.on("click", function () {
            // if($(this).is("[g-select]"))return;
            div.find("[g-select-body]").hide();
        });
        //点击下拉框选项
        div.find("[s-idx]").on("click", function () {
            var idx = $(this).attr("s-idx");
            renderStores(div, data.list[idx]);
            div.find("[g-title]").html($(this).html());
        });
        //保存门店自提
        div.find("#pks-saveStore").on("click", function () {
            emit("selectPickingUp", {
                shop           : datfn(im),
                selectedExpress: {
                    code   : "Gome Picking Up",
                    storeId: storeId
                }
            });
            dialog.hide();
        });
        //点击关闭
        div
            .find("[g-close]")
            .on("click", function () {
                dialog.hide();
            });
    }

    function make(div, data) {
        data = transData(data);

        function r(a, data1) {
            if (a == "div") return div;//操作范围
            if (data1 != null) {
                data = data1;
                return r;
            }
            if (a == "data") return data;//最新数据
        }
        
        render(r);
        return r;
    }

    exports.listOfItemMethod = {
        make: make,
        TYPE: TYPE,
        $$  : $$
    };
}(this, request, util, util_ui, util_watch, GTPL);