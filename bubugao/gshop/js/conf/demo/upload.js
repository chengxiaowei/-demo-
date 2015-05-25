define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');
  var Uploader = require('common/widget/uploader');

    // file uploader button installations
  $('[node-type="uploadButton"]').each(function(i, el) {
    var $el = $(el),
      fieldName = $el.data('name'),
      fieldInput = $('<input type="hidden" name="' + fieldName + '" />');

    $el.append(fieldInput);

    // initialize file upload component
    var uploader = Uploader(el, {
      endpoint: './api/up.php'
    });

    uploader.on('fileselect', function(e) {
      console.log('fileselect', e);
    });

    uploader.on('uploadprogress', function(e) {
      var percent = e.percentLoaded + '%';
      console.log(percent);
    });

    uploader.on('uploadcomplete', function(e) {
      var res = e.data || {};
      if (+res.code === 0) {
        fieldInput.val(res.data.id);
      }
      console.log(res);
    });

    uploader.on('uploaderror', function(e) {
      console.log('upload fails');
    });

    uploader.on('imageremoved', function(e) {
      fieldInput.val('');
      console.log('imageremoved');
    });

  });

});
