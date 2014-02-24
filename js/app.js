/*
 * Application
 */

(function() {

	function merge(object, data) {
		_.each(data, function(item, key) {
			console.log("[merge]", key);
			if(typeof(item)=="object") {
				if(this[key] && !this.hasOwnProperty(key)) {
					console.log("Merging prototype");
					var obj = this[key];
					this[key] = Utils.type(item)=="array"?[]:{};
					merge(this[key], obj);
					//console.log(this.hasOwnProperty(key), this[key]);
				}
				if(!this.hasOwnProperty(key)) {
					this[key] = Utils.type(item)=="array"?[]:{};
				}
				merge(this[key], item);
				return;
			}
			this[key] = item;
		}, object);
	}
	
	var Memcached = require('memcached');

	function Runtime(config) {
		function $Super() {}
		$Super.prototype = {};
		merge($Super.prototype, this.callbacks);
		
		this.$super = new $Super();
		merge(this, config);
		this.mc = new Memcached(this.hosts);
	}
	Runtime.prototype = {
			events: {
				issue: function() {console.log("[Memcached:issue]", arguments);},
				failure: function() {console.log("[Memcached:failure]", arguments);},
				reconnecting: function() {console.log("[Memcached:reconnecting]", arguments);},
				reconnected: function() {console.log("[Memcached:reconnected]", arguments);},
				remove: function() {console.log("[Memcached:remove]", arguments);}
			},
			callbacks: {
				stats: function() {
					console.log("[Memcached:stats]", arguments);
				},
				items: function() {
					console.log("[Memcached:items]", arguments);
				},
				slabs: function() {
					console.log("[Memcached:slabs]", arguments);
				},
				settings: function() {
					console.log("[Memcached:settings]", arguments);
				},
				flush: function() {
					console.log("[Memcached:flush]", arguments);
				}
			},

			init: function() {
				var This = this;
				_.each(this.events, function(fn, key) {
					This.mc.on(key, fn);
				});
			},
			connect: function() {
				this.mc.connect();
			},

			stats: function() {
				var self = this;
				this.mc.stats(function() {
					self.callbacks.stats.apply(self, arguments);
				});
			},

			items: function() {
				var self = this;
				this.mc.items(function() {
					self.callbacks.items.apply(self, arguments);
				});
			},

			slabs: function() {
				var self = this;
				this.mc.slabs(function() {
					self.callbacks.slabs.apply(self, arguments);
				});
			},

			settings: function() {
				var self = this;
				this.mc.settings(function() {
					self.callbacks.settings.apply(self, arguments);
				});
			},

			flush: function() {
				var self = this;
				this.mc.flush(function() {
					self.callbacks.flush.apply(self, arguments);
				});
			},

			close: function() {
				this.mc.end();
			}
	};

	function ViewModel() {
		this._data = {
				stats: [],
				items: [],
				slabs: [],
				settings: []
		};
		if(localStorage.data) {
			merge(
					this._data,
					JSON.parse(localStorage.data)
			);
		}
		console.log("[ViewModel]", this._data);

		function observable(obj, data) {
			_.each(data, function(value, key) {
				if(Utils.type(value)=="array") {
					obj[key] = ko.observableArray(value);
					return;
				}
				if(Utils.type(value)=="object") {
					obj[key] = {};
					observable(obj[key], value);
					return;
				}
				obj[key] = ko.observable(value);
			});
		}
		observable(this, this._data);

		var self = this;
		var config = {
				hosts: "127.0.0.1:11211",
				options: {},
				callbacks: {
					stats: function(ignore, stats) {
						console.log("==============================");
						this.$super.stats.apply(this, arguments);
						_.each(stats, function(item){
							this.push(item);
						}, self);
					}
				}
		};

		console.log("[Startup]", config);

		var mc = new Runtime(config);
		mc.init();
		
		mc.stats();
		mc.items();
		mc.slabs();
		mc.settings();
		
		mc.close();
	}

	$(function() {
		ko.applyBindings(new ViewModel());
	});
}).call(this);