

	var   Class     		= require( "ee-class" )
    	, EventEmitter    	= require( "./" );


	var Human = new Class( {
	    inherits: EventEmitter
	    , name: ""
	    , age: 29

	    , init: function( options ){
	        this.name = options.name;
	    }


	    , sayHello: function( to ){
	        this.emit( "startHello" );
	        console.log( "Hi %s, my name is %s, i'm %s years old.", to, this.name, this.age );
	        this.emit( "endHello" );
	    }
	} );



	var Boy = new Class( {
	    inherits: Human
	    , age: 12
	} );


	var fabian = new Boy( { 
	    name: "Fabian" 
	    , on: {
	          startHello: function(){ console.log( "starting console output:" ); }
	        , endHello: function(){ console.log( "finished console output!" ); }
	    }
	} );


	fabian.sayHello( "michael" );  // starting console output:
	                    // Hi my name is Fabian and i'm 12 years old.
	                    // finished console output!

	//fabian.emit( "error", new Error( "test" ) );
	fabian.emit( "error" );