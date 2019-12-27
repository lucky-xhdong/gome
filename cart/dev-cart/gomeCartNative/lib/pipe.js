var R = require('ramda');
var path = require('path');
var fs = require('fs');
var util = require('../util/util.js');
/**
 * 从/??/a.js,/b.js/?v=xxxx 中获取文件 读取并合并文件 如果不符合格式 走其他的路由
 * @param {} statics js文件根目录 从第一个目录开始查找如果存在不在往下查找
 * @param {} req 
 * @param {} res
 * @param {} next
 */
module.exports = R.curry(function(statics, req, res, next) {
    var contentType;
    var mainfn = R.ifElse(R.anyPass([R.isEmpty,
            R.pipe(R.keys,
                R.head,
                R.head,
                R.equals('?'),
                R.not)
        ]),
        callnext,
        R.pipe(R.keys,
            R.head,
            R.match(/\?([^\?]+)\??/),
            R.tail,
            R.head,
            R.split(','),
            setContentType,
            R.map(R.replace(".min.",".")),
            R.map(absPath),
            R.map(readFile),
            R.join('\n'),
            responsefn
        ));

    function callnext() {
        next();
    }

    function setContentType(arr) {
        contentType = R.ifElse(R.test(/js$/),
            R.always("text/javascript"),
            R.always("text/css"))(R.head(arr));
        return arr;
    }

    function absPath(path1) {
        return R.reduce(
            function(a, b) {
                return R.ifElse(fs.existsSync, R.reduced, R.always(a))(path.join(util.parsePath(b), a));
            },
            path1,
            statics);
    }

    function readFile(path) {
        return fs.readFileSync(path, 'utf-8');
    }

    function responsefn(str) {
        res.contentType(contentType);
        res.send(str);
    }
    mainfn(req.query);
});
