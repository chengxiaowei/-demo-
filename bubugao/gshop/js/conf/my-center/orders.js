/**
 * 个人中心 - 订单页面
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var countDown = require('module/my-center/count-down');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    // 图片懒加载--start
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url'
        });
        return imageLazyLoader;
    }

    resetImageLoader();
    // 图片懒加载--end

    var lazyMore = function(){
        new Lazyload('.jScroll .jPage', {
            type: 'html',
            placeholder: '<div class="loading">正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                if(!$(el).hasClass('load')) {
                    io.jsonp(window.location.href,{"p":page}, function(res) {
                        var html = unescape(res.data);
                        if(html) {
                            $(el).html(html).addClass('load');
                            $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                            resetImageLoader();
                            lazyMore();

                        } else {
                            $(el).remove();
                        }
                    }, function(data){
                        $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                    });
                }
            }
        });
    }
    lazyMore();

    //列表加载网络出错，重试
    $('body').on('click','#jNetError',function(){
        lazyMore();
    })











    var dlgTmpl = [
    '<div class="cancel-cnt">',
    '<div class="ui-item">',
    '<label class="ui-label">取消原因:</label>',
    '<div class="inner-ctrls">',
    '<select id="jCancelReason">',
    '<option value="">请选择取消原因</option>',
    '<option value="不想买了">不想买了</option>',
    '<option value="商品价格高">商品价格高</option>',
    '<option value="支付不成功">支付不成功</option>',
    '<option value="送货时间太长">送货时间太长</option>',
    '<option value="商品缺货">商品缺货</option>',
    '<option value="地址/发票填写有误">地址/发票填写有误</option>',
    '<option value="需添加或删除商品">需添加或删除商品</option>',
    '<option value="需修改优惠券信息">需修改优惠券信息</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="ui-item">',
    '<label class="ui-label">其它原因:</label>',
    '<div class="inner-ctrls">',
    '<textarea id="jOtherReason"></textarea>',
    '<p class="hint">请填写取消原因(4-250字符)</p>',
    '</div>',
    '</div>',
    '</div>'
    ].join('');

    var cancelOrder = function(orderId, cancelReason) {
        require('common/base/dialog');

        if (cancelReason) {
            io.jsonp($('#time-out-cancel-url').val(), {
                orderId: orderId,
                reason: cancelReason
            }, function (e) {
                window.location.reload();
            },
            function(e) {
                Dialog.tips(e.msg);
            }, this);
        }
        else {
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
                            var sV = $('#jCancelReason').val(),
                                sOV = $('#jOtherReason').val();
                            
                            if ('' == (sV + sOV)) {
                                if ('' == sV) {
                                    Dialog.tips('请选择取消原因');
                                } else {
                                    Dialog.tips('清填写取消原因');
                                }

                                return;
                            }
            
                            io.jsonp( $('#cancel-url').val(), {
                                orderId: orderId,
                                reason: sV || sOV
                            }, function (e) {
                                window.location.reload();
                            },
                            function(e) {
                                Dialog.tips(e.msg);
                            }, this);
                         }
                    }
                ]
            });
        }
    }

    // 按钮初始化
    var clickHandles = {
        morePros: function() {
            var $this = $(this);
            var $dom = $this.prev().toggle();
            $this.toggleClass("shown");
            resetImageLoader(); //点击订单商品展开，重新初始化图片懒加载
        },
        cancelBtn:function(){
            var orderId = $(this).parent().attr('order-id');
            cancelOrder(orderId);
        },
        viewBtn:function(){
        },
        deleteBtn:function(e){
            var orderId = $(this).parent().attr('order-id');
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: "确定要删除此订单吗？",
                btn: [
                    {
                        value: '取消',
                        isHide: true,
                        callBack: function () {}
                    },
                    {
                        value: '确定',
                        callBack: function () {
                                io.jsonp(
                                    $('#delete-url').val(),
                                    {
                                        orderId: orderId
                                    },
                                    function() {
                                        window.location.reload();
                                    },
                                    function (e) {
                                        Dialog.tips(e.msg);
                                    }
                                );
                            }
                    }
                ]
            });
        },
        payBtn:function(){
        },
        receiptBtn:function(){
            var orderId = $(this).parent().attr('order-id');
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: "是否确认收货？",
                btn: [
                    {
                        value: '取消',
                        isHide: true,
                        callBack: function () {}
                    },
                    {
                        value: '确定',
                        callBack: function () {
                            io.jsonp(
                                $('#receive-url').val(),
                                {
                                    orderId: orderId
                                },
                                function() {
                                    window.location.reload();
                                },
                                function (e) {
                                    Dialog.tips(e.msg);
                                }
                            );
                        }
                    }
                ]
            });
        },
        buyAgainBtn:function(){
        },
        commentBtn:function(){
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-orders").on("click",key,handle);
        }
    }

    // 页面倒计时初始化  如有新add的数据 那么需要对新add的也执行这个操作
    // $.each($("[node-type=countDown]"),function(k,el){
    //     countDown.init(el,function(){
    //         $(el).text("已取消");
    //         //TODO 联调时添加具体处理逻辑 起码按钮要根据订单状态做改变
    //     });
    // });
     //倒计时
    var countDown = require('common/ui/count-down/jquery.countDown');

    countDown({
        targetTime:$("[node-type=countDown] .query-time").attr('data-endTime'),
        timeText : ['',':',':','',''],
        container : '[node-type=countDown] .query-time',
        isShowTimeText : true,
        isShowArea : true,
        type : {
            'd' : false,
            'h' : true,
            'm' : true,
            's' : true,
            'ms' : false
        },
        callback : function(dom) {
            if (dom) {
                var oid = dom.attr('order-id');
                if (oid) {
                    cancelOrder(oid, '系统自动取消', 1);
                }
            }
        }
    });
});
