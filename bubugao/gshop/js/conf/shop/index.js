define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var cart = require('module/add-to-cart/addcart');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var search = require('module/search/search');

    new search({
        ctx:".jSearch"
    });

    var goodsNotice = require('module/add-to-cart/goods-notice');

    var top = require('module/common/to-top');
    top.init();
    
    //  到货通知
    goodsNotice('', '.jArrival');


    var Menu = require('common/ui/menu/menu');

    var url = '/html/demo/api/catalogue.php';

    var shop = $('#jShopClassify');

    var shopId = shop.attr('data-shop');

    Menu('#jShopClassify', 'http://m.yunhou.com/shop/category/', {"data":{"shopId":shopId}});


    //更新购物车
    cart.getcart();


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





    // var urlname = function() {
    //     var url = location.search,
    //         strs = '',
    //         theRequest = [];
    //     if (url.indexOf("?") != -1) {   
    //       var str = url.substr(1);   
    //       strs = str.split("&");   
    //       for(var i = 0; i < strs.length; i ++) {   
    //          theRequest.push(strs[i].split("=")[0]);
    //       }
    //    }
    //    return theRequest;
    // }
    // var urlget = function(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    //     var r = window.location.search.substr(1).match(reg);  
    //     if (r != null) return unescape(r[2]);  
    //     return null;  
    // }
    //收藏店铺
    var collection = $('#jCollection');
    collection.click(function(){
        if(collection.hasClass('span-color')){
            $('#jCollection i').html('&#xe603');
            collection.removeClass('span-color');
            var data = {
                'callback': 'callback',
                'id': $(this).attr('data-shopid'),
                'favoriteType': '2'
            };
            io.jsonp('/member/collection_cancle', data, function(data){

                Dialog.tips(data.msg);

            },function(e){

               if(e.error == -100){
                            Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                                window.location.href="https://ssl.yunhou.com/login/h5/login.html?ref="+encodeURIComponent(window.location.href)+"";
                            })
                        }
                        else {
                            Dialog.tips(e.msg);
                    }

            });
        }
        else{
            $('#jCollection i').html('&#xe603');
            collection.addClass('span-color');
            var data = {
                'callback': 'callback',
                'id': $(this).attr('data-shopid'),
                'favoriteType': '2'
            };
            io.jsonp('/member/collection_add', data, function(){
                Dialog.tips('收藏成功');
            },function(e){
                if(e.error == -100){
                            Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                                window.location.href="https://ssl.yunhou.com/login/h5/login.html?ref="+encodeURIComponent(window.location.href)+"";
                            })
                        }
                        else {
                            Dialog.tips(e.msg);
                    }
            });
        }
    });



        
    var urlArgument2Obj = function() {
        var o     = {},
            urlA  = window.location.search.replace(/^[?]/, '').split('&'),
            key   = '',
            value = '';

        for (var ia = 0, len = urlA.length; ia < len; ia = ia + 1) {
            if (urlA[ia] !== '') {
                key   = urlA[ia].split('=')[0];
                value = urlA[ia].split('=')[1];
                o[key] = decodeURIComponent(value);
            }
        }
        return o;
    };


     //加入购物车
     $('.shop-index').on('click', '.jShopAddCart', function(){
        var _this = $(this);
        var id = _this.closest('li').attr('data-id');
        cart.addcart(id, '1', _this);
     });
     
     var lazyMore = function(){
        new Lazyload('.jPage', {
            type: 'html',
            placeholder: '<div class="loading">正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');

                //根据rul地址动态添加地址
                // var str = {};
                //     str.callback = 'callback';
                //     str.p = page;
                //     str.page_type = 'shop';
                //     str.si = shopId;
                // for(var i = 0; i < urlname().length; i++){
                //         if(urlname()[i] != 'si' && urlname()[i] != 'k'){
                //             str[urlname()[i]] = urlget(''+urlname()[i]+'');
                //     }
                // }

                var data = {};
                data           = urlArgument2Obj();
                data.p         = page;
                data.page_type = 'shop';
                data.si = shopId;
                
                if(!$(el).hasClass('load')){
                    var src = '/Search/get_page_data';
                    io.jsonp(src, data, function(res) {
                        if(res.data == ''){
                            $(el).remove();
                        }
                        else{
                            var html = unescape(res.data);
                            $(el).html(html).addClass('load');
                            $(el).after('<div class="jPage jProd'+(Number(page)+1)+'" data-page="'+(Number(page)+1)+'"></div>');
                            lazyMore();
                            var dataid = $(el).find('.load li'),
                                ayId = [];
                            for (var i = 0; i < dataid.length; i++) {
                                ayId.push(dataid.eq(i).attr('data-id'));
                            };
                            var data = {
                                'productid_str': ''+ayId+''
                            }
                            io.get('/Promotion/productInfo', data, function(data){
                                for (var i = 0; i < data.length; i++) {
                                    if(data[i].price.Mprice != ''){
                                        $(el).find('.load [data-node-type=pri]').eq(i).text('￥'+data[i].price.Mprice+'');
                                    }
                                    if(data[i].showWapicon){
                                        $(el).find('.load [data-node-type=channel-pri]').eq(i).show();
                                    }
                                    else{
                                        $(el).find('.load [data-node-type=channel-pri]').eq(i).hide();
                                    }
                                    var tagStr = "";
                                    for (var j = 0; j< data[i].productTag.length ; j ++) {
                                        tagStr += '<span>'+data[i].productTag[j]+'</span>';
                                    };
                                    tagStr += '<span>'+data[i].downTag+'</span>';
                                    $(el).find('.load [data-node-type=tags]').eq(i).html(tagStr);
                                };
                            },function(e){
                                Dialog.tips(e.msg);
                            })
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

    //营销数据
    var dataid = $('.load li'),
        ayId = [];
    for (var i = 0; i < dataid.length; i++) {
        ayId.push(dataid.eq(i).attr('data-id'));
    };
    var data = {
        'productid_str': ''+ayId+''
    }
    io.get('/Promotion/productInfo', data, function(data){
        for (var i = 0; i < data.length; i++) {
            if(data[i].price.Mprice != ''){
                //$('.load .gd-pri').eq(i).text('￥'+data[i].price.Mprice+'');
                $('.load [data-node-type=pri]').eq(i).text('￥'+data[i].price.Mprice+'');
            }
            if(data[i].showWapicon){
                $('.load [data-node-type=channel-pri]').eq(i).show();
            }
            else{
                $('.load [data-node-type=channel-pri]').eq(i).hide();
            }

            var tagStr = "";
            for (var j = 0; j< data[i].productTag.length ; j ++) {
                tagStr += '<span>'+data[i].productTag[j]+'</span>';
            };
            tagStr += '<span>'+data[i].downTag+'</span>';
            $('.load [data-node-type=tags]').eq(i).html(tagStr);

        };
    },function(e){
        Dialog.tips(e.msg);
    })

    
});
