/**
 * @deprecated 图片上传插件 需要引入css目录下的jquery.imgUpload.css
 * @param tabs
 *            {object} {FromLocal : { title : '本地上传', options : { albumList :
 *            'ajax/ajax-album-list.php'// 相册列表 } }, FromAlbum : { title :
 *            '相册上传', options : { albumList : 'ajax/ajax-album-list.php',// 相册列表
 *            albumImgList : 'ajax/ajax-album-img-list.php'// 相册图片列表 } },
 *            FromNet : { title : '网络图片', options : { } }}
 * @author djune 2014.7.21
 */
define(function(require, exports, module) {
	var _ = require('../core/bbg');
	_ = require('./jquery.uploadify');
	_ = require('./jquery.imgLoading');
	_ = require('./jquery.pager');

	var Dialog = require('../ui/dialog/dialog-plus');

	$.fn.imgUpload = function(options) {
		var defautls = {
			id: 'imgUpload',
			// 允许上传的最大图片数
			max: 50,
			fixed: false,
			event: 'click', // 绑定在元素的制定时间上面，如果是false，则直接显示
			tabs: { // 配置允许出现的tab数量，排序按照tabs属性的先后顺序

			},
			editConfig: [
				// 专供编辑器
				// {
				// 'name' : 'align',
				// 'text' : '居中',
				// 'default' : true
				// }
			],
			// uploadify 配置
			uploadify: {
				swf: 'uploadify.swf', // 上传图片不可以跨域
				uploader: 'http://10.200.51.192:9720/bubugao-img-center/api', // 上传文件的接口
				formData: { // 给 uploader 的参数
				},
				fileSizeLimit: '2048KB' // 单个图片大小限制,默认2M
			},
			/**
			 * 关闭回调
			 *
			 * @param data
			 *            {Array} 选择图片的返回值
			 */
			callback: function(data) {}
		};

		var opt = $.extend(true, {}, defautls, options || {});

		var Tips = {
			/**
			 * 错误
			 *
			 * @param {String}
			 *            content 内容
			 * @param {Dom
			 *            element} btn 按钮，只支持原生dom节点
			 * @param {int}
			 *            time 自动关闭时间，单位毫秒,默认:2000
			 *
			 */
			error: function(content, btn, time) {
				Dialog({
					'id': '_dialogError',
					'type': 'error',
					'align': 'top',
					'content': content
				}).time(btn, time);
			},
			/**
			 * 警告
			 *
			 * @param {String}
			 *            content 内容
			 * @param {Dom
			 *            element} btn 按钮，只支持原生dom节点
			 * @param {int}
			 *            time 自动关闭时间，单位毫秒,默认:2000
			 *
			 */
			warning: function(content, btn, time) {
				Dialog({
					'id': '_dialogWarning',
					'type': 'warning',
					'align': 'top',
					'content': content
				}).time(btn, time);
			},
			/**
			 * 警告
			 *
			 * @param {String}
			 *            content 内容
			 * @param {Dom
			 *            element} btn 按钮，只支持原生dom节点
			 * @param {int}
			 *            time 自动关闭时间，单位毫秒,默认:2000
			 *
			 */
			loading: function(content, btn, time) {
				return Dialog({
					'id': '_dialogWarning',
					'type': 'loading-text',
					'align': 'top',
					'content': content
				}).show(btn);
			}
		};

		// 全局变量
		var mainDialog, isUploading = false,
			cntId = 'jImgUpload' + opt.id,
			loadingDialog = null;

		// 私有选择器
		var _$ = function(str) {
			return $('#' + cntId + ' .' + str);
		}

		var IMG = {
			blankImg: '//s1.bbgstatic.com/pub/img/blank.gif',
			/**
			 * 等比压缩图片居中显示
			 *
			 * @param img
			 *            {HTMLElement} 图片
			 * @param size
			 *            {Int} 需要压缩至的实际宽度或者高度
			 *
			 */
			setSize: function(img, size) {
				var str = '';
				w = img.width,
					h = img.height,
					returnSize = {
						w: 0,
						h: 0,
						marginLeft: 0,
						marginTop: 0
					};
				if (w >= h) {
					returnSize.w = size;
					returnSize.h = h * returnSize.w / w;
				} else {
					returnSize.h = size;
					returnSize.w = w * returnSize.h / h;
				}
				returnSize.marginLeft = (size - returnSize.w) / 2;
				returnSize.marginTop = (size - returnSize.h) / 2;
				str += ' width:' + returnSize.w + 'px;';
				str += ' height:' + returnSize.h + 'px;';
				str += ' margin-left:' + returnSize.marginLeft + 'px;';
				str += ' margin-top:' + returnSize.marginTop + 'px;';
				return str;
			}
		}

		/**
		 * 选中的图片相关
		 */
		var SelectedImg = {
			imgSize: 80,
			init: function() {
				SelectedImg.count = 0;
				SelectedImg.initElms();
				SelectedImg.elms.eSelectedList.html('');
				SelectedImg.initEvent();
			},
			// 主要元素，避免重复使用选择器
			elms: 　{
				eSelectedList: null,
				eSelTotal: null,
				eSelBox: null,
				eSelOp: null
			},
			initElms: function() {
				SelectedImg.elms.eSelectedList = _$('jSelectedList'),
					SelectedImg.elms.eSelTotal = _$('jSelTotal'),
					SelectedImg.elms.eSelBox = _$('jSelBox'),
					SelectedImg.elms.eSelOp = _$('jSelOp')
			},
			// 判断图片是否重复添加
			imgIsExist: function(src) {
				if (SelectedImg.elms.eSelectedList.find('.jSelItem[data-src^="' + src + '"]').length > 0) {
					return true;
				}
				return false;
			},
			// 添加到选中列表
			add: function(src, id, isDialog) {
				if (SelectedImg.imgIsExist(src)) {
					Tips.warning('该图片已添加，不可以重复添加！');
					return;
				}
				if (isDialog) {
					loadingDialog = Tips.loading('正在为了添加图片,请稍后...');
				}
				BBG.IMG.load(src, function(img) {
					var str = '';
					str += '<li class="jSelItem" data-src="' + src + '" data-id="' + id + '">';
					str += '	<img class="jSelImg" style="' + IMG.setSize(img, SelectedImg.imgSize) + '" src="' + BBG.IMG.getImgByType(src, BBG.IMG.TYPE.s2) + '">';
					str += '	<div class="op-box">';
					str += '		<a href="javascript:;" class="op-del"><i class="icon iconfont">&#xe628;</i></a>';
					str += '	</div>';
					str += '</li>';
					SelectedImg.elms.eSelectedList.append(str);
					SelectedImg.setTotal(1);
					isDialog && loadingDialog.close();
					SelectedImg.elms.eSelBox.scrollTop(SelectedImg.elms.eSelectedList.height() - SelectedImg.elms.eSelBox.height());
				}, function() {
					isDialog && loadingDialog.close();
					Tips.error('添加图片失败，请重试！');
				});
			},
			// 从列表中删除
			del: function(src) {
				var elm = SelectedImg.elms.eSelectedList.find('.jSelItem[data-src^="' + src + '"]');
				if (elm.length > 0) {
					elm.remove();
					SelectedImg.setTotal(-1);
					for (var i in opt.tabs) {
						if (Tabs.Cnt[i].del) {
							Tabs.Cnt[i].del(src);
						}
					}
				}
			},
			// 移动位置
			move: function() {

			},
			// 获取所有选中图片列表
			getSrcLists: function() {
				var arr = [];
				SelectedImg.elms.eSelectedList.find('.jSelItem').each(function() {
					arr.push($(this).attr('data-src'));
				});
				return arr;
			},
			// 获取所有选中图片ID列表
			getIdLists: function() {
				var arr = [];
				SelectedImg.elms.eSelectedList.find('.jSelItem').each(function() {
					arr.push($(this).attr('data-id'));
				});
				return arr;
			},
			// 选择图片的张数
			count: 0,
			// 统计选中图片张数
			setTotal: function(count) {
				SelectedImg.count = SelectedImg.count + count;
				SelectedImg.elms.eSelTotal.html('已选图片(' + SelectedImg.count + ')');
			},
			initEvent: function() {
				// 删除当前元素
				SelectedImg.elms.eSelectedList.delegate(".jSelItem .op-del", "click", function() {
					var src = $(this).parent('.op-box').parent('.jSelItem').attr('data-src');
					SelectedImg.del(src);
				});

				// 设置当前元素
				SelectedImg.elms.eSelectedList.delegate(".jSelItem", "click", function() {
					SelectedImg.elms.eSelectedList.find('.jSelItem').removeClass('selected');
					$(this).addClass('selected');
					return false;
				});

				// 当前元素上移
				SelectedImg.elms.eSelOp.find('.drag-up').click(function() {
					var eLi = SelectedImg.elms.eSelectedList.find('.selected'),
						eBefore = eLi.prev('.jSelItem').eq(0);
					if (eBefore.length > 0) {
						eLi.insertBefore(eBefore);
						SelectedImg.elms.eSelBox.scrollTop(eLi.position().top);
					}
				});

				// 当前元素下移
				SelectedImg.elms.eSelOp.find('.drag-down').click(function() {
					var eLi = SelectedImg.elms.eSelectedList.find('.selected');
					eAfter = eLi.next('.jSelItem').eq(0);
					if (eAfter.length > 0) {
						SelectedImg.elms.eSelBox.scrollTop(eLi.position().top);
						eLi.insertAfter(eAfter);
					}
				});

				// 删除当前元素
				SelectedImg.elms.eSelOp.find('.drag-del').click(function() {
					var src = SelectedImg.elms.eSelectedList.find('.selected').attr('data-src');
					SelectedImg.del(src);
				});
			}
		}

		/**
		 * Tabs 切换操作相关
		 */
		var Tabs = {
			init: function() {
				Tabs.initElms();
				Tabs.elms.eTabCnt.html('');
				Tabs.bindHtml();
				Tabs.initEvent();
				Tabs.initEditConfig();
			},
			// 销毁Tab
			destroy: function() {
				for (var i in Tabs.Cnt) {
					Tabs.Cnt[i].destroy();
				}
			},
			getInitHtml: function() {
				var strHtml = '';
				strHtml += '<div class="upload-cnt" id="' + cntId + '">';
				strHtml += '<div class="cnt-inner clearfix">';
				strHtml += '	<div class="l-upload">';
				strHtml += '		<div class="tab">';
				strHtml += '			<div class="tab-title clearfix jTabTitle">';
				strHtml += '				<a class="hover" href="javascript:;" data-type="local">本地上传</a>';
				strHtml += '			</div>';
				strHtml += '		</div>';
				strHtml += '		<div class="tab-cnt jTabCnt">';
				strHtml += '			<div class="cnt-loading">加载中，请稍后...</div>';
				strHtml += '		</div>';
				strHtml += '	</div>';
				strHtml += '	<div class="r-selected">';
				strHtml += '		<div class="sel-total jSelTotal">';
				strHtml += '			已选图片(0)';
				strHtml += '		</div>';
				strHtml += '		<div class="sel-op jSelOp">';
				strHtml += '			<a href="javascript:;" class="drag-up">上移</a>';
				strHtml += '			<a href="javascript:;" class="drag-down">下移</a>';
				strHtml += '			<a href="javascript:;" class="drag-del">删除</a>';
				strHtml += '		</div>';
				strHtml += '		<div class="sel-box jSelBox">';
				strHtml += '			<ul class="sel-list jSelectedList">';
				strHtml += '			</ul>';
				strHtml += '		</div>';
				strHtml += '	</div>';
				strHtml += '</div>';
				strHtml += '<div class="btm-bn clearfix">';
				strHtml += '	<div class="btm-tips f-l jBtmTips">Welcome to use.</div>';
				strHtml += '	<div class="btm-btn f-r">';
				strHtml += '		<a href="javascript:;" class="btn btn-sec jUploadCancel">取消</a>';
				strHtml += '		<a href="javascript:;" class="btn jUploadSubmit">确定</a>';
				strHtml += '	</div>';
				strHtml += '</div>';
				strHtml += '</div>';
				return strHtml;
			},
			// 主要元素，避免重复使用选择器
			elms: 　{
				eTabTitle: null,
				eTabCnt: null,
				eCancel: null,
				eSubmit: null,
				eBtmTips: null
			},
			initElms: function() {
				Tabs.elms.eTabTitle = _$("jTabTitle");
				Tabs.elms.eTabCnt = _$('jTabCnt');
				Tabs.elms.eCancel = _$("jUploadCancel");
				Tabs.elms.eSubmit = _$("jUploadSubmit");
				Tabs.elms.eBtmTips = _$("jBtmTips");
			},
			Tips: {
				show: function(str) {
					Tabs.elms.eBtmTips.html(str || 'Welcome to use.');
				},
				clear: function() {
					Tabs.elms.eBtmTips.html('Welcome to use.');
				},
				time: function(str, time) {
					Tabs.Tips.show(str);
					setTimeout(function() {
						Tabs.Tips.clear();
					}, time || 5000);
				}
			},
			bindHtml: function() {
				var strTabs = '',
					temp = '',
					count = 0,
					firstTabName;
				for (var i in opt.tabs) {
					temp = '';
					if (count == 0) {
						temp = ' class="hover" ';
						firstTabName = i;
					}
					count++;
					strTabs += '<a href="javascript:;"' + temp + 'data-name="' + i + '">' + opt.tabs[i].title + '</a>'
				}
				if (strTabs == '') {
					$('#' + cntId).html('<div class="no-data">sorry,无tab数据~</div>');
					return false;
				}
				Tabs.elms.eTabTitle.html(strTabs);
				Tabs.initCnt(firstTabName);
			},
			initEvent: function() {
				// tab 切换
				var eTitle = Tabs.elms.eTabTitle.find('a');
				eTitle.click(function() {
					if (isUploading) {
						Tips.warning('正在上传,请稍后...');
						return false;
					}
					var $this = $(this),
						index = $this.attr('data-name');
					Tabs.initCnt(index);
					eTitle.removeClass('hover');
					$this.addClass('hover');
				});

				// 提交
				Tabs.elms.eSubmit.click(function() {
					opt.callback && opt.callback({
						id: SelectedImg.getIdLists(),
						src: SelectedImg.getSrcLists(),
						editConfig: Tabs.getEditConfig()
					});
					mainDialog && mainDialog.close().remove();
				});

				// 取消
				Tabs.elms.eCancel.click(function() {
					if (isUploading) {
						Tips.warning('正在上传,不可以关闭!!');
						return false;
					}
					mainDialog && mainDialog.close().remove();
				});
			},
			initEditConfig: function() {
				var str = '';
				for (var i = 0; i < opt.editConfig.length; i++) {
					var strChecked = '';
					if (opt.editConfig[i]['default']) {
						strChecked = 'checked';
					}
					str += '<label><input id="j' + opt.editConfig[i].name + opt.id + '" type="checkbox" ' + strChecked + '>' + opt.editConfig[i].text + '</label>'
				}
				Tabs.Tips.show(str);
			},
			getEditConfig: function() {
				var obj = {};
				for (var i = 0; i < opt.editConfig.length; i++) {
					var _elem = $('#j' + opt.editConfig[i].name + opt.id);
					if (_elem.length > 0) {
						obj[opt.editConfig[i].name] = _elem.prop('checked');
					}
				}
				return obj;
			},
			initCnt: function(name) {
				var curTabCntItem = _$("j" + name);
				$('.jTabCntItem').hide();
				if (curTabCntItem.length > 0) {
					curTabCntItem.show();
				} else {
					Tabs.Cnt[name].init();
				}
			},
			Cnt: {}
		};

		/**
		 * 相册上传
		 */
		Tabs.Cnt.FromAlbum = {
			init: function() {
				Tabs.Cnt.FromAlbum.bindHtml();
				Tabs.Cnt.FromAlbum.initEvent();
			},
			// 销毁当前tab
			destroy: function() {},
			elms: {
				eFromAlbum: null,
				eOpRefresh: null,
				eAlbumList: null,
				eImgBox: null,
				eImgPager: null
			},
			initElms: function() {
				Tabs.Cnt.FromAlbum.elms.eFromAlbum = _$('jFromAlbum');
				Tabs.Cnt.FromAlbum.elms.eOpRefresh = Tabs.Cnt.FromAlbum.elms.eFromAlbum.find('.op-refresh');
				Tabs.Cnt.FromAlbum.elms.eAlbumList = Tabs.Cnt.FromAlbum.elms.eFromAlbum.find('.jAlbumList');
				Tabs.Cnt.FromAlbum.elms.eImgBox = Tabs.Cnt.FromAlbum.elms.eFromAlbum.find('.jImgBox');
				Tabs.Cnt.FromAlbum.elms.eImgPager = Tabs.Cnt.FromAlbum.elms.eFromAlbum.find('.jImgPager');
			},
			bindHtml: function() {
				var str = '';
				str += '<div class="from-album jTabCntItem jFromAlbum">';
				str += '	<div class="com-title">';
				str += '		<select class="jAlbumList"></select>';
				str += '		<a href="javascript:;" class="f-r op-refresh">刷新</a>';
				str += '	</div>';
				str += '	<div class="img-box jImgBox">';
				str += '	</div>';
				str += '	<div class="com-pager jImgPager">';
				str += '	</div>';
				str += '</div>';
				Tabs.elms.eTabCnt.append(str);
				Tabs.Cnt.FromAlbum.initElms();
				Tabs.Cnt.FromAlbum.getAlbumList();
			},
			// 生成相册列表
			getAlbumList: function() {
				var str = '';
				if (opt.tabs['FromAlbum'].options.albumList) { // 上传到指定相册 to do
					loadingDialog = Tips.loading('正在加载,请稍后...');
					BBG.AJAX.get({
							url: opt.tabs['FromAlbum'].options.albumList
						},
						function(data) {
							if (data) {
								for (var i = 0; i < data.length; i++) {
									str += '<option value="' + data[i].albumId + '">' + data[i].albumName + '(' + data[i].picCount + ')</option>';
								}
								if (str == '') {
									str += '<option value="-1">无相册信息</option>';
								}
								Tabs.Cnt.FromAlbum.elms.eAlbumList.html(str);
								Tabs.Cnt.FromAlbum.getAlbumImgList();
							}
							loadingDialog.close();
						},
						function(data) {
							loadingDialog.close();
							Tips.error(data._error.msg)
						}
					);
				}
			},
			// 生成对应相册的图片列表
			getAlbumImgList: function() {
				if (opt.tabs['FromAlbum'].options.albumImgList) {
					loadingDialog = Tips.loading('正在加载,请稍后...');
					var albumId = Tabs.Cnt.FromAlbum.elms.eAlbumList.val();
					if (albumId < 0) {
						Tabs.Cnt.FromAlbum.elms.eImgBox.html('<div class="no-data">无图片信息！</div>');
						loadingDialog.close();
						return false;
					}

					Tabs.Cnt.FromAlbum.elms.eImgPager.empty().pager({
						curPage: 1,
						pageSize: 24,
						range: 3,
						nextHtml: '&gt;', // 如果是false，则不显示
						prevHtml: '&lt;', // 如果是false，则不显示
						ajax: {
							// url: 'http://demo.bubugao.com/ajax/pager/list.php',
							url: opt.tabs['FromAlbum'].options.albumImgList,
							data: {
								albumId: albumId
							}
						},
						paged: function(curPage, data) {
							var str = '',
								strList = '';
							loadingDialog.close();
							if (data && data.data) {
								data = data.data;
								for (var i = 0; i < data.length; i++) {
									strList += '<li class="jImgItem" data-src="' + data[i].src + '" data-id="' + data[i].id + '">';
									strList += '	<a href="javascript:;">';
									strList += '		<img style="width: 100px" class="img-error jBodyImg" src="' + IMG.blankImg + '" data-url="' + BBG.IMG.getImgByType(data[i].src, BBG.IMG.TYPE.s2) + '">';
									strList += '	</a>';
									strList += '	<div class="op-box">';
									strList += '		<i class="icon iconfont">&#xe629;</i>';
									strList += '	</div>';
									strList += '</li>';
								}
								if (strList == '') {
									strList = '<div class="no-data">该相册暂无图片，换一个看看！</div>';
								} else {
									str += '<ul class="img-list clearfix">' + strList + '</ul>';
								}
								Tabs.Cnt.FromAlbum.elms.eImgBox.html(str);
								// 初始化已经选中的图片
								Tabs.Cnt.FromAlbum.initSelected();
								Tabs.Cnt.FromAlbum.elms.eImgBox.scrollTop(0);
								Tabs.Cnt.FromAlbum.elms.eImgBox.find('.jBodyImg').imgLoading({
									container: Tabs.Cnt.FromAlbum.elms.eImgBox
								});
							} else {
								Tips.error(data._error.msg)
							}
						},
						clickPageFun: function() {}
					});
				}
			},
			// 初始化已经选择的图片
			initSelected: function() {
				var selImgs = SelectedImg.getSrcLists();
				for (var i = 0; i < selImgs.length; i++) {
					Tabs.Cnt.FromAlbum.elms.eImgBox.find('.jImgItem[data-src^="' + selImgs[i] + '"]').addClass('hover');
				}
			},
			initEvent: function() {
				Tabs.Cnt.FromAlbum.elms.eAlbumList.change(function() {
					Tabs.Cnt.FromAlbum.getAlbumImgList();
				});

				Tabs.Cnt.FromAlbum.elms.eImgBox.delegate('li', 'click', function() {
					if (opt.max - SelectedImg.count === 0) {
						Tips.error('最多只能上传:' + opt.max + '');
						return false;
					}
					var $this = $(this),
						eCurImg = $this.find('.jBodyImg'),
						imgSrc = $this.attr('data-src');
					imgId = $this.attr('data-id');
					if (imgSrc && imgSrc == IMG.blankImg) {
						Tips.warning('无法选择正在加载的图片！');
					} else {
						if ($this.hasClass('hover')) {
							SelectedImg.del(imgSrc);
						} else {
							$this.addClass('hover');
							SelectedImg.add(imgSrc, imgId);
						}
					}
					return false;
				});

				Tabs.Cnt.FromAlbum.elms.eOpRefresh.click(function() {
					Tabs.Cnt.FromAlbum.getAlbumImgList();
				});
			},
			del: function(src) {
				if (Tabs.Cnt.FromAlbum.elms.eFromAlbum) {
					var elm = Tabs.Cnt.FromAlbum.elms.eImgBox.find('.jImgItem[data-src^="' + src + '"]');
					if (elm.length > 0) {
						elm.removeClass('hover');
					}
				}
			}
		}

		/**
		 * 网络上传
		 */
		Tabs.Cnt.FromNet = {
			init: function() {
				Tabs.Cnt.FromNet.bindHtml();
				Tabs.Cnt.FromNet.initEvent();
			},
			// 销毁当前tab
			destroy: function() {},
			bindHtml: function() {
				var str = '';
				str += '<div class="from-net jTabCntItem jFromNet">';
				str += '	<div class="net-box">';
				str += '		<div class="txt-title">网络图片地址</div>';
				str += '		<div class="txt-box">';
				str += '			<label for="netImgUrl">请输入网络图片地址</label>';
				str += '			<input type="text" id="netImgUrl" class="txt">';
				str += '			<a href="javascript:;" class="op-del"><i class="icon iconfont">&#xe607;</i></a>';
				str += '			<a href="javascript:;" class="btn btn-yellow">添加</a>';
				str += '		</div>';
				str += '	</div>';
				str += '</div>';
				Tabs.elms.eTabCnt.append(str);
			},
			initEvent: function() {
				var eTxtBox = Tabs.elms.eTabCnt.find('.txt-box'),
					eTxtLbl = eTxtBox.find('label'),
					eTxt = eTxtBox.find('.txt'),
					eDel = eTxtBox.find('.op-del'),
					eBtn = eTxtBox.find('.btn');

				eBtn.click(function() {
					var val = $.trim(eTxt.val());
					if (val.length <= 0) {
						Tips.warning('图片地址不能为空！');
						return false;
					}
					if (BBG.IMG.isImgUrl(val)) {
						SelectedImg.add(val, '', true);
					} else {
						Tips.warning('图片地址不正确！');
						return false;
					}
				});

				eTxt.blur(function() {
					val = $.trim(eTxt.val());
					if (val.length <= 0) {
						eTxtLbl.show();
						eTxtLbl.removeClass('lbl-opacity');
					}
				});

				eTxt.focus(function() {
					val = $.trim(eTxt.val());
					if (val.length <= 0) {
						eTxtLbl.addClass('lbl-opacity');
					} else {
						eTxtLbl.hide();
					}
				});

				eTxt.focus();

				eTxt.keydown(function(e) {
					eTxtLbl.hide();
				});

				eDel.click(function() {
					eTxt.val('');
					eTxtLbl.removeClass('lbl-opacity');
					eTxtLbl.show();
				});
			}
		}

		/**
		 * 本地上传
		 */
		Tabs.Cnt.FromLocal = {
			init: function() {
				Tabs.Cnt.FromLocal.bindHtml();
				Tabs.Cnt.FromLocal.initEvent();
			},
			// 销毁当前tab
			destroy: function() {
				Tabs.Cnt.FromLocal.elms.eBtnChooseFile && Tabs.Cnt.FromLocal.elms.eBtnChooseFile.uploadify('destroy');
			},
			Count: {
				curSuccess: 0,
				loading: 0
			},
			elms: {
				eFromLocal: null,
				eLoadingCount: null,
				eCancelAll: null,
				eAlbumList: null,
				eImgBox: null,
				eBtnChooseFile: null
			},
			global: {
				btnChooseFile: cntId + 'BtnChooseFile',
				queryId: cntId + 'QueueID'
			},
			initElms: function() {
				Tabs.Cnt.FromLocal.elms.eFromLocal = _$('jFromLocal');
				Tabs.Cnt.FromLocal.elms.eLoadingCount = Tabs.Cnt.FromLocal.elms.eFromLocal.find('.jLoadingCount');
				Tabs.Cnt.FromLocal.elms.eCancelAll = Tabs.Cnt.FromLocal.elms.eFromLocal.find('.jCancelAll');
				Tabs.Cnt.FromLocal.elms.eAlbumList = Tabs.Cnt.FromLocal.elms.eFromLocal.find('.jAlbumList');
				Tabs.Cnt.FromLocal.elms.eImgBox = $('#' + Tabs.Cnt.FromLocal.global.queryId);
				Tabs.Cnt.FromLocal.elms.eBtnChooseFile = $('#' + Tabs.Cnt.FromLocal.global.btnChooseFile);
			},
			bindHtml: function() {
				var str = '';
				str += '<div class="from-local jTabCntItem jFromLocal">';
				str += '	<form><div class="com-title">';
				str += '		<div class="op-select f-l jAlbumList">';
				str += '		</div>';
				str += '		<div class="op-cancel f-r">';
				str += '			<span><b class="jLoadingCount">0</b>张图片等待上传</span><a href="javascript:;" class="btn btn-yellow jCancelAll"><i class="icon iconfont">&#xe628;</i>取消上传</a>';
				str += '		</div>';
				str += '	</div>';
				str += '	<div class="local-box">';
				str += '		<div class="local-init">';
				var strTips = '';
				if (opt.max && opt.max > 1) {
					strTips = '按住Ctrl可多选图片';
				}
				str += '			<div class="local-tips">' + strTips + '</div>';
				str += '			<input id="' + Tabs.Cnt.FromLocal.global.btnChooseFile + '" name="file_upload" type="button">';
				str += '		</div>';
				str += '		<div class="img-box jImgBox" id="' + Tabs.Cnt.FromLocal.global.queryId + '">';
				str += '		</div>';
				str += '	</div></form>';
				str += '</div>';
				Tabs.elms.eTabCnt.html(str);
				Tabs.Cnt.FromLocal.initElms();
				Tabs.Cnt.FromLocal.getAlbumList();
			},
			// 生成相册列表
			getAlbumList: function() {
				var str = '';
				if (opt.tabs['FromLocal'].options.albumList) {
					loadingDialog = Tips.loading('正在加载,请稍后...');
					BBG.AJAX.get({
							url: opt.tabs['FromLocal'].options.albumList
						},
						function(data) {
							if (data) {
								for (var i = 0; i < data.length; i++) {
									str += '<option value="' + data[i].albumId + '">' + data[i].albumName + '(' + data[i].picCount + ')</option>';
								}
								if (str == '') {
									str += '<option value="-1">无相册信息</option>';
								}
								str = '上传到相册<select class="">' + str + '</select>';
								Tabs.Cnt.FromLocal.elms.eAlbumList.html(str);
							}
							var eAlbumList = Tabs.Cnt.FromLocal.elms.eAlbumList.find('select');
							eAlbumList.change(function() {
								Tabs.Cnt.FromLocal.uploadify();
							});
							Tabs.Cnt.FromLocal.uploadify();
							loadingDialog.close();
						},
						function(data) {
							loadingDialog.close();
							Tips.error(data._error.msg);
						}
					);
				} else {
					Tabs.Cnt.FromLocal.uploadify();
					// 不需要上传到指定相册 to do
				}
			},
			uploadify: function() {
				var formDate = opt.uploadify.formData;
				var eAlbumList = Tabs.Cnt.FromLocal.elms.eAlbumList.find('select');
				if (eAlbumList.length > 0) {
					formDate.albumId = eAlbumList.val();
					opt.uploadify.formData = formDate;
				}
				var defaults = {
					auto: true,
					height: 50,
					width: 162,
					multi: true,
					fileTypeExts: '*.png;*.jpg;*.gif;*.bmp',
					fileTypeDesc: '图片文件，支持:.png,.jpg,.gif,.bmp',
					formData: formDate,
					uploadLimit: opt.max - SelectedImg.count,
					fileSizeLimit: '1024KB',
					fileObjName: 'files',
					onFallback: function() {
						alert('sorry,flash不兼容！');
					},
					queueID: Tabs.Cnt.FromLocal.global.queryId,
					buttonText: '<i class="icon iconfont">&#xe613;</i>选择图片',
					onSelect: function(file) {
						Tabs.Cnt.FromLocal.elms.eFromLocal.addClass('local-box-loading');
						Tabs.Cnt.FromLocal.Count.loading++;
						var max = opt.max - SelectedImg.count;
						if (max <= 0) {
							Tips.error('最多只能上传：' + opt.max + '张图片！');
							this.cancelUpload(file.id);
						}
					},
					onUploadStart: function(file) { // 上传开始时触发（每个文件触发一次）
						　　
						isUploading = true;
					},
					onDialogOpen: function() {
						Tabs.Cnt.FromLocal.Count.curSuccess = 0;
						Tabs.Cnt.FromLocal.Count.loading = 0;
						var max = opt.max - SelectedImg.count;
						if (max > 0) {
							this.setFileUploadLimit(max);
						}
					},
					onUploadComplete: function() {
						Tabs.Cnt.FromLocal.Count.loading--;
						Tabs.Cnt.FromLocal.elms.eLoadingCount.html(Tabs.Cnt.FromLocal.Count.loading);
					},
					onUploadSuccess: function(file, data, response) {
						Tabs.Cnt.FromLocal.Count.curSuccess++;
						try {
							data = $.parseJSON(data);
							SelectedImg.add(data.src, data.id);
						} catch (e) {

						}
					},
					onUploadError: function(file, data, response) {
						Tips.error('图片[' + file.name + ']上传失败！');
					},
					onClearQueue: function() {
						Tabs.Cnt.FromLocal.elms.eImgBox.html('');
						Tabs.Cnt.FromLocal.elms.eFromLocal.removeClass('local-box-loading');
					},
					onCancel: function() {
						Tabs.Cnt.FromLocal.elms.eImgBox.html('');
						Tabs.Cnt.FromLocal.elms.eFromLocal.removeClass('local-box-loading');
					},
					onQueueComplete: function(status) {
						isUploading = false;
						Tabs.Cnt.FromLocal.elms.eImgBox.html('');
						Tabs.Cnt.FromLocal.elms.eFromLocal.removeClass('local-box-loading');
						this.queueData.files = {};
						this.destroy();
						Tabs.Cnt.FromLocal.elms.eBtnChooseFile.uploadify(uploadifyConfig);
					}
				};
				var uploadifyConfig = $.extend({}, defaults, opt.uploadify || {});
				if (opt.max - SelectedImg.getSrcLists().length == 1) {
					uploadifyConfig.multi = false;
				}
				Tabs.Cnt.FromLocal.elms.eBtnChooseFile.uploadify(uploadifyConfig);
			},
			initEvent: function() {
				Tabs.Cnt.FromLocal.elms.eCancelAll.click(function() {
					isUploading = false;
					Tabs.Cnt.FromLocal.elms.eImgBox.html('');
					Tabs.Cnt.FromLocal.elms.eFromLocal.removeClass('local-box-loading');
				});
			}
		}

		function showDialog() {
			mainDialog = Dialog({
				fixed: opt.fixed,
				id: opt.id + '_imgUpload',
				title: '图片上传',
				content: Tabs.getInitHtml(),
				padding: 0,
				onclose: function() {
					Tabs.destroy();
				},
				cancelDisplay: false
			}).showModal();
			SelectedImg.init();
			Tabs.init();
		}

		$(this).each(function() {
			var $this = $(this);
			if (opt.event) {
				$this.on(opt.event, function() {
					showDialog();
				});
			} else {
				showDialog();
			}
		});
	}
});
