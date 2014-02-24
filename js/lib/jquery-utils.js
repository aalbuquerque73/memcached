/*
 * jQuery Utilities
 */

(function($){

	var types = {
			element: 1,
			text: 3,
			comment: 8,
			document: 9
	};

	$.fn.splitText = function(offset) {
		return $(this.get(0).splitText(offset));
	};

	$.fn.data = function(data) {
		if(this.get(0)) {
			if(data) {
				this.get(0).data = data;
			}
			return this.get(0).data;
		}
		return null;
	};

	$.fn.tagName = function() {
		if(this.get(0)) {
			return this.get(0).tagName;
		}
		return null;
	};

	$.fn.nodeType = function() {
		if(this.get(0)) {
			return this.get(0).nodeType;
		}
		return null;
	};

	$.fn.filterNodeType = function( type ) {
		var type = typeof type === "string" ? types[ type.toLowerCase() ] : type;

		return this.pushStack( this.filter(function(){
			return this.nodeType === type;
		}), "nodetype", type );
	};

})(jQuery);