/* 到货通知 */
define(function(require, exports, module) {
    var $ = require('jquery');
    var _ = require('../core/bbg');
    _ = require('./jquery.formParams');
    _ = require('../kit/validate/jquery.validate.method');
    var Dialog = require('./dialog');
    _  = require('./login-dialog');

    var URL = {
        Goods: {
            arrival: 'http://api.mall.yunhou.com/product/subscribe' // 到货通知
        }
    };

    var Arrivalnotice = {
        // 配置文件
        defaultSetting: {
            event: false,
            // 登陆的回调
            loginCallBack: function() {
                BBG.Login.dialog(function() {
                    $.cookie('_notice', 'click');
                    location.reload();
                });
            },
            // 点击提交回调的函数
            subCallBack: function() {

            }
        },
        _dialog: null,
        // 需要操作的按钮
        btn: null,
        // 初始化
        init: function() {
            var _self = this;
            if (_self.defaultSetting.event) {
                _self.btn.click(function() {
                    _self.getUserInfo();
                })
            } else {
                _self.getUserInfo();
            }
        },
        // 弹出框
        addPop: function(data) {
            var _self = this;
            $.cookie('_notice', null);
            _self._dialog = Dialog({
                title: '到货通知',
                width: 500,
                // 内容模板
                content: _self.createForm(data)
            }).showModal();
            _self.bindEvent();
        },
        // 创建表单
        createForm: function(data) {
            var ar = [];
            var d = {
                "mobile": "",
                "email": ""
            }
            d = $.extend(d, data);
            ar.push('<div class="arrivalnotice" id="jArrivalnotice">');
            ar.push('	<div>该货品暂时缺货，请在下面输入您的邮箱地址或手机号码，当我们有现货供应时，我们将通过邮件和短信通知您！</div>');
            ar.push('	<form class="form-horizontal" id="jAnForm">');
            ar.push('		<div class="form-group">');
            ar.push('			<label class="control-label"><em class="txt-red">*</em>邮箱地址：</label>');
            ar.push('			<div class="form-control"><input class="input-text" name="email" value="' + d.email + '"/></div>');
            ar.push('		</div>');
            ar.push('		<div class="form-group">');
            ar.push('			<label class="control-label">手机号码：</label>');
            ar.push('			<div class="form-control"><input class="input-text" name="mobile" value="' + d.mobile + '"/></div>');
            ar.push('		</div>');
            ar.push('		<div class="form-btn"><a class="btn btn-m btn-sec" id="jArrivalnoticeBtn">提交</a></div>')
            ar.push('	</form>');
            ar.push('</div>')
            return ar.join('');
        },
        // 验证表单
        validateForm: function() {
            $('#jAnForm').validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    mobile: {
                        mobile: true
                    }
                },
                messages: {
                    email: {
                        required: '邮件地址不能为空',
                        email: '请输入正确的邮件地址'
                    },
                    mobile: {
                        mobile: '请输入正确的手机号码'
                    }
                }
            });
            $('#jAnForm').submit(function() {
                return false;
            });
            return $('#jAnForm').valid();
        },
        // 获取登陆用户的联系方式
        ajax: function(url, callback) {
            var _self = this;
            BBG.AJAX.jsonp({
                url: url
            }, function(data) {
                callback && callback(data);
            }, function(data) {
                if (data._error) {
                    var _code = data._error.code;
                    // 调用登陆的回调 -100
                    if (_code == '-100') {
                        _self.defaultSetting.loginCallBack();
                    } else if (_code == '-101') {
                        // 没有用户信息
                        callback && callback({});
                    } else {
                        BBG.Dialog.error(data._error.msg, _self.btn);
                    }

                }
            })
        },
        // 获取用户信息
        getUserInfo: function() {
            var _self = this;
            // code : -100 登陆 ,-101没有用户信息
            _self.ajax(BBG.URL.getUserInfo, function(data) {
                _self.addPop(data);
            });
        },
        // 绑定事件
        bindEvent: function() {
            var _self = this;
            $('#jArrivalnotice').on('click', '#jArrivalnoticeBtn', function() {
                var $this = $(this);
                if (_self.validateForm()) {
                    var formData = $('#jAnForm').formParams();
                    BBG.AJAX.jsonp({
                        url: URL.Goods.arrival,
                        data: {
                            productId: _self.btn.attr('data-product-id'),
                            mobile: formData.mobile,
                            email: formData.email
                        }
                    }, function(data) {
                        _self.defaultSetting.subCallBack(data);
                        // 关闭窗口
                        BBG.Dialog.ok('到货通知订阅成功！', _self.btn);
                        _self._dialog && _self._dialog.remove();
                    }, function(data) {
                        BBG.Dialog.error(data._error.msg, $this);
                    }, $this);
                }
            });
        }
    }

    $.fn.arrivalNotice = function(opt) {
        if ($(this).hasClass('btn-disabled')) {
            return;
        }
        $.extend(Arrivalnotice.defaultSetting, opt);
        opt = Arrivalnotice;
        opt.btn = $(this);
        opt.init();
    }

});
