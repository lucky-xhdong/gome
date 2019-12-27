/**
 * 格式化日期，返回年-月-日
 */
exports.formatDate = function (time) {
    "use strict";
    let year, month, date;
    if (time && time > 0) {
        year = new Date(time).getFullYear() + '-';
        month = (new Date(time).getMonth() + 1 < 10 ? '0' + (new Date(time).getMonth() + 1) : new Date(time).getMonth() + 1) + '-';
        date = new Date(time).getDate();
        return year + month + date;
    }
};
/**
 * 格式化日期，返回年-月-日 时:分:秒
 * timeFlag:显示时间标识，如果不传值或者传second显示到秒，传minute显示到分，hour显示到小时，day显示到天
 */
exports.formatDateTime = function (time, timeFlag) {
    "use strict";
    let year, month, day, hour, minute, seconds;
    if (time && time > 0) {
        year = new Date(time).getFullYear();
        month = (new Date(time).getMonth() + 1 < 10 ? '0' + (new Date(time).getMonth() + 1) : new Date(time).getMonth() + 1);
        day = new Date(time).getDate() < 10 ? '0' + new Date(time).getDate() : new Date(time).getDate();
        hour = new Date(time).getHours() < 10 ? '0' + new Date(time).getHours() : new Date(time).getHours();
        minute = new Date(time).getMinutes() < 10 ? '0' + new Date(time).getMinutes() : new Date(time).getMinutes();
        seconds = new Date(time).getSeconds() < 10 ? '0' + new Date(time).getSeconds() : new Date(time).getSeconds();
        if (!timeFlag || timeFlag == 'second') {
          return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
        } else if (timeFlag == 'minute') {
          return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        } else if (timeFlag == 'hour') {
          return year + '-' + month + '-' + day + ' ' + hour;
        } else if (timeFlag == 'day') {
          return year + '-' + month + '-' + day;
        }
    }
};
/**
 * 获取url中"?"符后的字串
 * name--url中要获取的字段名
 */
exports.getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}  ;
/**
 *
 */
exports.isStorage = function(currentRoute,beforeRoute){
    "use strict";
    if (window.sessionStorage.getItem('serviceData') && beforeRoute) {
        return true;
    }
};
/**
 * setItem
 */
exports.setStoreOnListForm = function(key, value){
    "use strict";
    window.sessionStorage ? sessionStorage.setItem(key, value) : Cookie.write(key, value);
};
/**
 * getItem
 */
exports.getStoreOnListForm = function(key){
    "use strict";
    window.sessionStorage ? sessionStorage.getItem(key): Cookie.read(key);
};
/**
 * clear
 */
exports.clearStoreOnListForm = function(){
    "use strict";
    window.sessionStorage && window.sessionStorage.clear();
};
