define(function(require, exports, module) {
    'use strict'; 
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
	var apphot_Hover = $('#apphot_Hover');
    var apphot_Hover_select = $('#apphot_Hover_select');
    if(apphot_Hover){ 
		apphot_Hover.hover(function() {
				$('#apphot_select').css("display","none");
                $('#apphot_Hover_select').css("background","none"); 
                $('#apphot_Hover').css("background","none"); 
		});
	}
	if(apphot_Hover_select){ 
		apphot_Hover_select.hover(function() {
				$('#apphot_select').css("display","block");
                $('#apphot_Hover').css("background-image","url(img/bt-selected-1.png)"); 
                $('#apphot_Hover_select').css("background-image","url(img/bt-selected-2.png)"); 
		});
	}
});