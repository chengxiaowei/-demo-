define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

    //导航
    var nav = require('common/ui/nav/nav'); 
    new nav({ 
        clickBtn : '#jCategory', 
        isShowCloud : false 
    });
    
	var eGoodsDetailCntData = $('#jGoodsDetailCntData'), // 商品详情内容数据
		eGoodsDetailCnt = $('#jGoodsDetailCnt'), // 商品详情内容
		defaultUrl = '';	//默认图片地址

    var imageLazyLoader = null;

    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url',
          load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error');
            }
          }
        });
        return imageLazyLoader;
    }

    /**
	 * 商品详情页图片懒加载
	 */
	loadGoodsDetail();

	function loadGoodsDetail() {
		var eGoodsIntro = $('<div>'+eGoodsDetailCntData.val()+'</div>');
		var eImg = eGoodsIntro.find('img');
		eImg.each(function() {
			var $this = $(this), src = $this.attr('src'), size = getSizeByUri(src);
			$this.attr('data-url', src);
			$this.removeClass('jImg');
			$this.attr('src', defaultUrl);
			// 防止编辑没有定义宽度，导致数据一次性加载
			if (size) {
				var w = $('body').width(), h = size.h;
				$this.css({
					width : w,
					height : size.h * w / size.w
				});
			}
			$this.addClass('jImg img-error');
		});
		eGoodsDetailCnt.html(eGoodsIntro);
		resetImageLoader();
	}

	//获取图片大小
	function getSizeByUri(picUri) {
		var size = {};
		var ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)\!([0-9]+)$/;
		var items = ptn.exec(picUri);
		if (items) {
			size.w = parseInt(items[1]);
			size.h = parseInt(items[2]);
			size.size = parseInt(items[4]);
		} else {
			ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)$/;
			items = ptn.exec(picUri);
			if (items) {
				size.w = parseInt(items[1]);
				size.h = parseInt(items[2]);
				size.size = size.w;
			} else {
				size = null;
			}
		}
		return size;
	}

});
