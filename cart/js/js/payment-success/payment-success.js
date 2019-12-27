;(function ($, tpl, u) {
    function split(a) {
        return function (b) {
            return b.split(a);
        }
    };
    function respInfofn() {
        var getArg      = window.location.href;
        var querystring = u.pipe(split("?"), u.last, split("&"), u.map(split("=")), u.fromPairs);
        var q2          = querystring(getArg);
        return q2.rspInfo;
    };

    function _swindle() {
        panel.biz001();
    }

    function load() {
        request
            .reqp('//success' + cookieDomain + '/order/loadPSInfo', {rspInfo: respInfofn()})
            .then(function (data) {
                //data.data.paymentType ="deposit";
                //success true时
                var tplmap = {
                    payment_fail     : tpl.payment_fail
                    , payment_default: tpl.payment_default
                    , payment_coupon : tpl.payment_coupon
                    , payment_balance: tpl.payment_balance
                    , payment_deposit: tpl.payment_deposit
                };
                //success false
                if (data.success == false) {
                    _swindle();
                    $("#payment-success").html("").html(tplmap.payment_fail(null));
                    return;
                } else {
                    if (data.data.paymentType == "default" && data.data && data.data.otherInfo.actURL) {
                    } else {
                        _swindle();
                    }
                    var name = "payment_" + data.data.paymentType;
                    $("#payment-success").html("").html(tplmap[name](data));
                }
                //其他逻辑
            })
            .fail(function () {
                //跳转到失败页
                _swindle();
                $("#payment-success").html("").html(tplmap.payment_fail(null));
            });
    }

    !(function init() {
        load();
    })();

//loadPSInfo 
}($, GTPL, util));
