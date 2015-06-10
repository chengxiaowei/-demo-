define(function(require, exports, module) {
    'use strict';
     var $ = require("jquery");
//   var _ = require('pub/plugins/min-bar');
//      _ = require('pub/plugins/hd/category');
//      _ = require('pub/plugins/site-nav');
//      _ = require('pub/plugins/hd/auto-search');
//      _ = require('app/plug/timeout');
//      _ = require('app/plug/lazyLoadData');
//      _ = require('app/plug/timeout');
        
        function slider(slide,slideBtnup,slideBtndn){
        	var that = this;
        	that.FNum=that.tempNum=$(slide+" .slider_nav"+" .content"+" .box").length-4;
        	$(slide+" .slider_nav"+" .content"+" .box").each(function(index){
        		$(this).on('click',function(){
        			that.swichBigimg(index);
        			that.swichBigtitle(index);
        		});
        	});
        	this.BtnUpClick = function(){
        		if(that.FNum<that.tempNum){
        			$(slideBtndn).off('click');
        			that.FNum++;
        			$(slide+" .slider_nav"+" .content_img").animate({top: '+=140',}, 500, function() {
        				$(slideBtndn).on('click',that.BtnDnClick)});
        		}
        		
        	},
        	this.BtnDnClick = function(){
        		if(that.FNum>0){
        			$(slideBtnup).off('click');
        			that.FNum--;
        			$(slide+" .slider_nav"+" .content_img").animate({top: '-=140',}, 500, function() {
        				$(slideBtnup).on('click',that.BtnUpClick)});
        		}
        	},
        	this.swichBigimg = function(index){
        		$(slide+" .slider_content"+" .jImg").each(function(index){
        			$(this).animate({opacity: 0}, 300);
        	    });
        	    $($(slide+" .slider_content"+" .jImg")[index]).animate({opacity: 1}, 300);
        	    $($(slide+" .slider_content"+" .jImg")[index]).css('display','block');
        	},
        	this.swichBigtitle = function(index){
        		$(slide+" .slider_content"+" .slider_content_title"+" .slider_content_smalltitle").each(function(index){
        			$(this).animate({opacity: 0}, 300);
        	    });
        	    $($(slide+" .slider_content"+" .slider_content_title"+" .slider_content_smalltitle")[index]).animate({opacity: 1}, 300);
        	     $($(slide+" .slider_content"+" .slider_content_title"+" .slider_content_smalltitle")[index]).css('display','block');
        	}
        	$(slideBtnup).on('click',this.BtnUpClick);
        	$(slideBtndn).on('click',this.BtnDnClick);
        		that.swichBigimg(0);
        	that.swichBigtitle(0);
        }
        var slider1 = new slider(".slider1",".slider1 .slider_nav .btnUP",".slider1 .slider_nav .btnDN");
});