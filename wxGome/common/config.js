/**
 * Created by CAOYI on 2017/3/22.
 */
    // const HOME = 'http://10.144.36.114/home';
let app        = getApp();
const HOME     = app.ourHostCart + '/wxmp';

const config   = {
    debug        : true,
    url          : {
        getLoadCart      : HOME + '/api/cart/loadCart',
        modifyProductNum : HOME + '/api/cart/changeNum',
        checkedProduct   : HOME + '/api/cart/selectItem',
        unCheckedProduct : HOME + '/api/cart/cancelItem',
        checkedCart      : HOME + '/api/cart/selectItemsByShopNo',
        unCheckedCart    : HOME + '/api/cart/cancelItemsByShopNo',
        checkedAllCarts  : HOME + '/api/cart/selectAllItem',//全部选中商品
        unCheckedAllCarts: HOME + '/api/cart/cancelAllItem',//取消全部选中商品
        submitCarts      : HOME + '/api/checkout/checkout',//购物车去结算
        deleteProduct    : HOME + '/api/cart/removeItem',//删除单个商品
        getMeiDian       : HOME + '/api/shop/getGomePlusShops',//美店信息查询
        pickerOnGroupHead: HOME + '/api/promotion/claimShopPromotion',//头选择优惠
    },
    labels       : {
        "MJ"       : "满减",
        "ZDZ"      : "整单折",
        "MZ"       : "满折",
        "MF"       : "满返",
        "JJHG"     : "加价换购",
        "SSG"      : "线下送礼品促销",
        "SSD"      : "线下送美豆",
        "TZ"       : "套装",
        "POP_MZE"  : "满赠",
        "POP_MJ"   : "满减",
        "POP_MF"   : "满返",
        "POP_MZH"  : "多买优惠",
        "POP_GWQ"  : "购物券",
        "KDP_MJ"   : "跨店铺满减",
        "KDP_MM"   : "跨店铺满免",
        "POP_I_MZH": "单品满折",
        "DPG"      : "搭配购",
        "NO"       : "不使用优惠",// 不使用促销

        //价格类型
        "MEMBER"           : "会员价",
        "INTERNAL_PURCHASE": "内购价",
        "PALM"             : "掌上专享"
    },
    labelsCss    : {
        "MEMBER"           : "title-hui",//会员价
        "INTERNAL_PURCHASE": "title-nei",//内购价
        "PALM"             : "title-phone"//掌声专享价
    },
    serviceType  : {
        '0': {title: '延保', label: '延长保修'},
        '1': {title: '屏碎保', label: '屏碎保'},
        '2': {title: '意外保', label: '意外保'},
    },
    //true不可选 false可选
    productStatus: {
        'default'               : {type: 'IN_STORE', label: '', cssClass: 'product-type--default', notCheck: false},
        'IN_STORE'              : {type: 'IN_STORE', label: '有货', cssClass: 'product-type--default', notCheck: false},
        'OFF'                   : {type: 'OFF', label: '已下架', cssClass: 'product-type--off', notCheck: true},
        'onTheRoad'             : {type: 'onTheRoad', label: '在途', cssClass: 'product-type--road', notCheck: false},
        'NO_GOODS'              : {type: 'NO_GOODS', label: '无货', cssClass: 'product-type--no', notCheck: false},
        'INVENTORY_TENSION'     : {type: 'INVENTORY_TENSION', label: '库存紧张', cssClass: 'product-type--tension', notCheck: false},
        'YY'                    : {type: 'YY', label: '预约中',cssClass: 'product-type--yy', notCheck: true, footerLabel: '此商品正在预约中，预约后才可购买！'},
        'YYWYY'                 : {type: 'YYWYY', label: '预约中',cssClass: 'product-type--yywyy', notCheck: true, footerLabel: '此商品正在预约中，预约后才可购买！'},
        'QGQ'                   : {type: 'QGQ', label: '预约待开抢', cssClass: 'product-type--qgq', notCheck: true, footerLabel: ''},//预约结束，抢购未开始--已预约
        'QGQWYY'                : {type: 'QGQWYY', label: '预约待开抢', cssClass: 'product-type--qgqwyy', notCheck: true, footerLabel: '您未预约此商品，暂不可购买！'},//预约结束，抢购未开始--未预约
        'QG'                    : {type: 'QG', label: '预约抢购中', cssClass: 'product-type--qg', notCheck: false, footerLabel: '您预约的商品正在抢购中，请尽快购买！'},//抢购已预约可购买
        'QGWYY'                 : {type: 'QGWYY', label: '预约抢购中', cssClass: 'product-type--qgwyy', notCheck: true, footerLabel: '您未预约此商品，暂不可购买！'},//抢购未预约
        'QGCF'                  : {type: 'QGCF', label: '', cssClass: 'product-type--qgcf', notCheck: true, footerLabel: '您已参加预约活动，不能重复购买！'},//重复购买
        'presell'               : {type: 'presell', label: '预售中', cssClass: 'product-type--presell', notCheck: true},//预售中
        'DELIVERY_NOT_SUPPORTED': {type: 'DELIVERY_NOT_SUPPORTED', label: '该区域暂不支持配送', cssClass: 'product-type--notSupported'},
    },
    // * 套装商品状态，正常：NORMAL,无货：OUT_STOCK,下架：OFF_SHELVES
    groupStatus  : {
        'default'    : {type: 'NORMAL', label: '', cssClass: '', notCheck: false},
        'NORMAL'     : {type: 'NORMAL', label: '', cssClass: '', notCheck: false},
        'OUT_STOCK'  : {type: 'OUT_STOCK', label: '无货', cssClass: 'box-type-no', notCheck: false},
        'OFF_SHELVES': {type: 'OFF_SHELVES', label: '下架', cssClass: 'box-type-off', notCheck: true},
    },
    errMessage   : {
        '0010360040': '部分商品正在预约中，暂不可购买',
        '0010360050': '部分商品正在预约中，暂不可购买'
    }
};
module.exports = config;