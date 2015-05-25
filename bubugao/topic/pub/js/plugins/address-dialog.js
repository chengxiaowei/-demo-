/**
 * 选择地址弹窗
 *
 * @author djune update@2014.8.13
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var _ = require('../core/bbg');
	var Dialog = require('../ui/dialog/dialog-plus');
	var linkageTab = require('./linkage-tab');
	var _cookie = require('./jquery.cookie');
	var pop = require('./jquery.newcomers.polite');
	var Address = {
		Dialog: null,
		init: function() {
			Address.Dialog = Dialog({
				id: 'jSelecteAddress',
				fixed: true,
				padding: 0,
				content: Address.getHtml(),
				onshow: function() {
					linkageTab({
						defaultText: '立即选择，您的地址，您做主！',
						areaId: 'jAddressDialogInfo',
						selector: 'jSelDialogAddress',
						selectValInput: 'ff1',
						lastValueId: 'ff4',
						firstValueId: 'jProvinceId',
						selectedUrl: BBG.URL.Addr.selectedUrl,
						changeCallBackUrl: BBG.URL.Addr.changeCallBackUrl,
						url: BBG.URL.Addr.url,
						selectValId: 'mentionId', // 自提点id
						isShowAddr: true,
                        degree:3,
						lastChangeCallBack: function() {
							$.linkageTab('setAddr', ['jSelDialogAddress', 'jSnSelAddress']);
							location.reload();
						}
					});
					Address.initEvent();
				}
			});
			//没有特定cookie && 没有'新人有礼'
			if (!Address.getCookie() && !pop.isVisible) {
				Address.Dialog.showModal();
			}
		},
		cookieName: '_address',
		getHtml: function() {
			var str = '';
			str += '<div class="addr-box">';
			str += '	<div class="addr-box-top">';
			str += '		<h3 class="t16">欢迎来到云猴网！</h3>';
			str += '		<div class="des">目前可支持湖南地区的配送。</div>';
			str += '	</div>';
			str += '	<div class="addr-box-cnt">';
			str += '		<div class="clearfix">';
			str += '			<label class="f-l btn-sel-tips">请您选择配送地点：</label>';
			str += '			<a href="javascript:;" class="f-l btn-sel-addr" id="jSelDialogAddress"></a>';
			str += '		</div>';
			str += '		<a href="javascript:;" class="btn btn-m" id="jSelDialogShoping">现在购物</a>';
			str += '	</div>';
			str += '	<div class="addr-box-btm"></div>';
			str += '</div>';
			return str;
		},
		show: function() {
			Address.Dialog.showModal();
		},
		// 判断是否存在默认地址
		getCookie: function() {
			return $.cookie(Address.cookieName);
		},
		initEvent: function() {
			var _self = this;
			$('#jSelDialogShoping').click(function() {
				if (Address.getCookie()) {
					location.reload();
					Address.Dialog.remove();
					//pop.show();
				} else {
					Dialog({
						'id': '_dialogWarning',
						'type': 'warning',
						'align': 'top',
						'content': '亲，配送地址是必须选择哦~'
					}).time($('#jSelDialogAddress'), 2000);
				}
			});
		}
	};
	//新人有礼,只有首页显示
	if ($('#jHideNav') && $('#jHideNav').val() == 'index') {
		pop = pop({
			callBack: function() {
				//Address.init();
			}
		});
		pop.show();
	}
	//
	//Address.init();
	return Address;
});
