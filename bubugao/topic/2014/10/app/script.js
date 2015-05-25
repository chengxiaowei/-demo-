define(function(require, exports, module) {
    'use strict'; 
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');
	var $ = require('jquery');

    var eBody = $("body"),bodyScrollTop;
	var eNav = $('#jAppNav');
	var eTop = $('#jTop');
	var eNavList = eNav.find('li');
	var $win = $(window);
	eTop.bind('click',function(){
		window.scrollTo(0, 0);
	})
	function scrollNav(){
		bodyScrollTop =  parseInt($(document).scrollTop());
		if((eNav.height()+300) > $win.height()){
			eNav.css('top',($win.height()-eNav.height())/2);
		}
		if(bodyScrollTop <= $('#com2')[0].offsetTop){ 
			eNavList.removeClass('select');
			eNavList.eq(0).addClass('select'); 
		}
		if(bodyScrollTop >= $('#com2')[0].offsetTop){
			 eNavList.removeClass('select');
			eNavList.eq(1).addClass('select');
		}
		if(bodyScrollTop >= $('#com3')[0].offsetTop){
			eNavList.removeClass('select');
			eNavList.eq(2).addClass('select');
		}
		if(bodyScrollTop >= $('#com4')[0].offsetTop){
			eNavList.removeClass('select');
			eNavList.eq(3).addClass('select');
		}
		if(bodyScrollTop >= $('#com5')[0].offsetTop){
			eNavList.removeClass('select');
			eNavList.eq(4).addClass('select');
		}
		if(bodyScrollTop >= $('#com6')[0].offsetTop){
			eNavList.removeClass('select');
			eNavList.eq(5).addClass('select');
		}
		if(bodyScrollTop >= $('#com7')[0].offsetTop){
			eNavList.removeClass('select');
			eNavList.eq(6).addClass('select');
		}
		if(bodyScrollTop >= $('#com8')[0].offsetTop){
			eNavList.removeClass('select');
			eNavList.eq(7).addClass('select');
			eTop.css('display','block');
		}else{
			eTop.css('display','none');
		}

	}
	eNavList.bind('click',function(){
		eNavList.removeClass('select');
		eNavList.eq($(this).index()).addClass('select');
	});

	scrollNav();
	$win.bind({
		'scroll' : scrollNav
	});
})