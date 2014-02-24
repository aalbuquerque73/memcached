/*
 * Utilities
 */

(function() {
	function Utils() {
	}
	Utils.prototype = {
			type: function(val) {
				return Object.prototype.toString.call(val).replace(/^\[object (.+)\]$/,"$1").toLowerCase();
			},

			merge: function (object, add, callbacks) {
				var self = this;
				_.each(add, function(value, key) {
					if(typeof(value)=="object") {
						this[key] = self.type(value)=="array"?[]:{};
						if(callbacks && callbacks._all && callbacks._all.before) {
							callbacks._all.before(this[key]);
						}
						if(callbacks && callbacks.hasOwnProperty(key) && callbacks[key].before) {
							callbacks[key].before(this[key]);
						}
						self.merge(this[key], value, (callbacks && callbacks.hasOwnProperty(key) && callbacks[key].children)?callbacks[key].children:null);
						if(callbacks && callbacks.hasOwnProperty(key) && callbacks[key].after) {
							callbacks[key].after(this[key]);
						}
						if(callbacks && callbacks._all && callbacks._all.after) {
							callbacks._all.after(this[key]);
						}
					} else {
						if(callbacks && callbacks._all && callbacks._all.before) {
							callbacks._all.before(this[key]);
						}
						if(callbacks && callbacks.hasOwnProperty(key) && callbacks[key].before) {
							callbacks[key].before(this[key]);
						}
						this[key] = value;
						if(callbacks && callbacks.hasOwnProperty(key) && callbacks[key].after) {
							callbacks[key].after(this[key]);
						}
						if(callbacks && callbacks._all && callbacks._all.after) {
							callbacks._all.after(this[key]);
						}
					}
				}, object);
			},
			
			guid: function() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				    return v.toString(16);
				});
			}
	};

	Utils.Env = {
			Global: null,
			Require: null
	};

	if (typeof global !== 'undefined' && typeof module !== 'undefined' && 'exports' in module) {
		Utils.Env.Global = global;
		Utils.Env.Require = module.require.bind(module);
		module.exports = new Utils();
	} else if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
		Utils.Env.Global = window;
		Utils.Env.Require = null;
		if (window.Utils) {
			(function() {
				var name, value, _ref, _results;
				_ref = window.Utils;
				_results = [];
				for (name in _ref) {
					if (!__hasProp.call(_ref, name)) continue;
					value = _ref[name];
					_results.push(Utils[name] = value);
				}
				return _results;
			})();
		}
		window.Utils = new Utils();
	} else if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
		Utils.Env.Global = self;
		Utils.Env.Require = self.importScripts.bind(self);
		self.Utils = new Utils();
	} else {
		throw new Error('utils.js loaded in an unsupported JavaScript environment.');
	}

}).call(this);