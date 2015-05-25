define(function(require, exports, module) {
    'use strict';
    
    var snow = require('app/plug/snow');
    var opt = {
    		  selector:$('#jSnow-1'),
          itemSize : 40,//飘点个数
          hidesnowtime: 0,//消失时间
          arrSnowSrc: [ 'snow-1', 'snow-2', 'snow-3', 'snow-4', 'snow-5', 'snow-6', 'snow-7', 'snow-8', 'snow-9' ],
          showTime : 10
    }
    snow(opt);
    var opt1 = {
          selector:$('#jSnow-2'),
           itemSize : 40,//飘点个数
           hidesnowtime: 0,//消失时间
           arrSnowSrc: [ 'snow-10', 'snow-11', 'snow-12', 'snow-13', 'snow-14', 'snow-15'],
           showTime : 0
    }
    snow(opt1);
});