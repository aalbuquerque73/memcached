var Memcached = require('memcached');
var _ = require('underscore');

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

var mc = new Runtime(config);

function ViewModel() {
	
}