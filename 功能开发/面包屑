var skuId, catId = "cat10000070";
if (window.prdInfo) {
    skuId = window.prdInfo.sku;
} else if (window.sku) {
    skuId = window.sku;
};
(function ($) {
    $.fn.extend({
      breadcrumb: function () {
          var productTmpl, flag = true;
          //模板
          productTmpl = {
              productLists: '\
                {{if lst && lst.length > 0}}\
                    <div class="andBuy-bread">\
                        <div class="andBuy-control">\
                            <a data-btn="tlRight" href="javascript:;"><b></b></a>\
                            <a data-btn="tlLeft" href="javascript:;"><s></s></a>\
                        </div>\
                        <div class="andBuy-wrapper">\
                            <ul>\
                            {{each lst as product index}}\
                                <li>\
                                    <a track="7:{{product.pid}}" maima_param="{{product.maima_param}}" href="{{product.purl}}" target="_blank" title="{{product.pn}}" class="product-imgs">\
                                        <img gome-src="{{product.iurl}}" alt="{{product.pn}}">\
                                    </a>\
                                    <div class="product-info">\
                                        <a track="7:{{product.pid}}" maima_param="{{product.maima_param}}" href="{{product.purl}}" title="{{product.pn}}" target="_blank">{{product.pn}}</a>\
                                        <span>¥{{product.price}}</span>\
                                    </div>\
                                </li>\
                            {{/each}}\
                            </ul>\
                        </div>\
                    </div>\
                    {{/if}}'
          };
          /**
           *  在推送数据中获取3个商品
           *  如果推送数据中有和详情页商品重复的过滤掉重复商品
           *  否则取前3个商品
           */
          function getAllProductLists() {
              //http://bigd.gome.com.cn/gome/rec?callback=rec&pid=9130692178&boxid=box87&area=11010200&cid=1441764828439535&uid=&brid=10000012&shopid=&c1id=cat10000005&c3id=cat10000197&sid=1000394885&imagesize=160&callbackparam=jsonpname_reskim&_=1495175199236
              $.ajax({
                  url: '//bigd'+gomeplusDomain+'/gome/rec',
                  dataType:'jsonp',
                  type:'get',
                  data: {
                      "pid": prdInfo.prdId,
                      "size": 3,
                      "boxid": 'box87',
                      "area": g.cityCode(),
                      "cid": $.cookie('__clickidc'),
                      "uid": loginData.loginId,
                      "brid": prdInfo.brandID,
                      "shopid": prdInfo.shopNo,
                      "c1id":  prdInfo.firstCategoryId,
                      "c3id":  prdInfo.thirdCategoryId,
                      "sid": prdInfo.sku,
                      "imagesize": 70,
                      "callbackparam": 'breadHotGoods'
                      // "pid": '9130692178',
                      // "size": 3,
                      // "boxid": 'box87',
                      // "area": '11010200',
                      // "cid": '1441764828439535',
                      // "uid": loginData.loginId,
                      // "brid": '10000012',
                      // "shopid": prdInfo.shopNo,
                      // "c1id":  'cat10000005',
                      // "c3id":  'cat10000197',
                      // "sid": '1000394885',
                      // "imagesize": 70,
                      // "callbackparam": 'breadHotGoods'
                  },
                  callback:'breadHotGoods'
              }).done(function (data) {
                  if(!(data.lst || data.lst.length > 0)) {
                      $(".details-breadcrumbs-dropdown .product-lists").hide();
                      return;
                  }
                  $(".details-breadcrumbs-dropdown .product-lists").attr("maima_param",data.maima_param).html(templateSimple.compile(productTmpl.productLists)(data));
                  var tlscroll = 3;
                  for(var i=0,k=tlscroll;i<k;i++){
                      $('.andBuy-wrapper').find('li').eq(i).loadsrc('gome-src');
                  }
                  if (data.size > tlscroll) {
                      $(".andBuy-wrapper").gSlider({
                          isAuto: false,
                          isImgLoad: false,
                          dataOriginal: "gome-src",
                          showNum: tlscroll,
                          stepLen: tlscroll,
                          time: 3000,
                          btnGo: {left: '[data-btn="tlLeft"]', right: '[data-btn="tlRight"]'},
                          callback:function(){
                              $('.andBuy-wrapper').loadsrc('gome-src');
                          }
                      });
                  }
              })
          }
          //面包屑导航鼠标悬浮事件
          $('.breadcrumb').hover(function(){
              $(".details-breadcrumbs-dropdown").show();
              var href = $(".breadcrumbs-container .left li").eq(3).find('a').attr('href');
              $(".more-breads").attr('href', href);
              if(flag == true) {
                  getAllProductLists();
                  flag = false;
              }
              return false;
          }, function(){
              $(".details-breadcrumbs-dropdown").hide();
          });

          //联营店铺鼠标悬浮事件
          $(".ly-stores").hover(function () {
              $(".pop-stores-others").show();
          }, function () {
              $(".pop-stores-others").hide();
          });
          $(".company-wrapper p img").loadsrc('gome-src');
      }
    })
})(jQuery);

$(document).ready(function () {
    $(".breadcrumbs-container").breadcrumb();
});
