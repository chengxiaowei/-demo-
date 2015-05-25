/*
 *  到货通知
 *  @author	taotao
 *
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');
    //  到货通知
    module.exports = function(productId, btn) {
        var gProductId = productId;
        var jBtn = btn || '#jCartAdd';


        $('body').on('click', jBtn, function() {
            if(!cookie("_nick")){
                Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                    window.location.href="https://ssl.yunhou.com/login/h5/login.html?ref="+encodeURIComponent(window.location.href)+"";
                });
                return;
            }
            gProductId = $(this).attr('data-id')||$(this).parent().attr('data-id')||gProductId;

            var html =   "<div class='item-mask jItemMask'></div>"+
                "<div class='arrival-notice jArrivalNotice'>"+
                "<div class='title'>到货通知</div>"+
                "<div class='explain'>该商品暂时缺货，请留下您的邮箱地址或手机号码，当我们有现货供应时，我们会发邮件通知您</div>"+
                "<div class='dialog-input'>邮箱号码：<input type='text' id='jEmailTong' placeholder='必填'/></div>"+
                "<div class='dialog-input'>手机号码：<input type='text' id='jMobileTong'/></div>"+
                "<div class='btn'><input type='button' class='jArrivalHide' value='取消'/><input type='button' class='ben2 jArrivalNot' value='确定' id='jDaoHuoHide'/></div>"+
                "</div>";
            $('body').append(html);

        });

        //绑定删除dom事件
        $('body').on('click', '.jArrivalHide', function() {
            $('.jItemMask').remove();
            $('.jArrivalNotice').remove();
        });

        //添加到货通知
        $('body').on('click', '.jArrivalNot', function() {
            var mobile = $('#jMobileTong').val(),
                email  = $('#jEmailTong').val(),
                e      = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

            if(!(e.test(email))){
                Dialog.tips('请输入有效邮箱');
            }
            else {
                // item.subscribe(mobile, email);
                var data = {
                    'callback': 'callback',
                    'product_id': gProductId,
                    'mobile': mobile,
                    'email': email
                };
                io.jsonp('http://m.yunhou.com/item/ajaxSubscribe', data, function(){
                    Dialog.tips('提交成功');
                    $('.jItemMask').remove();
                    $('.jArrivalNotice').remove();

                },function(e) {
                    if(e.error == -100){
                        Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                            window.location.href="https://ssl.yunhou.com/login/h5/login.html?ref="+encodeURIComponent(window.location.href)+"";
                        });
                    } else {
                        Dialog.tips(e.msg);
                    }
                });
            }
        });
    };
});
