/**
 * 图片懒加载组建，
 */
var ImgLazy = new Class({
	Implements : [ Options ],
	options : {
		range : 0,// 多加载部分，提高用户体验
		attr : 'data-url',// 实际的地址
		selector : 'img',// 需要做处理的
		container : window,// 容器
		isFade : true,// 是否支持动画
		model : 'y',// 目前支做垂直方向，因为水平方向暂时没这个需求
		attrBg: 'data-bg'
	},
	initialize : function(options) {
		this.setOptions(options);
		this.container = document.id(this.options.container);
		this.elements = this.container.getElements ? this.container.getElements(this.options.selector) : document.getElements(this.options.selector);
		var loading = function() {
			var container = this.container;
			var range = this.options.range;
			var model = this.options.model;
			var attr = this.options.attr;
			var attrBg = this.options.attrBg;
			var isFade = this.options.isFade;
			this.elements.each(function(el) {
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
							if(el.get(attrBg)&&el.get(attrBg)=="lazyload"){
								el.setStyle('background-image' , 'url(' + dataUrl + ')');
							}else{
								el.set('src', dataUrl);
							}
							el.erase(attr);
							new Fx.Tween(el, {
							    duration: 500,
							    transition: 'bounce:out',
							    link: 'ignore',
							    property: 'opacity'
							}).start(0.6, 1);
							
						});
					}
				}
			});
		}.bind(this);
		this.container.addEvent('resize', loading);
		this.container.addEvent('scroll', loading);
		loading();
	}
});