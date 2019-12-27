var R = require('ramda');
var fs = require('fs');
var path = require('path');
var util = require('../util/util.js');
/**
 * 根据配置文件规则加载数据
 * @param {} route
 * @param {} config
 * @param {} req
 * @param {} res
 * @returns {} 
 */
module.exports = R.curry(function(route, config, req, res, next) {
    var head = R.head(route);
    if (!head) {
        res.send("请配置数据文件");
        return;
    }
    var sendJson = function(json) {
        function jsonfn() {
            res.set("Content-Type", "application/json");
            res.send(json);
        }

        function jsonpfn() {
            res.set("Content-Type", "application/json");
            res.send(R.reduce(R.concat, req.query.callback, ["(", json, ")"]));
        }
        R.ifElse(R.isNil, jsonfn, jsonpfn)(R.path(['query', 'callback'], req));
    };
    var sendHtml = function(html) {
        res.set("Content-Type", "text/html");
        res.send(html);
    };
    var readFile = util.readFile;
   
    var parsepath = function(path1) {
        req.cwd = path.join(__dirname, '..');
        req.config = config;
        return util.formatstr(path1, req);
    };

    function callnext() {
        next();
    }

    function send(str) {
        res.send(str);
    }


    R.cond([
        [R.test(/json$/), R.pipe(
            parsepath,
            R.ifElse(fs.existsSync, 
                R.pipe(readFile, sendJson), 
                callnext)) ],
        [R.test(/html$/), R.pipe(parsepath, R.ifElse(fs.existsSync,
            R.pipe(readFile, sendHtml),
            callnext))],
        [R.T, callnext]
    ])(head);

});
