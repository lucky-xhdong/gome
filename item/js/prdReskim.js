(function ($) {
    $.fn.extend({
        reskim: function () {
            var productTmpl, $this = $(this);
            productTmpl = {
                lists: '\
                    {{if lst.length > 0}}\
                    <h2>看了又看</h2>\
                    <div class="reskim-carousel" id="reskim-carousel">\
                        <ul>\
                            {{each lst as list index}}\
                            <li>\
                                <a href="{{list.purl}}" target="_blank" title="" class="product-imgs">\
                                    <img width="160" height="160" gome-src="{{list.iurl}}" alt="{{list.pn}}">\
                                </a>\
                                 <p><span>¥{{list.price}}</span></p>\
                            </li>\
                            {{/each}}\
                        </ul>\
                    </div>\
                    {{/if}}\
                    '
            };
            $.ajax({
                url: '//bigd.gome.com.cn/gome/rec',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    // "pid": prdInfo.prdId,
                    // "size": 9,
                    // "boxid": 'box74',
                    // "area": g.cityCode(),
                    // "cid": $.cookie('__clickidc'),
                    // "uid": loginData.loginId ? loginData.loginId : '',
                    // "brid": prdInfo.brandID ? prdInfo.brandID : '',
                    // "shopid": prdInfo.shopNo ? prdInfo.shopNo : '',
                    // "c1id": prdInfo.firstCategoryId ? prdInfo.firstCategoryId : '',
                    // "c3id": prdInfo.thirdCategoryId ? prdInfo.thirdCategoryId : '',
                    // "sid": prdInfo.skuNo,
                    // "imagesize": 160,
                    // "callbackparam": 'jsonpname_reskim'
                    "pid": 9134561595,
                    "size": 9,
                    "boxid": 'box74',
                    "area": 11010200,
                    "cid": 1441764828439535,
                    "uid": 71426392300,
                    "brid": 10000084,
                    "shopid": '',
                    "c1id": 'cat31665542',
                    "c3id": 'cat10000070',
                    "sid": 1123502465,
                    "imagesize": 160,
                    "callbackparam": "jsonpname_reskim"
                },
                jsonpName: 'jsonpname_reskim'
            }).done(function(data){
                if(!(data.lst || data.lst.length > 0)) {
                    return;
                }
                $this.html(templateSimple.compile(productTmpl.lists)(data));
                $this.loadsrc('gome-src');
                new Carousel('#reskim-carousel',
                    {
                        elementNum: 3,
                        margin: 10,
                        direction: 'top',
                        pager: true
                    }
                );
            })
        }
    });
})(jQuery);
$(document).ready(function () {
    $(".bigdata-reskim").reskim();
});
