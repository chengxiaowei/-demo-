/**
 * 个人中心 - 地址列表页
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');


    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });
    
    // 页面所需url
    var urls = {
        def : '//m.yunhou.com/member/address_set_def',
        del : '//m.yunhou.com/member/address_del'
    }
    //空数据时候输出到页面上的dom
    var domStr = '<section class="my-center-none" >' +
    '<div class="bd"><i class="iconfont">&#xe601;</i></div>' +
    '<div class="ft">您还没有添加收货地址</div>' +
'</section>';
    // 按钮初始化
    var clickHandles = {
        defaultBtn: function(e) {
            e.preventDefault();
            var $this = $(this);
            var sender = this;
            var url = urls.def + '?addrId=' + $this.attr("data-id");
            io.get(url, {}, function(e) {
                console.log('resule: ', e.error);
                console.log('message: ', e);
                if(e.error == '0'){
                    $this.parents(".mod-address-list").children(".default").removeClass("default");
                    var $dom = $this.parents(".address-item").toggleClass("default");
                    Dialog.tips(e.msg||'设置默认地址成功');
                }
                else{
                    Dialog.tips(e.msg||'设置默认地址失败，请稍后重试');
                }
            }, function(e) {
                console.log('unexception error');
                console.log(e);
                Dialog.tips(e.msg||'设置默认地址失败，请稍后重试');
            }, sender);
            // Dialog.tips('设置默认地址失败');
        },
        deleteBtn:function(e){
            e.preventDefault();
            var dlgTmpl = "确定要删除该收货地址吗";
            var $this = $(this);
            var sender = this;
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: dlgTmpl,
                btn: [
                    {
                        value: '取消',
                        isHide: true,
                        callBack: function () {}
                    },
                    {
                        value: '确定',
                        callBack: function () {
                            var url = urls.del + '?addrId=' + $this.attr("data-id");
                            io.get(url, {}, function(e) {
                                console.log('resule: ', e.error);
                                console.log('message: ', e);
                                if(e.error == '0'){
                                    var $dom = $this.parents(".address-item").remove();
                                    Dialog.tips(e.msg||'删除地址成功');
                                    console.log("删除成功");
                                    if($('.mod-address-list').children().length == 0){
                                        console.log("无纪律处理");
                                        $('.mod-address-list').after(domStr);
                                    }
                                }
                                else{
                                    Dialog.tips(e.msg||'删除地址失败，请稍后重试');
                                }
                            }, function(e) {
                                console.log('unexception error');
                                Dialog.tips(e.msg||'删除地址失败，请稍后重试');
                            }, sender);
                        }
                    }
                ]
            });
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-address-list").on("click",key,handle);
        }
    }

  //获取url参数值
   var getUrlValue =  function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                r = window.location.search.substr(1).match(reg);
            if(r != null)
                return unescape(r[2]);
            return null;
    }
  //跳转到结算页
    $('.jAddressClick').click(function(){

        if(getUrlValue('source') == 'order'){
            var date = {
                addrId: $(this).attr('data-id')
            }
            io.jsonp('/checkout/selectAddr', date, function(){
                window.location.href = 'http://m.yunhou.com/html/order/order.html';
            },function(e){
                Dialog.tips(e.msg);
            })
        }
    })
});