var R = require('ramda');
var fs = require('fs');
var os = require('os');

var home = R.ifElse(R.equals("Windows_NT"),R.always("c:\\gm"),R.always(process.env.HOME))(os.type());
var parsePath = R.when(R.pipe(R.head, R.equals("~")),
    R.pipe(R.tail, R.concat(home)));

var readFile = function(path) {
    return fs.readFileSync(path, 'utf-8');
};
var writeFile = R.curry(function(path, str) {
    fs.writeFileSync(path, str);
    return str;
});
var formatstr = R.curry(function(str, data) {
    return R.replace(/\{([^\}]+)\}/g, function(all, a, b) {
        var pathfn = R.pipe(R.split('.'), R.path(R.__, data));
        var pathfn1 = R.pipe(pathfn, R.isNil, R.not);
        return R.ifElse(pathfn1, pathfn, R.always(all))(a);
    }, str);
});

function readdir(path) {
    return R.map(R.concat(path + '/'), fs.readdirSync(path));
}

function stat(path) {
    return fs.statSync(path);
}

function isdir(path) {
    return stat(path).isDirectory();
}

function isFile(path) {
    return stat(path).isFile();
}

function concat(list) {
    return R.filter(R.pipe(R.isNil, R.not), R.reduce(R.concat, [], list));
}
var delayfn = R.curry(function(time, fn) {
    clearTimeout(fn.__timer);
    fn.__timer = setTimeout(function() {
        fn.__timer = null;
        fn();
    }, time);
});
module.exports = {
    home: home,
    parsePath: parsePath,
    readFile: readFile,
    formatstr: formatstr,
    writeFile: writeFile,
    readdir: readdir,
    isdir: isdir,
    isFile: isFile,
    concat: concat,
    delayfn: delayfn,
    delay500: delayfn(500),
    delay500fn: function(fn) {
        return R.partial(delayfn, [500, fn]);
    }

}
