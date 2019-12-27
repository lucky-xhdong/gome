!(function (exports, $) {
    /*
     设置和加载所有详情页面的变量和JS
     */
    var the_Version = 20160712;

    var allStores = {};//新商品接口
    var userStores = {};//用户相关接口
    var allStore = {};//暴露出去的变量
    /*var storedef;

     var itemName = prdInfo.prdName;
     var catName = prdInfo.thirdCategoryName;
     var catId = prdInfo.catId;
     var totalPrice = prdInfo.price;
     var num = prdInfo.stats == 2 ? "0" : "399";
     var originPrice = prdInfo.gomePrice;
     var properties = {};
     properties.br = prdInfo.breadName;
     var prodid = prdInfo.prdId;
     var endDate = prdInfo.stats == 1 ? 1 : 0;
     var price = prdInfo.price;*/
    try {
        (function () {

            var arr_atgregion = (function () {
                var arr = ($.cookie('atgregion') || "11010200|北京市朝阳区朝外街道|11010000|11000000|110102002").split('|');
                return [arr[1], arr[3], arr[2], arr[0], (arr[4] == undefined ? arr[0] + '1' : arr[4])];
            })();
            if (!$.cookie('atgregion') || ($.cookie('atgregion') && !$.cookie('atgregion').split("|")[4]))
                $.cookie('atgregion', "11010200|北京市朝阳区朝外街道|11010000|11000000|110102002", {
                    expires: 30,
                    path: '/',
                    domain: cookieDomain
                });

            document.getElementById('stockaddress').innerHTML = arr_atgregion[0].replace("北京北京", "北京");
            storedef = $.when(
                $.ajax({
                    type: 'get', /*ceshi 869473036  $.cookie('SSO_USER_ID')*/
                    url: '//ss' + cookieDomain + '/item/v1/d/m/store/unite/' + prdInfo.prdId + '/' + prdInfo.sku + '/N/' + arr_atgregion[3] + '/' + arr_atgregion[4] + '/1/'  + $.cookie('SSO_USER_ID') + '/flag/item/allStores',
                    dataType: 'jsonp',
                    jsonpName: "allStores"

                }).done(function (datas) {
                    if (datas.success && !$.isEmptyObject(datas.result)) {
                        allStores = datas.result;
                        if (allStores.stock && allStores.stock.amount) {
                            window.cartMax = allStores.stock.amount;
                        } else {
                            window.cartMax = 1;
                        }

                    }
                }),
                $.ajax({
                    type: 'get',
                    url: '//ss' + cookieDomain + '/item/v1/d/reserve/p/detail/' + prdInfo.prdId + '/' + prdInfo.sku + '/' + $.cookie('SSO_USER_ID') + '/' + arr_atgregion[2] + '/flag/item/userStores',
                    dataType: 'jsonp',
                    jsonpName: "userStores"
                }).done(function (datas) {
                    if (datas.success && !$.isEmptyObject(datas.result)) {
                        userStores.userStores = datas.result;
                        if(userStores.userStores && userStores.userStores.phase && userStores.userStores.phase == '3'){
                            // Phase=3为预约结束，抢购未开始1：已预约，2：已约满， 3：未预约，4：用户未登录（建议立即抢购） 这段时间和 预约阶段可以理解为相同状态
                            userStores.userStores.phase = '1';
                            userStores.userStores.phasesatue="1"; //未登录预约结束，抢购未开始展示立即抢购
                        }

                    }
                })).then(function () {
                prdInfo.prdType = allStores.status;

                //合并两个请求的返回对象
                $.extend(allStores, userStores);
                //飞天的那个东西，购买数默认1,allStore暴露出去的变量
                exports.allStore = {
                    others:allStores.others,
                    enterQty: 1,
                    userStore: allStores.userStores
                };

                if(prdInfo.sapSkuType=="ECTZ" || prdInfo.sapSkuType=="ZSTK" || prdInfo.sapSkuType=="ZDZK" || prdInfo.sapSkuType=="ZHK" || prdInfo.sapSkuType=="ZLH" || prdInfo.sapSkuType=="ZHYJ" || prdInfo.sapSkuType=="ZJXK" || prdInfo.sapSkuType=="ZJXJ" ){
                    prdInfo.ispecial="1";// 套装  美通卡  电信卡合约机等
                }

                for (var eType in EventManager._eventsList) {   //执行首屏的展示
                    if(!(prdInfo.preferential=="1" && eType=="gome_tq"))// 预售  苹果特惠  团抢控制顺序 （预约  预售 团抢 互斥）
                    EventManager.fireEvent(eType, allStores);
               
                };

                $('#similarDom').gLoad(function () {
                    prdAssort.init();    //搭配购
                });

                


                /**
                 * 节能补贴
                 * 如果是预约抢购商品，预约状态都不执行节能补贴；
                 * 如果是抢购状态，只有"立即抢购"可以参加节能补贴，"未预约"和"已购买"不参加节能补贴
                 */
                if (prdInfo.energyState == "1") {
                    if (!(allStores.userStores && (allStores.userStores.phase == 1 || allStores.userStores.phase == 2))) {
                        var result = "";
                        if (allStores.stock && allStores.stock.status) {
                            result = 'Y'
                        } else {
                            result = 'N'
                        };
                        gmEnergy.init(result);
                    } else {
                        $('#pay_fenQi').css('display', 'none')
                    }
                }

                //在线客服调用
                live800Fn();

                /*对比*/
                $("body").accordion({
                        boxStyle:{"left":"50%","marginLeft":"-390px"},
                        obj:".shareDB",
                        objstyle:"",
                        domain:cookieDomain 
                    })


            });
            $('.jqzoom img,.jqzoom1 img').loadsrc('gome-src');
            $('.pic-small').gLoad(function () {
                $('.pic-small').loadsrc('gome-src');
            });
            $('#store_name').gLoad(function () {
                $('#store_name img').loadsrc('gome-src');
            })
        })();
    } catch (e) {
    }
})(window, $);