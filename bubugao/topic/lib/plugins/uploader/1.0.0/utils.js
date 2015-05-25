/**
 * Upload file utils.
 *
 * @module lib/plugins/uploader/utils
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  // https://gist.github.com/allex/5098339
  // generate a thumbnail by scaling images with canvas
  var getThumbnail = function(src, opts, callback) {

    // Scaling images with html5 canvas
    var max_w = opts.width,
        max_h = opts.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image();

    img.onload = function(e) {
      var size = getScaleImageSize(img, max_w, max_h), width = size.width, height = size.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(this, 0, 0, width, height);
      callback(canvas.toDataURL(opts.type || 'image/png'));
      ctx = canvas = img = img.onload = opts = null;
    };

    img.src = src;
  };

  // re-calcuate image size by limit region
  var getScaleImageSize = function(img, max_w, max_h) {
    var w = img.width, h = img.height, scale = w / h;
    if (w > 0 && h > 0) {
      if (scale >= max_w / max_h) {
        if (w > max_w) {
          w = max_w;
          h = w / scale;
        }
      } else {
          if (h > max_h) {
            h = max_h;
            w = h * scale;
          }
      }
    }
    return {width: w, height: h};
  };

  /**
   * Generate file preview image by FileReader
   *
   * @param {File} oFile The html file instance.
   * @param {Object} opts Options to limits thumbnail images. { width, height, type }
   * @param {Function} The callback to executed when image generated.
   */
  exports.genImageFileThumbnail = function(oFile, opts, callback) {
    if (typeof FileReader !== 'undefined' && (/image/i).test(oFile.type)) {
      var oReader = new FileReader();
      oReader.onload = function(e) {
        opts.type = oFile.type;
        getThumbnail(oReader.result, opts, callback);
        oFile = oReader = oReader.onload = null;
      };
      // read selected file as DataURL
      oReader.readAsDataURL(oFile);
    } else {
      callback(null);
    }
  };

});
