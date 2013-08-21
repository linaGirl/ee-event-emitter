	"use strict";


	var Class 	= require( "ee-class" )
		, log 	= require( "ee-log" );


	// cutom events, because they less suck
	module.exports = new Class( {

		emit: function( event, err ){
			if ( !this.$$$$_events ) Object.defineProperty( this, "$$$$_events", { value: {} } );

			var args = arguments, i, current;

			if ( this.$$$$_events[ event ] ){
				i = this.$$$$_events[ event ].length;
				while( i-- ){
					current = this.$$$$_events[ event ][ i ];
					if ( typeof current.listener === "function" ){
						current.listener.apply( null, Array.prototype.slice.call( args, 1 ) );
						if ( current.once ) this.$$$$_events[ event ].splice( i, 1 );
					}
					else {
						throw new Error( "cannot emit event [" + event + "], listener is typeof [" + typeof current.listener + "]!" );
						this.$$$$_events[ event ].splice( i, 1 );
					}
				}
			}
			else if ( event === "error" ){
				var errs = Array.prototype.slice.call( args, 1 ).filter( function( a ){ return a instanceof Error; } );
				var err = errs.length > 0 ? errs[ 0 ] : new Error( "Emitted an error event without an instance of an error!" );
				log.error( "Cannot emit error event without listeners!" );
				log.trace( err );
				process.exit();
			}

			return this;
		}


		, listener: function( event ){
			return this.$$$$_events && this.$$$$_events[ event ]  ? this.$$$$_events[ event ] : [];
		}


		// remove all event s( no args ), all listeners of a specific event ( first arg ) or a specific listener ( two args )
		, off: function( event, listener ){
			var i;

			if ( event ){
				if ( listener && this.$$$$_events && this.$$$$_events[ event ] ){
					i = this.$$$$_events[ event ].length;
					while( i-- ){
						if ( this.$$$$_events[ event ][ i ].listener === listener ){
							this.$$$$_events[ event ].splice( i, 1 );
						}
					}
				}
				else {
					if ( this.$$$$_events[ event ] ) delete this.$$$$_events[ event ];
				}
			}
			else {
				this.$$$$_events = Object.defineProperty( this, "$$$$_events", { value: {} } );;
			}

			this.emit( "removeListener", event, listener );

			return this;
		}


		// add one ( two args ) or multiple events ( one arg -> object ). fired once.
		, once: function( event, listener ){
			this.on( event, listener, true );

			return this;
		}

		// add one ( two args ) or multiple events ( one arg -> object ). fired once ( third arg )
		, on: function( event, listener, once ){
			var keys, i;
			if ( typeof event === "object" ){
				// multiple events
				keys = Object.keys( event );
				i = keys.length;
				while( i-- ){
					this.addListener( keys[ i ], event[ keys[ i ] ], once );
				}
			}
			else {
				this.addListener( event, listener, once );
			}

			return this;
		}


		// adds a listenr, somehow private
		, addListener: function( event, listener, once ){
			if ( !this.$$$$_events ) Object.defineProperty( this, "$$$$_events", { value: {} } );
			if ( !this.$$$$_events[ event ] ) this.$$$$_events[ event ] = [];

			this.emit( "listener", event, listener, once === true );

			this.$$$$_events[ event ].push( {
				listener: listener
				, once: once === true
			} );
		}
	} );