var oc_page = {
    "init"         : function () {
        this.getOrderInfo()
    },
    "pageData"     : {
        "paymentInfos": {//订单支付方式
            "VIRTUAL_ACCOUNT"       : {"title": "订单支付成功，我们将尽快为您发货！", "type": "美通卡支付"},
            "CASH_ON_DELIVERY"      : {"title": "订单提交成功，我们将尽快为您发货！", "type": "货到付款"},
            "PHYSICAL_STORE_PAYMENT": {"title": "订单提交成功，请尽快支付！", "type": "门店付款"},
            "POST_OFFICE_PAYMENT"   : {"title": "订单提交成功，请尽快支付！", "type": "邮局汇款"},
            "COUNTER_TRANSFER"      : {"title": "订单提交成功，请尽快支付！", "type": "银行柜台转账"},
            "ACCOUNT_PERIOD"        : {"title": "订单提交成功，我们将尽快为您发货！", "type": "账期支付"},
            "PREPAID_CARD"          : {"title": "订单支付成功，我们将尽快为您发货！", "type": "美通卡支付"}
        },
        "coupons"     : {//订单优惠种类
            "REDCOUPON"     : "红券",
            "BLUECOUPON"    : "蓝券",
            "SHOPCOUPON"    : "店铺券",
            "PLATFORMCOUPON": "店铺平台券",
            "POINT"         : "消费积分"
        },
        "express"     : {//订单商品配送方式
            "GOMEEXPRESS"  : "国美配送",
            "GOMEPICKINGUP": "门店自提",
            "NORMALEXPRESS": "普通快递",
            "EMSEXPRESS"   : "EMS快递"
        }
    },
    "trackData"    : {},
    "getOrderInfo" : function () {
        var _this      = this;
        var renderData = {}
        var orederId   = window.location.href.split('o=')[1].split("&")[0];
        request.reqp("//success" + cookieDomain + "/order/paymentInfo", {
            "orderIdsStr"    : orederId,
            "userId"         : $.cookie("DYN_USER_ID") ? $.cookie("DYN_USER_ID") : "",
            "isCommittedPage": true
        }).then(function (data) {
            renderData = $.extend(true, {}, data.data, oc_page.pageData)
            _this.renderOrderInfo(renderData);
            util_watch.emit($page.name, "renderEnd", data.data);
            if (data.data.otherInfo && data.data.otherInfo.supportEInstall == "true") {
                $(".oc_electricApplianceService").show();
            } else {
                $(".oc_electricApplianceService").hide();
            }
        });
        //renderData = $.extend(true,{},orderSuccessData.data,oc_page.pageData);
        //_this.renderOrderInfo(renderData);
    },
    renderOrderInfo: function (renderData) {
        var _this            = this;
        var oc_orderInfoHTML = "";
        switch (renderData.pme) {
            case "VIRTUAL_ACCOUNT" : 	 //0：余额支付
                //美通卡支付
                if (renderData.pName) {
                    renderData.paymentInfos.VIRTUAL_ACCOUNT.type
                        = ((renderData.pName == '余额') ? "美通卡" : renderData.pName) + '支付'
                }
                oc_orderInfoHTML = GTPL.pay_onLine(renderData);
                break;
            case "CASH_ON_DELIVERY" : 	//货到付款
                oc_orderInfoHTML = GTPL.pay_onLine(renderData);
                break;
            case "ACCOUNT_PERIOD" : 	//账期支付
                // oc_orderInfoHTML = GTPL.orderType(renderData);
                break;
            case "PHYSICAL_STORE_PAYMENT" : 	//门店付款
                oc_orderInfoHTML = GTPL.pay_inStore(renderData);
                break;
            case "POST_OFFICE_PAYMENT" : 	//邮局汇款
                oc_orderInfoHTML = GTPL.pay_inPostOffice(renderData);
                break;
            case "COUNTER_TRANSFER" : 	//银行柜台转账
                oc_orderInfoHTML = GTPL.pay_inBank(renderData);
                break;
            case "PREPAID_CARD":
                //美通卡支付
                if (renderData.pName) {
                    renderData.paymentInfos.VIRTUAL_ACCOUNT.type
                        = "美通卡支付"
                }
                oc_orderInfoHTML = GTPL.pay_onLine(renderData);
                break;
            default:
                break;
        }
        $("#oc_orderType").html(GTPL.orderType(renderData));	//订单类型
        $("#oc_orderInfo").html(oc_orderInfoHTML);				//对应的类型下具体信息
        //$("#oc_rebateInfos").html(GTPL.rebateInfos(renderData));	//订单赠送优惠券信息
    }

}

$(function () {
    oc_page.init();
    panel.biz001();
    $("#gotoOrderDetail").bind("click", function () {
        var orederId         = window.location.href.split('o=')[1];
        window.location.href = "//myhome" + cookieDomain + "/member/shippingGroupDetailInfo/" + orederId + "/null"
    })
});


