define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cart = require('module/add-to-cart/addcart');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');

    var goodsNotice = require('module/add-to-cart/goods-notice');

    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });
    var guide = require('common/ui/guide/_guide');
    new guide();

    //轮播
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var slider = new Slider('#slides', {
        width: 420,
        height: 420,
        play: {
            auto: false,
            interval: 4000,
            swap: true,
            pauseOnHover: true,
            restartDelay: 2500
        },
        callback:{
            start:function(index){
                var el = $('.jSliderImg').eq(index);
                var src = el.attr('data-url');
                sliderImgLoad(src,el);
            },
            loaded : function(){
                var el = $('.jSliderImg').eq(0);
                var src = el.attr('data-url');
                sliderImgLoad(src,el);
            }
        }
    });

    function sliderImgLoad(src,el) {
        if (isImgUrl(src)) {
            var objImg = new Image();
            objImg.src = src;
            if (objImg.complete) {
                console.log(src);
                el.attr('src',src).removeClass('img-error').removeAttr('data-url');
            } else {
                objImg.onload = function() {
                    el.attr('src',src).removeClass('img-error').removeAttr('data-url');
                };
            }
        }
    }

    function isImgUrl(str) {
        return (/^((https?|ftp|rmtp|mms):)?\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(str);
    }
    //时间戳格式化
    Date.prototype.format = function(fmt) { // author: meizz
        var o = {
            "M+" : this.getMonth() + 1, // 月份
            "dd" : this.getDate(), // 日
            "hh" : this.getHours(), // 小时
            "mm" : this.getMinutes(), // 分
            "ssss" : this.getSeconds(), // 秒
            "q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
            "S" : this.getMilliseconds()
            // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for ( var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    //地址
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    $('#jAddrPop').parent().click(function(){
        var pageCnt = $('.page-view');
        //地址一
        linkageTab({
            //调用多级地址的对象
            linkageBox : $('#jAddrPop'),
            // 下拉列表隐藏域的id
            selectValInput : 'f1',
            // 只存选中的value值
            selectValId : 'f2',
            // area 存文本和id的隐藏域的id
            areaId : 'areaInfo2',
            // 存最后一个值的隐藏域的id
            lastValueId : 'f4',
            degree : 3,
            //selectedData:'湖南_长沙市_芙蓉区:43_430100000000_430102000000',
            lastChangeCallBack : function(){
                window.location.reload();
            },
            onShow : function(){
                $('html').addClass('freez-page');
            },
            onHide : function(){
                $('html').removeClass('freez-page');
            }
        });
    });

    var item = {
        init: function() {

            item.initialization();

            var size = $('#jSize label'),
                color = $('#jColor label');

            //item.effect(color);
            item.add_cookie();

            item.Meiosis();

            item.iconcollection();

            cart.getcart();
            
        },
        time: function(currentTime,timeend) {
            if(!timeend){
                $('#jDomButtom').html("")
                return;
            }
            var nowtime=new Date().getTime()
            //剩余时间
            var shengyutime=timeend-nowtime

            if(shengyutime>0){
                if(new Date(shengyutime).getDate()>0){
                    var promotion_html=new Date(shengyutime).format('<i class="iconfont icon-daojishi">&#xe600;</i><span>dd</span>天<span>hh</span>小时<span>mm</span>分<span>ssss</span>秒 ')
                }else{
                    var promotion_html=new Date(shengyutime).format('<i class="iconfont icon-daojishi">&#xe600;</i> <span>hh</span>小时<span>mm</span>分<span>ssss</span>秒')
                }
                var the=this
                setTimeout(function(){
                    the.time(currentTime,timeend)
                },1000)
                $('#jDomButtom').html(promotion_html);

            }else{
                $('#jDomButtom').html("<label>活动已结束</label>");
            }
        },
        //加一
        addend: function(num) {
            $('.jAddend').click(function() {
                var text = parseInt($('#jNumber').val());
                if(text >= num){
                    $('#jNumber').val(num);
                    Dialog.tips('最多只能购买'+num+'件');
                }
                else if($('#jNumber').val() == ''){
                    $('#jNumber').val(1);
                }
                else {
                    $('#jNumber').val(text + 1);
                }
            })
        },
        //减一
        Meiosis: function() {
            $('.jMeiosis').click(function(){
                var text = parseInt($('#jNumber').val());
                if(text <= 1) {
                    $('#jNumber').val(1);
                }
                else if($('#jNumber').val() == ''){
                    $('#jNumber').val(1);
                }
                else {
                    $('#jNumber').val(text - 1);
                }
            })
        },
        keyup: function(num) {
            var text = $('#jNumber');
            text.keyup(function(){
                var value = text.val();
                if(value == ''){
                    text.val('');
                }
                else if(value == 0){
                    text.val(1);
                }
                else if(!(/^\d+$/.test(value))){
                    text.val(1);
                }
                else if(value > num){
                    text.val(num);
                    Dialog.tips('最多只能购买'+num+'件');
                }
            });
        },
        //收藏
        iconcollection: function() {
            var coll = $('#jCollectionIcon');
            coll.click(function() {
                if(coll.hasClass('hover')) {
                    return false;
                }
                else {
                    item.collection('http://m.yunhou.com/member/collection_add');
                }
            })
        },
        //收藏ajax
        collection: function(url) {
            var data = {
                        'callback': 'callback',
                        'id': gProductId,
                        'favoriteType': '1'
                };
            io.jsonp(url, data, function(){
                        $('#jCollectionIcon').html('&#xe603;').addClass('hover');
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
        },
        add_cookie: function() {
            var _address = cookie("_address"),$addr = $('#jAddrPop'),arry;
            if(!_address){
                io.jsonp('/item/ajaxGetCurrentRegion', {}, function(data){
                    setAddr(data.address);
                })
            }else{
                setAddr(_address);
            }
            function setAddr(_address){
              if(_address.indexOf(':') > 0){
                    arry = _address.split(':')[0].split('_');
                    _address = arry[0]+','+arry[1]+','+arry[2];
                }
                $addr.text(_address);  
            }
            
        },
        //到货通知
        subscribe: function(m, email) {
            var data = {
                'callback': 'callback',
                'product_id': gProductId,
                'mobile': m,
                'email': email
            };
            io.jsonp('/item/ajaxSubscribe', data, function(){
                Dialog.tips('提交成功');
            },function(e) {
                e.msg&&Dialog.tips(e.msg);
            })
        },
        //加入购物车
        cart: function() {
            $('#jCartAdd').click(function() {
                var _this = $(this);
                var num = $('#jNumber').val();
                if(num == ''){
                    num = 1;
                }
                cart.addcart(gProductId, num, _this);
            })
        },
        //页面初始化
        initialization: function() {
            var item_data = {
                'product_id': gProductId,
                'callback': 'callback'
            };
            $('#promotion').hide()
            io.jsonp('http://m.yunhou.com/item/ajaxGetData', item_data, function(data){
                if(data.hideNum == true){
                    $('#jNumOpt').hide();
                }
                var store = data.data.product.store||0,  //库存
                    max = data.data.product.max,  //最大购买数
                    isFavorite = data.data.product.price, //是否已收藏，true已收藏 ，false未收藏,
                    supportDelivery = data.data.product.supportDelivery;  //是否可配送

                if(data.data.product.price){
                    var price = data.data.product.price; //销售价
                }
                else{
                    var price = $('#jPrice').text().replace("￥","");
                }

                if(data.data.promotion){
                    
                    var timest = '';

                    if(data.data.promotion.price){
                        var promotion_price = data.data.promotion.price.price;   //促销价（如果存在则显示促销价，反之显示销售价）
                        var timeend = data.data.promotion.price.limitTimeEnd;

                        //有活动时价格
                        $(".m-text span").eq(0).text(data.data.promotion.price.text)
                        $('#jPrice').text('￥'+promotion_price+'');
                        $('#jProPrice').text('￥'+price+'');
                    }
                    else{
                        promotion_price = price;
                        //有活动时没价格
                        $('#jPrice').text('￥'+promotion_price+'');
                        $('#jProPrice').text('');
                    }

                    if(data.data.promotion.limit){
                        var pronum = data.data.promotion.limit.num;   //促销商品限购数量
                    }

                    //添加倒计时
                    item.time(data.data.currentTime,timeend);

                    var gift_html ='';
                    /*营销活动*/
                    for(var i=0 ; i<data.data.promotion.list.length; i++){
                        if(data.data.promotion.list[i].type == 'gift'){
                            gift_html += '<li><a href="'+data.data.promotion.list[i].url+'"> <span class="color1">'+data.data.promotion.list[i].tag+'</span>'+data.data.promotion.list[i].ad+'<i class="iconfont icon-bbgxiayige">&#xe60e;</i></a></li>';
//                            $(".message").prepend('<div class="list-li"><a href="'+data.data.promotion.list[i].url+'"><i class="iconfont i1">&#xe60f;</i><span>赠品信息</span><i class="iconfont i2">&#xe60e;</i></a></div>')
                        }else{
                            gift_html += '<li><span class="color2">'+data.data.promotion.list[i].tag+'</span>'+data.data.promotion.list[i].ad+'</li>';
                        }
                    }
                    if(gift_html){
                        $('#promotion').append(gift_html).show()
                    }else{
                        $('#promotion').hide()
                    }



                    //有促销时最大购买量
                    if(pronum > store || !data.data.promotion.limit){
                        item.addend(max);
                        item.keyup(max);
                    }
                    else{
                        item.addend(pronum);
                        item.keyup(pronum);
                    }
                }
                else{
                    //没活动时价格
                    $('#jPrice').text('￥'+price+'');

                    item.addend(max);

                    item.keyup(max);
                }

                //库存
                (store <= 0) ? $('#jStock').text('缺货') : $('#jStock').text('有货');

                //收藏
                var isfavorite = data.data.product.isFavorite;
                if(isfavorite == true){
                    $('#jCollectionIcon').html('&#xe603;').addClass('hover');
                }

                //评论数
                $('#jCommentNum').text('('+data.data.product.commentNum+')');

                //按钮状态
                var btntype = data.data.button.state; //按钮状态
                var btntext = data.data.button.text;   //按钮文本
                var btnclick = data.data.button.click;  //按钮事件

                //修改按钮文本
                $('#jCartAdd').val(btntext);

                if(btnclick == 'disable'){  //不可点
//                    $('#jNumOpt').hide();
                    $('#jCartAdd').attr('disabled','true').css('background','#ccc');
                }
                else if(btnclick == 'storeNotice') {   //到货通知
                    $('#jCartAdd').removeClass("add-btn").addClass("dis-btn");
                    goodsNotice(gProductId);
                }
                else if(btnclick == 'addCart'){   //添加购物车
                    item.cart();
                }
                else if(btnclick == 'loginAddCart'){   //未登陆
                    item.cart();
                }
                else if(btnclick == 'buy'){
                    item.cart();
                }
            },function(e) {
                e.msg&&Dialog.tips(e.msg);
            });
        }
    }
    item.init();
});
