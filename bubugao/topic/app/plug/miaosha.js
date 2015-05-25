define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var _ = require('pub/core/bbg');


    function asyncCount($curObj,opt,successFun,errorFun) {
        BBG.AJAX.jsonp(opt, function(data) {
            successFun && successFun(data);
        }, function(data) {
            errorFun && errorFun(data);
        })
    }
    // 三种状态 1未开始，2进行中，3已结束  asyncCountFlg 请求库存标记
    function changeButton($curObj, flg, url, asyncCountFlg) {
        
        function changeBtnDom($curObj, btnFlg){
            if($curObj.attr("miaosha-status") != btnFlg){
                $curObj.attr("miaosha-status", btnFlg);
                var $a = $curObj.find(".buy-btn-mod a");
                if(btnFlg == "1"){
                    $a.text("即将开始");
                    $a.attr("class","to-buy-btn");    
                }
                else if(btnFlg == "21"){
                    $a.text("立即抢");
                    $a.attr("class","com-buy-btn"); 
                }
                else if(btnFlg == "22"){
                    $a.text("已抢光");
                    $a.attr("class","no-buy-btn"); 
                    $curObj.addClass("show-over-part");
                }
                else if(btnFlg == "3"){
                    $a.text("已结束");
                    $a.attr("class","no-buy-btn");
                    $curObj.addClass("show-over-part");
                }
                
            }
        }
        
        switch (flg) {
            case 1:
                changeBtnDom($curObj,"1");
                break;
            case 2:
                // 已经结束
                if($curObj.attr("miaosha-status") == "22") {
                      break;
                }
                else{
                    changeBtnDom($curObj,"21");
                    // 目前注释掉
                    if(asyncCountFlg && false){
                        asyncCount(
                            $curObj,
                            {
                                url:url,
                                data:$curObj.attr("data-targetid")
                            },
                            function(data){
                                if(data && data.noCount == "1"){
                                    changeBtnDom($curObj,"22");  
                                }
                                else{
                                    changeBtnDom($curObj,"21");
                                }
                            },function(){
                               changeBtnDom($curObj,"21");
                            }
                        );
                    }
                }
                break;
            case 3:
                changeBtnDom($curObj,"3");
                break;
        }
    }

    function Miaosha(opt) {
        this.defaultSetting = $.extend(this, this.defaultSetting, opt || {});
        this.init();
    }
    Miaosha.prototype = {
        defaultSetting: {
            // 获取服务器事件的url
            url: 'http://api.mall.yunhou.com/Time',
            //请求库存url
            countUrl : 'http://api.mall.yunhou.com/Time',
            // 秒杀结束结束回调函数
            callback: function($dom) {},
            // 容器
            container: '[data-node-type=mod-miaosha]'
        },
        init: function(argument) {
            var _self = this;
            _self.getServiceTime(function(data) {
                _self.currentTime = data;
                _self._countDown();
                var $lis = $(_self.container).children("li");
                _self.itemArray = $(_self.container).children("li");
            });
        },
        ajax: function(url, data, successFun, errorFun) {
            var opt = {
                'url': url,
                'data': $.extend({
                    platform: 'js' // ,
                }, data)
            };
            BBG.AJAX.jsonp(opt, function(data) {
                successFun && successFun(data);
            }, function(data) {
                errorFun && errorFun(data);
            });
        },
        // 获取服务器时间
        getServiceTime: function(callback) {
            if (this.url != '') {
                this.ajax(this.url, {}, function(data) {
                    if (!data || data == null) {
                        return;
                    }
                    callback && callback(data);
                }, function() {
                    //callback && callback();
                });
            } else {
                callback && callback();
            }
        },
        // 主时间轴
        _countDown: function() {
            var _self = this;
            //当前时间 从系统取，没有的话取本地
            var _currentTime = _self.currentTime;
            _currentTime = (_currentTime ? _currentTime : new Data().getTime());
            _currentTime = parseInt(_currentTime);

            //变量，用于标记请求库存的标记，因为页面500毫秒一个timer，请求库存需要1s一次
            var sFlg = true;
            // 解决浏览器切换选项卡倒计时停止的问题 需要
            var _beginTime = new Date().getTime();
            _countDownDeal();
            var initTime = setInterval(_countDownDeal, 500);
            function _countDownDeal() {
                // 解决浏览器切换选项卡倒计时停止的问题 需要
                _currentTime = _currentTime + 100;
                _beginTime = _beginTime + 100;
                if (_beginTime != new Date().getTime()) {
                    _currentTime = _currentTime + (new Date().getTime() - _beginTime);
                    _beginTime = new Date().getTime();
                }

                sFlg = !sFlg;
                if(_self.itemArray){
                    for (var i = _self.itemArray.length - 1; i >= 0; i--) {
                        _countDownItem($(_self.itemArray[i]));
                    }
                }
            }

            // 处理具体某一个秒杀单品
            function _countDownItem($curObj) {
                if ($curObj.attr("miaosha-status") == "3") {
                    return;
                }
                // 结束时间;
                var _endTime = $curObj.attr('data-eTime');
                _endTime = parseInt(_endTime);
                var _startTime = $curObj.attr('data-sTime');
                _startTime = parseInt(_startTime);
                // 根据时间判断秒杀进度
                if (_endTime > _currentTime) {
                    if (_currentTime < _startTime) {
                        changeButton($curObj, 1, _self.countUrl, false);
                    } else {
                        changeButton($curObj, 2, _self.countUrl, sFlg);
                    }
                } else {
                    changeButton($curObj, 3, _self.countUrl, false);
                    // 倒计时结束调用回调函数
                    _self.callback($curObj);
                }
            }
        }
    }
    module.exports = Miaosha;

    new Miaosha({
        url: 'http://api.mall.yunhou.com/Time',
        container: '[data-node-type=mod-miaosha]',
        countUrl :"http://api.mall.yunhou.com/Time"
    });
});