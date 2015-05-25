define(function(require, exports, module) {

    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');


    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    //懒加载
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url',
          load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error');
            }
          }
        });
        return imageLazyLoader;
    }

    resetImageLoader();


    var rome = $('.jRome');
    $('.bd').on('click', '.jRome', function() {
        var id = $(this).attr('data-id');
        var favoriteType = $(this).attr('data-favoriteType');
        var data = {
                'id': id,
                'favoriteType': favoriteType
            }
        if(window.confirm('确定要取消收藏吗？')) {
            io.get('/member/collection_cancle', data, function(){
                Dialog.tips('取消成功！', function() {
                    window.location.reload();
                })
            }, function(e) {
                Dialog.tips(e.msg);
            });
        }
        else {
            return false;
        }
    });



    var lazyMore = function(){
        new Lazyload('.jPage', {
            type: 'html',
            placeholder: '<div class="loading">正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                var data = {
                    'callback': 'callback',
                    'page': page
                };
                if(!$(el).hasClass('load')){
                    var src = '/member/collection_product';
                    io.jsonp(src, data, function(data) { 
                        if(data.data == ''){
                            $(el).remove();
                            return false;
                        }
                        else{
                            var html = unescape(data.data);
                            $(el).html(html).addClass('load'); 
                            $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                            lazyMore();
                            resetImageLoader();
                        }
                        
                    },function(){
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
