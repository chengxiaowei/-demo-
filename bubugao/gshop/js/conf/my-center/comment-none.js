/**
 * 个人中心 - 待评论页
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');


    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    // 按钮初始化
    var clickHandles = {
        morePros: function() {
            var $this = $(this);
            var $dom = $this.prev().toggle();
            $this.toggleClass("shown");
            resetImageLoader();
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-orders").on("click",key,handle);
        }
    }

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

    //加载更多
    var lazyMore = function(){
        new Lazyload('.jScroll .jPage', {
            type: 'html',
            placeholder: '<div class="loading">正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                if(!$(el).hasClass('load')){
                    io.get(window.location.href,{"p":page}, function(res) {
                        if(res.error == "0"){
                            var html = "";
                            if(res.data != ""){
                                html = unescape(res.data);
                                $(el).html(html).addClass('load');
                                $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                                resetImageLoader(); // 为新加的图片使用懒加载
                                lazyMore();  // 为新加的内容添加懒加载
                            }
                            else{
                                console.log("end");
                                $(el).remove();
                            }
                        }
                        else{
                            console.log("返回error");
                            Dialog.tips(res.msg||'加载更多失败，请稍后重试');
                            $(el).html("");
                            $(window).scrollTop($(window).scrollTop()-40);
                            setTimeout(function(){
                                lazyMore();
                            },3000);
                        }
                    },function(error){
                        // console.log("通信失败");
                        // Dialog.tips('加载更多失败，请稍后重试');
                        // $(el).html("");
                        // $(window).scrollTop($(window).scrollTop()-40);
                        // setTimeout(function(){
                        //     lazyMore();
                        // },3000);
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

});