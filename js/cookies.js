(function() {
	function Cookie() {

	}
	Cookie.prototype = {
			set: function(c_name, value, exdays) {
				var exdate = new Date();
				exdate.setDate(exdate.getDate() + exdays);
				var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
				document.cookie = c_name + "=" + c_value;
			},

			get: function(c_name) {
				var i, x, y, ARRcookies = document.cookie.split(";");
				for (i = 0; i < ARRcookies.length; i++) {
					x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
					y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
					x = x.replace(/^\s+|\s+$/g, "");
					if (x == c_name) {
						return unescape(y);
					}
				}
			},

			remove: function(name) {
				document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
			}
	};

	Utils.Env = {
			Global: null,
			Require: null
	};

	if (typeof global !== 'undefined' && typeof module !== 'undefined' && 'exports' in module) {
		Utils.Env.Global = global;
		Utils.Env.Require = module.require.bind(module);
		module.exports = new Cookie();
	} else if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
		Utils.Env.Global = window;
		Utils.Env.Require = null;
		if (window.Cookie) {
			(function() {
				var name, value, _ref, _results;
				_ref = window.Cookie;
				_results = [];
				for (name in _ref) {
					if (!__hasProp.call(_ref, name)) continue;
					value = _ref[name];
					_results.push(Cookie[name] = value);
				}
				return _results;
			})();
		}
		window.Cookie = new Cookie();
	} else if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
		Utils.Env.Global = self;
		Utils.Env.Require = self.importScripts.bind(self);
		self.Cookie = new Cookie();
	} else {
		throw new Error('cookies.js loaded in an unsupported JavaScript environment.');
	}
}).call(this);