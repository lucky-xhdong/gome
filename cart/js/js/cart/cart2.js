!function (u, ui, uw, req,giftHead) {
    var commonerror           = u.curry(function (errfn, handler, data) {
        if (data.success) {
            return handler(data);
        } else {
            return errfn(data)
        }
    });
    var _isCatchDian = false;//是否使用店铺券 缓存数据
    var _isLoading = true;//给loadCart添加flag，避免短时间内重复加载loadCart造成繁忙阻塞
    var shopSkuNos = [];//暂存店铺skus
    //优惠券最优组合埋cookie
    $.cookie('yhj_com','Y', {expires:30,path:'/',domain:window.cookieDomain});
    function _getSiteDomin(){
        return (function (cookieDomain, siteName) {//子域名，用于拼接空购物车跳转
            if(isQygSite()){//http://b.atguat.com.cn/qyg/index
                return '//preview.ds.gome.com.cn/stage-web/channel.jsp?templateName=enterpriseV07&ftlPath=qyg/index'//todo 企业购频道页地址
            }
            var subDomain        = {};
            subDomain.home       = 'www';
            subDomain.groupOn    = 'tuan';
            subDomain.rushBuy    = 'q';
            subDomain.secondHand = 'tao';
            subDomain.warranty   = 'www';
            subDomain.presell    = 'www';
            return '//' + (subDomain[siteName] || 'www') + cookieDomain;
        })(cookieDomain, siteName)
    }
    var commonErrorWarp       = commonerror(errfn);
    var commonErrorRenderWarp = commonerror(errRenderfn);
    var siteName              = $page.site// 当前站点名称
        , cookieDomain        = window.cookieDomain
        , siteDomain          = _getSiteDomin()
        , defaultData         = {
            siteName    : siteName
            , siteDomain: siteDomain
        }
        , addGoodType         = {// 添加商品时候的类型字段，用于购物车添加商品的部分
            home: 0,
            ext : 5,   // 延保商品
            jjg : 6,  // 加价购
            GIGTS: 26, //赠品
            qiyegou: 27  //企业购
        }
        , reducePriceData     = null
        , pidArr              = []
        , events              = {
            // 选中、取消单个商品
            'gcheckbox.change [act-check-item]'       : function () {
                var $this   = $(this);
                var checked = $this.find('[type=checkbox]').prop('checked');
                postapi(checked ? "cart/selectItem" : "cart/cancelItem", {
                    cid: $this.data('cid')
                }).then(commonErrorRenderWarp(function () {
                    cartApp.loadCart();
                }))
            }
            , 'click [act-remove-selected-good]'      : function () {
                postapi("cart/cancelItem", {
                    cid: $(this).attr('hover')
                }).then(commonErrorWarp(function () {
                    cartApp.loadCart(false, {isBottomOpen: true});
                }))
            }
            // 选中、取消商铺商品
            , 'gcheckbox.change [act-check-shop-item]': function () {
                var $this   = $(this);
                var checked = $this.find('[type=checkbox]').prop('checked');
                postapi(checked ? "cart/selectItemsByShopNo" : "cart/cancelItemsByShopNo", {
                    sno: $this.data('sid')
                }).then(commonErrorRenderWarp(function () {
                    cartApp.loadCart();
                }))
            }
            // 全选、取消全选
            , 'gcheckbox.change [act-check-all-items]': function () {
                var checked = $(this).find('[type=checkbox]').prop('checked');
                postapi(checked ? "cart/selectAllItem" : "cart/cancelAllItem", {}).then(commonErrorWarp(function () {
                    cartApp.loadCart();
                }))
            }
            // 修改商品数量
            , 'count-change [act-change-count]'       : function (event, value, oldValue) {
                var $this = $(this);
                setTimeout(function(){
                    if(!$config.cartAtom.limitTuanIsShow){
                        $config.cartAtom.limitTuanIsShow = {};
                    }
                    $config.cartAtom.limitTuanIsShow.currentCid = $this.data('cid');
                },0);
                var _track = function (){
                    var _type = '';
                    _cha = value-oldValue;
                    (_cha>0)?  _type='AddCart' :  _type='CartDelGoods';
                    $track(_type,{
                        quantity:  (_cha>0)?_cha: -_cha,
                        sku_id: $this.data('sku')
                    })
                }
              
                if (value === '') {
                    cartApp.renderCacheCart();
                } else if (value <= 0) {
                    // 购物车商品数量少于0
                    panel.error('商品数量必须大于0');
                    cartApp.renderCacheCart();
                } else {
                    var limit = $this.data('limit');
                    if (value > limit) {
                        $config.cartAtom.limitTip = $this.data('cid');
                        cartApp.renderCacheCart();
                        //如果总购买数大于了限购数，仅提示；如果总购买数小于于了限购数，不仅提示，而且继续--1
                        //当总购买数大于了限购数，而且为+号 或者 在输入框回车时，
                        var classNames = event.target.className;
                        if(classNames.indexOf("gui-count-add") != -1 || classNames.indexOf("cart-count") != -1){
                            $config.cartAtom.limitTip = null;
                            return;
                        }
                    }
                    getapi("cart/changeNum", {
                        cid     : $this.data('cid')
                        , pcount: value
                    }).then(commonErrorRenderWarp(function () {
                        cartApp.loadCart();
                        _track();
                        
                        clearMiniCount();
                    }))
                }
            }
            //商品促销优惠点击更多交互
            , 'click [act-promotion-gt10]'            : function () {
                var $this = $(this);
                $this.parent().find('.promotionGt10').toggle();
                if ($this.find('span').text() == "更多") {
                    $this.find('span').text('收起').end().find('i').removeClass('arrowdown').addClass('arrowup2')
                } else {
                    $this.find('span').text('更多').end().find('i').removeClass('arrowup2').addClass('arrowdown')
                }
            }
            //删除延保
            ,'click [act-delete-server]': function(){
                var $this = $(this);
                var cids =  $this.data('aid');
                if(!cids){
                    console.log('err:click [act-delete-server] mainItemId为空');
                    return '';
                }
                panel.confirmOk({
                    title: "删除增值服务!",
                    body : "确认要删除增值服务？"
                }, function (dialog) {
                    dialog.hide();
                    postapi("cart/batchRemoveItem", {
                        cids: cids
                    }).then(commonErrorWarp(function (data) {
                        cartApp.loadCart();
                    }))
                });

            }
            // 批量删除
            , 'click [act-batch-remove-item]'         : function () {
                var cids = [], $delThis = $(this), skus =[], nums=[];
                $('[name=good]:checked').each(function () {
                    var $this = $(this), item = null;
                    if ($this.attr('ctype') == "suit") {
                        item             = cartApp.getCartGood($this);
                        item.tzSubAmount = (Number($this.data('price')) || 0).toFixed(2)
                        item.type        = 'suit'
                    } else {
                        item = cartApp.getCartGood($this);
                    }
                    cids.push(this.value);
                    skus.push(item.skuId);
                    nums.push(item.quantity ||1);
                    if ($delThis.data('save')) {
                        cartApp.updateDeleteData(item)
                    }
                });
                if (!cids.length) {
                    return panel.error('至少选中一件商品才可删除');
                }
                panel.confirmOk({
                    title: "删除商品!",
                    body : "确认要删除选中商品吗？"
                }, function (dialog) {
                    dialog.hide();
                    postapi("cart/batchRemoveItem", {
                        cids: cids.join(",")
                    }).then(commonErrorWarp(function (data) {
                        for(var i=0,len=skus.length; i<len; i++){
                            $track('CartDelGoods', {
                                quantity: nums[i],
                                sku_id: skus[i]
                            })
                        }
                        cartApp.loadCart();
                        cartApp.refreshDeletedArea();
                        clearMiniCount();
                    }))
                });
                return false
            }
            //删除套购(套购只限主站商品),{操作区,删除,移入收藏夹,到货通知}回车去焦点,避免回车触发click事件
            , 'click [act-remove-suit-item]'          : function () {
                var $this = $(this)
                $this.blur();
                var item         = cartApp.getCartGood($this),tmpItem = item;
                item.tzSubAmount = (Number($this.data('price')) || 0).toFixed(2)
                item.type        = 'suit'
                function removeItem(dialog) {
                    if ($this.data('save')) {
                        cartApp.updateDeleteData(tmpItem)
                    }
                    getapi("cart/removeItem", {
                        cid: item.itemId || ''
                    }).then(commonErrorWarp(function () {
                        cartApp.loadCart();
                        cartApp.refreshDeletedArea();
                        clearMiniCount();
                    }))
                    dialog.hide();
                }

                panel.confirmOk({title: "删除商品?", body: "确定要删除商品吗"}, removeItem);
                return false
            }
            // 删除商品
            , 'click [act-remove-item]'               : function () {
                var $this = $(this), item = cartApp.getCartGood($(this)), tmpItem= item;
                $this.blur();
                function removeItem(dialog) {
                    if ($this.data('save')) {
                        cartApp.updateDeleteData(tmpItem);
                    }
                    getapi("cart/removeItem", {
                        k  : item.fanliId,
                        m  : item.meidianId,
                        s  : item.storeCode,
                        cid: item.itemId
                    }).then(commonErrorWarp(function () {
                        $track('CartDelGoods', {
                            quantity: 1,
                            sku_id: $this.data('sku')||0
                        })
                        cartApp.loadCart();
                        cartApp.refreshDeletedArea();
                        clearMiniCount();
                    }))
                    dialog.hide();
                }

                function fn2(confirm) {
                    $this.parent().parent().find("[act-add-wishlist]").trigger("click");
                    confirm.hide();
                }

                var _title = "您可以选择移入收藏夹，或删除商品";
                var _btns  = (function(){

                    if(isQygSite()){
                        _title = '确认要删除选中商品吗？';
                        return [
                            {
                                btnName: "取消",
                                clazz  : "btn btn-default",
                                click  : ui.hide
                            },
                            {
                                btnName: "删除",
                                clazz  : "btn btn-primary",
                                click  : removeItem
                            }]
                    }
                    return [{
                        btnName: "删除",
                        clazz  : "btn btn-default",
                        click  : removeItem
                    }, {
                        btnName: "移入收藏夹",
                        clazz  : "btn btn-primary",
                        click  : fn2
                    }];
                })();
                if (cartApp.isHome()) {
                    //搭配购子品或者下架商品只能删除不能移入收藏夹，套装子品没有删除操作
                    if (item.inventoryState == "OFF" || item.commerceitemVOFlag == "SUB") {
                        panel.confirmOk({title: "删除商品?", body: "确认要删除选中商品吗"}, removeItem)
                    } else {
                        panel.confirm({
                            type : panel.TYPE.WARN,
                            title: "删除商品?",
                            body : _title,
                            close: ui.hide,
                            btns : _btns
                        });
                    }
                } else {
                    panel.confirmOk({title: "删除商品?", body: "确定要删除商品吗"}, removeItem);
                }
                return false
            }
            , 'click [act-deleted-more]'              : function () {
                var $this = $(this);
                if ($this.find('i').hasClass('arrow-bottom')) {
                    $this.html('收起部分商品<i class="c-i arrow-top ml5"></i>').parent().find('.cdi-more').show()
                } else {
                    $this.html('显示全部商品<i class="c-i arrow-bottom ml5"></i>').parent().find('.cdi-more').hide()
                }
                return false;
            }
            // 找相似
            , 'click [act-find-simlar]'               : function () {
                var $this   = $(this),
                    fdsJson = {
                        pid   : $this.data('pid'),
                        sid   : $this.data('sid'),
                        slbody: $this.next()
                    };
                // $this.find('i').addClass('arrowup_red').removeClass('arrowdown_red');
                if (fdsJson.slbody.is(":visible")) {
                    $this.parents('[gui-popup]').eq(0).gPopup('hide');
                    return false
                } else {
                    if ($.inArray(fdsJson.pid, pidArr) > -1) {
                        req.deferredReq(cbfindSimilar(fdsJson), 3000)
                    } else {
                        cbfindSimilar(fdsJson)();
                        pidArr.push(fdsJson.pid)
                    }
                }
            }
            //找相似刷新
            , 'click [act-similar-refresh]'           : function () {
                var $this   = $(this),
                    fdsJson = {
                        pid   : $this.data('pid'),
                        sid   : $this.data('sid'),
                        slbody: $this.closest('.find-similar-body')
                    };

                if ($.inArray(fdsJson.pid, pidArr) > -1) {
                    req.deferredReq(cbfindSimilar(fdsJson), 3000)
                } else {
                    cbfindSimilar(fdsJson)();
                    pidArr.push(fdsJson.pid)
                }
            }
            // 添加延保,屏碎保.意外保属性
            , 'click [act-warranty-change]'           : function () {
                var $this    = $(this),
                    $i       = $this.find('.chose_icon'),
                    $sib     = $this.parent().siblings('p'),
                    isChange = JSON.parse($this.attr('change'));
                if ($this.hasClass('selected')) {
                    $this.removeClass('selected');
                    $i.addClass('hide');
                } else {
                    $this.addClass('selected');
                    $i.removeClass('hide');
                    if ($sib.length) {
                        var $sibA       = $sib.find('a'),
                            isSibChange = JSON.parse($sibA.attr('change'));
                        if ($sibA.hasClass('selected')) {
                            $sibA.removeClass('selected').attr('change', !isSibChange)
                            $sib.find('.chose_icon').addClass('hide');
                        }
                    }
                }
                $this.attr("change", !isChange)
                return false
            }
            // 重新渲染延保信息
            , 'pophide [act-warranty-prom]'           : function () {
                var $this = $(this), $a = $this.find('[act-warranty-change]'), $i = $this.find('.chose_icon');
                var child = $this.find('.js-popup-child');
                $a.removeClass('selected').attr("change", false);
                // child.removeClass('js-cart-coupon-btn fontred');
                child.find('.js-i').addClass('arrowdown').removeClass('arrowup_red ');
                $i.addClass('hide');
                $a.each(function (k, v) {
                    if ($(v).hasClass('init-selected')) {
                        $(v).addClass('selected').find('.chose_icon').removeClass('hide');
                    }
                })
            }
            , 'popshow [act-warranty-prom]'           : function () {
                var $this = $(this);
                var child = $this.find('.js-popup-child');
                // child.addClass('js-cart-coupon-btn fontred');
                child.find('.js-i').removeClass('arrowdown').addClass('arrowup_red ');
            }
            // 添加延保,屏碎保.意外保保存,取selected样式中所以data值
            , 'click [act-warranty-save]'             : function () {
                var $this               = $(this),
                    isArr = [], cidsArr = [],
                    itemid              = $this.data('itemid'),
                    productid           = $this.data('productid'),
                    skuNo               = $this.data('skuno'),
                    $parent             = $this.parents('.cart-warranty-wrap'),
                    $a                  = $parent.find('[act-warranty-change]'),
                    $selected           = $parent.find('.selected'),
                    pcount              = $this.data('quantity'),
                    brandCode           = $this.data('brandcode'),
                    employeeId          = $this.data('employeeid'),
                    fanliKeyId          = $this.data('fanlikeyid'),
                    meiDianid           = $this.data('meidianid');
                if (ischange($a)) {
                    if ($selected.length) {
                        $selected.each(function (i, v) {
                            var st  = $(v).data('childgroupid'),//組id
                                sid = $(v).data('incrementservicesid'),
                                pid = $(v).data('incrementservicepid');
                                sno = $(v).data('incrementserviceskuno');
                            ;
                            isArr.push(st, sid, pid,sno);
                        })
                        getapi("cart/addToCart", {
                            mid     : itemid
                            , is    : isArr.join(",")
                            , skuNo : skuNo
                            , type  : addGoodType.ext
                            , pid   : productid
                            , pcount: pcount
                            , s     : brandCode
                            , e     : employeeId
                            , k     : fanliKeyId
                            , m     : meiDianid
                        }).then(commonErrorWarp(function (data) {
                            if(data.success){
                                cartApp.loadCart();
                            }else{
                                panel.alertWarrantyHas(function(){
                                    cartApp.loadCart();
                                });
                            }
                            //cartApp.loadCart();
                        }))
                    } else {
                        $a.each(function (i, v) {
                            var mid = $(v).data('mainitemid');
                            cidsArr.push(mid)
                        })
                        postapi("cart/batchRemoveItem", {
                            cids: cidsArr.join(",")
                        }).then(commonErrorWarp(function (data) {
                            cartApp.loadCart();
                        }))
                    }
                }
                function ischange(data) {
                    return u.find(function (item) {
                        return JSON.parse($(item).attr('change')) == true
                    }, data)
                }
            }
            // 延保购物车添加延保
            , 'click [act-add-warranty]'              : function () {
                var $this = $(this);
                var vals  = ($(this).data('infos')).split('|');
                if (!$this.hasClass('cart-ext-item-selected')) {
                    getapi("cart/addToCart", {
                        mid      : vals[0]
                        , is     : [vals[6], vals[1], vals[2]].join(",")
                        , type   : addGoodType.ext
                        , mpid   : vals[4]
                        , wpcount: vals[5]
                    }).then(commonErrorWarp(function (data) {
                        cartApp.loadCart();
                    }))
                } else {
                    getapi("cart/removeItem", {
                        cid: vals[3]
                    }).then(commonErrorWarp(function () {
                        cartApp.loadCart();
                    }))
                }
            }
            //弹窗登陆
            , 'click [act-user-login]'                : function () {
                //login 弹框
                cartApp.glogin();
            }
            //收藏夹弹窗登陆
            , 'click [act-user-fav-login]'            : function () {
                //login 弹框
                cartApp.glogin(function () {
                    cartApp.loadFavorites();
                });
            }
            // 初始化订单确认页面
            , 'click [act-init-order]'                : function () {
                var $this = $(this);
                if ($this.hasClass('init-disabled') || $this.hasClass('btn-status-loading')) {
                    return;
                }
                var params = {};
                if ($this.data('hwg')) {
                    params = {isHwg: true};
                }
                $this.addClass('btn-status-loading').find('.btn-loading').show();
                function initOrder() {
                    postapi(((params && params.isHwg) ? "checkout/checkoutHWG" : "checkout/checkout"), params).done(function (data) {
                        data = typeof data =='object' ? data: JSON.parse(data);
                        if (data.errCode == '0') {
                            //清除购物车页的是否优惠信息cookie
                            $.cookie("yhj",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("mdjf",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("sygmek",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("syzhye",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("syjf",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("sytjh",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("symkl",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("userAsset",null, {expires:-1,path:'/',domain:cookieDomain});
                            $.cookie("transDataPointFlag","1", {expires:30,path:'/',domain:cookieDomain});
                            if (params && params.isHwg) {
                                location.href = '/haiwaigou' + $config.URL.shopping;
                            } else {
                                siteName = $page.site || 'home';
                                if (siteName == 'home') {
                                    location.href = $config.URL.shopping;
                                } else if (siteName == 'warranty') {
                                    location.href = '/warranty/shopping?oid=' + cartApp.oidForWarrany + "&sid=" + cartApp.sidForWarrany + "&cid=" + cartApp.cidForWarrany;
                                } else {
                                    location.href = '/' + siteName + $config.URL.shopping;
                                }
                            }
                        } else {
                            $this.removeClass('btn-status-loading');
                            if (data.errCode == "003000001") {
                                cartApp.glogin(initOrder);
                            }else if(data.errCode === '0010580002'){
                                cartApp.loadCart();
                                var dialog = panel.confirm({
                                    type:panel.TYPE.WARN,
                                    body:data.errMsg,
                                    close:true,
                                    btns:[{
                                        clazz:"btn btn-primary btn-w83",
                                        btnName:'我知道了',
                                        click:	function(){dialog.hide()}
                                    },{
                                        clazz:"btn btn-default btn-w83",
                                        btnName:"关闭",
                                        click:	function(){dialog.hide()}
                                    }],

                                })
                            }else {
                                data.errMsg = data.errMsg || '结算失败，请重试';
                                panel.errorWithObjClose(data, function (dialog) {
                                    util_ui.hide(dialog);
                                    /*
                                     0010360030=您添加商品的数量超过限购数量.
                                     0010360050=预约活动还未开始.
                                     0010360051=您没有参加预约活动.
                                     0010360052=您已参加预约活动,不能重复购买.
                                     0010360053=您选择的商品参加了预约活动 暂不可购买(线下商品).
                                     0010360054=未开始抢购，暂时不可购买.
                                     */
                                    if (
                                        data.errCode == '0010360030' ||
                                        data.errCode == '0010360050' ||
                                        data.errCode == '0010360051' ||
                                        data.errCode == '0010360052' ||
                                        data.errCode == '0010360053' ||
                                        data.errCode == '0010360054') {
                                        cartApp.loadCart();
                                    }
                                });
                            }
                        }
                    }).fail(function () {
                        panel.error('生成订单超时，请重试。');
                        $this.removeClass('btn-status-loading');
                    });
                };
                initOrder();

            }
            // 促销优惠的弹层关闭之后恢复购物车原状态
            , 'pophide [act-good-prom]'               : function () {
                var $this = $(this);
                $this.find('.promotionGt10').hide()
                $this.find('.promotion-more span').text('更多').end().find('i').removeClass('arrowup_red').addClass('arrowdown_red ')
                $this.find('input:checked').prop('checked', false);
                $this.find('[data-default]').prop('checked', true);
            }
            , 'popshow [act-good-prom]'               : function () {
                var $this = $(this);
                // $this.find('.promotionGt10').hide()
                $this.find('.cart-coupon-trigger i').removeClass('arrowdown_red ').addClass('arrowup_red')

            }
            // 加入收藏夹
            , 'click [act-add-wishlist]'              : function () {
                var $this = $(this);
                $this.blur()
                if ($this.attr('path')) {
                    var item = cartApp.getCartGood($this);
                } else {
                    var item = cartApp.getOneDeleteGood($this.data('skuid'))
                }
                //弹窗提示
                function okfn(dialog) {
                    addToWishlist(item, $this);
                    dialog.hide();
                }

                if (cartApp.getLoginStatus()) {
                    panel.confirmOk({title: "移入收藏夹!", body: "移动后选中商品将只在收藏夹内显示"}, okfn);
                } else {
                    cartApp.glogin();
                }
            }
            // 收藏夹添加购物车
            , 'click [act-add-cart]'                  : function (type) {
                // 加入购物车
                var args  = arguments;
                var $this = $(this);
                $this.addClass("cart-scroll-click-background");
                if ($this.hasClass('cart-scroll-btn-disabled')) {
                    return;
                }
                var skuMappingSuit = $this.attr('data-skuMappingSuit');
                if (skuMappingSuit) {
                    var params = {
                        type    : 24
                        , sid   : skuMappingSuit
                        , pid   : $this.data('pid')
                        , pcount: 1
                        , cr    : 0
                    }
                } else {
                    var params = {
                        sid     : $this.data('sid')
                        , pid   : $this.data('pid')
                        , pcount: 1
                        , k     : $this.attr('data-keyid')
                        , m     : $this.attr('data-mid')
                        , s     : $this.attr('data-storeid')
                        , type  : addGoodType[siteName] || 0// 区分站点的
                    }
                }
                getapi("cart/addToCart", params).done(function (cartData) {
                    if (cartData.errCode == '0') {
                        var $tip = $this.siblings('.cart-scroll-image').find('.cart-scroll-tip');
                        $tip.show();
                        setTimeout(function () {
                            $tip.hide();
                        }, 2000);
                        cartApp.loadCart();
                    } else if (cartData.errCode == '001004002') {
                        // data-limit-${good.skuId}-${good.productId}
                        var $limit = $('[data-limit-' + $this.data('sid').toLowerCase() + '-' + $this.data('pid').toLowerCase() + ']');
                        var limit  = $limit.data('limit-' + $this.data('sid').toLowerCase() + '-' + $this.data('pid').toLowerCase());
                        if (limit) {
                            panel.alert('您购物车中的相同商品购买数量不能大于' + limit + '件');
                        }
                    } else if (cartData.status == "MTK_V") {//虚拟卡
                        window.location.href = '//card' + cookieDomain + "?productId=" + $this.data('pid') + "&skuId=" + $this.data('sid') + "&count=" + 1 + "&skuType=ZDZK";
                        return;
                    } else if (cartData.status == "MTK_E") {//实体卡
                        window.location.href = '//card' + cookieDomain + "?productId=" + $this.data('pid') + "&skuId=" + $this.data('sid') + "&count=" + 1 + "&skuType=ZSTK";
                        return;
                    } else if (cartData.status == "GO_SKU_PAGE") {//实体卡
                        window.location.href = '//item' + cookieDomain + "/" + $this.data('pid') + "-" + $this.data('sid') + ".html";
                        return;
                    } else {
                        if (type == null) return args.callee(16);
                        panel.error(cartData.errMsg || '加入购物车失败');
                    }
                }).fail(function () {
                    panel.error('加入购物车失败，请重试');
                })
            }
            // 删除区 - 重新添加购物车
            , 'click [act-rebuy]'                     : function () {
                var $this = $(this), param = {};
                var item  = cartApp.getOneDeleteGood($this.data('skuid'));
                if ($this.data('suit')) {
                    param = {
                        sid     : item.vSkuId
                        , pid   : item.vProductId
                        , pcount: item.quantity
                        , wsid  : 0
                        , wpid  : 0
                        , cr    : 0
                        , type  : 24
                        , k     : item.fanliId || ''
                        , m     : item.meidianId || ''
                        , s     : item.storeCode || ''
                    }
                } else {
                    param = {
                        sid     : item.skuId
                        , pid   : item.productId
                        , pcount: item.quantity
                        , k     : item.fanliId
                        , m     : item.meidianId
                        , s     : item.storeCode
                        , type  : addGoodType[$page.site] || 0
                    }
                }
                getapiBySite("cart/addToCart", param, $this.data('site')).done(function (cartData) {
                    if (cartData.errCode == '0') {
                        cartApp.loadCart();
                        cartApp.deleteGood(item)
                        cartApp.refreshDeletedArea()
                    } else if (cartData.errCode == '001004002') {
                        var $limit = $('[data-limit-' + item.skuId + '-' + item.productId + ']');
                        var limit  = $limit.data('limit-' + item.skuId + '-' + item.productId);
                        if (limit) {
                            panel.alert('您购物车中的相同商品购买数量不能大于' + limit + '件');
                        }
                    } else {
                        panel.error(cartData.errMsg || '加入购物车失败');
                    }
                }).fail(function () {
                    panel.error('加入购物车失败，请重试');
                })
            }
            // 点击优惠券标签
            ,'click [act-get-coupon]'                 :function(){
                var $this = $(this);
                var cartCouponBoxMask = $this.next().find(".cart-coupon-box-mask");
                cartCouponBoxMask.css("display","none");
            }
            // 获取店铺券
            , 'refresh [act-get-coupon]'              : function () {
                var $this = $(this);
                postapi("couponQuery/loadAllFetchCoupon", {shopNO: $this.data('sid'),shopSkuNos: shopSkuNos}).then(function (cartData) {
                    if (cartData.errCode == '0') {
                        var tpl = cartApp._couponTpl;
                        if (!tpl) {
                            tpl = cartApp._couponTpl = $('#couponTpl').html();
                        }

                        if (!cartData.data || !cartData.data[0] || !cartData.data[0].shopCoupons) {
                            return;
                        }

                        var html    = '';
                        var coupons = cartData.data[0].shopCoupons;
                        for (var i = 0, data; data = coupons[i++];) {
                            var startDate      = new Date(+data.startDate);
                            var expirationDate = new Date(+data.expirationDate);

                            data.startDate = [
                                startDate.getFullYear()
                                , (startDate.getMonth() + 1)
                                , startDate.getDate()
                            ].join('.');

                            data.expirationDate = [
                                expirationDate.getFullYear()
                                , (expirationDate.getMonth() + 1)
                                , expirationDate.getDate()
                            ].join('.');

                            html += tpl.replace(/\$\{([^\}]+)\}/g, function (a, b) {
                                return data[b] || '';
                            });
                        }
                        $this.siblings('.cart-coupon-box').find('.cart-coupon-items').html(html);
                    } else {
                        // cartApp.alert(cartData.errMsg || '拉取优惠券失败');
                    }
                })
            }
            // 查看购物车中可用此券的商品
            , 'click [act-select-goods]'           : function () {
                var $this = $(this);
                if ($this.find('.js-i').is(".arrowdown")) {
                    $this.find('.js-i').removeClass('arrowdown').addClass('arrowup_red ');
                    $this.next().show();
                }
                else {
                    $this.find('.js-i').addClass('arrowdown').removeClass('arrowup_red ');
                    $this.next().hide();
                }
            }
            // 领取商铺劵
            , 'click [act-add-coupon]'                : function () {
                var $this = $(this);
                var cartCouponBox = $this.closest(".cart-coupon-box");
                var cartCouponBoxMask = cartCouponBox.find(".cart-coupon-box-mask");
                var path = "";
                var aData = {};
                var errPop = cartCouponBox.find(".err-pop");
                errPop.html("").hide();
                function show5sHide(thiz,html){
                    thiz.html(html).show();
                    setTimeout(function(){
                        thiz.hide();
                    },5000);
                }
                if ($this.hasClass('act-gome-add-coupon')) {
                    path = '//hd'+cookieDomain+'/promotion/coupons/getCouponsForCartNew.do';
                    aData = {
                        promId                 : $this.data('aid')
                        , activityDescription  : $this.data('desc') || ""
                    }
                }else{
                    path = "coupon/fetchCoupon";
                    aData = {
                        couponid  : $this.data('cpid')
                        , activeid: $this.data('aid')
                    }
                }
                if ($this.hasClass('cart-coupon-btn-disabled')) {
                    return;
                }
                function getCoupon() {
                    /**
                     * 加一动画
                     * @private
                     */
                    function _addOneAnimate() {
                        var offset  = $this.offset();
                        var $addone = $('<div class="cart-coupon-addone">+1</div>');
                        $addone.appendTo(document.body).css({
                            left : (offset.left - 130)
                            , top: offset.top
                        }).animate({
                            top      : (offset.top - 100)
                            , opacity: 0
                        }, function () {
                            $addone.remove();
                        });
                    }
                    if($this.hasClass('act-gome-add-coupon')){
                        $.ajax({
                            type: "GET",
                            url: path,
                            data:aData,
                            dataType: "jsonp",
                            jsonp: 'callback',
                            success:function(cartData){
                                cartData = typeof cartData =='object' ? cartData: JSON.parse(cartData);
                                if(cartData.state == "success"){
                                    if(cartData.leftNum == null || cartData.leftNum == "0"){
                                        couponSuccess();
                                    }else{
                                        _addOneAnimate();
                                        $this.html('继续领取');
                                    }
                                }else if(cartData.state == 'no_login'){
                                    //cartApp.glogin(getCoupon);
                                    //panel.error(cartData.remark);
                                    cartCouponBoxMask.css("display","block");
                                    show5sHide(errPop,cartData.remark);
                                }else{
                                    var remark = "";
                                    if(cartData.state == "end"){
                                        remark = "来晚啦，活动结束！";
                                    }else if(cartData.state == "no_count"){
                                        remark = "来晚啦，优惠券已领完！";
                                    }else if(cartData.state == "no_mobile"){
                                        remark = "手机号未验证，请到会员中心验证！";
                                    }else if(cartData.state == "failed"){
                                        remark = "未领取成功，请稍后再领！";
                                    }else if(cartData.state == "busy"){
                                        remark = "点的太快了，请稍后再领！";
                                    }else if(cartData.state == "risk_black"){
                                        remark = "领取太频繁，请稍后重试";
                                    }else{
                                        remark = cartData.remark || "操作失败！";
                                    }
                                    cartCouponBoxMask.css("display","block");
                                    //panel.error(remark);
                                    show5sHide(errPop,remark);
                                    couponDisabled();
                                }
                            },
                            error:function(data){
                                //panel.error("忙疯啦，正在加速处理中，请稍后重试");
                                show5sHide(errPop,"忙疯啦，正在加速处理中，请稍后重试");
                            }
                        });
                    }else{
                        postapi(path, aData).then(function (cartData) {
                            cartData = typeof cartData =='object' ? cartData: JSON.parse(cartData);
                           
                            if (cartData.errCode == '0') {
                                if ($this.data('type') === 'GOU_WU') {//如果是店铺券
                                    shoppingCoupon.callValue($this.data('shopid'), function (data) {
                                        if(data){
                                            readerShoppingCoupon(data);
                                        }
                                    });
                                }
                                if (cartData.data != 'SUCCUSS'){
                                    couponSuccess();
                                } else {
                                    _addOneAnimate();
                                    $this.html('继续领取');
                                }
                            }else if(cartData.errCode == '003000001') {
                                show5sHide(errPop,cartData.cartData.errMsg);
                                //cartApp.glogin(getCoupon);
                            }else{
                                cartCouponBoxMask.css("display","block");
                                //panel.error(cartData.errMsg);
                                show5sHide(errPop,cartData.cartData.errMsg);
                                couponDisabled();
                            }
                        });
                    }
                    function couponSuccess(){
                        $track('Voucher', {
                            coupon_id: aData.couponid
                        })
                        $this.addClass('cart-coupon-btn-disabled');
                        //领完处理UI
                        $this.prev().prev()
                            .css("borderColor", "#ccc")
                            .find(".cart-coupon-icon-inner")
                            .css({"opacity": "0.5","filter":"alpha(opacity=50)"});
                        $this.prev().prev()
                            .find('.cart-coupon-icon-title')
                            .css("color", "#ccc");
                        // $this.prev().prev().find(".cart-coupon-icon-inner").css("background","#ccc");
                        $this.prev()
                            .children("div")
                            .css("color", "#ccc")
                            .find('.cart-coupon-icon-title');

                        $this.html('已领完');
                    }
                    function couponDisabled(){
                        $this.addClass('cart-coupon-btn-disabled');
                        $this.html('领取');
                        //领完处理UI
                        $this.prev().prev()
                            .css("borderColor", "#ccc")
                            .find(".cart-coupon-icon-inner")
                            .css({"opacity": "0.5","filter":"alpha(opacity=50)"});
                        $this.prev()
                            .children("div")
                            .css("color", "#ccc");
                        $this.prev().prev()
                            .find('.cart-coupon-icon-title')
                            .css("color", "#ccc");
                    }
                }
                getCoupon();

            }
            // 加价购确定
            , 'click [act-add-jjg]'                   : function () {
                var $this = $(this);
                var $cbs  = $this.parents('.cart-add-buy-list-inner').find(':checked');
                var sps   = '';
                $cbs.each(function (i) {
                    if (i) {
                        sps += ',';
                    }
                    sps += this.value;
                });
                getapi("cart/addToCart", {
                    type  : addGoodType.jjg
                    , sps : sps
                    , spid: $this.data('id')
                    , groupNo: $this.data('groupid')
                }).done(commonErrorRenderWarp(function () {
                    cartApp.loadCart();
                })).fail(function () {
                    cartApp.renderCacheCart();
                    panel.error('加价换购失败，请重试');
                })
            }
            // 到货通知
            , 'click [act-arrival-notice]'            : function () {
                var $this = $(this),
                    item  = cartApp.getCartGood($this),
                    tpl   = this._dialogTpl;
                $this.blur()
                if (!tpl) {
                    tpl = this._dialogTpl = $('#arrival-notice').html();
                }

                var html = tpl.replace(/\$\{([^\}]+)\}/g, function (a, b) {
                    return data[b] || '';
                });

                var dialog = $.gDialog({html: html, modal: {}})
                dialog.show();
                var $dialogEl = dialog.$dialog;
                // 独立站点的到货通知没有加入收藏夹
                if (!$this.data('fav')) {
                    $dialogEl.find('.add').hide();
                }

                $dialogEl.off('click').on('click', '[act-submit]', function () {
                    var $phoneno = $dialogEl.find('[name=phoneno]');
                    var $email   = $dialogEl.find('[name=email]');
                    var $checked = $dialogEl.find(':checked');
                    var data     = {
                        tell: $.trim($phoneno.val()),
                        mail: $.trim($email.val()),
                        sync: $checked.length ? true : false
                    };

                    if (data.tell == '') {
                        return $phoneno.siblings('span').show().html('<i></i>手机号不能为空');
                    } else if (!/^1[3578]\d{9}/.test(data.tell)) {
                        return $phoneno.siblings('span').show().html('<i></i>手机号格式不正确');
                    } else {
                        $phoneno.siblings('span').hide();
                    }
                    if (data.mail && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(data.mail)) {
                        return $email.siblings('span').show().html('<i></i>邮箱格式不正确');
                    } else {
                        $email.siblings('span').hide();
                    }
                    var url = "//ss" + cookieDomain + "/item/v1/notice/arrival/" +
                        item.productId + "/" + item.skuId +
                        "/" + cartApp.getUserId() +
                        "/" + getArea().area3 +
                        "/" + data.tell +
                        "/" + data.mail +
                        "/" + data.sync +
                        "/flag/wp/notice";
                    req.reqp(url, {}, 'notice').done(function (data) {
                        panel.success(data.message);
                        dialog.hide();
                        if ($checked.length) {
                            addToWishlist(item);
                        }
                    }).fail(function () {
                        dialog.hide();
                        panel.error('请求接口失败');
                    })
                });
                $dialogEl.on('click', '[act-close]', function () {
                    dialog.hide();
                });
            }
            // 切换自营商品的促销类型
            , 'click [act-claimGomePromotion]'        : function () {
                var $this = $(this);
                var pid   = $this.parents('.cart-coupon-items').find(':checked').val();
                if (pid == 'no_use') {
                    pid = '';
                }
                postapi("promotion/claimGomePromotion", {
                    cid   : $this.data('cpid')
                    , prid: pid
                }).then(function (cartData) {
                    if (cartData.errCode == '0') {
                        cartApp.loadCart();
                    } else {
                        cartApp.renderCacheCart();
                        panel.alert('切换促销失败！');
                    }
                })
            }
            // 切换联营促销信息
            , 'change [act-change-promotion]'         : function () {
                var vals = ($(this).val()).split('|');
                postapi("promotion/claimShopPromotion", {
                    shopno: vals[0]
                    , prid: vals[1]
                }).then(function (cartData) {
                    if (cartData.errCode == '0') {
                        cartApp.loadCart();
                    } else {
                        cartApp.renderCacheCart();
                        panel.error('切换促销失败！');
                    }
                })
            }
            // 选择赠品 库存信息
            , 'click [act-get-gifts]'         : function () {
                var $this = $(this).parents('.js-gift-parent');
                var proid = $(this).data('proid');
                var itemIds = $(this).data('itemids');
                giftHead.callValue(proid,itemIds,function(data){
                    if(!data || data.length<1){
                        console.error('查询赠品库存失败');
                    }
                    for(var i=0; i<data.length; i++){
                        var gifts = data[i].gifts;
                        if(!gifts || gifts.length<1){
                            continue;
                        }
                        for(var j=0; j<gifts.length; j++){
                            var gift = gifts[j];
                            var checkBox = $this.find('.js-inventory-state-'+gift.skuId);
                            checkBox.text(getInventoryStateTitle(gift.state))
                        }
                    }

                });

                /**
                 * 库存状态标示
                 * @param state
                 * @returns {*|string}
                 */
                function getInventoryStateTitle(state){
                    var states = {
                        // "ON_THE_ROAD":"在途" //在途状态
                        "NO_GOODS":'无货'
                        // ,"INVENTORY_TENSION":'<span class="fontRed">库存紧张</span>'
                        ,"OFF":'已下架'
                        //,"IN_STOCK":"有货"
                        ,"DELIVERY_NOT_SUPPORTED":'该区域暂不支持配送'
                    };
                    return states[state] || '';
                }

            }
            //促销头 选择赠品弹框 勾选
            , 'gcheckbox.change [act-gifts-check]'      : function () {

                var $this   = $(this);

                var $giftsPopBox = $this.parents('.cart-gift-box');//得到整个弹框的dom
                //TODO 为什么hasClass需要使用先找parents
                var checkbox = $this.parents('.cart-add-buy-item-left').find('.js-gift-checkbox');
                var hasBoxChose = checkbox.hasClass('checkbox_chose');

                var checkboxs = (function getCheckboxs(){
                    var $parent = $this.parents('.js-gifts-box-group');
                    return $parent.find('[gui-checkbox]');
                })();

                function setCheckGroup(){

                    if(!hasBoxChose){
                        checkboxs.addClass('checkbox_chose').removeClass('checkboxs');
                        _setBtnGroupData(true);
                        checkbox.find('input').prop("checked", true);
                    }else{
                        checkboxs.removeClass('checkbox_chose').addClass('checkboxs');
                        _setBtnGroupData(false);
                        checkbox.find('input').prop("checked", false);
                    }
                }
                setCheckGroups();
                setCheckGroup();


                function _setBtnGroupData(is){
                    //得到groupId 并绑定到 确定按钮上
                    var groupId                                            = checkbox.data('groupid');
                    var $btn = $giftsPopBox.find('[act-gifts-add]');
                    var pid_sids                                           = [];
                    checkboxs.each(function(){
                        pid_sids.push($(this).data('pid')+'-'+$(this).data('sid'));
                    });
                    if(is){
                        $giftsPopBox.find('.js-gift-selected-num').text('1');
                        $btn.data('groupid',groupId);
                        $btn.data('pidsids',pid_sids.join(","));
                    }else{

                        $giftsPopBox.find('.js-gift-selected-num').text('0');
                        $btn.data('groupid','');
                        $btn.data('pidsids',pid_sids.join(","));
                    }

                }

                function setCheckGroups(){
                    $giftsPopBox.find('.checkbox_chose').removeClass('checkbox_chose').addClass('checkboxs');

                }

            }

            // 添加赠品 确定
            , 'click [act-gifts-add]'                   : function () {
                var $this = $(this);
                var groupId = $this.data('groupid');
                if(!$this.data('pidsids')){
                    return;
                }
                /**
                 * type 定义的常量 addGoodType.GIGTS
                 * spid 促销方案id
                 * groupNo 赠品分组编码
                 * zengPinType   添加的赠品类型 {Item_SentGifts：单品增实物,Shop_Money_SentGifts：多品满金额赠实物,Shop_Quantity_SentGifts：多品满件数赠实物}
                 * mainItemIds []  用于赠品商品记录主品ID集合
                 * pIdSkuIds [,] "productId-skuID,productId-skuID"
                 */
                getapi("cart/addToCart", {
                    type         : addGoodType.GIGTS
                    , spid       : $this.data('id')
                    , groupNo    : $this.data('groupid')
                    , zengPinType: $this.data('gifttype')
                    , mainItemIds: $this.data('itemtsid')
                    , pIdSkuIds  : $this.data('pidsids')
                }).done(commonErrorRenderWarp(function () {
                    cartApp.loadCart();
                })).fail(function () {
                    cartApp.renderCacheCart();
                    panel.error('加价换购失败，请重试');
                })
            }
            , 'gcheckbox.change [act-jjg-check]'      : function () {
                var $this   = $(this);
                var $parent = $this.parents('.cart-add-buy-row');
                var max     = $parent.data('max');
                var checked = $parent.find(':checked').length;
                if (checked > max) {
                    $this.find('input')[0].checked = false;
                    $.gCheckbox.render($this);
                    $this.siblings('.cart-add-buy-tip').show();
                    clearTimeout($this.data('_timer'));
                    $this.data('_timer', setTimeout(function () {
                        $this.siblings('.cart-add-buy-tip').hide();
                    }, 2000));
                } else {
                    cartApp.renderJJGCount();
                }
            }
            //关闭降价通知
            , 'click [i-close]'                       : function () {
                $(this).parent('.showDownNotice').hide();
                postapi("cart/closeNotice", {}).then(function () {
                })
            }
            , 'click [act-gifts-more]': function(){
                var  $prents= $(this).parents('.cart-good-box');
                $prents.find('.js-more-box').show();
                $prents.find('.js-more-btn').hide();
            }
            , 'click [act-gifts-more-close]': function(){
                var $prents = $(this).parents('.cart-good-box');
                $prents.find('.js-more-box').hide();
                $prents.find('.js-more-btn').show();
            }
            , 'click [act-head-tab]': function(e){
                function _changeURL(newUrl){
                    //兼容 ie8以下
                    if (!!(window.history && history.pushState)) {
                        var stateObject = {};
                        var title       = document.title;
                        history.pushState(stateObject, title, newUrl);
                    }else{
                        location.href='//cart'+cookieDomain+newUrl;

                    }
                }
                var val = $(e.target).attr('act-head-tab');
                siteName = _getSiteDomin();
                if(val === 'qyg'){
                    $page.site = 'qiyegou';
                    _changeURL('/qiyegou/cart');
                    cartApp.loadCart();
                }else{
                    $page.site = 'home';
                    _changeURL('/home/cart');
                    cartApp.loadCart();
                }
                cartApp.refreshDeletedArea();
            }
        }
        , isCartEmpty         = util.cond([
            [isWarrantySite, isWarrantyCartEmpty],
            [util.T, isPrimaryCartEmpty]
        ])
        , logicLess           = u.ifn(u.__, u.identity, u.__)//如果条件返回true 返回自身，否则执行后置条件
        , renderCart          = u.cond([ //渲染购物车
            [isWarrantySite, u.pipe(setPreCartData, logicLess(isCartEmpty, renderTpl(GTPL.cart_warranty)), afterRender)]
            , [util.T, u.pipe(setPreCartData, logicLess(isCartEmpty, renderTpl(GTPL.cart_new)), afterRender)]
        ])
        , user                = (function () {
            var uid     = $.cookie("SSO_USER_ID");
            var logined = (uid != null && uid != "");//此处 无法干掉，因为异步请求 时间无法确定 为hack写法，增强代码的健壮性
            var falselongin = false;//是否假登录
            window.ifnotLogined = false;//是否假登录或者未登录
            function loadUser() {
                req.reqp("//member" + cookieDomain + "/gome/index/loginStyle", {}).then(function (data) {
                    if (!data.loginStatus)return;
                    setLoginedStatus(data);
                });
            }

            function isLogin() {
                return logined;
            }

            function isFlaseLogin() {
                return falselongin;
            }

            function getUserId() {
                return uid;//可能存在场景，第一，有SSO_USER_ID，但重新登陆，SSO_USER_ID 改变了
            }

            function getLoginStatus() {
                loadUser();
                return logined;
            }

            /**
             * 设置 登陆状态 logined
             * @param data
             */
            function setLoginedStatus(data) {
                logined     = false;
                falselongin = false;
                uid         = data.loginId || $.cookie("SSO_USER_ID");
                switch (data.loginStatus) {
                    //1未登录
                    case 1:
                        logined = false;
                        break;
                    //2假登录
                    case 2:
                        falselongin = true;
                        logined     = false;
                        break;
                    //已登录
                    case 3:
                        logined = true;
                        break;
                    default:
                        break;
                }
                if(logined == false && falselongin == false){
                    window.ifnotLogined = true;
                }else if(logined == false && falselongin == true){
                    window.ifnotLogined = true;
                }else{
                    window.ifnotLogined = false;
                }

                uw.emit($page.name, "login", data);
            }

            /**
             * 获取登陆状态
             * 公共头尾 已经判断登陆了 则使用“loginData”
             * 如果 公共头尾 没有判断登陆了 则调用loadUser
             * @private
             */
            function _init() {
                if (loginData && loginData.loginStatus) {
                    setLoginedStatus(loginData);
                } else {
                    loadUser();
                }
            }

            _init();
            return {
                isLogin       : isLogin,
                loadUser      : loadUser,
                getUserId     : getUserId,
                isFlaseLogin  : isFlaseLogin,
                getLoginStatus: getLoginStatus
            }
        }())
        /**
         * 实现一个简单的map,
         * 以JavaScript object 来存 key -value
         * 但，key 可能是Number，所有使用 id+'' 转换为String类型
         * @type {$page.site|*}
         */
        , meiDian             = MeiDian
        , shoppingCoupon      = ShoppingCoupon
        , cartApp             = { // 购物车整体代码
            glogin              : glogin
            , isSuit            : isSuit
            , isSuitOff         : isSuitOff
            , getCartGood       : getCartGood
            , getDeleteDataIdx  : function (item) {
                return u.findIdx(function (v) {
                    return v==item
                }, $config.cartAtom.deleteData)
            }
            //存储数据到全局变量中
            , updateDeleteData  : function (item) {
                if (!(cartApp.getDeleteDataIdx(item) > -1)) {
                    if($config.isQygSite()){
                        item._site = 'qyg';
                    }else{
                        item._site = 'home';
                    }
                    $config.cartAtom.deleteData.push(item)
                }
                return $config.cartAtom.deleteData
            }
            //获取删除区数据
            , getOneDeleteGood  : function (skuId) {
                return u.find(function (item) {
                    if (item.type == 'suit') {
                        return item.vSkuId == skuId
                    } else {
                        return item.skuId == skuId
                    }
                }, $config.cartAtom.deleteData)
            }
            //从删除区删除一条数据，更新全局变量
            , deleteGood        : function (item) {
                return $config.cartAtom.deleteData.splice(cartApp.getDeleteDataIdx(item), 1)
            }
            , state             : {
                propTimeId: null
            }
            , isFail            : isFail
            , isrushBuy         : isrushBuy
            , isgroupOn         : isgroupOn
            , isWarrantySite    : isWarrantySite
            , isLogin           : user.isLogin
            , getUserId         : user.getUserId
            , isFlaseLogin      : user.isFlaseLogin
            , getLoginStatus    : user.getLoginStatus
            , isPromitionOnNoUse: function (data) {
                if(!data || data.length<0){
                    return false;
                }
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].promotionId == 'noUse') {
                        if (data[i].selected) {
                            return true;
                        }
                        return false;
                    }
                }
                return false;
            }
            /**
             * 模板中调用方法
             * @param data
             * @param num
             * @returns {*}
             */
            , getPromitionData  : function (data, num) {
                var is = cartApp.isPromitionOnNoUse(data);
                if(!data || data.length<0){
                    return data;
                }
                var dataLength = data.length;
                if (is) {
                    if (data && dataLength) {
                        var len = (dataLength < 10) ? (dataLength) : 10;
                        if (num > 0) {
                            return data.slice(0, len)
                        } else if (num == -1) {
                            return false;
                        }
                        else {
                            return data.slice(10, (dataLength))
                        }
                    }
                }
                /**
                 * if num 存在 则返回前num个
                 *      如果data.length 小于9，则返回去除最后一个（data.length-1），否则 全部返回
                 * else if  如果num == -1 则返回最后一个
                 * else 则返回后9个
                 */
                if (data && dataLength) {
                    var len = (dataLength < 10) ? (dataLength - 1) : 9;
                    if (num > 0) {
                        return data.slice(0, len)
                    } else if (num == -1) {
                        return data[dataLength - 1];
                    }
                    else {
                        return data.slice(9, (dataLength - 1))
                    }
                }
            }
            , isHome            : isHome
            //商品状态
            , itemState         : function _itemState(good, type) {
                if (!isSecondHandSite() && good.inventoryState == "OFF") return '<div class="red">已下架</div>';
                if (good.inventoryState == "NO_GOODS") return '<div class="red">无货</div>';
                if (good.inventoryState == "INVENTORY_TENSION") return '<div class="red">库存紧张</div>';
                if (good.inventoryState == "DELIVERY_NOT_SUPPORTED") return '<div class="red">该区域暂不支持配送</div>';
                if (good.inventoryState === "NO_JURISDICTION") return '<div class="red">无权购买</div>';
                if (type == 'suit') return "有货";
                return "";
            }
            , isCartEmpty       : isCartEmpty
            , getArea           : getArea
            , init              : function () {
                this.loadCart();
                if (isHome()) {
                    // 只有主站有底部栏
                    cartApp.initTab()
                    uw.emit('home', 'loadRecommed', {})
                }
                this.bindActEvents();
                this.bindUiEvents();
            }
            // 重新刷新购物车所有区块
            , reload            : function () {
                cartApp.loadCart();
                cartApp.loadFavorites();
                cartApp.loadHistory();
                cartApp.loadRecommend();
                signData.init();//顶通用户登录

            }
            , doCartAction      : function (cartData) {
                //企业购 想隐藏控制
                if(isQygSite()){
                    var _num = cartData.data.cartProfile ?  cartData.data.cartProfile.allItemCount : 0;
                    $('.js-bottom-tabs').hide();
                    $('.js-head-num-qyg').find('.head-title-tip').text(_num||0);
                    $('.js-head-num-home').hide();
                    $('.js-head-num-qyg').show();
                }else{
                    if(isHome()){
                        var _num = cartData.data.cartProfile ?  cartData.data.cartProfile.allItemCount : 0;
                        $('.js-bottom-tabs').show();
                        $('.js-head-num-home').find('.head-title-tip').text(_num||0);
                        $('.js-head-num-home').show();
                    }
                    $('.js-head-num-qyg').hide();
                }

                //购物车数据为空的时候加载空数据模板
                if (isCartEmpty(cartData)) {
                    // 空购物车去购物链接跳转地址
                    cartData.siteDomain = siteDomain;
                    $('.cart-area').hide();
                    $('.cart-lists').html(GTPL.cart_empty(cartData));
                } else {
                    $('.cart-area').show();
                }
                cartData.siteName = siteName;
                // 只有主站有选择框
                if (isHome()) {
                    cartData.hasCheckbox      = true;
                    cartData.hasAddFavorites  = true;
                    cartData.hasDeleteArea    = true;
                } else {
                    cartData.hasCheckbox      = false;
                    cartData.hasAddFavorites  = false;
                    cartData.hasDeleteArea    = false;
                }
                // 二手站点没有商品数量增减框
                if (siteName == 'secondHand') {
                    cartData.hasChangeCount = false;
                } else {
                    cartData.hasChangeCount = true;
                }
                //添加黑名单校验
                if (cartData.status == "BLACKLIST") {
                    cartAppError()
                    return;
                }
                showHeadTab(cartData);
                if (cartApp.isFail(cartData)) {
                    //团抢处理
                    if (cartData.status == "GO_LOGIN") {
                        cartApp.glogin();
                        return;
                    }
                    cartAppError()
                } else {
                    cartApp._cacheData = cartData;
                    _freight();
                    cartApp.renderCart(cartData);
                }
            }
            // 加载购物车数据
            , loadCart          : function (isSilent, args) {
                _isCatchDian = true;
                if(!_isLoading){
                    return
                }
                _isLoading = false;

                var param = {}, $showDownNotice = $('.showDownNotice'),p=null;
                // 延保购物车需要传oid sid cid
                if (isWarrantySite()) {
                    var str = window.location.href.split("?")[1];
                    var strOid = null,strSid = null,strCid = null;
                    if(str != null){
                        strOid = str.split("&")[0].split("=")[1];
                        strSid = str.split("&")[1].split("=")[1];
                        strCid = str.split("&")[2].split("=")[1];
                    }
                    cartApp.oidForWarrany = param.oid = strOid;
                    cartApp.sidForWarrany = param.sid = strSid;
                    cartApp.cidForWarrany = param.cid = strCid;
                    p=req.reqp('//success' + cookieDomain + '/api/loadCart/loadWarrantyCart',param)
                } else {
                    p=postapi('cart/loadCart', param);
                }

                p.done(commonErrorWarp(function (data) {
                    //暂存店铺sku
                    shopSkuNos = [];
                    function getshopSkuNosData(d){
                        var arr = [];
                        u.map(function(all){
                            u.map(function(item){
                                u.map(function(i){
                                    if(i.skuNo){
                                        arr.push(i.skuNo)
                                    }
                                })(item.commerceItemsGroup)
                            })(all.commerceItemsGroups)
                        })(d);
                        return arr
                    }
                    if(data.data.siVOs){
                        shopSkuNos = getshopSkuNosData(data.data.siVOs);
                    }
                    _isLoading = true;
                    data.data.ifnotLogined = window.ifnotLogined;
                    if (args && data.data.cartProfile) {
                        if (data.data.cartProfile.hwgitemChecked || data.data.cartProfile.normalItemChecked) {
                            cartApp.doCartAction(u.assoc('isBottomOpen', true, data))
                        } else {
                            cartApp.doCartAction(u.assoc('isBottomOpen', false, data))
                        }
                        return;
                    }

                    if (data.success && isHome() && !isQygSite()) {
                        postapi('cart/reducePrice', {}).then(function (data1) {
                            if (data1.success && data1.data && data1.data.reducePriceList && data1.data.reducePriceList.length) {
                                reducePriceData = data1.data;
                                renderReduceBox();
                            }else{
                                reducePriceData = null;
                                $showDownNotice.hide();
                            }
                            cartApp.doCartAction(data);
                        })
                    } else {
                        cartApp.doCartAction(data);
                        $showDownNotice.hide();
                    }

                })).fail(function () {
                    _isLoading = true;
                    cartAppError()
                })
                function renderReduceBox() {//加载降价通知公告
                    if (reducePriceData.showNotice) {
                        $showDownNotice.show();
                    } else {
                        $showDownNotice.hide();
                    }
                    $showDownNotice.find('.num').html(reducePriceData.num);
                }
            }

            // 用上次缓存的数据渲染购物车
            , renderCacheCart  : function () {
                if (cartApp._cacheData) {
                    cartApp.renderCart(cartApp._cacheData);
                } else {
                    cartApp.loadCart();
                }
            }
            // 渲染我的收藏、最近浏览、为您推荐模块
            , renderBottomItems: function (data, $dom, type) {
                var arr = [], html = '';
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        arr.push(cartApp.renderBottomItem(data[i]));
                    }
                }
                html = arr.join('')
                if ($dom) {
                    if (!arr.length) {
                        $dom.find('.scroll-left-btn').hide();
                        $dom.find('.scroll-right-btn').hide();
                        html = GTPL['bottom_empty_' + type](cartApp);
                    }
                    $dom.find('.scroll-view ul').html(html);
                    // 我的收藏、最近浏览、为您推荐模块的滚动
                    $dom.gScroll({moveDistance: 904})
                }
                return html;
            }
            , renderBottomItem : function (data) {
                return GTPL.bottom_item(data);
            }
            // 加载我的收藏
            , loadFavorites    : function () {
                if (!cartApp.isLogin()) {
                    cartApp.renderBottomItems(null, $('[data-favorites]'), 'favorites');
                    return;
                }
                req.reqp('//member' + cookieDomain + '/myaccount/myFavorites/getFavoritesGoodsForShopCart', {
                    userId        : cartApp.getUserId()
                    , currPageNum : 1
                    , pageSize    : 15
                    , districtCode: getArea().area3
                }, 'ckdata').then(function (data) {
                    var result = [];

                    var list;
                    try {
                        list = data.result.favoritesList.pagination.list;
                    } catch (e) {

                    }
                    if (list) {
                        $(list).each(function () {
                            var fixData   = {};
                            fixData.url   = this.productUrl;
                            fixData.image = this.imageUrl;
                            fixData.title = this.displayName;
                            fixData.price = this.skuPrice;
                            fixData.sid   = this.skuId;
                            fixData.pid   = this.productId;
                            fixData.type = this.shopFlag,
                                fixData.giftId = this.giftItemId;
                            if (this.shopFlag == 2 || this.shopFlag == 3) {
                                fixData.isHWG = true;
                            }
                            //美信店铺id可选非必填
                            fixData.keyid = this.keyid;
                            //美信keyid
                            fixData.mid = this.mid;
                            //门店ID
                            fixData.storeid = this.storeId;
                            //分享用户ID
                            fixData.shareuserid = this.shareuserid
                            //this.prdstock='X'下架,Y 有货，N 无货
                            if (this.prdstock == "X" || this.prdstock == "N") {
                                fixData.isOnlyShow    = true
                                fixData.isPrdStockOff = true
                            }
                            result.push(fixData);
                        });
                    }
                    var html = cartApp.renderBottomItems(result, $('[data-favorites]'), 'favorites');
                })
            }
            // 加载最近浏览
            , loadHistory      : function () {
                var pids = $.cookie("proid120517atg");
                try {
                    pids = JSON.parse(pids);
                } catch (e) {
                    pids = '';
                }
                if (!pids) {
                    var html = cartApp.renderBottomItems(null, $('[data-history]'), 'history');
                    return;
                };
                function _getBase(){
                     var url = '//ss' + cookieDomain + '/item/v1/browse/prdreturn/' + pids.join(',') + '/100/' + getArea().area2 + '/' + getArea().area3 + '/flag/item/wp';
                    // var url =  '//member' + cookieDomain + '/myaccount/myFootprint/myFootprintList' 
                    req.reqp(url, {}, "wp").then(function (data) {
                        var result = [];
                        if (data.success) {
                            $.each(data.result, function (i, item) {
                                if (!item.skuId)return;
                                var fixData = {
                                    url           : this.url,
                                    image         : this.pic,
                                    title         : this.name,
                                    price         : $.trim(this.price || ''),
                                    sid           : this.skuId,
                                    pid           : this.productId,
                                    type          : this.shopFlag,
                                    skuMappingSuit: (this.skuMappingSuit ? this.skuMappingSuit : false),
                                    isHWG         : ((this.shopFlag == 2 || this.shopFlag == 3) ? true : false)
                                };
                                if (!(this.state)) {
                                    fixData.isOnlyShow    = true
                                    fixData.isPrdStockOff = true
                                }
                                result.push(fixData);
                            });
                        }
                        var html = cartApp.renderBottomItems(result, $('[data-history]'), 'history');
                    }).fail(function () {
                        var html = cartApp.renderBottomItems(null, $('[data-history]'), 'history');
                    });
                }
                function _getNew(){
                    //    var url = '//ss' + cookieDomain + '/item/v1/browse/prdreturn/' + pids.join(',') + '/100/' + getArea().area2 + '/' + getArea().area3 + '/flag/item/wp';
                       //url = http://member.atguat.com.cn/myaccount/myFootprint/myFootprintList?type=1&pageSize=10&areaCode=11010200
                       var url =  '//member' + cookieDomain + '/myaccount/myFootprint/myFootprintList?type=2&pageSize=10&areaCode=' + getArea().area3 ;
                       req.reqp(url, {}, "ckdata").then(function (data) {
                           var result = [];
                           if (data.result && data.result.length >0) {
                               $.each(data.result, function (i, item) {
                                   if (!item.skuId)return;
                                   var fixData = {
                                       url           : '//item'  + cookieDomain + '/'+ this.productId +'-'+this.skuId +'.html',
                                       image         : this.imgUrl,
                                       title         : this.productName,
                                       price         : $.trim(this.areaPrice || ''),
                                       sid           : this.skuId,
                                       pid           : this.productId,
                                       type          : this.shopFlag,
                                       skuMappingSuit: (this.skuMappingSuit ? this.skuMappingSuit : false),
                                       isHWG         : ((this.shopFlag == 2 || this.shopFlag == 3) ? true : false)
                                   };
                                   if (!(this.state)) {
                                       fixData.isOnlyShow    = true
                                       fixData.isPrdStockOff = true
                                   }
                                   result.push(fixData);
                               });
                           }
                           var html = cartApp.renderBottomItems(result, $('[data-history]'), 'history');
                       }).fail(function () {
                           var html = cartApp.renderBottomItems(null, $('[data-history]'), 'history');
                       });
                      
                }
               if(cartApp.isLogin()){
                    _getNew()
               }else{
                 _getBase() 
               }
            }
            // 加载为您推荐
            , loadRecommend    : function (isEmpty) {
                var $goodItems = $('[data-good]');
                var sid        = [];
                var pid        = [];
                $goodItems.each(function () {
                    var $this = $(this);
                    sid.push($this.data('sid'));
                    pid.push($this.data('pid'));
                });

                req.reqp('//bigd.gome.com.cn/gome/rec', {
                    boxid      : (isEmpty ? 'box15' : 'box16')
                    , imagesize: 100
                    , cid      : $.cookie("__clickidc")
                    , uid      : cartApp.getUserId()
                    , area     : cartApp.getArea().area3
                    , sid      : sid.join(',')
                    , pid      : pid.join(',')
                }, "rec").then(function (data) {
                    var result = [];
                    if (data.size == 0) {
                        var html = cartApp.renderBottomItems(null, $('[data-recommend]'), 'recommend');
                    } else {
                        if (data.lst && data.lst.length) {
                            $(data.lst).each(function () {
                                var fixData = {
                                    url           : this.purl,
                                    image         : this.iurl,
                                    title         : this.pn,
                                    price         : $.trim(this.price || ''),
                                    sid           : this.sid,
                                    pid           : this.pid,
                                    gprice        : $.trim(this.gprice || ''),
                                    maima_param   : this.maima_param,
                                    skuMappingSuit: (this.skuMappingSuit ? this.skuMappingSuit : false),
                                    isHWG         : ((this.shopFlag == 2 || this.shopFlag == 3) ? true : false)
                                };
                                result.push(fixData);
                            });
                        }
                        var html = cartApp.renderBottomItems(result, $('[data-recommend]'), 'recommend');
                    }
                })
            }

            // 绑定所有刷新购物车事件，events在此文件最上面配置的
            , bindActEvents : function () {
                var $doc = $(document);
                for (var type in events) {
                    var event = type.split(/\s+/);
                    $doc.on(event[0], event[1], events[type]);
                }
            }
            // 绑定UI交互事件
            , bindUiEvents  : function () {
                $(document).on('gcheckbox.change', '.cart-shop-good', function (e, checked) {
                    var $this = $(this);
                    if (checked) {
                        $this.addClass('cart-shop-good-checked');
                    } else {
                        $this.removeClass('cart-shop-good-checked');
                    }
                });
                $.gCheckbox.bind();
                $.gPopup.bind();
                $.gSelect.bind();
            }
            , renderKfStatus: function () {
                var jsonpcall = 0;
                //find在线客服
                var ServerID_arr = [];
                $('[data-customer_service_id]').each(function () {
                    ServerID_arr.push($(this).data('customer_service_id'));
                });

                if (ServerID_arr.length > 0) {
                    jsonpcall++;
                    //调用live800接口
                    $.ajax({
                        type     : 'get',
                        url      : '//ss' + cookieDomain + '/item/v1/online/' + ServerID_arr.join(',') + '/' + cartApp.getUserId() + '/flag/item/live800' + jsonpcall,
                        dataType : 'jsonp',
                        jsonpName: "live800" + jsonpcall,
                        success  : function (data) {
                            //改变客服状态
                            $('[data-customer_service_id]').each(function () {
                                var customers = data.result || [];
                                for (var i = 0; i < customers.length; i++) {
                                    if (customers[i].customer_flag == $(this).data('customer_service_id')) {
                                        $(this).show();
                                        $(this).data('customer_service', customers[i]);
                                        if (customers[i].status == 0 || customers[i].status == 1) { //客服离线 || 客服在线
                                            $(this).find('i').removeClass("c-kf-off").addClass('c-kf-on');
                                            $(this).find('.contact-customer-word').addClass('contact-font');
                                        } else if (customers[i].status == -1) {//没有客服
                                            $(this).hide();
                                        }
                                        if (typeof $(this).data('customer_service_cb') == 'function') {
                                            $(this).data('customer_service_cb').call(this);
                                        }
                                    }
                                }
                            });

                            //弹出客服窗口
                            $('[data-customer_service_id]').off('click.kf').on('click.kf', function () {
                                var customer_service = $(this).data('customer_service');
                                // if (customer_service.status<1) {
                                //  return;
                                // }
                                if (cartApp.isLogin()) {
                                    if ($('[act-login-name]').html() == '') {
                                        location.href = g.url.login + '/login?tableName=login&orginURI=' + location.href;
                                        return;
                                    }
                                    if (customer_service) {
                                        if (customer_service.status < 0) {
                                            return;
                                        }
                                        window.open(customer_service.host + //host
                                            '/chatClient/chatbox.jsp?' +
                                            'companyID=' + customer_service.customerID +
                                            '&customerID=' + customer_service.customerID +
                                            '&info=' + customer_service.customerInfo +
                                            '&page=0' +
                                            '&enterurl=' + location.href +
                                            '&shopname=' + encodeURI(encodeURI($(this).data("shopname"))),
                                            'customerService' + $(this).data(customer_service).customerID,// 窗口id
                                            'toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,width=1120,height=700'
                                        );
                                    }
                                    ;
                                } else {
                                    cartApp.glogin();
                                }

                            });
                        }
                    });
                }
            }

            // 读取数据之后渲染购物车列表
            , renderCart    : renderCart
            // 加价换购已选中的数量渲染
            , renderJJGCount: function () {
                $('.cart-add-buy-list-inner').each(function () {
                    var $this   = $(this);
                    var $red    = $this.find('.cart-add-buy-header .cart-red-text').eq(1);
                    var checked = $this.find('.cart-add-buy-row :checked').length;
                    $red.html(checked);
                });
            }

            // 底部固定 IE6无视了
            , bindFixedBottom   : function () {
                var $cartBottomWrap      = $('.cart-bottom-wrap');
                var cartBottomWrapHeight = $cartBottomWrap.height();
                var isFixed              = false;
                if (!$cartBottomWrap.length) {
                    return;
                }

                var setBottomFixed = function () {
                    var scrollTop      = document.documentElement.scrollTop || document.body.scrollTop;
                    var bottomPosition = scrollTop + $(window).height();
                    if (Math.ceil($cartBottomWrap.offset().top) + cartBottomWrapHeight > bottomPosition) {
                        if (isFixed) {
                            return;
                        }
                        isFixed = true;
                        $cartBottomWrap.addClass('cart-bottom-fixed');
                    } else {
                        if (!isFixed) {
                            return;
                        }
                        isFixed = false;
                        $cartBottomWrap.removeClass('cart-bottom-fixed');
                    }
                }
                setBottomFixed();
                $(window)
                    .off('scroll.fixedBottom resize.fixedBottom')
                    .on('scroll.fixedBottom resize.fixedBottom', setBottomFixed);
            }
            // 往删除列表里添加已删除商品
            , refreshDeletedArea: function () {
                var zData    = $config.cartAtom.deleteData;
                var _show = $('[act-deleted-wrap]');

                var dataShow = u.filter(function (d) {
                    if ($config.isQygSite() && d._site === 'qyg') {
                        return d;
                    } else if (!$config.isQygSite() && d._site !== 'qyg') {
                        return d;
                    }
                })(zData);

                if (dataShow.length) {
                    var text = $config.isQygSite()? '已删除商品，您可以重新购买': '已删除商品，您可以重新购买或移入收藏夹：';
                    _show.show().find('.cart-deleted-header').text(text);
                    _show.find('[act-deleted-list]').html(GTPL.cart_deleted_area_item(dataShow))
                } else {
                    _show.hide()
                }
            }
            // 拉取完底部我的收藏、为您推荐、最近浏览的数据之后渲染
            , initTab           : function () {
                var $tab = $('.cart-bottom-tab');
                $tab.show();
                var $tabTrigger       = $tab.find('.cart-tab-header a');
                var $tabContent       = $tab.find('.cart-tab-content');
                var isLoadedHistory   = false,
                    isLoadedFavorites = false;//只有第一次时发送ajax请求
                
                $tabTrigger.each(function (i) {
                    $(this).mouseover(function () {
                       if (i == 1 && !isLoadedHistory) {
                            cartApp.loadHistory();
                            isLoadedHistory = true;
                        } else if (i == 2 && !isLoadedFavorites) {
                            cartApp.loadFavorites();
                            isLoadedFavorites = true;
                        }
                        ;
                        $tabTrigger.removeClass('active').eq(i).addClass('active');
                        $tabContent.hide().eq(i).show();
                    });
                });
                $tabTrigger.eq(0).mouseover();
            }
            , tplHelper         : {
                taozhuang: {
                    /**
                     * 套装 状态值
                     */
                    ITEMS         : {
                        'OFF_SHELVES': {
                            'tag'        : '此套装已下架'
                            , 'isNotGray': true
                        },
                        'OUT_STOCK'  : {
                            'tag'        : '无货'
                            , 'isNotGray': false
                        }
                    }
                    /**
                     * 判断是否将单个商品置灰
                     * @param state
                     * @returns {boolean}
                     */
                    , isGoodtoGray: function (state) {
                        return this.ITEMS[state] ? this.ITEMS[state].isNotGray : false
                    }
                    , isStateTpl  : function (state) {
                        if (!state) {
                            return ''
                        }
                        return this.ITEMS[state] ? this.ITEMS[state].tag : '';
                    }
                }

            }
        }


    //处理运费
    function _freight(){
        var code = getArea();
        postapi('template/fsm', {code:code.area2}).then(function (data1) {
            if (data1.success && data1.data) {
                $('.freight-box').html(GTPL.freight_box(data1.data));
            }
        })
    }
    function getapi(path, params) {
        return req.getApi($page.site, path, params);
    }

    function getapiBySite(path, params, site) {
        if (!site) {
            site = $page.site;
        }
        return req.getApi(site, path, params);
    }

    /**
     * 判断是否显示 头部tabs
     * @param data
     */
    function showHeadTab(data){
           if(!data || !data.data || !data.data.cartProfile){
                return;
           }
           if(!isHome()){
               return ;
           };
            var type = data.data.cartProfile.userType;
           if(type === 'ENTERPRISE'){
               var $tabs = $('.js-head-tabs')
               if(isQygSite()){
                   $tabs.find('.js-base').removeClass('head-tab-checked');
                   $tabs.find('.js-qyg').addClass('head-tab-checked');
               }else{
                   $tabs.find('.js-base').addClass('head-tab-checked');
                   $tabs.find('.js-qyg').removeClass('head-tab-checked');
               };
               $tabs.show();
           }

    }

    /**
     * 清除小购物车数量cookie
     */
    function clearMiniCount(){
        if($.cookie){
            $.cookie("cartnum",0,{path:'/',expires:-1});
        }
    }
    function postapi(path, params) {
        return req.postApi($page.site, path, params).then(function(data){
            if(isQygSite()){//处理企业购没有权限
                if(data.status === 'QYG_P'){
                    window.location.href = '//cart' + cookieDomain + "/no-permission";
                }
            }
            if(data.errCode === "0010040023"){//全选单独处理
                var sABp = $(".selectAllItemOffCheck").prev();
                var sAB = $(".selectAllItemOffCheck");
                sABp.addClass("good-checkboxs-no").removeClass("checkbox_chose").removeClass("c-i");
                sABp.removeAttr("act-check-all-items");
                sABp.removeAttr("gui-checkbox");
                sAB.show();
                var sTimer= null;
                sTimer = setTimeout(function(){
                    clearTimeout(sTimer);
                    cartApp.loadCart();
                },3000);
            }
        });
    }

    //统一错误处理函数
    function errfn(data) {
        //同一处理未登陆
        if(data.errCode === "003000001"){
            var isNotLoad = true;
            cartApp.glogin(false,isNotLoad);
            return;
        }
        if (data.errCode != "0" && data.errCode != "0010040023") {
            panel.error(data.errMsg);
            return
        }

    }

    function errRenderfn(data) {
        if (data.errCode != "0") {
            panel.error(data.errMsg);
            cartApp.renderCacheCart();
            return
        }
    }

    //异步ajax error 走固定提示的报错，并刷新页面
    function cartAppError() {
        panel.error('忙疯啦，正在加速处理中，请稍后再试~ <br>你可以返回 <a class="alertatag" href="//www' + cookieDomain + '"> 国美在线首页</a> 继续购物');
        if (cartApp._cacheData) {
            cartApp.renderCart(cartApp._cacheData);
        } else {
            $('.cart-lists').html(GTPL.cart_empty(defaultData));
            //cartApp.renderCart(defaultData);
        }
    }

    function addToWishlist(item, $obj) {
        var url = '//ss' + cookieDomain + '/item/v1/sc/md/' + item.productId + '/' + item.skuId + '/' + cartApp.getUserId() + '/' + siteName
            + '/flag/cart/wishlist?kid=' + item.fanliId + '&mid=' + item.meidianId + '&storeId=' + item.storeCode;
        req.reqp(url, {}, 'wishlist').then(function (cartData) {
            $track('GoodCollection', 
            {
                collection_type: '成功',
                sku_id: item.skuId
            })
            if (cartData.success == 'true') {
                getapi("cart/removeItem", {
                    cid: item.itemId
                }).then(commonErrorWarp(function () {
                    cartApp.loadCart();
                    cartApp.loadFavorites();
                    if ($obj) {
                        // 如果是在删除区加入收藏夹，则去掉删除区项目
                        cartApp.deleteGood(item)
                        cartApp.refreshDeletedArea()
                    }
                }))
            } else {
                panel.alert(cartData.errorType == "isCollect" ? '您已收藏过此商品' : ( cartData.message || '收藏失败！'));
                cartApp.loadFavorites();
            }
        })
    }

    /**
     * reconsitution 裸露在命名空间的事件绑定
     * @private
     */
    function _addEvent() {
        // 下拉框展示的时候提高下拉框所在元素的z-index，防止被遮挡
        $(document).on('popshow selectshow', '.cart-shop-header,.cart-shop-good,.cart-shop-info', function () {
            $(this).addClass('high-level');
        }).on('pophide selecthide', '.cart-shop-header,.cart-shop-good,.cart-shop-info', function () {
            $(this).removeClass('high-level');
        });
        /****自定义事件***********************/
        var timer = null;
        $(document).on("mouseenter", "[popup-prop-group]", function () {
            var div = $(this);
            div.addClass("cart-good-pro-hover");
            timer = setTimeout(function () {
                div.removeClass("cart-good-pro-hover").addClass("cart-good-pro-focus");
            }, 1000)

        }).on("mouseleave", "[popup-prop-group]", function () {
            clearTimeout(timer)
            $(this).removeClass("cart-good-pro-hover cart-good-pro-focus");
        }).on("click", "[prop-up]", function () {
            $(this).parent("[popup-prop-group]").removeClass("cart-good-pro-focus").addClass('cart-good-pro-hover');
        }).on("click", "[prop-down]", function () {
            $(this).parent("[popup-prop-group]").removeClass("cart-good-pro-hover").addClass("cart-good-pro-focus");
        });
        //鼠标划过弹出运费
        var shipfeeTimer = null;
        $(document).on("mouseenter","[shipfee-dec]",function(){
            clearTimeout(shipfeeTimer);
            $(this).find(".shipfee-tip-pop").show();
        }).on("mouseleave","[shipfee-dec]",function(){
            var $_this = $(this);
            shipfeeTimer = setTimeout(function(){
                $_this.find(".shipfee-tip-pop").hide();
            },100);
        });
        $(document).on('click',function(){
            if(!$config.cartAtom.limitTuanIsShow){
                $config.cartAtom.limitTuanIsShow = {};
            }
            $config.cartAtom.limitTuanIsShow.currentCid = false;
        });
        //鼠标hover优惠券使用说明
        var couponTimer = null;
        $(document).on("mouseenter","[coupon_desc]",function(){
            clearTimeout(couponTimer);
            $(this).siblings(".tip_desc").show();
        }).on("mouseleave","[coupon_desc]",function(){
            var $_this = $(this);
            couponTimer = setTimeout(function(){
                $_this.siblings(".tip_desc").hide();
            },100);
        });

    }

    function renderTpl(tplfn) {
        return function (data) {
            $('.cart-lists').html(tplfn(data));
            readerMeiDian();
            return data;
        }
    }

    //从数据中过滤有子品的数据，去取子品对应主品的itemId
    function getMainItemId(goods) {
        var mianPro = u.find(function (item) {
            return item.commerceitemVOFlag != 'SUB'
        }, goods)
        if (mianPro) return mianPro.itemId
    }

    //购物车loadCart data数据转换
    function transCartData(data, cp) {
        var selectedGoodsData = {
            itemId           : 0,
            normalItemChecked: cp.normalItemChecked,
            hwgitemChecked   : cp.hwgitemChecked,
            normalitemCount  : 0,
            hwgitemCount     : 0,
            normalGoodCount  : 0,
            hwgGoodCount     : 0,
            hwglist          : [],
            normallist       : []
        };

        /**
         * 判断是否 选中增值服务
         *  todo 现在只处理了 延保（incrementServiceItems）
         * @param _items
         * @private
         */
        function _isSelectedServiceItems(_items){
            for(var i=0,len=_items.length; i<len; i++){
                var iItems = _items[i].incrementServiceItems;
                if(!iItems || iItems.length<1){
                    continue;
                }
                for(var j=0; j<iItems.length; j++){
                    if(iItems[j].selected){
                        good._incrementServiceItemsSelected = true;
                        return;
                    }
                }

            }
        }
        if (data.data.siVOs) {
            for (var i = 0; i < data.data.siVOs.length; i++) {
                for (var m = 0, item = data.data.siVOs[i], length = item.commerceItemsGroups.length; m < length; m++) {
                    var groups = item.commerceItemsGroups[m];
                    shoppingCoupon.put(item.shopId);

                    for (var n = 0; n < groups.commerceItemsGroup.length; n++) {
                        var good = groups.commerceItemsGroup[n], params = {};
                        //处理倒计时
                        good = countDownHandler(good);
                        good = countDownHandlerYyqg(good);
                        if (groups.promotionHeads && groups.promotionHeads[0]) headGiftAddItemid(groups.promotionHeads[0], good);
                        groups.shopId = item.shopId;
                        // if($config.isGift(groups)){//对于赠品 处理，只有无货和正常状态，在此处将别的状态转换为 有货
                        //     if(good.inventoryState != 'NO_GOODS'){
                        //         good.inventoryState = 'IN_STOCK'
                        //     }
                        // }
                        //去结算查看勾选商品,数据处理
                        if (good.selected) {
                            params = {
                                "itemId"      : good.commerceitemVOFlag == "SUB" ? getMainItemId(groups.commerceItemsGroup) : good.itemId,
                                "itemURL"     : good.itemURL,
                                "itemName"    : good.itemName,
                                "itemImageURL": good.itemImageURL
                            }
                            if (good.cType == "HWG") {
                                selectedGoodsData.hwgitemCount += good.quantity
                                selectedGoodsData.hwgGoodCount += 1
                                selectedGoodsData.hwglist.push(params)
                            } else {
                                if (good.baseQuantity) {
                                    selectedGoodsData.normalitemCount += good.baseQuantity * good.quantity
                                } else {
                                    selectedGoodsData.normalitemCount += good.quantity
                                }
                                selectedGoodsData.normalGoodCount += 1
                                selectedGoodsData.normallist.push(params)
                            }
                        }
                        //如果存在美店数据
                        if (good.meidianId) {
                            meiDian.setId(good.meidianId);
                        }
                        //国美自营商品时转换延保，碎屏保，意外保数据
                        if (good.incrementServiceInfo
                            && good.incrementServiceInfo.showBaseGroupVOList && good.incrementServiceInfo.showBaseGroupVOList.length > 0) {
                            good._incrementServiceItems = good.incrementServiceInfo.showBaseGroupVOList;
                            var _items = good._incrementServiceItems;
                            good._incrementServiceItemsSelected = false;
                            _isSelectedServiceItems(_items);

                        }

                        //降价通知数据
                        if (reducePriceData) {
                            var reducePriceList = reducePriceData.reducePriceList;
                            for (var l = 0; l < reducePriceList.length; l++) {
                                if (reducePriceList[l].comId == good.itemId) {
                                    good.reducePrice = reducePriceList[l].price;
                                }
                            }
                        }
                        good._commerceItemVOs = [];
                        if (good.returnedCouponVOs) {
                            if (good.commerceItemVOs) {
                                good._commerceItemVOs = Array.prototype.concat(good.commerceItemVOs);
                            }
                            good._commerceItemVOs = good._commerceItemVOs.concat(good.returnedCouponVOs);
                        }
                        if (good._commerceItemVOs.length > 2) {
                            good._commerceItemVOs._isMore = true
                        } else {
                            good._commerceItemVOs._isMore = false;
                        }
                    }

                }
            }
        }
        data.selectedGoodsData = selectedGoodsData;
        return data;
    }

    /**
     * 处理倒计时
     * 向good 中添加属性
     *      _tipCount 表示 倒计时显示 字符串团
     *      _isCount 表示 是否显示倒计时
     * 显示 分为三种情况，分别是 首位显示 天|时|分
     * @param good
     * @returns {*}
     */
    function countDownHandler(good){

        var info      = good.itemPromotionInfo;
        good._isCount = false;//表示 是否显示倒计时
        if(good.inventoryState === 'NO_GOODS' || good.inventoryState === 'OFF'){//无货，已下架不显示倒计时
            return good;
        }
        if (!info) {
            return good;
        }
        var nowTime    = new Date().getTime();//当前时间戳
        var remainTime = info.endTime - nowTime;//剩余毫秒数

        if (remainTime < 0) {
            return good;
        }
        good._isCount = true;

        countDownSetInterval(good);
        good._tipCount =  _getIntegerCount(remainTime);//最终添加的属性

        return good;
    }
    //预约抢购倒计时
    function countDownHandlerYyqg(good){
        var tarTime      = good.reserveStartTime;
        good._isCountYyqg = false;//表示 是否显示倒计时
        if (!tarTime) {
            return good;
        }
        var nowTime    = new Date().getTime();//当前时间戳
        var remainTime = tarTime - nowTime;//剩余毫秒数
        if (remainTime < 0) {
            return good;
        }
        good._isCountYyqg = true;

        countDownSetInterval(good);
        good._tipCountYyqg =  _getIntegerCount(remainTime);//最终添加的属性

        return good;
    }

    /**
     * 添加 动态倒计时 每个1000 动态改变倒计时 时间
     * @param good
     */
    function countDownSetInterval(good){
        var intervalID = null,intervalIDYyqg = null;
        if(good.itemPromotionInfo && good.itemPromotionInfo.endTime){
            intervalID = window.setInterval(func,1000);
        }
        if(good.reserveStartTime){
            intervalIDYyqg = window.setInterval(funcYyqg,1000);
        }

        function func(){
            var nowTime    = new Date().getTime();//当前时间戳
            var remainTime = good.itemPromotionInfo.endTime-nowTime;//剩余毫秒数
            if(remainTime<=0){
                window.clearInterval(intervalID);
                cartApp.loadCart();
            }else{
                var $countdown = $('.js-countdown-'+good.skuId);
                $countdown.text(_getIntegerCount(remainTime));
            }

        }
        function funcYyqg(){
            var nowTime    = new Date().getTime();//当前时间戳
            var remainTime = good.reserveStartTime-nowTime;//剩余毫秒数
            var rDate = new Date(parseInt(good.reserveStartTime));
            var Y = rDate.getFullYear();
            var M = (rDate.getMonth()+1 < 10 ? '0'+(rDate.getMonth()+1) : rDate.getMonth()+1);
            var D = rDate.getDate();
            var H = rDate.getHours();
            var m = rDate.getMinutes();
            var iTime = Y + "年" + M + "月" + D + "日" + H + "时" + m + "分";
            if(remainTime<=0){
                window.clearInterval(intervalIDYyqg);
                cartApp.loadCart();
            }else{
                var $countdown = $('.yyrh-cont-' + good.skuId);
                var countTxt = _getIntegerCount(remainTime);
                if(remainTime < 86400000){
                    $countdown.text("预约商品还剩" + countTxt + "开抢！");
                }else{
                    $countdown.text("预约商品" + iTime + "开抢！");
                }
            }

        }
    }
    /**
     * 拼接显示倒计时 时分秒
     * @param remainTime
     * @returns {string}
     * @private
     */
    function _getIntegerCount(remainTime){
        var DAY        = 24 * 60 * 60 * 1000;
        var HOUR       = 60 * 60 * 1000;
        var MINUTE     = 60 * 1000;
        var _count = new Array(2);
        //显示 分为三种情况，分别是 首位显示 天|时|分
        if(remainTime/DAY >1) {
            _count[0] = Math.floor(remainTime / DAY);//天
            _count[1] = Math.floor((remainTime % DAY) / HOUR);//小时
            return _format(_count[0])+ '天'
                + _format(_count[1]) +'时'
        }else if(remainTime/HOUR >1){
            _count[0] = Math.floor(remainTime/HOUR);//时
            _count[1] = Math.floor((remainTime%HOUR)/MINUTE);//分
            return _format(_count[0])+ '时'
                + _format(_count[1]) +'分'
        }else{
            _count[0] = Math.floor(remainTime/MINUTE);//分
            _count[1] = Math.floor((remainTime%MINUTE)/1000);//秒
            return _format(_count[0])+ '分'
                + _format(_count[1]) +'秒'
        }

        /**
         * 对于显示 只有1位，前面加“0”
         * @param n
         * @returns {string}
         * @private
         */
        function _format(n){
            return n<10 ? ('0'+n) : n;
            //return n;
        }
    }
    //向促销头中添加 itemid
    function headGiftAddItemid(heads,goods){
        var itemId = goods.itemId;
        if(!heads || heads.length<1){
            return null;
        }
        for(var i=0,len=heads.length; i<len; i++){
            var head = heads[i];
            if(!head.itemIds){
                head.itemIds =[];
            }
            //只有主品
            if(goods.commerceitemVOFlag === "MAIN" && !isRepeat(head.itemIds,itemId)){
                head.itemIds.push(itemId);
                head.itemIdsSting = JSON.stringify(head.itemIds);
            }
            head._selectedNum = getSelectedNum(head);
            head._rangeWithGiftGroupses = transRangeWithGiftGroupses(head);
        }
        /**
         * 判断是否重复
         * @param data
         * @param value
         * @returns {boolean}
         */
        function isRepeat(data,value){
            if(!data && data.length<1){
                return false;
            }
            for(var i=0,len=data.length; i<len; i++){
                if(data[i] === value){
                    return true;
                }
            }
            return false;
        }

        /**
         * 选中赠品的数量
         * @param head
         * @returns {number}
         */
        function getSelectedNum(head){
            if(!head  ){
                return 0;
            }
            var selectedNum = 0;

            var ranges = head.ranges;
            if(!ranges){
                return 0;
            }
            for(var j=0; j<ranges.length; j++){
                var groups = ranges[j].groups;
                if(!ranges[j].groups || ranges[j].groups<1){
                    continue;
                }
                for(var z=0; z<groups.length; z++){
                    var gifts = groups[z].gifts;
                    if(!gifts || gifts<1){
                        continue;
                    }
                    for(var g=0; g<gifts.length; g++){
                        if(gifts[g].selected){
                            selectedNum = (selectedNum+1)/gifts.length;//因为 是套，一个套可能有多个商品
                        }
                    }
                }
            }
            return Math.ceil(selectedNum);//向上取整
        }

        /**
         * 处理加价换购数据
         * 将深层次的数据，变成单层数组
         * @param head
         * @returns {*}
         */
        function transRangeWithGiftGroupses(head){
            if(!head  ){
                return 0;
            }
            var _rangeWithGiftGroupses=[];
            var _maxNum = 0;

            var ranges = head.rangeWithGiftGroupses;
            if(!ranges){
                return 0;
            }
            for(var j=0; j<ranges.length; j++){
                var groups = ranges[j].groups;
                if(!ranges[j].groups || ranges[j].groups<1){
                    continue;
                }
                for(var z=0; z<groups.length; z++){
                    var gifts = groups[z].gifts;
                    if(!gifts || gifts<1){
                        continue;
                    }
                    for(var g=0; g<gifts.length; g++){
                        gifts[g]._available = ranges[j].range.available;
                        _rangeWithGiftGroupses.push(gifts[g]);
                        if(ranges[j].range.available){
                            _maxNum++;
                        }
                    }
                }
            }
            if(head.maxNum <= _maxNum){
                _maxNum=head.maxNum ||0;
            }
            head._maxNum=_maxNum;
            return _rangeWithGiftGroupses|| [];//向上取整
        }
    }

    function setPreCartDataByWarrantySite(data) {
        var _products = data.commerceItemVOs;
        if (!_products || _products.length < 1) {
            return data;
        }
        for (var i = 0, len = _products.length; i < len; i++) {
            var _product                    = _products[i];
            _product.itemId                 = _product.commerceItemId;
            _product._incrementServiceItems = (_product.incrementServiceInfoVO) ? _product.incrementServiceInfoVO.showBaseGroupVOList : {};
            if(!_product.incrementServiceInfoVO || _product.incrementServiceInfoVO == null)panel.alertWarrantyHas();
            //判断是否有选中的延保
            if(_product._incrementServiceItems.length){
                var pItem = _product._incrementServiceItems[0].incrementServiceItems,
                    obj = {};
                //补购延保不再多选 结构不变[还是array的形式，但是只有一层可选择] 所以默认取第0个：
                if(pItem.length){
                    for(var j =0; j<pItem.length; j++) {
                        if (pItem[j].selected == true) {//有选中的情况
                            obj.hasLabel      = $config.warrantyAtom[pItem[0].serviceType].lable;
                            obj.hasType       = (pItem[j].promotionType == "1" ? "特惠" : "");
                            obj.hasName       = pItem[j].displayName;
                            obj.hasNYear      = pItem[j].numOfYear;
                            obj.hasQuantity   = pItem[j].quantity;
                            obj.hasPrice      = pItem[j].price;
                            obj.hasAmount     = pItem[j].amount;
                            obj.hasSel        = obj.hasLabel + " " + obj.hasType + " " + obj.hasName + " " + obj.hasNYear + "年";
                            _product.hasDatas = obj;
                            return;
                        } else {
                            obj.hasLabel      = null;
                            obj.hasType       = null;
                            obj.hasName       = null;
                            obj.hasNYear      = null;
                            obj.hasQuantity   = 0;
                            obj.hasPrice      = 0;
                            obj.hasAmount     = 0;
                            obj.hasSel        = "选购增值服务";
                            _product.hasDatas = obj;
                        }
                    }
                }
            }
        }
    }

    function setPreCartData(data) {
        data.prevHeight = cartApp._prevHeight;
        if (data.success && data.data && data.data.cartProfile) {
            transCartData(data, data.data.cartProfile)
        }
        meiDian.callVlaues(function (data) {
            readerMeiDian();
        });
        //只有主站调用 购物券
        if(isHome()){
            if(_isCatchDian){
                shoppingCoupon.callValues(function (data) {
                    if(data){
                        readerShoppingCoupon(data);
                    }
                });
                _isCatchDian = false;
            }else{
                readerShoppingCoupon(shoppingCoupon.data);
            }

        }
        //处理延保站点
        if (data.success && data.data && isWarrantySite()) {
            setPreCartDataByWarrantySite(data.data);
        }
        return data;
    }

    function readerMeiDian() {
        //TODO 当且 loadcart 和load 美店数据后 才执行，当下解决的方案是 渲染两次
        var list = meiDian.getMap();
        if (!list) {
            return;
        }
        for (var prop in list) {
            if (list[prop + '']) $('.mei-dian-' + prop).attr("title",'来自美店：' + list[prop + '']);
        }
    }

    /**
     * 渲染店铺券提示
     * @param arr
     */
    function readerShoppingCoupon(arr) {
        "use strict";
        if (!arr && arr.length < 1) {
            return;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            ;(function () {
                var item, title, $box, $remind, timer;
                item = arr[i];
                if (item.haveCoupon) {
                    title = item.name || '';
                    //添加去凑单链接
                    title += '<a style="color:#006699" href="//coudan'+cookieDomain+'/?'
                        + item.id
                        + '&crossShop=true'
                        + '&aid=' + item.activityId
                        + '"'
                        + ' target="_blank">'
                        + '&nbsp;&nbsp;&nbsp;去凑单&nbsp;<span class="jt">&gt;</span></a>';
                } else {
                    title = item.frontPrompt || '';
                }
                $box    = $('#shopping-coupon-' + item.shopNo);
                $remind = $box.find('.coupon-remind');
                $box.find('.title-txt').html(title);
                $box.show(500);

                $box.find('[hoverup]').hover(function () {
                    clearTimeout(timer);
                    $remind.show();
                }, function () {
                    timer = setTimeout(function () {
                        $remind.hide();
                    }, 500);
                })
            })();
        }
        // 绑定底部fixed条事件
        setTimeout(function(){
            _bottomBottom();
        },500);

    }
    /**
     * 底部位置计算
     * @private
     */
    function _bottomBottom(){
        cartApp.bindFixedBottom();
        // if (cartApp._prevHeight) {
        //     cartApp._prevHeight = $('[act-list]').height();
        //     $('[act-list]').animate({height: cartApp._prevHeight});
        //
        // } else {
        //     cartApp._prevHeight = $('[act-list]').height();
        // }
    }

    //渲染头部四级区域
    function gCityRender() {
        gcity.make($("#gCityRegion"), "", {
            selectfn: function (data) {
                $('#stockaddress').html(data.chtm);
                $("#gCityRegion").find(".gCity").hide();
                //重写城市cookie
                $.cookie('atgregion', data.xid + "|" + data.chtm + "|" + data.cid + "|" + data.sid + "|" + data.zid, {
                    expires: 30,
                    path   : '/',
                    domain : cookieDomain
                });
                //重写八叉乐cookie
                $.cookie('atgMboxCity', data.snam, {expires: 30, path: '/', domain: cookieDomain});
                req.postJson('//cart' + cookieDomain + '/api/district/changeTransportDistrict', {
                    p   : data.sid // 省
                    , c1: data.cid // 城
                    , c2: data.xid // 县
                    , t : data.zid // 镇
                }).then(function (data) {
                    if (data && data.success) {
                        cartApp.loadCart();
                    } else {
                        panel.error('修改区域失败，请重试.');
                    }
                })
            },
            auto    : true
        })
        $('#address').click(function () {
            $('.gCity').show();
        })
    }

    function afterRender(cartData) {
        gCityRender()
        // 渲染各个UI组件
        $.gCheckbox.render();
        $.gCount.render();
        $.gSelect.render();
        //去结算查看勾选商品,hover显示
        if (cartData.selectedGoodsData) {
            var $hoverup     = $('[g-hoverup-obj]'),
                $showhoverup = $('[g-show-hover-obj]'),
                sgoodsData   = cartData.selectedGoodsData;
            //点击显示底部已选商品
            $hoverup.off('click').on('click', function () {
                if ($showhoverup[0] && $showhoverup[0].style.display == 'block') {
                    $showhoverup.hide();
                    $(this).find('i').hide();
                    $(this).find('em').removeClass('arrow-bottom').addClass('arrow-top');
                } else {
                    $showhoverup.show();
                    if (sgoodsData['normalItemChecked'] || sgoodsData['hwgitemChecked']) {
                        $(this).find('i').show();
                        $(this).find('em').removeClass('arrow-top').addClass('arrow-bottom');
                    }
                }
                return false
            })

            if (sgoodsData['normalItemChecked'] && sgoodsData['hwgitemChecked']) {
                $showhoverup.find('.col-hwg').gScroll({
                    stepLen: 4, moveDistance: 356, speed: 400
                })
                $showhoverup.find('.col-nor').gScroll({stepLen: 5, moveDistance: 453})
            } else {
                $showhoverup.gScroll({stepLen: 10, moveDistance: 910, speed: 1000})
            }
        }

        // 绑定底部fixed条事件
        _bottomBottom();

        cartApp.renderJJGCount();
        cartApp.renderKfStatus();
        //凑单icon的提示
        ui.hoverUp($("[g-hoverup-tip]").add($("[g-hover-tip]")))($("[g-hover-tip]"));
        uw.emit($page.name, "renderEnd", cartData);
    }

    //是否延保站点
    function isWarrantySite() {
        return $page.site == "warranty";
    }

    //判断是否是二手站点
    function isSecondHandSite() {
        return $page.site == "secondHand";
    }

    //判断是否是企业购
    function isQygSite(){
        return $config.isQygSite();
    }

    //判断是否团购
    function isgroupOn() {
        return $page.site == "groupOn";
    }

    //判断是否抢购
    function isrushBuy() {
        return $page.site == "rushBuy";
    }

    //判断是否是主站
    function isHome() {
        return $page.site == "home" ||  $page.site === "qiyegou";
    }

    //延保购物车是否为空
    function isWarrantyCartEmpty(cartData) {
        return !(cartData && cartData.data && cartData.data.commerceItemVOs && cartData.data.commerceItemVOs.length);
    }

    //判断购物车是否为空
    function isPrimaryCartEmpty(cartData) {
        return !(cartData && cartData.data && cartData.data.siVOs && cartData.data.siVOs.length);
    }

    //判断数据响应是否失败
    function isFail(data) {
        if (data == null)return true;
        if (data.errCode == "0") return false;
        return true;
    }

    //判断是否是套装商品
    function isSuit(group) {
        if (group.promotionHeads && group.promotionHeads[0] && group.promotionHeads[0][0] && group.promotionHeads[0][0].type == 'TZ') {
            return true
        }
        return false
    }

    function isSuitOff(group) {
        var item = util.find(function (igroup) {
            if (igroup.state === "OFF_SHELVES") {
                return true
            }
        }, group.commerceItemsGroup)
        if (item) {
            return true
        } else {
            return false
        }
    }

    //用户登录弹窗 公共登录有坑，请使用这个
    function glogin(fn,isNotLoad) {
        g.login(function () {
            $.cookie("g_checkCart", "true", {expires: 1, path: '/', domain: cookieDomain});
            signData.gloginfn = null;
            if(!isNotLoad){//保证不循环loadCart 进入死循环
                cartApp.reload();
            }
            isNotLoad = false;
            uw.watchOnce($page.name, "renderEnd", function () {
                if (fn)fn();
            });
            user.loadUser();
            cartApp.initTab();
        });
    }

    //获取三级区域 默认三级区域11011400
    function getArea() {
        var area = ($.cookie("atgregion") || '').split("|");
        if (area) {
            return {area3: area[0], area2: area[2]}
        } else {
            return {area3: '11010200', area2: '11010000'}
        }
    }

    function getCartGood(obj) {
        var div  = obj;
        var path = div.attr("path").split(".");
        return u.path(path, cartApp._cacheData.data.siVOs);
    }

    //页头显示控制
    //传type目的是区别login，renderEnd监听区别，在有数据的情况下，等同于假登陆处理
    function controlPageheadview(type) {
        return function () {
            if (cartApp.isLogin()) {
                $('[act-login-info]').show();
                $('[act-not-login-info]').hide();
            } else {
                if (type == 'renderEnd') {
                    $("#idnotlogin").show();
                    $("#idtruelogin").hide();
                } else {
                    $("#idnotlogin").hide();
                    $("#idtruelogin").show();
                }
            }
        }
    }
    //当购物车为空时对是否已登录状态进行判断
    function controlPageheadEmptyView(type){
        return function () {
            if (cartApp.isLogin()) {
                $('[act-login-info]').show();
                $('[act-not-login-info]').hide();
            } else {
                if (type == 'renderEnd') {
                    $("#idnotlogin").hide();
                    $("#idtruelogin").show();
                } else {
                    $("#idnotlogin").show();
                    $("#idtruelogin").hide();
                }
            }
        }
    }

    //找相似请求大数据接口
    function cbfindSimilar(fdsJson) {
        return function () {
            req.reqp('//bigd.gome.com.cn/gome/rec', {
                boxid    : 'box21',
                imagesize: 130,
                pid      : fdsJson.pid,
                sid      : fdsJson.sid,
                cid      : $.cookie("__clickidc"),
                area     : cartApp.getArea().area3,
                uid      : cartApp.getUserId()
            }, 'rec1').done(function (data) {
                if (data.isSuccess == "Y" && data.size && data.lst) {
                    data.page = util.range(0, Math.ceil(data.size / 5));
                    fdsJson.slbody.find('.fsb-inner').html(GTPL.cart_find_similar(data));
                    fdsJson.slbody.gScroll({
                        isLoadImg   : true,
                        pager       : true,
                        noCarousel  : true,
                        stepLen     : 5,
                        moveDistance: 930
                    })
                } else {
                    fdsJson.slbody.find('.fsb-inner').html(GTPL.cart_find_similar_empty({success: true}))
                }
            }).fail(function () {
                fdsJson.slbody.find('.fsb-inner').html(GTPL.cart_find_similar_empty({
                    success: false,
                    pid    : fdsJson.pid,
                    sid    : fdsJson.sid
                }))
            })
        }
    }

    !(function init() {
        _addEvent();
        uw.watch('home', "loadRecommed", cartApp.loadRecommend);
        uw.watchOnce($page.name, "login", controlPageheadview('login'));
        uw.watch($page.name, "renderEnd", u.ifn(cartApp.isCartEmpty, controlPageheadEmptyView("renderEnd"), controlPageheadview('renderEnd')));
        cartApp.init();
        window.cartApp = cartApp;
    })(window);
}(util, util_ui, util_watch, request,GiftHead);