/**
 * @fileOverview
 * @name server.js
 * @author qzl
 * @license
 */
var express=require("express");
var color = require('colors');
var n_path = require('path');
var fs = require('fs');
var R = require('ramda');
var u = require('./util/util.js');


module.exports.gomeCartNative = function(app, conf){
    var config=conf;
    var all = function(a, b) {
        app.all(a, b);
    };
    
    var gmroute = require('./lib/gmroute.js');
    var groute = function(routes) {
        R.map(function(route) {
            console.log(route.join("------>").cyan);
            all(R.head(route), gmroute(R.tail(route), config));
        }, routes);
    };
    var pipe = require('./lib/pipe.js');
    var dirtostatic = function(path) {
        app.use(express.static(path));
        function fn(req,res){
            res.redirect(req.url.split("min.").join(""));
        }
        app.get("*min.js",fn);
        app.get("*min.css",fn);
    };

    all('/', pipe(config.statics));
    app.get("*.woff",function(req,res,next){
        res.setHeader("Access-Control-Allow-Origin","*");
    });
    //静态文件映射
    R.map(dirtostatic, config.statics);

    groute(config.project.routes);

    // ftl to fn 工程
    require('./lib/watchtpl')(config);
    require('./lib/watchsprite')(config);
}







