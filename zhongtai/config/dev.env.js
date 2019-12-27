'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
var NODE_ENV="";
if(argumentssargv && (argumentssargv=='gome' ||  argumentssargv=='4344')){
	var NODE_ENV='"production"';
}else{
	var NODE_ENV='"development"';
}


module.exports = merge(prodEnv, {
  NODE_ENV: NODE_ENV
})
