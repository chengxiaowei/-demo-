/*  
 *@Description: 倒计时控件
 *@Author:djune (2013-11-29)
 *@Param：见代码options的注释
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var bbg = require('../core/bbg');

	function CountDown(opt) {
		this.defaultSetting = $.extend(this, this.defaultSetting, opt || {});
		this.init();
	}
	CountDown.prototype = {
		defaultSetting : {
			// 获取服务器事件的url
			// http://mall.yunhou.com/api/getTime
			url : '',
			// 当前时间
			currentTime : null,
			//自定义标签
			labelCtn : 'b',
			//是否展示成 <b>1</b><b>2</b><em>:</em><b>1</b><b>2</b>格式
			isShowArea : false,
			// 倒计时结束时间
			targetTime : null,
			//是否显示时间文本
			isShowTimeText : true,
			//时间文本
			timeText : ['天','时','分','秒','毫秒'],
			//文本标签
			textLabel : 'em',
			// 【d（天）：参数值如果是false表示不显示天数，如果是ture表示显示，如果是某个字符串，表示会给天数赋值一个class样式】
			// 【h（时）：没有false参数值，如果是ture表示显示，如果是某个字符串，表示会给天数赋值一个class样式】
			// 【m（分）：同上】
			// 【s（秒）：同上】
			// 【ms（毫秒）：参数值说明同d（天）】
			type : {
				'd' : false,
				'h' : true,
				'm' : true,
				's' : true,
				'ms' : false
			},
			// 倒计时结束回调函数
			callback : function() {
			},
			// 容器
			container : null
		},
		init : function(argument) {
			var _self = this;
			_self.ShowTimeText();
			_self.getServiceTime(function( data ){
				$(_self.container).each(function(argument) {
					$(this).attr('data-startTime',data)
					_self._countDown($(this));
				})
			});
		},
		ShowTimeText:function(){
			this.timeText = (!this.isShowTimeText)?['','','','','']:this.timeText;
		},
		ajax : function(url, data, successFun, errorFun) {
			var opt = {
				'url' : url,
				'data' : $.extend({
					platform : 'js'// ,
				// act_id : $('#groupbuying_act_id').val(),
				// buy_act : $('#is_fastbuy').val(),
				// 团购标示
				// type_code:$('#type_code').val()
				}, data)
			};
			BBG.AJAX.jsonp(opt, function(data) {
				successFun && successFun(data);
			}, function(data) {
				errorFun && errorFun(data);
			})
		},
		// 获取服务器时间
		getServiceTime : function(callback) {
			if(this.url!=''){
				this.ajax(this.url, {},function( data ) {
					//(new Date(data)).getTime()
					if(!data || data==null){
						return;	
					}
					callback && callback(data);
				},function(){
					//callback && callback();
				});
			}else{
				callback && callback();
			}
		},
		//创建文本标签
		createTextLabel : function( index ){
			var self = this;
			var str = self.timeText[index];
			if(self.textLabel!='' && str!=''){
				str = '<'+ self.textLabel +'>' + self.timeText[index] + '</'+ self.textLabel +'>';
			}
			return str;
		},
		_countDown : function(_this) {
			var _self = this;
			var curObj = _this;
			// 结束时间;
			var _tgTime = curObj.attr('data-endTime');
			// 开始
			var _startTime = curObj.attr('data-startTime');
			var _currentTime = _self.currentTime;
			var _targetTime = _self.targetTime;
			// ?目标时间参数
			_targetTime = (_tgTime ? _tgTime : _targetTime);
			// 给当前时间一个默认值
			_currentTime = (_startTime ? _startTime : _currentTime);
			if (_currentTime == null || _targetTime == null) {
				// ("currentTime和targetTime是必填参数!");
				return false;
			}
			_currentTime = parseInt(_currentTime);
			_targetTime = parseInt(_targetTime);

			// 格式化指定的时分秒，如不足2位补0
			function _formatZero(n) {
				var n = parseInt(n, 10);
				if (n > 0) {
					if (n <= 9) {
						n = "0" + n;
					}
					return String(n);
				} else {
					return "00";
				}
			}

			// 绑定显示时间
			function _bindTime(day, hour, minite, second, msec) {
				var temp = '';
				if (_self.type.d) {
					temp += _addTagB(day, _self.type.d)+ _self.createTextLabel(0);
				} else {
					hour = _formatZero(hour * 1 + (day * 24));
				}
				temp += _addTagB(hour, _self.type.h)+_self.createTextLabel(1);
				temp += _addTagB(minite, _self.type.m)+_self.createTextLabel(2);
				temp += _addTagB(second, _self.type.s)+_self.createTextLabel(3);
				if (_self.type.ms) {
					temp += _addTagB(msec, _self.type.ms)+_self.createTextLabel(4);
				}
				curObj.html(temp);
			}
			// 给指定的时分秒添加样式
			function _addTagB(n, _class) {
				var _t = '';
				var labelStr = '';
				//
				if (_class && _class.length > 0) {
					_t = ' class="' + _class + '"';
				}
				//长度
				if(n.length>1 && _self.isShowArea){
					for(var k=0;k<n.length;k++){
						labelStr += '<'+ _self.labelCtn + _t + '><i></i>' + n.slice(k,k+1) + '</'+ _self.labelCtn +'>';
					}
				}else{
					labelStr = '<'+ _self.labelCtn + _t + '>' + n + '</'+ _self.labelCtn +'>';
				}

				return labelStr;
			}

			var msec = 9;
			var _beginTime = new Date().getTime();
			var initTime = setInterval(_countDown, 100);
			// 倒计时函数
			function _countDown() {
				_currentTime = _currentTime + 100;
				_beginTime = _beginTime + 100;
				if (_beginTime != new Date().getTime()) {
					_currentTime = _currentTime + (new Date().getTime() - _beginTime);
					_beginTime = new Date().getTime();
				}

				var dur = (_targetTime - _currentTime) / 1000;
				if (dur > 0) {
					var second = _formatZero(dur % 60);
					var minite = Math.floor((dur / 60)) > 0 ? _formatZero(Math.floor((dur / 60)) % 60) : "00";
					var hour = Math.floor((dur / 3600)) > 0 ? _formatZero(Math.floor((dur / 3600)) % 24) : "00";
					var day = Math.floor((dur / 86400)) > 0 ? _formatZero(Math.floor((dur / 86400)) % 24) : "00";
					_bindTime(day, hour, minite, second, msec);
					if (msec == 0) {
						msec = 9;
					} else {
						msec--;
					}
				} else {
					_bindTime("00", "00", "00", "00", "0");
					// 倒计时结束调用回调函数
					_self.callback( _this );
					clearInterval(initTime);
				}
			}
		}
	}

	return function(opt) {
		new CountDown(opt)
	}
});
