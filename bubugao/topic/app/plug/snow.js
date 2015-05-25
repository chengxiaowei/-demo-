/*******************************************************************************
 * Snow Effect Script- By Altan d.o.o. (http://www.altan.hr/snow/index.html)
 * Visit Dynamic Drive DHTML code library (http://www.dynamicdrive.com/) for
 * full source code Last updated Nov 9th, 05' by DD. This notice must stay
 * intact for use
 ******************************************************************************/
 define(function(require, exports, module) {
    'use strict';

    //import public lib
    var $ = require('jquery');
    function Snow(opt) {
        $.extend(this, this.defaultSetting, opt || {});
        this.init();
    };
    Snow.prototype = {
    	defaultSetting: {
            selector : '',
            itemSize : 20,//飘点个数
            hidesnowtime: 0,//消失时间
            arrSnowSrc: [ 'snow-1', 'snow-2', 'snow-3', 'snow-4', 'snow-5', 'snow-6', 'snow-7', 'snow-8', 'snow-9' ],
            showTime : 10,
            dx:[],
            xp:[],
            yp:[],
            am:[],
            stx:[],
            sty:[],
            list:[],
            callback:function(){}
        },
        init:function(){
        	var self = this,$body = $('body');  
			if(self.selector){
				self.docWidth = parseInt(self.selector.width()) - 100;
				self.docHeight = self.selector.height();
			}else{
				self.docWidth = parseInt($body.width()) - 100;
				self.docHeight = parseInt($body.height());
			}
			
			self.creatDiv();
			self.snowEvent();
			if (self.hidesnowtime > 0)
				setTimeout(function(){self.hidesnow();}, self.hidesnowtime * 1000);
			 
        },
        creatDiv:function(){
        	var self = this,divStr =  ''; 
        	for (var i = 0; i < self.itemSize; i++) {
        		self.dx[i] = 0; // set coordinate variables
				self.xp[i] = Math.random() * (self.docWidth - 20); // set position variables
				self.yp[i] = Math.random() * self.docHeight;
				self.am[i] = Math.random() * 20; // set amplitude variables
				self.stx[i] = 0.02 + Math.random() / 10; // set step variables
				self.sty[i] = 0.7 + Math.random(); // set step variables
        		if(parseInt(Math.random() * 3)==0){
					self.list[i] = $('<div id="dot' + i + '" style="position: absolute; z-index: ' + (100 + i) + '; visibility: visible; top: 15px; left: 15px;" class="' + self.arrSnowSrc[0] + '"></div>');	
				}else{ 
					self.list[i] = $('<div id="dot' + i + '" style="position: absolute; z-index: ' + (100 + i) + '; visibility: visible; top: 15px; left: 15px;" class="' + self.arrSnowSrc[parseInt((Math.random() * self.arrSnowSrc.length))] + '"></div>');
				}
				if(self.selector){
					self.selector.append(self.list[i]);
				}else{
					$('body').append(self.list[i]);
				}
				
        	}
        	
        },
		snowEvent:function(){
			var self = this; 
			for (var i = 0; i < self.itemSize; i++) { 
				self.yp[i] += self.sty[i];
				if (self.yp[i] > self.docHeight - 50) {
					self.xp[i] = Math.random() * (self.docWidth - self.am[i] - 30);
					self.yp[i] = 0;
					self.stx[i] = 0.02 + Math.random() / 10;
					self.sty[i] = 0.7 + Math.random();
				}
				self.dx[i] += self.stx[i];
				if(self.selector){
					self.selector.find('div:eq('+i+')').css('top',self.yp[i] + "px");
				}else{
					self.list[i].css('top',self.yp[i] + "px");
				}
				var _left =self.xp[i] + self.am[i] * Math.sin(self.dx[i]);
				if(_left > self.docWidth){
					_left = _left - 100;
				}
				if(self.selector){
					self.selector.find('div:eq('+i+')').css('left',_left + "px");
				}else{
					self.list[i].css('left',_left + "px");
				} 
			}
			self.snowtimer = setTimeout(function(j){ 
				self.snowEvent();
			}, self.showTime*10);
		}, 
		hidesnow:function() {
			var self = this;
			if (self.snowtimer){
				clearTimeout(self.snowtimer);
			}
			for (var i = 0; i < self.itemSize; i++){
				self.list[i].css('visibility','hidden');
			}
		}
    };

    return function( opt ){
        new Snow( opt )
    };
});