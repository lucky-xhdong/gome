(function ($) {
    $.fn.extend({
        praiseGoods: function () {
            var productTmpl, $this = $(this), flag = false;
            productTmpl = {
                lists: '\
                    {{if lst.length > 0}}\
                        <h2>本店好评商品</h2>\
                        <div class="praise-goods-lists" id="praise-goods-lists">\
                            <ul class="waterfallUl">\
                                {{each lst as list index}}\
                                <li class="goods-block" data-productId="{{list.pid}}">\
                                    <div class="picture-wrapper">\
                                        <a href="{{list.purl}}" target="_blank"><img gome-src="{{list.iurl}}" alt="{{list.pn}}"></a>\
                                        <p>¥{{list.price}}</p>\
                                    </div>\
                                    <div class="appraise-wrapper"></div>\
                                </li>\
                                {{/each}}\
                            </ul>\
                        </div>\
                    {{/if}}\
                    ',
                appraises: '\
                    <ul>\
                        {{each appraiseArr as appraise index}}\
                        <li>\
                            <div class="txt-appraise">\
                                <span class="nickname">{{appraise.nikename}}</span>\
                                <span class="content" title="{{appraise.content}}">{{appraise.content}}</span>\
                            </div>\
                        </li>\
                        {{/each}}\
                    </ul>\
                '
            };
            var methods = {
                getAllProducts: function () {
                    $.ajax({
                        url: '//bigd.gome.com.cn/gome/rec',
                        type: 'get',
                        dataType: 'jsonp',
                        data: {
                            "pid": prdInfo.prdId,
                            "size": 12,
                            "boxid": 'box75',
                            "area": g.cityCode(),
                            "cid": $.cookie('__clickidc'),
                            "uid": loginData.loginId ? loginData.loginId : '',
                            "brid": prdInfo.brandID ? prdInfo.brandID : '',
                            "shopid": prdInfo.shopNo ? prdInfo.shopNo : '',
                            "c1id": prdInfo.firstCategoryId ? prdInfo.firstCategoryId : '',
                            "c3id": prdInfo.thirdCategoryId ? prdInfo.thirdCategoryId : '',
                            "sid": prdInfo.sku,
                            "imagesize": 160,
                            "callbackparam": 'jsonpname_praisegoods'
                            // "pid": 'A0005767404',
                            // "size": 12,
                            // "boxid": 'box75',
                            // "area": 11010200,
                            // "cid": 1441764828439535,
                            // "uid": 71426392300,
                            // "brid": 10000220,
                            // "shopid": 80011060,
                            // "c1id": 'cat10000005',
                            // "c3id": 'cat21455953',
                            // "sid": 'pop8008498034',
                            // "imagesize": 160,
                            // "callbackparam": "jsonpname_praisegoods"
                        },
                        jsonpName: 'jsonpname_praisegoods'
                    }).done(function (data) {
                        var pidArr = [];
                        if (!(data.lst || data.lst.length > 0)) {
                            return;
                        }
                        if (data.lst && data.lst.length && data.lst.length > 0) {
                            $this.html(templateSimple.compile(productTmpl.lists)(data));
                        }
                        $this.loadsrc('gome-src');
                        for (var i = 0, len = data.lst.length; i < len; i++) {
                            pidArr.push(data.lst[i].pid);
                        }
                        if (pidArr && pidArr.length > 0) {
                            methods.getAllAppraises(pidArr);
                        }
                    })
                },
                getAllAppraises: function (arr) {
                    var appraiseData = {};
                    //评价测试地址：http://ss.atguat.com.cn/item/v1/prdevajsonp/appraiseNewRecommend/prod24280042,90100000231/flag/appraise/all?callback=all&_=1490066099721
                    if (arr instanceof Array) {
                        $.ajax({
                            url: '//ss' + cookieDomain + '/item/v1/prdevajsonp/appraiseNewRecommend/' + arr + '/flag/appraise/all?callback=all&_=1490066099721',
                            type: 'get',
                            dataType: 'jsonp',
                            jsonp: 'callback',
                            jsonpCallback: 'all'
                        }).done(function (data) {
                            if (!(data || data.length > 0)) {
                                return;
                            }
                            appraiseData.appraiseArr = [];
                            $(".praise-goods-lists li").each(function (index, element) {
                                var productid = $(this).data('productid');
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].productId == productid) {
                                        appraiseData.appraiseArr = data.splice(i, 1)[0].appraise;
                                        break;
                                    }
                                }
                                $(this).find(".appraise-wrapper").html(templateSimple.compile(productTmpl.appraises)(appraiseData));
                            });
                            new Waterfall('#praise-goods-lists',
                                {
                                    elementNum: 4,
                                    margin: 12
                                }
                            );
                        })
                    }
                }
            };
            methods.getAllProducts();
        }
    });
})(jQuery);
$(document).ready(function () {
    if(prdInfo.shopNo && prdInfo.shopNo != "") {
        $(".bd-praise-goods").praiseGoods();
    }
});
