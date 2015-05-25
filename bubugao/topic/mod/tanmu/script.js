define(function(require, exports, module) {
    'use strict';

     var _ = require('app/plug/tanmu');

    // 字符串数组 {text:弹幕的文本，fontColor：文字的颜色，fontSize：文字的大小 默认为20，最好默认大小}
    var zhufuStrArray = [{text:"2015年愿家人和自己身体健康，工作顺利，事业有进步，每天开开心心的，自己每次考试棒棒的。",fontColor:"#f00"},
        {text:"宝贝亚女，我生日的最后一刻许愿，你开开心心快快乐乐的",fontColor:"#f00"},
        {text:"我要天天开心，事事顺心，心想事成。",fontColor:"#f00"},
        {text:"希望2015年一切顺利 宝宝健康 我肯快有份待遇好 事少的好工作,很快能接到电话",fontColor:"#f00"},
        {text:"祝自己生日快乐，身体健康，生意兴隆！",fontColor:"#f00"},
        {text:"尽快找到自己心爱的那个他。",fontColor:"#f00"},
        {text:"希望娶月儿为妻，和她厮守一生",fontColor:"#f00"},
        {text:"保佑我生意兴隆，客源越来越多，生意越来越好。",fontColor:"#f00"},
        {text:"   ——深刻理解先进性学习运动 教育，是所有生命存在和活动的第一需要，又是所有生命活动第�",fontColor:"#f00"},
        {text:"希望2015年一切顺利 宝宝健康 我肯快有份待遇好 事少的好工作,很快能接到电话",fontColor:"#f00"},
        {text:"本命年里事事顺心如意，有出乎意料的超好运!",fontColor:"#f00",fontSize:10},
        {text:"蒙柳之你永远都不会知道我开通黄钻只是希望每次进你空间时可以隐身访问， 没有人知道有我的痕迹！包括你！要幸福哦！",fontColor:"#f00"},
        {text:"我们的脚本，写得好认真，我一定看过最好的悲剧。",fontColor:"#f00",fontSize:10}];

    //初始化 弹幕对象
    var canvas = document.getElementById("canvas_tanmu");
    var emitter = new animationEngine({
        canvas:canvas,
        tmData:zhufuStrArray
    });
    emitter.start();

    //异步更新弹幕词条
    setInterval(function(){
        // 这里可以异步ajax后更新 this.fultures  只要fultures没有更新，弹幕始终循环之前的词条
        emitter.fultures = [{text:"我的新年愿望 新年愿望 新年愿望 新年愿望 新年愿望 新年愿望 新年愿望 新年愿望 新年愿望 新年愿望"},
                            {text:"你的圣诞礼物 圣诞礼物 圣诞礼物 圣诞礼物 圣诞礼物 圣诞礼物"},
                            {text:"他的生日礼物 ^-^  ^-^ ^-^ ^-^ ^-^ "}];
    },10000);

    // 页面元素绑定事件
    var button = document.getElementById("abuttton");
    button.onclick = function(){
        if(button.innerHTML == "关闭弹幕") {
            emitter.stop();
            button.innerHTML = "开启弹幕";
        }
        else if(button.innerHTML == "开启弹幕"){
            button.innerHTML = "关闭弹幕";
            emitter.start ();
        }
    }
    var addButton = document.getElementById("add");
    addButton.onclick = function(){
        // 添加本地发起的弹幕  这条消息 一直在页面上循环，始终不消失。
        emitter.addMyText({text:"我的新年愿望"});
    }

 });