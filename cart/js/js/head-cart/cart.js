/*
 * @Author   andy
 * @QQ       419656532
 * @DateTime 2016-06-22
 */

//all bind event user class，
//event once
;
if (window.cartInfo) {
    var config = {
        dynSite: cartInfo.dynSite || dynSite,
        storeSite: cartInfo.contextPath || contextPath,
        imgServer: imgServer,
        secureURL: secureURL
    };
    var methodSite = cartInfo.methodSite || "homeus";
    var clink = config.dynSite + config.storeSite + cartInfo.cartLink;
    $(".cartlink").attr("href", clink);
} else {
    var config = {dynSite: dynSite, storeSite: contextPath, imgServer: imgServer, secureURL: secureURL};
    var methodSite = "homeus";
}
;

(function (exports) {
    //Preview tpl 
    var cartList = '<div class="mini-products">\
                        <h2 class="hdrcartitle">最近加入的商品：</h2>\
                        <ul class="mini-nProductLists">\
                            <% for(var i=0;i<commerceItemsGroups.length;i++ ) { %>\
                            <li class="mini-list clearfix">\
                                <% var commerceItems = commerceItemsGroups[i] || {}; %>\
                                <dl class="nProduct-huod realMini">\
                                    <% if(commerceItems.promotionHeads && commerceItems.promotionHeads.length > 0 ) { %>\
                                    <% if(!(commerceItems.promotionHeads[0] && commerceItems.promotionHeads[0][0] && commerceItems.promotionHeads[0][0].type=="GOME_TAO_ZHUANG")) {%>\
                                    <dd data-sub="tit-sub" class="huod-hd clearfix">\
                                        <% for(var k=0; k< commerceItems.promotionHeads.length; k++) {%>\
                                        <% var promotionHead = commerceItems.promotionHeads[k] || [] ;%>\
                                        <% for(var l=0; l<promotionHead.length; l++) {%>\
                                        <% var promotionHeadItem = promotionHead[l] || {},label = promotionHeadItem.label; %>\
                                        <% if(promotionHeadItem.selected===true && promotionHeadItem.type != "NO_USE") {%>\
                                        <div class="pCol-name-huod">\
                                            <% if (promotionHeadItem.type === "GOME_MAN_JIAN") {%>\
                                            <% var promotionTxt = ""; %>\
                                            <% if(promotionHeadItem.satisfied && promotionHeadItem.shopId != "GOME") {%>\
                                            <span class="ico-l">满减</span>\
                                            <% promotionTxt = "活动商品已购满" + ($toFixed(promotionHeadItem.preCondition)) + "元（已减" + ($toFixed(promotionHeadItem.postCondition)) + "元）";%>\
                                            <% } else {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">满减</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>满减</span>\
                                            <% } %>\
                                            <% promotionTxt = "活动商品购满" + ($toFixed(promotionHeadItem.preCondition)) + "元，即可享受优惠";%>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionTxt %>"><%=$cutstr(promotionTxt,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "GOME_MAN_FAN"){ %>\
                                            <% var promotionTxt = ""; %>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">满返</span>\
                                            <% promotionTxt = "活动商品已购满" + ($toFixed(promotionHeadItem.preCondition)) + "元";%>\
                                            <% if (promotionHeadItem.returnedCouponVOs && promotionHeadItem.returnedCouponVOs.length) {%>\
                                            <% promotionTxt += "(下单可返"; %>\
                                            <% for(var p =0 ; p<promotionHeadItem.returnedCouponVOs.length; p ++) {%>\
                                            <% if(p > 0) {promotionTxt += " , "}%>\
                                            <% promotionTxt += ($toFixed(promotionHeadItem.returnedCouponVOs[p].faceValue)) + "元"; %>\
                                            <% if (promotionHeadItem.returnedCouponVOs[p].couponType == "BLUECOUPON") {promotionTxt += "蓝券";} else {promotionTxt += "红券";}%>\
                                            <% promotionTxt += "x" + promotionHeadItem.returnedCouponVOs[p].quantity || 0;%>\
                                            <% }%>\
                                            <% promotionTxt += ")"; %>\
                                            <% }%>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>满返</span>\
                                            <% promotionTxt = "活动商品购满" + ($toFixed(promotionHeadItem.preCondition)) + "元，即可享受满返";%>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionTxt %>"><%=$cutstr(promotionTxt,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "GOME_MAN_ZENG") {%>\
                                            <% if(!promotionHeadItem.satisfied) {%><i></i><% } %>\
                                            <span class="ico-l">满赠</span>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "GOME_JIA_JIA_HUAN_GOU") {%>\
                                            <% var promotionTxt = ""; %>\
                                            <% if(promotionHeadItem.satisfied && promotionHeadItem.shopId != "GOME") {%>\
                                            <span class="ico-l">加价购</span>\
                                            <% } else {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">加价购</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>加价购</span>\
                                            <% } %>\
                                            <% } %>\
                                            <% if(!promotionHeadItem.satisfied) {%>\
                                            <% promotionTxt = "活动商品购满" + ($toFixed(promotionHeadItem.preCondition)) + "元，即可加价换购商品" + (promotionHeadItem.maxNum || "0") + "件";%>\
                                            <% } else {%>\
                                            <% promotionTxt = "活动商品已购满" + ($toFixed(promotionHeadItem.preCondition)) + "元，可加价换购商品" + (promotionHeadItem.maxNum || "0") + "件";%>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionTxt %>"><%=$cutstr(promotionTxt,24)  %></span>\
                                            <% } else if (promotionHeadItem.type === "GOME_MAN_ZHE") {%>\
                                            <% var promotionTxt = ""; %>\
                                            <% if(promotionHeadItem.satisfied && promotionHeadItem.shopId != "GOME") {%>\
                                            <span class="ico-l">满折</span>\
                                            <% promotionTxt = "活动商品已购满" + (promotionHeadItem.preCondition || "0") + "件（已减" + ($toFixed(promotionHeadItem.postCondition)) + "元）";%>\
                                            <% } else {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">满折</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>满折</span>\
                                            <% } %>\
                                            <% promotionTxt = "活动商品购满" + (promotionHeadItem.preCondition || "0") + "件，即可享受满折";%>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionTxt %>"><%=$cutstr(promotionTxt,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "GOME_DA_PEI_GOU") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">搭配购</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>搭配购</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="搭配折扣购组合">搭配折扣购组合</span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_KDP_MJ") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">跨店铺满减</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>跨店铺满减</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,20)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_KDP_MM") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">跨店铺满免</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>跨店铺满免</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,20)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_SHOP_MAN_JIAN") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">满减</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>满减</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_SHOP_MAN_FAN") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">满返</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>满返</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_SHOP_MAN_ZENG") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">满赠</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>满赠</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,26)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_SHOP_JIA_JIA_HUAN_GOU") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">加价购</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>加价购</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,24)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_SHOP_MAN_ZHE") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">多买优惠</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>多买优惠</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,24)  %></span>\
                                            <% } else if (promotionHeadItem.type === "NPOP_SHOP_GOUWUQUAN") {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">购物券</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>购物券</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,24)  %></span>\
                                            <% } else {%>\
                                            <% if(promotionHeadItem.satisfied) {%>\
                                            <span class="ico-l">促销</span>\
                                            <% } else {%>\
                                            <span class="ico-l-gray"><i></i>促销</span>\
                                            <% } %>\
                                            <span class="nLowLeight " title="<%= promotionHeadItem.label %>"><%=$cutstr(label,26)  %></span>\
                                            <% } %>\
                                        </div>\
                                        <% } %>\
                                        <% } %>\
                                        <%} %>\
                                        <% if(commerceItems.pomotionSummary && commerceItems.pomotionSummary.promtion && commerceItems.pomotionSummary.subAmount > 0) {%>\
                                        <p style="padding-left:8px;">\
                                            小计：<span class="yuan" style="margin-right:10px;"> <b>¥</b><%= $toFixed(commerceItems.pomotionSummary.subAmount) %></span>\
                                            <% if(commerceItems.pomotionSummary.promoDiscAmount > 0) {%>\
                                            <span class="nRed">已减：<%= $toFixed(commerceItems.pomotionSummary.promoDiscAmount)%>元</span>\
                                            <% } %>\
                                        </p>\
                                        <%} %>\
                                    </dd>\
                                    <%}%>\
                                    <%} %>\
                                    <% var commerceItemsGroup = commerceItems.commerceItemsGroup || [];%>\
                                    <% if(commerceItems.promotionHeads && commerceItems.promotionHeads.length > 0 && commerceItems.promotionHeads[0] && commerceItems.promotionHeads[0][0]) { %>\
                                    <% var getTaoZhuangType = commerceItems.promotionHeads[0][0].type;%>\
                                    <%}%>\
                                    <% if(getTaoZhuangType=="GOME_TAO_ZHUANG"){ %>\
                                    <%if(commerceItemsGroup.length>0 && commerceItemsGroup[0]){%>\
                                    <dd class="mini-huod-list min-sideline-list clearfix">\
                                        <div class="mini-product-info clearfix">\
                                            <div class="mini-pCol-img">\
                                                <a target="_blank" title="<%= commerceItemsGroup[0].vProductName %>" href="<%= commerceItemsGroup[0].vUrl %>">\
                                                    <img alt="" src="<%= commerceItemsGroup[0].vImageURL %>" width="50" height="50"></a>\
                                            </div>\
                                            <div class="mini-pCol-name">\
                                                <p>\
                                                    <a target="_blank" class="nBlue" title="<%= commerceItemsGroup[0].vProductName %>" href="<%= commerceItemsGroup[0].vUrl %>">\
                                                        【套装】<%=commerceItemsGroup[0].vProductName  %></a>\
                                                </p>\
                                            </div>\
                                            <div class="mini-pCol-row">\
                                                <span class="yuan"><b>¥<%= $toFixed(commerceItems.pomotionSummary.subAmount) %></b></span>\
                                                <span  class="quantity"><%= commerceItemsGroup[0].quantity %></span>\
                                                <span isClick="" mcart-count mcart-count-min="1"\
                                                      mcart-count-change-interval="100"\
                                                      mcart-change-count\
                                                      data-cid="<%= commerceItemsGroup[0].itemId %>"\
                                                      data-limit="<%= commerceItemsGroup[0].limitNum %>"class="mcart-count">\
                                                                                <a href="javascript:;" type="down" mcart-count-sub class="mcart-count-btn mcart-count-sub  <% if(commerceItemsGroup[0].quantity ==1) {%>mcart-count-disabled<% } %> ">-</a>\
                                                                                <a href="javascript:;" type="up" mcart-count-add class=" <% if(commerceItemsGroup[0].quantity >= commerceItemsGroup[0].limitNum  ) {%>mcart-count-disabled<% } %>  mcart-count-btn mcart-count-add  ">+</a>\
                                                                                <div class="mcart-count-input"><input  maxlength="3" name="num" type="text" value="<%= commerceItemsGroup[0].quantity %>">\
                                                                                </div>\
                                                                        </span>\
                                                <a class="nLowLeight miniDel" href="javascript:void(0)" title="删除" data-itemid="<%= commerceItemsGroup[0].itemId %>">删除</a>\
                                            </div>\
                                        </div>\                                        \
                                        <% var taozhuangServiceItems = commerceItemsGroup[0].incrementServiceItems || [];%>\
                                        <% if(taozhuangServiceItems.length > 0) {%>\
                                            <div class="mini-pCol-promotion fl">\
                                                <%for(var k=0;k<taozhuangServiceItems.length;k++) {%>\
                                                <% if(taozhuangServiceItems[k].selected === true) {%>\
                                                    <% var tzdName = (taozhuangServiceItems[k].warrantyType === "SPECIAL" ? "特惠" : "") + $toDisplayName(taozhuangServiceItems[k]) + "  " + taozhuangServiceItems[k].numOfYear + "年  ¥" + $toFixed(taozhuangServiceItems[k].price) %>\
                                                        <p class="nLowLeight cou-gift" title="<%=tzdName %>">[<em><%=$toServiceType(taozhuangServiceItems[k]) %></em>]&nbsp;&nbsp;<%=tzdName %></p>\
                                                     <% } %>\
                                                <% } %>\
                                            </div>\
                                        <% } %>\
                                    </dd>\
                                    <%}%>\
                                    <%}else{%>\
                                    <% for(var j=0; j< commerceItemsGroup.length; j++) {%>\
                                    <% var commerceItem = commerceItemsGroup[j] || {}; %>\
                                    <dd class="mini-huod-list min-sideline-list clearfix">\
                                        <div class="mini-product-info clearfix">\
                                            <div class="mini-pCol-img">\
                                                <a target="_blank" title="<%= commerceItem.itemName %>" href="<%= commerceItem.itemURL %>">\
                                                    <img alt="" src="<%= commerceItem.itemImageURL %>" width="50" height="50"></a>\
                                            </div>\
                                            <div class="mini-pCol-name">\
                                                <p>\
                                                    <a target="_blank" class="nBlue" title="<%= commerceItem.itemName %>" href="<%= commerceItem.itemURL %>"><%=$cutstr(commerceItem.itemName,56)  %></a>\
                                                </p>\
                                            </div>\
                                            <div class="mini-pCol-row">\
                                                <span class="yuan"><b>¥<%= $toFixed(commerceItem.salePrice) %></b></span>\
                                                <span  class="quantity"><%= commerceItem.quantity %></span>\
                                                <span isClick="" mcart-count mcart-count-min="1"\
                                                      mcart-count-change-interval="100"\
                                                      mcart-change-count\
                                                      data-cid="<%= commerceItem.itemId %>"\
                                                      data-limit="<%= commerceItem.limitNum %>"class="mcart-count">\
                                                                                <a href="javascript:;" type="down" mcart-count-sub class="mcart-count-btn mcart-count-sub  <% if(commerceItem.quantity ==1) {%>mcart-count-disabled<% } %> ">-</a>\
                                                                                <a href="javascript:;" type="up" mcart-count-add class=" <% if(commerceItem.quantity >= commerceItem.limitNum  ) {%>mcart-count-disabled<% } %>  mcart-count-btn mcart-count-add  ">+</a>\
                                                                                <div class="mcart-count-input"><input  maxlength="3" name="num" type="text" value="<%= commerceItem.quantity %>">\
                                                                                </div>\
                                                                        </span>\
                                                <a class="nLowLeight miniDel" href="javascript:void(0)" title="删除" data-itemid="<%= commerceItem.itemId %>">删除</a>\
                                            </div>\
                                        </div>\
                                        <% var incrementServiceItems = commerceItem.incrementServiceItems || [], commerceItemVOs = commerceItem.commerceItemVOs || [];%>\
                                        <% if(incrementServiceItems.length > 0 || commerceItemVOs.length > 0) {%>\
                                        <div class="mini-pCol-promotion fl">\
                                            <%for(var k=0;k<incrementServiceItems.length;k++) {%>\
                                                <% if(incrementServiceItems[k].selected === true) {%>\
                                                    <% var dName = (incrementServiceItems[k].warrantyType === "SPECIAL" ? "特惠" : "") + $toDisplayName(incrementServiceItems[k]) + "  " + incrementServiceItems[k].numOfYear + "年  ¥" + $toFixed(incrementServiceItems[k].price) %>\
                                                        <p class="nLowLeight cou-gift" title="<%=dName %>">[<em><%=$toServiceType(incrementServiceItems[k]) %></em>]&nbsp;&nbsp;<%=dName %></p>\
                                                     <% } %>\
                                                <% } %>\
                                            <% for(var h=0;h<commerceItemVOs.length;h++) {%>\
                                             <% var itemName = commerceItemVOs[h].itemName || ""; %>\
                                                <p class="nLowLeight cou-gift" title="<%=itemName %>">[<em>赠品</em>]&nbsp;&nbsp;<%=$cutstr(itemName,24)  %> </p>\
                                            <% } %>\
                                        </div>\
                                        <% } %>\
                                    </dd>\
                                    <% } %>\
                                    <%}%>\
                                </dl>\
                            </li>\
                            <% } %>\
                        </ul>\
                        <div id="atg_store_csFooter1" class="cartfooter">\
                            <h4>\
                                已选 <i><span id="csQuantity"><%= cartProfile.itemCount || 0 %></span></i> \
                                件 ，共计： <strong><span id="csSubtotal">¥</span><%= $toFixed(cartProfile.totalAmount) %></strong>\
                            </h4>\
                            <% if(isUpCart) {%>\
                            <a  data-code="cart01002" id="csCheckout" style="text-decoration:none;" class="gocart" href="//cart' + cookieDomain + '/" title="去购物车">\
            <span>\
                                        去购物车\
                                    </span>\
        </a>\
        <% } else {%>\
        <a  data-code="cart01001" id="csCheckout" style="text-decoration:none;" class="gocart" href="//cart' + cookieDomain + '/" title="去购物车">\
            <span>\
                                        去购物车\
                                    </span>\
        </a>\
        <% } %>\
    </div>\
</div>';
    var emptyCart = '<div carttype="asidecart"  id="csEmptyMessage" class="noshop">\
                        <% if(isUpCart) {%>\
                            <a data-code="cart01002" href="//cart' + cookieDomain + '/" title="去购物车" style="text-decoration:underline;">购物车</a>\
                        <% } else {%>\
                            <a data-code="cart01001" href="//cart' + cookieDomain + '/" title="去购物车" style="text-decoration:underline;">购物车</a>\
                        <% } %>\
                        中还没有商品，赶紧选购吧！</div>';

    //Preview api
    var URL = {
        loadCart: "//cart" + cookieDomain + "/home/api/cart/loadMiniCart"
        , delCartItem: "//cart" + cookieDomain + "/home/api/cart/removeItem"
        , changeNum: "//cart" + cookieDomain + "/home/api/cart/changeNum"
    };
    var AJAX_INTERVAl = 10 * 1000;
    //Preview function
    var mCart = {
        renderCart: renderCart
        , reqMiniCart: reqMiniCart
        , isFail: isFail
        , cartEvents: cartEvents
        , isEmptyCart: isEmptyCart
        , renderEmptyCart: renderEmptyCart
        , minloadCart: minloadCart
        , doActionCart: doActionCart
        , reqChangeNum: reqChangeNum
        , qtyUpdate: qtyUpdate
        , tplHelp: tplHelp
        , twoScroll: twoScroll
        , STATE: {
            scroll: 0,
            scroll2: 0
        }
        , twoCartH: twoCartH
        , firstLoadTime: 0
        , loadMinCartByLazy: loadMinCartByLazy
        , hoverMinCart: hoverMinCart

    };

    function twoCartH(div) {
        var CARTHEIGHT = {
            upCart: 0,
            asideCart: 0
        };
        if (div.attr("carttype") !== "up") {
            CARTHEIGHT.asideCart = $("#gome-bar-cart").height() - 154;
            $(".gminicart .mini-nProductLists").css({
                'overflow-y': 'auto', 'height': CARTHEIGHT.asideCart, 'overflow-x': 'hidden'
            });
        } else {
            return;
            //CARTHEIGHT.upCart = $("#miniShoppingcartLoadId").height()-100;
            /*$("#miniShoppingcartLoadId .mini-nProductLists").css({
             'overflow-y':'auto','height':310,'overflow-x':'hidden'
             });*/
        }

    };
    function reqMiniCart() {
        return $.ajax({
            dataType: "jsonp",
            type: "get",
            url: URL.loadCart
        })
    };
    function tplHelp() {
        template.helper('$cutstr', function (str, len) {
            var str_length = 0;
            var str_len = 0;
            str_cut = new String();
            str_len = str.length;
            for (var i = 0; i < str_len; i++) {
                a = str.charAt(i);
                str_length++;
                if (escape(a).length > 4) {
                    //中文字符的长度经编码之后大于4
                    str_length++;
                }
                str_cut = str_cut.concat(a);
                if (str_length >= len) {
                    str_cut = str_cut.concat("...");
                    return str_cut;
                }
            }
            //如果给定字符串小于指定长度，则返回源字符串；
            if (str_length < len) {
                return str;
            }
        });
        template.helper('$toFixed', function (arg) {
            return parseFloat(arg || 0).toFixed(2);
        });
        /**
         * 屏碎保、意外保主
         */
        template.helper('$toServiceType', function (item) {
            var strs = {
                '0': '延保'
                , '1': '屏碎保'
                , '2': '意外保'
            };
            if (!item || !item.serviceType) {
                return '';
            }
            return strs[item.serviceType] || '';
        });
        /**
         * 屏碎保、意外保主
         */
        template.helper('$toDisplayName', function (item) {
            var strs = {
                '0': '延长保修'
                , '1': '屏碎保'
                , '2': '意外保'
            };
            if (!item || !item.serviceType) {
                return '';
            }
            return strs[item.serviceType] || '';
        });
    };
    function doActionCart(div) {
        return function (data) {
            if (isFail(data))return;
            //小购物车
            data.isUpCart = div.attr("carttype") == "up";
            if (data.data)data.data.isUpCart = data.isUpCart;
            tplHelp();//template use function no other way
            if (isEmptyCart(data)) {
                window.mCart.getCartNumber(true);
                renderEmptyCart(div, data);
                return;
            }
            renderCart(div, data);
            twoScroll();
            twoCartH(div);
            $("#miniShoppingcartLoadId .mini-nProductLists").scrollTop(mCart.STATE.scroll);
            $(".gminicart .mini-nProductLists").scrollTop(mCart.STATE.scroll2);
            cartEvents(div, data);
            window.mCart.getCartNumber(true);
        }
    };
    function renderCart(div, data) {
        var render = template.compile(cartList);//function anonymous
        //IE6FIX();
        return div.html(render(data.data));
    };
    //IE6 hover 不支持处理
    /* function IE6FIX(){
     var isIE=!!window.ActiveXObject;
     var isIE6=isIE&&!window.XMLHttpRequest;
     if(isIE && isIE6){
     $("#miniShoppingcartLoadId .min-sideline-list .mcart-count").show();
     }else{
     return;
     }
     };*/
    function isFail(data) {//1
        return data.errCode !== "0";
    };
    function reqChangeNum(that, inputVal) {
        var value = that.next().find("input").val();
        var cid = that.parent("span").data('cid');
        return $.ajax({
            type: "get",
            dataType: "jsonp",
            data: {
                cid: cid
                , pcount: inputVal
            },
            url: URL.changeNum
        });
    };
    //only request
    function reqChangeNum2(param) {
        return $.ajax({
            type: "get",
            dataType: "jsonp",
            data: {
                cid: param.cid,
                pcount: param.pcount
            },
            url: URL.changeNum
        });
    }

    function qtyUpdate(that, type, div, data) {
        var newValue = that.parent().find("input").val();
        var inputVal = newValue;
        var mcartLimitNum = that.parent().data("limit");
        //off event
        if (that.hasClass("mcart-count-disabled")) {
            that.off("click");
        }
        if (type == "up") {
            if (that.parent().attr("isClick") == "") {
                that.parent().attr("isClick", "yet");
                inputVal++;
                if (inputVal > mcartLimitNum) {
                    that.parent().attr("isClick", "");
                    return;
                }
                reqChangeNum(that, inputVal).then(function () {
                    reqMiniCart().then(doActionCart(div));
                });
            }

        } else if (type == "down") {
            if (that.parent().attr("isClick") == "") {
                that.parent().attr("isClick", "yet");
                if (inputVal > 1) {
                    inputVal--;
                } else {
                    that.parent().attr("isClick", "");
                    return;
                }
                reqChangeNum(that, inputVal).then(function () {
                    reqMiniCart().then(doActionCart(div));
                });
            }
        }
        that.next(".mcart-count-input").children("input").val(inputVal);
        that.parent().prev(".quantity").html(inputVal);
    };
    //scroll event
    function twoScroll() {
        $("#miniShoppingcartLoadId .mini-nProductLists").scroll(function () {
            mCart.STATE.scroll = $(this).scrollTop();
        });
        $(".gminicart .mini-nProductLists").scroll(function () {
            mCart.STATE.scroll2 = $(this).scrollTop();
        });
    };
    function cartEvents(div, data) {

        //delete good
        div.find(".miniDel").off("click").on("click", function () {
            var itemid = $(this).attr("data-itemid");
            $.ajax({
                dataType: "jsonp",
                type: "get",
                url: URL.delCartItem,
                data: {
                    cid: itemid
                }
            }).then(function () {
                reqMiniCart().then(doActionCart(div));
            });

        });
        //focus
        div.find(".mcart-count-input input").each(function () {
            var that = $(this);
            var oldV = $(this).parent().parent().prev(".quantity").html();
            $(this).on("input keyup ", function (event) {
                this.value = this.value.replace(/\D/g, '');
                var mcartLimitNum = that.parent().parent().data("limit");
                if (event.keyCode == "13" || event.keyCode == "108") {
                    var newV = this.value;
                    if (newV > mcartLimitNum) {
                        newV = oldV;
                    }
                    if (newV < 1) {
                        newV == 1;
                    }
                    $(this).parent().parent().prev(".quantity").html(newV);
                    //request
                    var param = {
                        cid: $(this).parent().parent().data("cid")
                        , pcount: this.value

                    };
                    reqChangeNum2(param).then(function () {
                        reqMiniCart().then(doActionCart(div));
                    });
                }
            }).on("focus", function () {
                this.value == oldV;
            }).on("blur", function () {
                if (oldV == this.value) {
                    return;
                }
                $(this).parent().parent().prev(".quantity").html(this.value);
                //request
                var param = {
                    cid: $(this).parent().parent().data("cid")
                    , pcount: this.value

                };
                reqChangeNum2(param).then(function () {
                    reqMiniCart().then(doActionCart(div));
                });
            });
        });

        div.find("[mcart-count-add]").each(function () {
            var that = $(this);
            var type = $(this).attr("type");
            $(this).on("click", function () {
                qtyUpdate(that, type, div, data);
            });
        });
        div.find("[mcart-count-sub]").each(function () {
            var that = $(this);
            var type = $(this).attr("type");
            $(this).on("click", function () {
                qtyUpdate(that, type, div, data);
            });
        });


    };
    function isEmptyCart(data) {
        //var cig = data.data.commerceItemsGroups || [];
        if (data.data.cartProfile == null || data.data.commerceItemsGroups.length === 0) {
            return true;
        }
        ;
    };
    function renderEmptyCart(div, data) {
        var render = template.compile(emptyCart);
        var dom = render(data);
        return div.html(dom);
    };
    function minloadCart(div) {//common cart
        div = div || $("#miniShoppingcartLoadId");
        div.attr("carttype", "up");
        reqMiniCart().then(doActionCart(div));
    };

    /**
     * ajax 请求懒加载
     * 在interval时间内 只加载第一次，后续加载都忽略
     * @param interval
     * @param fn 懒加载最终执行
     */
    function loadMinCartByLazy(interval, fn) {
        var newTime = new Date().getTime()
            , functor = function () {
            fn();
            mCart.firstLoadTime = newTime;
        };

        if (!interval) {
            fn();
        }
        //if this is the first
        if (mCart.firstLoadTime == 0) {
            functor();
        } else if ((mCart.firstLoadTime + interval) <= newTime) {
            functor();
        }
    }

    /**
     * 购物车hover
     */
    function hoverMinCart() {
        var timer;
        //cartHover
        $('.shopcartbox').hover(function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                $('.shopcartbox').addClass("hover");
            }, 150);
        }, function () {
            clearTimeout(timer);
            $(this).removeClass("hover");
        });

        // 新购物车地址
        $('.cartlink, .ucCart')
            .unbind()
            .hover(function () {
                mCart.loadMinCartByLazy(AJAX_INTERVAl, mCart.minloadCart);
            })
            .attr('href', '//cart' + cookieDomain + '/');
    }

    /**
     * 外部暴露接口
     */
    ;
    (function api() {
        $.fn.extend({
            "gminicart": function () {
                var div = $(this).addClass("gminicart");
                div.attr("carttype", "right");
                mCart.reqMiniCart().then(doActionCart(div));
            }
        });
        exports.cartUnit = {
            minloadCart: mCart.minloadCart
        };
    })();
    /**
     * DOM 加载完毕后执行init
     */
    $(function init() {
        //loadCart
        mCart.hoverMinCart();
    });
}(window));