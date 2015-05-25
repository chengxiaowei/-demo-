/**
 * 图片懒加载组建，
 */
var Slide = new Class({
	Implements : [ Options ],
	options : {
		attr : 'data-img',// 实际的地址
		duration : 5000,// 每个多久轮播一次
		container : 'slide'// 容器
	},
	initialize : function(options) {
		var _this = this;
		this.setOptions(options);
		$$('.'+_this.options.container).each(function(item,index){
			var eSlideItems = item.getElements('.slide-list li');
			if(eSlideItems && eSlideItems.length == 0){
				return;
			}
			var eNums = item.getElements('.slide-num a');
			var isStop = false, oldIndex = 0, curIndex = 0, attr = _this.options.attr, itemCount = eNums.length;
			eNums.addEvents({
				mouseenter : function() {
					curIndex = this.index();
					setCurrent();
				}
			});
			function setCurrent() {
				eNums.removeClass('hover');
				eNums[curIndex].addClass('hover');
				var curItem = eSlideItems[curIndex];
				var dataImg = curItem.get(attr);
				if (dataImg) {
					BBG.img.load(dataImg, function() {
						curItem.setStyles({
							'background-image' : 'url(' + dataImg + ')'
						});
						curItem.erase(attr);
					});
				}
				// 大图切换
				if (oldIndex != curIndex) {
					eSlideItems[oldIndex].set('morph', {
						duration : 500
					}).morph({
						opacity : 0,
						'z-index' : 1
					});
				}
				curItem.set('morph', {
					duration : 1000
				}).morph({
					opacity : 1
				});
				curItem.setStyles({
					'z-index' : 9
				});
				oldIndex = curIndex;
			}
			setCurrent();
			if (_this.options.duration > 0) {
				item.addEvents({
					mouseenter : function() {
						isStop = true;
					},
					mouseleave : function() {
						isStop = false;
					}
				});
				var clearTime = setInterval(function() {
					if (!isStop) {
						curIndex++;
						if (curIndex >= itemCount) {
							curIndex = 0;
						}
						setCurrent();
					}
				}, _this.options.duration);
			}
		});
	}
});