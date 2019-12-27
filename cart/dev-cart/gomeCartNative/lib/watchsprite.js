var spritesheetjs = require('spritesheetjs');
var u = require('../util/util.js');
var fs = require('fs');
var R =require('ramda');

var exitsFiles =fs.existsSync;

module.exports=function(config){
	var sprite=config.project.sprite;
	var srcdir=u.formatstr(sprite.src,{config:config});
	var dist=u.formatstr(sprite.dist,{config:config});
	var csspath=u.formatstr(sprite.css,{config:config});
	var htmlpath=u.formatstr(sprite.html,{config:config});

	function dofn(event, filename){
		var sheet = new spritesheetjs({
		    source_dir: srcdir,
		    rel_sprite_path: "", // in case your css file and sprite image are in different directories
		    sprite_path: dist,
		    css_path: csspath,
		    sprite_name:sprite.sprite_name,
		    selector:sprite.selector
		});

		sheet.spritesheet(function(css){
			if(!exitsFiles(htmlpath+".tpl"))return;
			function asli(name){
				return [
						"<li>",
						"<div><code>",
						R.tail(sprite.selector),
						" ",
						name,
						"</code></div>",
						"<span class=\"",
						R.tail(sprite.selector),
						" ",
						name,
						"\" ></span>",
						"</li>"
				].join('');
			}
			function ashtml(str){
				return u.formatstr(u.readFile(htmlpath+".tpl"),{str:str})
			}
			R.pipe(R.map(R.pipe(R.prop("name"), 
				asli)),
			R.join("\n"),
			ashtml,
			u.writeFile(htmlpath))(css);
		});
	}
	if(exitsFiles(srcdir)){
		fs.watch(srcdir,u.delay500fn(dofn));
		u.delay500(dofn);
	}
}