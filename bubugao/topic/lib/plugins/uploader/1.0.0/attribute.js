/**
 * Simple attribute management interface implements.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function() {
  'use strict';

  var Attributes = {
    _attrs: {},
    get: function(k) { return this._attrs[k]; },
    set: function(k, v) { this._attrs[k] = v; }
  };

  return Attributes;
});
