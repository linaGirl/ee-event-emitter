!function(){
	'use strict';


	var Class 	= require('ee-class')
		, log 	= require('ee-log');


	// cutom events, because they less suck
	module.exports = new Class({

		___events: {
			get: function(){
				if (!Object.hasOwnProperty.call(this, '____events')) Class.define(this, '____events', Class({}).Writable());
				return this.____events;
			}
		}


		, emit: function(event, err) {
			var   args = []
				, errs
				, i
				, l
				, current;

			// let v8 optimize this method!
			for (i = 0, l = arguments.length; i < l; i++) args.push(arguments[i]);


			if (this.___events[event]) {
				i = this.___events[event].length;
				while(i--) {
					current = this.___events[event][i];

					if (typeof current.listener === 'function') {
						current.listener.apply(null, args.slice(1));
						if (current.once) this.___events[event].splice(i, 1);
					}
					else {
						throw new Error('cannot emit event «'+event+'», listener is typeof «' + typeof current.listener + '»' );
						this.___events[ event ].splice( i, 1 );
					}
				}
			}
			else if (event === 'error') {
				errs = args.slice(1).filter(function(a) {
					return a instanceof Error;
				});

				log.error('Cannot emit error event without listeners!');
				log.trace(errs[0]);
			}

			return this;
		}


		, listener: function(event) {
			return this.___events && this.___events[event]  ? this.___events[event] : [];
		}


		// remove all event s( no args ), all listeners of a specific event ( first arg ) or a specific listener ( two args )
		, off: function(event, listener) {
			var i;

			if (event) {
				if (listener && this.___events[event]) {
					i = this.___events[event].length;

					while(i--) {
						if (this.___events[event][i].listener === listener) {
							this.___events[event].splice(i, 1);
						}
					}
				}
				else if (this.___events[event]) delete this.___events[event];
			}
			else {
				this.____events = {};
			}

			this.emit('removeListener', event, listener);

			return this;
		}


		/**
		 * listens for an event and passes it directly to this
		 * instance of the eventemitter
		 *
		 * @param {string} eventName the name of the event to emit
		 * @returns {function} event listener that passes the event
		 *  				   to this class
		 */
		, passEvent: function(eventName) {
			return function() {
				var args = [eventName];

				// convert args to array (since Array.from or
				// the spread operator are not available yet)
				for (var i = 0, l = arguments.length; i < l; i++) args.push(arguments[i]);

				// emit what we got
				this.emit.apply(this, args);
			}.bind(this);
		}



		// add one ( two args ) or multiple events ( one arg -> object ). fired once.
		, once: function(event, listener) {
			return this.on(event, listener, true);
		}



		// add one ( two args ) or multiple events ( one arg -> object ). fired once ( third arg )
		, on: function(event, listener, once) {
			var keys, i;

			if (typeof event === 'object') {
				// multiple events
				keys 	= Object.keys(event);
				i 		= keys.length;

				while(i--) {
					this.addListener(keys[i], event[keys[i]], once);
				}
			}
			else {
				this.addListener(event, listener, once);
			}

			return this;
		}


		// adds a listenr, somehow private
		, addListener: function(event, listener, once) {
			if (!this.___events[event]) this.___events[event] = [];

			this.emit('listener', event, listener, once === true);

			this.___events[event].push({
				  listener 	: listener
				, once 		: !!once
			});
		}
	});
}();
