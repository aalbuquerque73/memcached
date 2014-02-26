/*
 * Application
 */

(function() {
	var Memcached = require('memcached');

	var config = {
			hosts: "127.0.0.1:11211",
			options: {}
	};

	console.log("[Startup]", config);

	function Runtime(config) {
		this.mc = new Memcached(config.hosts);
	}
	Runtime.prototype = {
			events: {
				issue: function() {},
				failure: function() {},
				reconnecting: function() {},
				reconnected: function() {},
				remove: function() {}
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

			display: function() {
				this.mc.display(function() {
					console.log(arguments);
				});
			},

			dump: function() {
				this.mc.dump(function() {
					console.log(arguments);
				});
			},

			stats: function() {
				this.mc.stats(function() {
					console.log(arguments);
				});
			},

			items: function() {
				this.mc.items(function() {
					console.log(arguments);
				});
			},

			slabs: function() {
				this.mc.slabs(function() {
					console.log(arguments);
				});
			},

			settings: function() {
				this.mc.settings(function() {
					console.log(arguments);
				});
			},

			flush: function() {
				this.mc.flush(function() {
					console.log(arguments);
				});
			},

			close: function() {
				this.mc.end();
			}
	};

	function ViewModel() {
		this._data = {};
		if(localStorage.data) {
			Utils.merge(
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

		var mc = new Runtime(config);
	}

	$(function() {
		ko.applyBindings(new ViewModel());
	});
}).call(this);