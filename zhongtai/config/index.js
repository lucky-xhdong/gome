'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
/*
uat ip
http://10.115.88.93:8000 pcatpview
http://10.115.88.93:8001 pcorderview
http://10.115.88.93:8002 pcpayview
http://10.115.88.94:8000 pccartview

4344
  pcatpview="http://10.58.162.177:20000";
  pcorderview="http://10.58.162.177:20001";
  pcpayview="http://10.58.162.177:20002";
  midesk="http://10.58.163.1:8783";
  pccartview="http://10.58.162.177:20003";

gome
 pcatpview="http://10.58.162.125:20000";
  pcorderview="http://10.58.162.128:20000";
  pcpayview="http://10.58.162.131:20000";
  midesk="http://10.58.163.4:8783";
  pccartview="10.58.162.134:20000";

*/
const path = require('path')
var argumentssargv="";
try {
argumentssargv = JSON.parse(process.env.npm_config_argv).original;
} catch(ex) {
argumentssargv = process.argv;
}

var argumentss = argumentssargv.splice(2);


if(argumentss.length>0){
   argumentssargv=argumentss[0].substring(1);
}else{
   argumentssargv="";
}
global.argumentssargv=argumentssargv;

var env = '.atguat.com.cn';
var pcatpview = "http://10.115.88.93:8000";
var pcorderview = "http://10.115.88.93:8001";
var pcpayview = "http://10.115.88.93:8002";
var midesk = "http://10.112.179.135:8783";
var pccartview = "http://10.115.88.94:8000";

if(argumentssargv && argumentssargv=='gome'){

    pcatpview = "http://10.58.162.125:20000";

    pcorderview = "http://10.58.162.128:20000";

    pcpayview = "http://10.58.162.131:20000";

    midesk = "http://10.58.163.4:8783";

    pccartview = "http://10.58.162.134:20000";

    env = ".ds.gome.com.cn";
}

if(argumentssargv && argumentssargv=='4344'){
 
  pcatpview = "http://10.58.162.177:20000";

  pcorderview = "http://10.58.162.177:20001";

  pcpayview = "http://10.58.162.177:20002";

  midesk = "http://10.58.163.1:8783";

  pccartview = "http://10.58.162.177:20003";

  env = ".ds.gome.com.cn";

}
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      
      "/pcatpview":{
        target:pcatpview,
        changeOrigin: true,
        secure: false,
        pathRewrite:{
          '^/pcatpview': ''//需要rewrite重写
        }
      },
      "/pcorderview":{
        target:pcorderview,
        changeOrigin: true,
        secure: false,
        pathRewrite:{
          '^/pcorderview': ''//需要rewrite重写
        }
      },
      "/pcpayview":{
        target:pcpayview,
        changeOrigin: true,
        secure: false,
        pathRewrite:{
          '^/pcpayview': ''//需要rewrite重写
        }
      },
      "/pccartview":{
        target:pccartview,
        changeOrigin: true,
        secure: false,
        pathRewrite:{
          '^/pccartview': ''//需要rewrite重写
        }
      }
      
    },

    // Various Dev Server settings
    host: 'mpf'+env, // can be overwritten by process.env.HOST
    port: 80, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/order/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
