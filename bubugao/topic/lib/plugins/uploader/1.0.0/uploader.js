/**
 * File uploader implements.
 *
 * @module lib/plugins/uploader/uploader
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var _ = require('../../../lodash/3.1.0/lodash');
  var Events = require('./events');
  var Attribute = require('./attribute');
  var FileHTML5 = require('./filehtml5');
  var UploadButton = require('./uploadbutton');
  var utils = require('./utils');

  /**
   * File uploader contructor
   * @constructor
   * @class Uploader
   */
  var Uploader = function(el, opts) {
    var self = this;
    opts = _.extend({

      /**
       * Auto upload files when select, Defaults to false.
       */
      uploadOnSelect: false,

      /**
       * A filtering function that is applied to every file selected by the user.
       * The function receives the `FileHTML5` object and must return a Boolean value.
       * If a `false` value is returned, the file in question is not added to the
       * list of files to be uploaded.
       * Use this function to put limits on file sizes or check the file names for
       * correct extension, but make sure that a server-side check is also performed,
       * since any client-side restrictions are only advisory and can be circumvented.
       */
      fileFilter: null,

      /**
       * A String specifying what should be the POST field name for the file
       * content in the upload request.
       * @type {String}
       * @default Filedata
       */
      fileFieldName: 'Filedata',

      /**
       * An object, keyed by `fileId`, containing sets of key-value pairs
       * that should be passed as POST variables along with each corresponding
       * file. This attribute is only used if no POST variables are specifed
       * in the upload method call.
       *
       * @attribute postVarsPerFile
       * @type {Object}
       * @default {}
       */
      postVarsPerFile: {}

    }, opts);

    _.each(opts, function(v, k) { self.set(k, v); });

    self._fileList = [];
    self._uploader = null;
    
    self._initUploader(el);
  };

  _.extend(Uploader.prototype, Events.prototype, Attribute, {

    /**
     * Initialize upload button staffs.
     *
     * @protected
     */
    _initUploader: function(el) {
      var self = this;
      var buttonOpts = _.extend({
        accept: self.get('accept'),
        multiple: self.get('multiple'),
        onChange: function(e) {
          var files = e.target.files;
          if (files) {
            self._updateFileList(files);
          }
          else {
            console.warn('No support for the File API in this web browser');
          }
        }
      });
      self._uploader = new UploadButton(el, buttonOpts);
    },

    /**
     * Starts the upload of a specific file.
     *
     * @method upload
     * @param file {FileHTML5} Reference to the instance of the file to be uploaded.
     * @param url {String} The URL to upload the file to.
     * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
     *                          If not specified, the values from the attribute `postVarsPerFile` are used instead. 
     */
    upload: function (file, url, postvars) {

      var uploadURL = url || this.get('uploadURL'),
          postVars = postvars || this.get('postVarsPerFile'),
          fileId = file.get('id');

          postVars = postVars.hasOwnProperty(fileId) ? postVars[fileId] : postVars;

      if (!uploadURL) {
        throw Error('Upload exception, the uploader endpointer not valid');
      }

      if (file instanceof FileHTML5) {
         
        file.on('uploadstart', this._uploadEventHandler, this);
        file.on('uploadprogress', this._uploadEventHandler, this);
        file.on('uploadcomplete', this._uploadEventHandler, this);
        file.on('uploaderror', this._uploadEventHandler, this);
        file.on('uploadcancel', this._uploadEventHandler, this);

        file.startUpload(uploadURL, postVars, this.get('fileFieldName'));
      }
    },

    /**
     * Handles and retransmits events fired by `FileHTML5`.
     * 
     * @method _uploadEventHandler
     * @param event The event dispatched during the upload process.
     * @protected
     */
    _uploadEventHandler: function (event) {
      switch (event.type) {
        case 'uploadstart':
          this.emit('uploadstart', event);
        break;
        case 'uploadprogress':
          this.emit('uploadprogress', event);
        break;
        case 'uploadcomplete':
          this.emit('uploadcomplete', event);
        break;
        case 'uploaderror':
          this.emit('uploaderror', event);
        break;
        case 'uploadcancel':
          this.emit('uploadcancel', event);
        break;
      }
    },

    /**
     * Adjusts the content of the `fileList` based on the results of file selection
     * 
     * @method _updateFileList
     * @param files {FileList} The file list received from the uploader.
     * @protected
     */
    _updateFileList: function(files) {
      var newfiles = files,
          parsedFiles = [],
          filterFunc = this.get('fileFilter');

      if (filterFunc) {
        _.each(newfiles, function(value) {
          var newfile = new FileHTML5(value);
          if (filterFunc(newfile)) {
            parsedFiles.push(newfile);
          }
        });
      } else {
        _.each(newfiles, function(value) {
          parsedFiles.push(new FileHTML5(value));
        });
      }

      if (parsedFiles.length > 0) {
        var oldfiles = this.getFileList();
        this._fileList = oldfiles.concat(parsedFiles);

        this.emit('fileselect', {fileList: parsedFiles});

        if (this.get('uploadOnSelect')) {
          this.uploadThese(parsedFiles);
        }
      }
    },

    getFileList: function() {
        return this._fileList.concat();
    },

    uploadThese: function(files) {
      var self = this, url = self.get('uploadURL');
      files.forEach(function(file) {
        self.upload(file, url);
      });
    },

    removeFile: function(id) {
      this._fileList = _.filter(this._fileList, function(item) {
        if (item.get('id') === id) {
          item.destroy();
          self.emit('fileremove', {file: file});
          return false;
        }
        return true;
      });
    }

  });

  // Attaches static utilities.
  Uploader.genImageFileThumbnail = utils.genImageFileThumbnail;

  return Uploader;
});

/* vim: set fdm=marker et ff=unix et sw=2 ts=2 sts=2 tw=100: */
