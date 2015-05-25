/**
 * H5 Uploader implements
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var Uploader = require('lib/plugins/uploader/1.0.0/uploader');

  /**
   * Render upload file preview image view and staffs.
   */
  var renderFilePreview = function(oFile, container, uploader) {
    var $el = $(container),
        clipSize = {width: $el.width(), height: $el.height()};

    // generate preview image src
    Uploader.genImageFileThumbnail(oFile, clipSize, function(src) {
      var img = new Image();

      img.src = src;
      img.onload = function() {
        // central image visiable
        $(img).css({
          top: (clipSize.height - img.height) / 2,
          left: (clipSize.width - img.width) / 2,
          position: 'absolute'
        });
        img = img.onload = null;
      };
      $el.append(img);

      // add close button
      var closeButton = $('<b class="icon-delete"></b>');
      closeButton.one('click', function(e) {
        $el.removeClass('file-uploaded').find('img').remove();
        closeButton.remove();
        closeButton = container = $el = null;
        uploader.emit('imageremoved');
      });

      $el.append(closeButton).addClass('file-uploaded');
    });
  };

  var fileFilter = function(file) {
    var type = file.get('type');
    return /^image\//.test(type);
  };

  var createProcessBar = function() {
    var el = $('<div class="process-bar-container"><div class="process-bar"></div></div>');
    return el;
  };

  module.exports = function(el, options) {
    // file uploader button installations
    var $el = $(el),
        fieldName = $el.data('name'),
        processBar = null;

    // initialize file upload component
    var uploader = new Uploader(el, {
      uploadURL: options.endpoint,
      uploadOnSelect: true,
      accept: 'image/*',
      fileFilter: fileFilter
    });

    uploader.on('fileselect', function(e) {
      processBar = createProcessBar(el).appendTo($el).find('.process-bar');
      setTimeout(function() {
        var fileList = e.fileList, file = fileList && fileList[0], oFile;
        if (file && (oFile = file.get('file'))) {
          // generate preview image and staffs
          renderFilePreview(oFile, el, uploader);
        }
      }, 1);
    });

    uploader.on('uploadprogress', function(e) {
      var percent = e.percentLoaded + '%';
      processBar.width(percent);
    });

    uploader.on('uploadcomplete', function(e) {
      processBar.parent().remove();
      processBar = null;
    });

    uploader.on('uploaderror', function(e) {
      processBar.parent().remove();
      processBar = null;
      console.log('upload fails');
    });
  
    return uploader;
  };

});
