/**
 * IO demo for development kit, (post, get, jsop, etc,.)
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var builder = require('common/kit/dom/build');
    var io = require('common/kit/io/request');

    var eventHandles = {
        'post': function(e) {
            e.preventDefault();
            var url = './api/json.php?t=post&delay=2';
            var sender = this;
            io.post(url, {foo: 'bar param value'}, function(e) {
                console.log('resule: ', e.data);
                console.log('message: ', e.msg);
            }, function(e) {
                console.log('request unexception error');
            }, sender);
        },
        'jsonp': function(e) {
            e.preventDefault();
            var url = './api/json.php?t=jsonp&delay=3';
            var sender = this;
            io.jsonp(url, {foo: 'oh, yeah yeah'}, function(e) {
                console.log('resule: ', e.data);
                console.log('message: ', e.msg);
            }, function(e) {
                console.log('unexception error');
            }, sender);
        }
    }

    var nodeList = builder.parseNodes($('.mod-demo-io'), null, true);

    $.each(nodeList, function(k, el) {
        var fn = eventHandles[k];
        if (typeof fn === 'function') {
            $(el).click(fn);
        }
    });
});
