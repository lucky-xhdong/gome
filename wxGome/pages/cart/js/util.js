/**
 * Created by CAOYI on 2017/3/23.
 */
const Promise = require('../../../lib/es6-promise').Promise;
const co = require('../../../lib/co/we-index');
const regeneratorRuntime = require("../../../lib/regenerator-runtime/runtime");

const config = require('../../../common/config');


//promise 拓展 不管成功与失败都执行
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};
/**
 * 封装ajax请求 返回promise对象
 * @returns {*}
 */
let _isLoadMore = true; //给loadCart添加flag，避免短时间内重复加载loadCart造成繁忙阻塞
function ajax(obj) {
  const scn = wx.getStorageSync('scn');
  const header = {
    // 'Accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    'gome-header': 'wxa.gome.com.cn',
    'Cookie': 'SCN=' + scn
  };
  return new Promise(function(resolve, reject) {
    if (!obj.url) {
      reject(new Error("请求地址为空"));
    }
    if (!_isLoadMore) {
      return
    }
    _isLoadMore = false;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    });
    wx.request({
      url: obj.url,
      data: obj.data || '',
      header: obj.header || header,
      dataType: obj.dataType || 'json',
      success: function(json) {
        const data = json.data;
        _isLoadMore = true;
        if (!data.success) {
          if (data.errCode && data.errCode == '008000001') {
            wx.removeStorageSync('scn');
            wx.navigateTo({
              url: '../loginEmpower/loginEmpower',
            })
          } else {
            const err = new BaseErr(data);
            reject(err);
            if (data.errCode && data.errCode == '0010040023') {
              wx.showToast({
                title: data.errMsg,
                icon: 'none'
              });
            }
          }


        }
        resolve(data);
      },
      fail: function(err) {
        reject(err);
        _isLoadMore = false;
      },
      complete: function() {
        //失败成功都执行
        //wx.hideToast();
      }
    });
  });
}

function apiDataVerify(data) {
  "use strict";
  return function() {
    if (!data.success) {
      throw new BaseErr();
    }
    return data;
  }
}

function log(msg) {
  if (!config.debug || !msg) return;
  console.error(msg);
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}
/**
 * 自定义异常
 * 添加属性 code
 * -- new BaseErr(data)
 */
class BaseErr extends Error {
  constructor(e) {
    super();
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
    this.message = e.errMsg || '服务异常';
    this.code = e.errCode || '-1';
  }
}

function parsePrice(num) {
  return new Number(num).toFixed(2);
}

function _hasUrlHead(url) {
  return /http|https/.test(url);
}

function dealUrl(url) {
  if (!url) {
    return '';
  }
  if (!_hasUrlHead(url)) {
    return 'http:' + url;
  }
  return url;
}

function arrChangeTop(arr, index) {
  let temp, fires;
  if (index === 0 || index > arr.length - 1) {
    return arr;
  };
  temp = arr[index];
  fires = arr[0];
  arr[0] = temp;
  arr[index] = fires;
  return arr;
}

const util = {
  ajax, //封装ajax  将ajax请求转换为一个promise
  log, //封装console.log
  apiDataVerify, //response 返回数据success==false 则抛出一个自定义异常
  isArray, //是否是数组
  parsePrice, //对于金额处理为两位小数
  dealUrl, //处理url，如果没有http，则自动添加“http:”头，warn:只是解决微信小程序不能自动添加http头问题
  arrChangeTop, //数组将第index与第一个交换
};
module.exports = util;