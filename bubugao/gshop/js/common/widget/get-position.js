/*  getPosition.js
**  获取地理位置信息
**  设备需要支持geolocation
**  create leaytam 2015-2-6
*/
!function(window) {
    if (navigator.geolocation) { 
        var opt = {
            enableHighAccuracy: true,   //是否启用高精度设备
            maximumAge: 30000,  //设备缓存时间
            timeout: 20000     //超时时间，超时后将会调用getPositionError
        };
        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError, opt);
    }else{ 
        //如果不支持需要进行的提示操作。。。
    }

    function getPositionSuccess(position){  
        console.log(position);       
        var lat = position.coords.latitude;         
        var lng = position.coords.longitude; 
        alert( "您所在的位置:经度" + lat + ",纬度" + lng); 
    }

    function getPositionError(error) {
        //获取地址失败后进行的操作。。。
    }

}(window);
