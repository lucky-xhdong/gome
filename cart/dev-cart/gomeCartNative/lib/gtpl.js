$ = jQuery = {fn:{}};
jQuery.makeArray = function (e,t){var n=t||[];if(e!=null){var i=r.type(e);if(e.length==null||i==="string"||i==="function"||i==="regexp"||r.isWindow(e)){j.call(n,e)}else{r.merge(n,e)}}return n}
jQuery.each = function(list, fn){
	if(list.length){
		for(var i=0,len=list.length; i<len; i++){
			fn.call(list[i], i)
		}
	}else{
		for(var i in list){
			fn.call(list[i], i)
		}
	}
}
jQuery.trim = function(a){
	return a.trim();
}
jQuery.isFunction = function(target){
	return typeof target === 'function';
}
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
var fs = require('fs'); 
var jquerytmpl = fs.readFileSync(__dirname+'/jquery.tmpl.js');
require("./jquery.tmpl.js");
// console.log(window);
// this.$ = jQuery;
eval(jquerytmpl);
module.exports=jQuery;