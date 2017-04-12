{
    'use strict';

    const assert = require('assert');




    // cutom events, because they  suck
    module.exports = class EventEmitter {



        constructor() {

            // store events in a hidden proeprty
            Object.defineProperty(this, 'eventHandlers', {
                  value: new Map()
                , configurable: true
            });
        }





        /**
        * emit an event with n paramters
        */
        emit(eventName, ...args) {
            if (this.eventHandlers.has(eventName)) {

                // iterate over all lisetenrs
                for (const listener of this.eventHandlers.get(eventName)) {

                    // call the listener
                    listener.listener(...args);

                    // remove after executing once
                    if (listener.once) this.off(eventName, listener.listener);
                }
            } else if (eventName === 'error') {


                const errors = args.filter(a => a instanceof Error);
                console.log('Emitted an unhandled error event!');
                console.log(errors);
            }


            return this;
        }






        /**
        * get listeners for an event
        */
        listener(eventName) {
            return this.eventHandlers.has(eventName) ? this.eventHandlers.get(eventName) : [];
        }






        /**
        * remove one, all or event specific listeners
        */
        off(eventName, listener) {
            if (eventName) {
                if (this.eventHandlers.has(eventName)) {
                    if (listener) {
                        const handlers = this.eventHandlers.get(eventName);
                        const handler = handlers.find(item => item.listener === listener);
                        const index = handlers.indexOf(handler);
                        
                        if (index >= 0) handlers.splice(index, 1);
                    } else {

                        // reset event
                        this.eventHandlers.set(eventName, [])
                    }
                }
            } else {

                // reset all events
                this.eventHandlers = new Map();
            }


            this.emit('removeListener', eventName, listener);


            return this;
        }






        /**
        * listen for the event once
        */
        once(eventName, listener) {
            return this.on(eventName, listener, true);
        }






        /**
        * listen for an event
        */
        on(eventName, listener, once) {
            return this.addListener(eventName, listener, once);
        }





        // adds a listenr, somehow private
        addListener(eventName, listener, once) {
            if (!this.eventHandlers.has(eventName)) this.eventHandlers.set(eventName, []);

            this.emit('listener', eventName, listener, !!once);

            // Store
            this.eventHandlers.get(eventName).push({
                  listener  : listener
                , once      : !!once
            });
        }
    };
};
