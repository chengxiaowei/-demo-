/**
 * File upload html5 implement.
 *
 * @module lib/plugins/uploader/filehtml5
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var _ = require('../../../lodash/3.1.0/lodash');
  var Events = require('./events');
  var Attribute = require('./attribute');

  /**
   * Checks whether a specific native file instance is valid
   *
   * @method isValidFile
   * @param file {File} A native File() instance.
   * @static
   */
  var isValidFile = function(file) {
    return (window && window.File && file instanceof File);
  };

  /**
   * Checks whether the browser has a native upload capability
   * via XMLHttpRequest Level 2.
   *
   * @method canUpload
   * @static
   */
  var canUpload = function() {
    return (window && window.FormData && window.XMLHttpRequest);
  };

  var fileseed = 0;

  /**
   * The class provides a wrapper for a file pointer.
   *
   * @class FileHTML5
   * @constructor
   * @param {Object} config Configuration object.
   * @author Allex Wang <http://iallex.com>
   */
  var FileHTML5 = function(o) {
    var self = this, file = null;

    if (isValidFile(o)) {
      file = o;
    }
    else if (isValidFile(o.file)) {
      file = o.file;
    }
    else {
      file = null;
    }

    if (file && canUpload()) {
      if (!file.id) file.id = '__fileh5_' + ++fileseed;
      _.each(['id', 'name', 'size', 'type'], function(p) {
        self.set(p, file[p]);
      });
      self.set('file', file);
    }
  };

  _.extend(FileHTML5.prototype, Events.prototype, Attribute, {

    /**
     * Handler of events dispatched by the XMLHTTPRequest.
     *
     * @method _uploadEventHandler
     * @param {Event} event The event object received from the XMLHTTPRequest.
     * @protected
     */      
    _uploadEventHandler: function(event) {
      var xhr = this.get('xhr');

      switch (event.type) {
        case 'progress':
          /**
           * Signals that progress has been made on the upload of this file. 
           *
           * @event uploadprogress
           * @param event {Event} The event object for the `uploadprogress` with the
           *                      following payload:
           *  <dl>
           *      <dt>originEvent</dt>
           *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
           *      <dt>bytesLoaded</dt>
           *          <dd>The number of bytes of the file that has been uploaded.</dd>
           *      <dt>bytesTotal</dt>
           *          <dd>The total number of bytes in the file (the file size)</dd>
           *      <dt>percentLoaded</dt>
           *          <dd>The fraction of the file that has been uploaded, out of 100.</dd>
           *  </dl>
           */
          this.emit('uploadprogress', {originEvent: event,
                                       bytesLoaded: event.loaded, 
                                       file: this,
                                       bytesTotal: this.get('size'), 
                                       percentLoaded: Math.min(100, Math.round(10000*event.loaded/this.get('size'))/100)
                                       });
          this.set('bytesUploaded', event.loaded);
          break;

        case 'load':
          /**
           * Signals that this file's upload has completed and data has been received from the server.
           *
           * @event uploadcomplete
           * @param event {Event} The event object for the `uploadcomplete` with the
           *                      following payload:
           *  <dl>
           *      <dt>originEvent</dt>
           *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
           *      <dt>data</dt>
           *          <dd>The data returned by the server.</dd>
           *  </dl>
           */
          if (xhr.status >= 200 && xhr.status <= 299) {
            var response = event.target.responseText;
            try {
              response = JSON.parse(response)
            } catch (e) {}
            this.emit('uploadcomplete', {originEvent: event,
                                         file: this,
                                         data: response});
            var xhrupload = xhr.upload,
                boundEventHandler = this.get('boundEventHandler');

            xhrupload.removeEventListener ('progress', boundEventHandler);
            xhrupload.removeEventListener ('error', boundEventHandler);
            xhrupload.removeEventListener ('abort', boundEventHandler);
            xhr.removeEventListener ('load', boundEventHandler); 
            xhr.removeEventListener ('error', boundEventHandler);
            xhr.removeEventListener ('readystatechange', boundEventHandler);

            this.set('xhr', null);
          }
          else {
            this.emit('uploaderror', {originEvent: event,
                                      status: xhr.status,
                                      file: this,
                                      statusText: xhr.statusText,
                                      source: 'http'});
           }
           break;

        case 'error':
          /**
           * Signals that this file's upload has encountered an error. 
           *
           * @event uploaderror
           * @param event {Event} The event object for the `uploaderror` with the
           *                      following payload:
           *  <dl>
           *      <dt>originEvent</dt>
           *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
           *      <dt>status</dt>
           *          <dd>The status code reported by the XMLHttpRequest. If it's an HTTP error,
                          then this corresponds to the HTTP status code received by the uploader.</dd>
           *      <dt>statusText</dt>
           *          <dd>The text of the error event reported by the XMLHttpRequest instance</dd>
           *      <dt>source</dt>
           *          <dd>Either "http" (if it's an HTTP error), or "io" (if it's a network transmission 
           *              error.)</dd>
           *
           *  </dl>
           */
          this.emit('uploaderror', {originEvent: event,
                                    file: this,
                                    status: xhr.status,
                                    statusText: xhr.statusText,
                                    source: 'io'});
          break;

        case 'abort':
          /**
           * Signals that this file's upload has been cancelled. 
           *
           * @event uploadcancel
           * @param event {Event} The event object for the `uploadcancel` with the
           *                      following payload:
           *  <dl>
           *      <dt>originEvent</dt>
           *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
           *  </dl>
           */
          this.emit('uploadcancel', {originEvent: event, file: this});
          break;

        case 'readystatechange':
          /**
           * Signals that XMLHttpRequest has fired a readystatechange event. 
           *
           * @event readystatechange
           * @param event {Event} The event object for the `readystatechange` with the
           *                      following payload:
           *  <dl>
           *      <dt>readyState</dt>
           *          <dd>The readyState code reported by the XMLHttpRequest instance.</dd>
           *      <dt>originEvent</dt>
           *          <dd>The original event fired by the XMLHttpRequest instance.</dd>
           *  </dl>
           */
          this.emit('readystatechange', {readyState: event.target.readyState,
                                          file: this,
                                          originEvent: event});
          break;
      }
    },

    /**
     * Starts the upload of a specific file.
     *
     * @method startUpload
     * @param url {String} The URL to upload the file to.
     * @param parameters {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
     * @param fileFieldName {String} (optional) The name of the POST variable that should contain the uploaded file ('Filedata' by default)
     */
    startUpload: function(url, parameters, fileFieldName) {

      this.set('bytesUploaded', 0);

      this.set('xhr', new XMLHttpRequest());
      this.set('boundEventHandler', _.bind(this._uploadEventHandler, this));
                   
      var uploadData = new FormData(),
          fileField = fileFieldName || 'Filedata',
          xhr = this.get('xhr'),
          xhrupload = this.get('xhr').upload,
          boundEventHandler = this.get('boundEventHandler');

      _.each(parameters, function (value, key) {uploadData.append(key, value);});
      uploadData.append(fileField, this.get('file'));

      xhr.addEventListener ('loadstart', boundEventHandler, false);
      xhrupload.addEventListener ('progress', boundEventHandler, false);
      xhr.addEventListener ('load', boundEventHandler, false);
      xhr.addEventListener ('error', boundEventHandler, false);
      xhrupload.addEventListener ('error', boundEventHandler, false);
      xhrupload.addEventListener ('abort', boundEventHandler, false);
      xhr.addEventListener ('abort', boundEventHandler, false);
      xhr.addEventListener ('loadend', boundEventHandler, false); 
      xhr.addEventListener ('readystatechange', boundEventHandler, false);

      xhr.open('POST', url, true);

      xhr.withCredentials = this.get('xhrWithCredentials');

      _.each(this.get('xhrHeaders'), function (value, key) {
        xhr.setRequestHeader(key, value);
      });

      xhr.send(uploadData);

      /**
       * Signals that this file's upload has started. 
       *
       * @event uploadstart
       * @param event {Event} The event object for the `uploadstart` with the
       *                      following payload:
       *  <dl>
       *      <dt>xhr</dt>
       *          <dd>The XMLHttpRequest instance handling the file upload.</dd>
       *  </dl>
       */
       this.emit('uploadstart', {xhr: xhr, file: this});
    },

    isUploaded: function() {
      return this.get('bytesUploaded') === this.get('size');
    },

    /**
     * Cancels the upload of a specific file, if currently in progress.
     *
     * @method cancelUpload
     */    
    cancelUpload: function () {
      this.get('xhr').abort();
    },

    /**
     * Destroy the file instance.
     *
     * @method destroy
     */
    destroy: function() {
      var xhr = this.get('xhr');
      if (xhr) {
        this.cancelUpload();
      }
      this.off();
      this.set('xhr', null);
    }

  });

  return FileHTML5;
});

/* vim: set fdm=marker et ff=unix et sw=2 ts=2 sts=2 tw=100: */
