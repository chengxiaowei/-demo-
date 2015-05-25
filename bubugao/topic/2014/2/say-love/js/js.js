(function() {
	// 背景图片懒加载
	bgLazyLoading();
	function bgLazyLoading() {
		var container = $(window);
		var loading = function() {
			var model = 'y';
			var attr = 'data-url';
			var isFade = false;
			var range = 0;
			$$(".jBg").each(function(el) {
				var wTop = container.getScroll()[model];
				var wHeight = container.getSize()[model] + range;
				var wPosition = wTop + wHeight; // 当前屏幕位置 = 当前滚动条位置+屏幕高度
				var imgHeight = el.getSize()[model];
				var imgTop = el.getPosition()[model];
				var imgPosition = imgTop + imgHeight; // 当前图片位置 = 当前滚动条位置+屏幕高度
				if ((imgPosition >= wTop && imgPosition <= wPosition) || imgTop <= wPosition && imgPosition >= wPosition) {
					var dataUrl = el.get(attr);
					if (dataUrl) {
						BBG.img.load(dataUrl, function() {
							el.setStyles({
								'background-image' : 'url(' + dataUrl + ')'
							});
							el.erase(attr);
							new Fx.Tween(el, {
								duration : 500,
								transition : 'bounce:out',
								link : 'ignore',
								property : 'opacity'
							}).start(0.6, 1);
						});
					}
				}
			});
		};
		container.addEvent('resize', loading);
		container.addEvent('scroll', loading);
		loading();
	}

	// 提示框
	var Tips = {
		show : function(str, time) {
			var eTips = $("jTips");
			eTips.set('html', str);
			eTips.setStyles({
				display : 'block'
			});
			if (time && time > 0) {
				setTimeout(function() {
					eTips.hide();
				}, time);
			}
		},
		hide : function() {
			var eTips = $("jTips");
			eTips.setStyles({
				display : 'none'
			});
		}
	};

	// 防止浏览器缓存
	clearAll();
	function clearAll() {
		$('to').set('value', '');
		$('cnt').set('value', '');
		$('from').set('value', '');
		setTimeout(function() {
			$('to').focus();
		}, 100);
		$('cnt').addEvent('keydown', function(event) {
			if (event.code == 8 || event.code == 46){
				
			}else{
				if (this.get('value').length >= this.get('maxlength')) {
					return false;
				}
				if (event.code == 13) {
					return false;
				}
			}
		});
	}

	// 预览爱
	var eView = $("jView");
	eView.addEvent('click', function() {
		var url = getUrl();
		url && window.open(url);
	});

	// 拼接链接
	function getUrl(isUri) {
		var eTo = $('to').get('value'), eCnt = $('cnt').get('value'), eFrom = $('from').get('value');
		if (!(/^.{1,10}$/).test(eTo)) {
			Tips.show('【To】格式不对，由1-10位字符组成哦');
			return false;
		}
		if (!(/^.{1,40}$/).test(eCnt)) {
			Tips.show('【表白内容】格式不对，由1-40位字符组成哦');
			return false;
		}
		if (!(/^.{1,8}$/).test(eFrom)) {
			Tips.show('【From】格式不对，由1-8位字符组成哦');
			return false;
		}
		var str = 't=' + eTo + '&f=' + eFrom + '&c=' + eCnt;
		var host = 'http://www.yunhou.com/index.html?';
//		var host = 'http://10.201.3.99:8082/index.php/index.html?';
		str = encodeURI(str);
		if (isUri) {
			return encodeURIComponent(host + str);
		}
		return host + str;
		// return 'http://www.yunhou.com/index.php/?' + encodeURI(str);
		// return 'http://localhost:8082/index.php/index.html?' +
		// encodeURI(str);
	}

	// 说出爱
	sayLove();
	function sayLove() {
		var eSayLove = $('jSayLove');
		var eTexts = eSayLove.getElements('.txt');
		var eTips = eSayLove.getElements('.lbl-tips');
		eTips.each(function(item) {
			var eTxt = item.getSiblings('.txt')[0];
			item.addEvents({
				click : function() {
					eTxt.fireEvent('focus');
					item.setStyles({
						display : 'none'
					});
				}
			});
		});
		eTexts.each(function(item) {
			var len = item.get('maxlength');
			var title = item.get('title');
			var eTips = item.getSiblings('.lbl-tips')[0];
			var cntLen = 0;
			item.addEvents({
				focus : function() {
					cntLen = item.get('value').length;
					Tips.show(title + ' 还可以输入<b>&nbsp;' + (len - cntLen) + '&nbsp;</b>个字符');
					if (cntLen > 0) {
						eTips.setStyles({
							display : 'none'
						});
					}
				},
				click : function() {
					cntLen = item.get('value').length;
					Tips.show(title + ' 还可以输入<b>&nbsp;' + (len - cntLen) + '&nbsp;</b>个字符');
					if (cntLen > 0) {
						eTips.setStyles({
							display : 'none'
						});
					}
				},
				keyup : function() {
					cntLen = item.get('value').length;
					Tips.show(title + ' 还可以输入<b>&nbsp;' + (len - cntLen) + '&nbsp;</b>个字符');
					if (cntLen > 0) {
						eTips.setStyles({
							display : 'none'
						});
					}
				},
				blur : function() {
					Tips.show($("jTips").get('data-say'));
					if (item.get('value').length <= 0) {
						eTips.setStyles({
							display : 'block'
						});
					}
				}
			});
		});
	}
	// 分享爱
	shareLove();
	function shareLove() {
		var eShareLove = $('jShare');
		var eIcon = eShareLove.getElements('.icon');
		eIcon.each(function(item) {
			var type = item.get('data-type');
			item.addEvents({
				click : function() {
					getShareLink(type);
				}
			});
		});

		function getShareLink(type) {
			var url = getUrl(true);
			if (url) {
				var cnt = '今天我向【' + $('to').get('value') + '】表白了，而且上了@云猴网 的首页了喔，我的爱情请大家一起来见证！';
				var link = 'http://8.bubugao.com/share/commonShare.do?shareTo=' + type + '&content=' + encodeURIComponent(cnt) + '&url=' + url + '&title='+encodeURIComponent('大声说出你的爱')+'&imageUrl=' + encodeURIComponent('http://img01.bubugao.com/public/images/61/77/31/a6fb3591a6974547b9c1dc39d83d57f1.jpg?1392014212#w');
				window.open(link);
			}
		}
	}
})();