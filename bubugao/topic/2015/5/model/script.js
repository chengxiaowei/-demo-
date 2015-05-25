define(function(require, exports, module) {
	'use strict';
	var $ = require("jquery");
	var _ = require('pub/plugins/min-bar');
	_ = require('pub/plugins/hd/category');
	_ = require('pub/plugins/site-nav');
	_ = require('pub/plugins/hd/auto-search');
	_ = require('app/plug/timeout');
	_ = require('app/plug/lazyLoadData');
	_ = require('app/plug/timeout');
	_ = require('app/plug/scrollNav');
	_ = require('app/plug/miaosha');

	var loadData = require('pub/plugins/load-data');
	var lazyBlock = require('pub/plugins/lazy-block');
	var floorTab = require('app/plug/floorTab');
	var addTag = require('pub/plugins/add-tag');
	var getProductIcon = require('pub/plugins/get-product-icon'); //获取商品标签
	
	var listLazy = require('app/plug/jquery.list.lazy');
    var countDown = require('pub/plugins/jquery.countDown');
	listLazy({
        selector: '#jListLeft',
        listItem: '.jListItem',
        laodItem: '#jLoadBox',
        successFun: function(data) {
            $('#jListLeft').append(data);
        }
    });

    $.each($('.jListItem'), function() {
        var timeCount = $(this).find('.jCountTime').attr('data-endTime'),
            $this = $(this);
        	timeOutDown($this,timeCount,{timeText: ['天', '时', '分', '秒'],container:$this.find('.jCountTime'),type:{
                    'd': true,
                    'h': true,
                    'm': true,
                    's': true
                }});
    });
    var $closeTime = $('.jCloseTime');
    timeOutDown(null,$closeTime.attr('data-endTime'),{timeText:['天', '时', '分'],container:$closeTime,type:{
                    'd': true,
                    'h': true,
                    'm': true,
                    's': false
                }});
    function timeOutDown($obj,endTime,opt){
    	if (endTime && endTime != "") {
            countDown({
                url: 'http://api.mall.yunhou.com/Time',
                timeText:opt.timeText,
                container: opt.container,
                isShowTimeText: true,
                type: opt.type,
                callback: function() {
                    $obj && $obj.find('.sale-tag-mod').show();
                }
            });
        }
    }
    
	var $item = $('.jFloorItem'),nowDay=new Date().getDate();
	 
	lazyLoad($item[0]);

	$(".btnbox ul li").each(function() {

		if ($(this).attr("data-num") == nowDay) {
			$(".btnbox ul li").removeClass("active");
			$(this).addClass("active");
		}
	});

	$(".btnbox ul li").on("click", function() {
			var i = $(".btnbox ul li").index(this);
			$(".btnbox ul li").removeClass("active");
			$(this).addClass("active");
			$(".list").css("display", "none");
			$(".list").eq(i).css("display", "block");
			lazyLoad($item[i]);
		})
	 


	function lazyLoad(item) {
		lazyBlock({
			selector: item,
			callback: function(elm) {
				loadData({
					elm: elm.find('ul'),
					okFn: function(data) {

						BBG.animitLi();
						getProductIcon({
							parent: elm
						});
						addTag({
							parent: elm
						});
					}
				});
			}
		});
	}
});