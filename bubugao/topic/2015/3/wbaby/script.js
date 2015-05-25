define(function(require, exports, module) {
    'use strict';
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');

    var eBody = $("body"),bodyScrollTop;  
	function scrollNav(){
		bodyScrollTop =  parseInt($(window).scrollTop());
		console.log('bodyScrollTop:'+bodyScrollTop);
		if (bodyScrollTop <= $('#com6')[0].offsetTop)
			eBody.css('background-image','url('+$('#com6').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com7')[0].offsetTop)
			eBody.css('background-image','url('+$('#com6').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com8')[0].offsetTop)
			eBody.css('background-image','url('+$('#com6').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com1').offset().top) 
			eBody.css('background-image','url('+$('#com6').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com2')[0].offsetTop)
			eBody.css('background-image','url('+$('#com1').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com3')[0].offsetTop) 
			eBody.css('background-image','url('+$('#com2').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com4')[0].offsetTop) 
			eBody.css('background-image','url('+$('#com3').attr('data-url')+')'); 
		else if (bodyScrollTop <= $('#com5')[0].offsetTop)
			eBody.css('background-image','url('+$('#com4').attr('data-url')+')'); 
		else  eBody.css('background-image','url('+$('#com4').attr('data-url')+')'); 

	}

	
 
	 

	$(window).bind({
		'scroll' : scrollNav
	});

});