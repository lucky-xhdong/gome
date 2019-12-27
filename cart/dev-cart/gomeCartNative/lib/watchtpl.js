//diqye
var gtpl=require('./gtpl.js');
var fs = require('fs');
var R =require('ramda');
var u =require('../util/util.js');
var gtpl=require('./gtpl.js');
var n_path=require('path');
var colors=require('colors');


var notDotFiles=R.pipe(function(path){
	return R.test(/^\./)(n_path.basename(path));
},R.not);
var exitsFiles =fs.existsSync;
var ignoreFiles=R.filter(R.allPass([exitsFiles,notDotFiles]));
function complieTpl(str){
	var fn=function(){};
	try{
		fn = gtpl.template(null,str)
		return "function(data){ var $fn="
		+fn.toString().replace(/anonymous\(/,"(")
		+";return $fn($,{data:data||{}}).join('')};";
	}catch(e){
		console.log(e);
		return "null;"
	}
}
function tplToFn(srcpaths,topath){
	function complie(path){
		var name=n_path.basename(path,'.tpl');
		return R.pipe(u.readFile,complieTpl,R.concat('\nGTPL.'+name+'='))(path);
	}
	function addDes(str){
		return u.readFile(__dirname+"/des.js")+"\n"+str;
	}
	R.pipe(R.map(complie),
		R.join('\n'),
		addDes,
		u.writeFile(topath))(srcpaths);
	return null;
}
function concat(list){
	return R.filter(R.pipe(R.isNil,R.not),R.reduce(R.concat,[],list));
}
function listfile(paths){
	return concat(R.map(R.when(u.isdir,R.pipe(u.readdir,listfile)),ignoreFiles(paths)));
}

function listDir(rootdir){
	return concat(R.ifElse(u.isdir,
				R.pipe(u.readdir,
					R.filter(R.allPass([notDotFiles,u.isdir])),
					R.ap([R.identity,listDir])),
				R.always(null))(rootdir));
}
module.exports=function(config){
	var tofn=config.project.tplTofn;
	var srcdir=u.formatstr(tofn.src,{config:config});
	var distdir=u.formatstr(tofn.dist,{config:config});
	var distmapsrc=R.filter(R.pipe(R.head,R.anyPass([R.equals('src'),R.equals('dist')]),R.not),R.toPairs(tofn));

	function dofn(event, filename){
		R.map(function(a){
			tplToFn(R.filter(R.test(/tpl$/),listfile(R.map(R.concat(srcdir),R.last(a)))),R.concat(distdir,R.head(a)));
		},distmapsrc);
		console.log(("模版构建完成").magenta);
	}
	if(exitsFiles(srcdir)){
		//递归监控
		R.map(function watchSrc(a){
			fs.watch(a,u.delay500fn(dofn));
		},listDir(srcdir));
		u.delay500(dofn);
	}
}