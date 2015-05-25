/**
 * 个人中心 - 地址编辑
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    var validator = require('common/widget/validator');
    var io = require('common/kit/io/request');
    var cookie = require('common/kit/io/cookie');
    require('common/widget/happy/happy');

    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    var urls = {
        getZTD : '//m.yunhou.com/member/get_list_ztd'
    };
    // 读取cookie设置默认地址
    (function(){
       var addressValue = "", addressArray, addressText = "", pop = $('#jAddrPop');
        if($("#zone").val()=="" || $("#zone").val()=="请选择"){
            addressValue = cookie("_address");
            var data = {
                area: addressValue
            };
            io.jsonp('/region/transformation', data, function(data){
                var text = data.data;
                addressArray = text.split(":");
                addressText = addressArray.length > 1?addressArray[0]:"请选择";
               // console.log(addressText);
                addressText = addressText.replace(new RegExp("_","gm"),",");
                $('#zone').val(text);
                pop.attr("data-linkage-tab",text);
                pop.text(addressText);
            },function(){
                Dialog.tips('获取地址失败，请手动选择');
            })
        }
        else{
            console.log("编辑地址");
        }
    })();


    //  表单验证
    $('.mod-address-edit form').isHappy({
        fields: {
            '#zone': {
                required: 'sometimes',
                test: function() {
                    var address = $('#jAddrPop').attr("data-linkage-tab");
                    $(".mod-address-edit form #zone").val(address);
                    if (address == '') {
                        Dialog.tips('请选择收货地区');
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            '#xiangxiaddress':{
                required: 'sometimes',
                test: function() {
                    var xiangxiaddress = $('#xiangxiaddress').val();

                    if (xiangxiaddress == '') {
                        Dialog.tips('请输入详细地址');
                        return false;

                    } else {
                        return true;
                    }
                }
            },
            '#zitidianSelect':{
                required: 'sometimes',
                test: function() {
                    var isCheck = $('#zitidianCheckbox').attr("checked");
                    if (isCheck) {
                        var zitidianSelect = $("#zitidianSelect").val();
                        if(zitidianSelect == ""){
                            Dialog.tips('请选择自提点');
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            },
            '#shouhuoren': {
                required: 'sometimes',
                test: function() {
                    var username = $('#shouhuoren').val();
                    if (username == '') {
                        Dialog.tips('请填写收货人');
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            '#shoujihao':{
                required: 'sometimes',
                test: function() {
                    var shoujihao = $('#shoujihao').val();

                    if (shoujihao == '') {
                        Dialog.tips('请填写手机号');
                        return false;
                    }
                    else if(!validator['mobile'].func(shoujihao)){
                        Dialog.tips(validator['mobile'].text);
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
        },
        submitButton: '#submitBtn',
        happy: function() {
            Dialog.tips('正在提交');
            var $form = $(".mod-address-edit form");
            $form.submit();
            // if($form.attr("data-init")!="1"){
            //     $form.attr("data-init","1");
            //     $form.submit();
            // }
        }
    });

   $('#jAddrPop').click(function(){
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
            //selectedData:'湖南_长沙市_芙蓉区:43_430100000000_430102000000',
            degree : 4,
            lastChangeCallBack : function(e){
                toggleZiti();
            },
            onClose:function(){
                toggleZiti();
            }
        });
    });
   //切换是否显示 查询自提点
    var toggleZiti = function(oldValue){
        var showFlg = false;
        var checkFlg = false;
        // 有可能ajax判断是否有自提点
        var address = $('#jAddrPop').attr("data-linkage-tab");
        var regionId = address.split("_");
        if(regionId.length > 1){
            var url = urls.getZTD + '?regionId=' + regionId[regionId.length-1];
            io.get(url, {}, function(e) {
                var rowData = e;
                var e = eval(e);
                console.log('resule: ', e.error);
                console.log('message: ', e);
                console.log("e.data",e.data);
                if(e.data && e.data.length>0){
                    showFlg= true;
                    $("#zitidianSelect").html("");
                    for (var i = e.data.length - 1; i >= 0; i--) {
                        if(oldValue && oldValue == e.data[i].collUid){
                            checkFlg = true;
                            $("#zitidianSelect").append("<option selected='selected' value="+e.data[i].collUid+">"+e.data[i].collName+"</option>");
                        }
                        else{
                            $("#zitidianSelect").append("<option value="+e.data[i].collUid+">"+e.data[i].collName+"</option>");
                        }
                    };
                }
                else{
                    console.log(e.msg,"没有自提点");
                }
                deal(showFlg,checkFlg);
            }, function(e) {
                console.log('unexception error');
                console.log(e);
                Dialog.tips(e.msg||'获取自提点地址数据失败，请稍后重试');
                deal(showFlg,checkFlg);
            }, null);
        }

        function deal(showFlg,checkFlg){
            if(showFlg){
                $(".zitidian-div").show();
                $(".zitidian-div").next().addClass("no-border");
                $(".mod-address-edit .zitidian-div input[type=checkbox]")[0].checked = checkFlg?true:false;
                if( !$(".mod-address-edit .zitidian-div input[type=checkbox]").is(":checked")){
                    $(".mod-address-edit .zitidian-div select").attr('disabled', 'disabled');
                }
            }
            else{
                $(".zitidian-div").hide();
                $(".zitidian-div").next().removeClass("no-border");
                $(".mod-address-edit .zitidian-div input[type=checkbox]")[0].checked = false;
                $(".mod-address-edit .zitidian-div select").removeAttr('disabled');
            }
        }
    }

    // 按钮初始化
    var changeHandles = {
        daishoudian:function(){
            var $this = $(this);
            var val = $this.is(":checked");
            if(!val){
                $this.parents(".zitidian-div").find("select").attr('disabled', 'disabled');
            }
            else{
                $this.parents(".zitidian-div").find("select").removeAttr('disabled');
            }
        }
    }
    for(var k in changeHandles){
        var handle = changeHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-address-edit").on("change",key,handle);
        }
    }

    //页面编辑时候 初始化自提点数据
    if($("#hdf_selfId").val()==""){
        //新建
        $(".mod-address-edit input[type=checkbox]")[0].checked=false;
        toggleZiti();
    }
    else{
        if($("#hdf_addressId").val()==""){
            $(".mod-address-edit input[type=checkbox]")[0].checked=false;
            toggleZiti();
        }
        else{
            toggleZiti($("#hdf_selfId").val());
        }
    }
    // 页面进入防止dom状态被保存
    //$(".mod-address-edit form").attr("data-init","0");

});
