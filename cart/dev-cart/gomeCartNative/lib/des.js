var GTPL={}
$.extend({
	encode: function( text ) {
		return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
	}
})