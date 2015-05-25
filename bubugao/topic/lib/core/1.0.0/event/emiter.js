/**
 * A custom event mechanism implementation inspired by nodejs EventEmitter and
 * backbone.Events
 *
 * <code><pre> 
 *  var EventEmitter = require('lib/core/1.0.0/event/emiter')
 *  var object = new EventEmitter();
 *  object.on('expand', function(){ alert('expanded'); });
 *  object.emit('expand');
 * </pre></code> 
 *
 * @module core/event/emiter
 * @author Allex Wang (allex.wxn@gmail.com)
 */
(function(global, factory) {
  // Set up EventEmitter appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(factory);

  // Next for Node.js or CommonJS.
  } else if (typeof module !== 'undefined') {
    factory(require, module.exports, module)

  // Finally, as a browser global.EventEmitter
  } else {
    var out = {exports: {}}
    factory(null, out.exports, out);
    global.EventEmitter = out.exports;
  }
}(this, function( require, exports, module ) {
'use strict';

// EventEmitter
//
// -----------------
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js

// Regular expression used to split event strings
var eventSplitter = /\s+/


// A module that can be mixed in to *any object* in order to provide it
// with custom events. You may bind with `on` or remove with `un` callback
// functions to an event; `emit`-ing an event fires all callbacks in
// succession.
//
//     var object = new EventEmitter();
//     object.on('expand', function(){ alert('expanded'); });
//     object.emit('expand');
//
function EventEmitter() {
}


// Bind one or more space separated events, `events`, to a `callback`
// function. Passing `"all"` will bind the callback to all events fired.
EventEmitter.prototype.addListener = function(events, callback, context) {
  var cache, event, list
  if (!callback) return this

  cache = this._events || (this._events = {})
  events = events.split(eventSplitter)

  while (event = events.shift()) {
    list = cache[event] || (cache[event] = [])
    list.push(callback, context)
  }

  return this
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener

EventEmitter.prototype.once = function(events, callback, context) {
  var self = this
  var cb = function() {
    self.un(events, cb)
    callback.apply(context || self, arguments)
  }
  return this.on(events, cb, context)
}

// Remove one or many callbacks. If `context` is null, removes all callbacks
// with that function. If `callback` is null, removes all callbacks for the
// event. If `events` is null, removes all bound callbacks for all events.
EventEmitter.prototype.removeListener = function(events, callback, context) {
  var cache, event, list, i

  // No events, or removing *all* events.
  if (!(cache = this._events)) return this
  if (!(events || callback || context)) {
    delete this._events
    return this
  }

  events = events ? events.split(eventSplitter) : keys(cache)

  // Loop through the callback list, splicing where appropriate.
  while (event = events.shift()) {
    list = cache[event]
    if (!list) continue

    if (!(callback || context)) {
      delete cache[event]
      continue
    }

    for (i = list.length - 2; i >= 0; i -= 2) {
      if (!(callback && list[i] !== callback ||
          context && list[i + 1] !== context)) {
        list.splice(i, 2)
      }
    }
  }

  return this
}

EventEmitter.prototype.un = EventEmitter.prototype.removeListener

// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `emit` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
EventEmitter.prototype.emit = function(events) {
  var cache, event, all, list, i, len, rest = [], args, returned = true;
  if (!(cache = this._events)) return this

  events = events.split(eventSplitter)

  // Fill up `rest` with the callback arguments.  Since we're only copying
  // the tail of `arguments`, a loop is much faster than Array#slice.
  for (i = 1, len = arguments.length; i < len; i++) {
    rest[i - 1] = arguments[i]
  }

  // For each event, walk through the list of callbacks twice, first to
  // emit the event, then to emit any `"all"` callbacks.
  while (event = events.shift()) {
    // Copy callback lists to prevent modification.
    if (all = cache.all) all = all.slice()
    if (list = cache[event]) list = list.slice()

    // Execute event callbacks except one named "all"
    if (event !== 'all') {
      returned = triggerEventEmitter(list, rest, this) && returned
    }

    // Execute "all" callbacks.
    returned = triggerEventEmitter(all, [event].concat(rest), this) && returned
  }

  return returned
}


// Helpers
// -------

var keys = Object.keys

if (!keys) {
  keys = function(o) {
    var result = []

    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name)
      }
    }
    return result
  }
}

// Mix `EventEmitter` to object instance or Class function.
EventEmitter.applyTo = function(receiver) {
  var proto = EventEmitter.prototype

  if (isFunction(receiver)) {
    for (var key in proto) {
      if (proto.hasOwnProperty(key)) {
        receiver.prototype[key] = proto[key]
      }
    }
    Object.keys(proto).forEach(function(key) {
      receiver.prototype[key] = proto[key]
    })
  }
  else {
    var event = new EventEmitter
    for (var key in proto) {
      if (proto.hasOwnProperty(key)) {
        copyProto(key)
      }
    }
  }

  function copyProto(key) {
    receiver[key] = function() {
      var v = proto[key].apply(event, Array.prototype.slice.call(arguments))
      return v === undefined ? this : v
    }
  }
}

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy.
function triggerEventEmitter(list, args, context) {
  var pass = true
  if (list) {
    var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2]
    switch (args.length) {
      case 0: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context) !== false && pass} break;
      case 1: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1) !== false && pass} break;
      case 2: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass} break;
      case 3: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass} break;
      default: for (; i < l; i += 2) {pass = list[i].apply(list[i + 1] || context, args) !== false && pass} break;
    }
  }
  // trigger will return false if one of the callbacks return false
  return pass;
}

function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]'
}

module.exports = EventEmitter

}));
