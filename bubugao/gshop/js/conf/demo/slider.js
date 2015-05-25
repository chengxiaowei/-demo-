/**
 * Slides demo
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var Slider = require('lib/ui/slider/3.0.4/slider');

  var slider = new Slider('#slides', {
    play: {
      auto: true,
      interval: 4000,
      swap: true,
      pauseOnHover: true,
      restartDelay: 2500
    }
  });

});
