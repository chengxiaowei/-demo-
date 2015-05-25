/**
 * Lazyload demo
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
  var io = require('common/kit/io/request');

  var tmpHTML = $('#container').html();

  var imageLazyLoader = null;
  var resetImageLoader = function() {
    // Please make sure destroy it firts if not null
    if (imageLazyLoader) {
      imageLazyLoader.destroy();
    }
    imageLazyLoader = new Lazyload('img.lazy', {
      effect: 'fadeIn'
    });
    return imageLazyLoader;
  }

  var init = function() {
    // init image loader
    resetImageLoader();

    var lazy2 = new Lazyload('#container2 .pl', {
        type: 'html',
        placeholder: '<div class="loading">Loadding..., Just wait a moment, please.</div>',
        load: function(el, src) {
          io.get(src, function(res) { $(el).html(res); });
        }
    });

    $('.reRender').click(function(e) {
      e.preventDefault();
      $('#container').html(tmpHTML);
      resetImageLoader();
    });
  };

  init();

});

//  vim: set fdm=marker ts=2 sw=2 sts=2 tw=85 et :
