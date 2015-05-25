define(function(require, exports, module) {
    'use strict'; 
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout'); 
		setTimeout(function(){ 
			/*var music1 = new Element('object',{
				data : '//static5.bubugao.com/mall/topic/2014/7/july/bgmusic.mp3',
				type : 'application/x-mplayer2',
				width : '0',
				height : '0',
				html : '<param name="src" value="music.mp3"><param name="autostart" value="1"><param name="playcount" value="infinite">'
			});
			var music2 = new Element('bgsound',{
				src : '//static5.bubugao.com/mall/topic/2014/7/july/bgmusic.mp3'
			});
			music1.inject($('jMusic'));
			music2.inject($('jMusic'));*/
		},3000); 
});