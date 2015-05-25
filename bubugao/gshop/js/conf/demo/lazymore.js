define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

  	var io = require('common/kit/io/request');

  	var src = '/html/demo/api/lazymore.php';
  	
  	var lazyMore = function(){
  		new Lazyload('.jScroll .jPage', {
	      	type: 'html',
	        placeholder: '<div class="loading">正在加载，请稍后...</div>',
	        load: function(el) {
	        	var page = $(el).attr('data-page');
	        	if(!$(el).hasClass('load')){
	          		io.get(src,{"page":page}, function(res) { 
	          			var html = unescape(res);
	          			$(el).html(html).addClass('load'); 
	          			$(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
	          			lazyMore();
	          		});
	          	}
	        }
	    });
  	}

  	lazyMore();

});
