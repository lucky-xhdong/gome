/**
 * Created by CAOYI on 2017/3/23.
 */
const Promise            = require('../../../lib/es6-promise').Promise;
const co                 = require('../../../lib/co/we-index');
const regeneratorRuntime = require("../../../lib/regenerator-runtime/runtime");

const config = require('../../../common/config');
const util   = require("./util");

/**
 * 请求整个购物车
 * @returns {*}
 */
function getLoadCart() {
    return util.ajax({
        url: config.url.getLoadCart,
    });
}
function modifyProductNum(data) {
    return util.ajax({
        url : config.url.modifyProductNum,
        data: data
    });
}

function checkedProduct(data) {
    const req = {
        cid: data.id
    };
    return util.ajax({
        url : config.url.checkedProduct,
        data: req
    });

}
function unCheckedProduct(data) {
    const req = {
        cid: data.id
    };
    return util.ajax({
        url : config.url.unCheckedProduct,
        data: req
    });
}
function checkedCart(data) {
    const req = {
        sno: data.id
    };
    return util.ajax({
        url : config.url.checkedCart,
        data: req
    });
}
function unCheckedCart(data) {
    const req = {
        sno: data.id
    };
    return util.ajax({
        url : config.url.unCheckedCart,
        data: req
    });

}
function checkedAllCarts() {
    return util.ajax({
        url: config.url.checkedAllCarts,
    });
}
function unCheckedAllCarts() {
    return util.ajax({
        url: config.url.unCheckedAllCarts,
    });
}
function submitCarts() {
    return util.ajax({
        url: config.url.submitCarts,
    });
}
function deleteProduct(data) {
    return util.ajax({
        url : config.url.deleteProduct,
        data: {
            cid: data.id
        }
    });

}
function getMeiDian(data){
    let ary = data;
    return util.ajax({
        url : config.url.getMeiDian,
        data: {
            ss: Array.prototype.toString.call(ary)
        }
    });

}
function pickerOnGroupHead(data){
    return util.ajax({
        url : config.url.pickerOnGroupHead,
        data: data
    });
}
const server   = {
    getLoadCart      : getLoadCart,
    modifyProductNum : modifyProductNum,
    checkedProduct   : checkedProduct,
    unCheckedProduct : unCheckedProduct,
    checkedCart      : checkedCart,
    unCheckedCart    : unCheckedCart,
    checkedAllCarts  : checkedAllCarts,
    unCheckedAllCarts: unCheckedAllCarts,
    submitCarts      : submitCarts,  //去结算,
    deleteProduct    : deleteProduct,
    getMeiDian       : getMeiDian,
    pickerOnGroupHead: pickerOnGroupHead //头选择优惠

};
module.exports = server;