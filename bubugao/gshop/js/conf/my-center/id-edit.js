/**
 * 个人中心 - 身份证编辑
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    require('common/widget/happy/happy');
    var io = require('common/kit/io/request');
    var validator = require('common/widget/validator');

    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    //  获取来源url
    var getUrlParameter = function(key) {
        var p = window.location.href.split('?');
        if (p.length<2) {
            return '';
        }
        var ps = p[1].split('&');
        for (var i = 0, len = ps.length; i < len; i = i + 1) {
            var k = ps[i].split('=');
            if (k[0] === key) {
                return decodeURIComponent(k[1]);
            }
        }
        return '';
    };
    var refUrl = getUrlParameter('ref');
    console.log("refUrl",refUrl);


    //身份证上传先不要了
    var Uploader = require('common/widget/uploader');

     //file uploader buton installations  失败：-1 初始值0 正在上传1 成功2
      var uploadArray = [];
      $('[node-type="uploadButton"]').each(function(i, el) {
        uploadArray[i] = 0;
        var $el = $(el),
          fieldName = $el.data('name'),
          fieldInput = $('<input type="hidden" name="_UPLOAD_' + i + '" />');

        $el.append(fieldInput);

        // initialize file upload component
        var uploader = Uploader(el, {
          endpoint: 'http://m.yunhou.com/member/upload'
        });

        uploader.on('fileselect', function(e) {
          console.log('fileselect', e);
          uploadArray[i] = 1;
        });

        uploader.on('uploadprogress', function(e) {
          var percent = e.percentLoaded + '%';
          console.log(percent);
        });

        uploader.on('uploadcomplete', function(e) {
          var res = e.data || {};
          console.log("fanhui",res);
          if (res.code == "1") {
            uploadArray[i] = 2;
            fieldInput.val(res.url);
            console.log("wangzhi",res.url);
          }
          else{
            uploadArray[i] = -1;
            Dialog.tips(res.msg || '图片上传失败');
          }
        });

        uploader.on('uploaderror', function(e) {
            uploadArray[i] = -1;
          console.log('upload fails');
        });

      });
    //  表单验证
    $('.mod-id-edit form').isHappy({
        fields: {
            '#xingming': {
                required: 'sometimes',
                test: function() {
                    var username = $('#xingming').val();

                    if (username === '') {
                        Dialog.tips('请填写用户名');
                        return false;

                    }
                    else if(!validator['isNoneMalformed'].func(username)){
                        Dialog.tips(validator['isNoneMalformed'].text);
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            '#shenfenzheng':{
                required: 'sometimes',
                test: function() {
                    var shenfenzheng = $('#shenfenzheng').val() || "";
                    shenfenzheng = shenfenzheng.replace("x","X");
                    if (shenfenzheng === '') {
                        Dialog.tips('请填写身份证号');
                        return false;

                    }
                    else if(!validator['isIdCardNo'].func(shenfenzheng)){
                        Dialog.tips(validator['isIdCardNo'].text);
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            '#img-upload':{
                required: 'sometimes',
                test: function() {
                    var flg = true;
                    // 上传成功后又删除照片 或者编辑状态
                    $('[node-type="uploadButton"]').each(function(i, el) {
                        if(flg){
                            var $el = $(el).children("img");
                            var $parent = $(el).parent(".edit");
                            //非编辑状态
                            if($parent.length == 0){
                                if($el.length == 0)
                                {
                                    if(i == 0){
                                        Dialog.tips("请上传身份证正面照片");
                                    }
                                    else{
                                         Dialog.tips("请上传身份证反面照片");
                                    }
                                    flg = false;
                                }
                            }
                            // 编辑状态 把上传状态重置成2 （标识为上传成功）。
                            else
                            {
                                uploadArray[i] = 2;
                            }

                        }
                    });
                    // 上传状态判断  有可能上传未完成就点击提交了
                    for (var i = 0; i < uploadArray.length ; i++) {
                        if(flg){
                            if(uploadArray[i] < 2){
                                flg = false;
                                if(uploadArray[i] < 1){
                                    if(i == 0){
                                        Dialog.tips("请上传身份证正面照片");
                                        break;
                                    }
                                    else{
                                        Dialog.tips("请上传身份证反面照片");
                                        break;
                                    }
                                }
                                else{
                                    Dialog.tips("请身份证照片上传完成后再保存");
                                    break;
                                }
                            }
                        }
                    };
                    return flg;
                }
            }
        },
        submitButton: '#submitBtn',
        happy: function() {
            Dialog.tips('正在提交');
            var $form = $(".mod-id-edit form");

                var sender = $form[0];
                var url = $form.attr("action") || window.location.href;
                io.post(url, $form.serialize(), function(e) {
                    console.log('resule: ', e.error);
                    console.log('message: ', e);
                    if(e.error == '0'){
                        Dialog.tips(e.msg||'提交成功');
                        if(refUrl){
                            window.location.href = refUrl;
                        }
                        else{
                            history.back(-1);
                        }
                    }
                    else{
                        Dialog.tips(e.msg||'提交失败，请稍后重试');
                    }
                }, function(e) {
                    console.log('unexception error');
                    Dialog.tips(e.msg||'提交失败，请稍后重试');
                }, sender);
        }
    });


    var clickHandlers = {
        deleteImgBtn : function(e) {
            var $this = $(this);
            $this.parents(".id-img").toggleClass("edit");
        }
        // submitBtn : function(e) {
        //     e.preventDefault();
        //     var url = '#';
        //     var sender = this;
        //     io.post(url, {foo: 'bar param value'}, function(e) {
        //         console.log('resule: ', e.data);
        //         console.log('message: ', e.msg);
        //     }, function(e) {
        //         console.log('request unexception error');
        //     }, sender);
        //     //post
        //     io.jsonp(url, {foo: 'oh, yeah yeah'}, function(e) {
        //         console.log('resule: ', e.data);
        //         console.log('message: ', e.msg);
        //     }, function(e) {
        //         console.log('unexception error');
        //     }, sender);

            // if($("form").attr("data-init")==null){
            //     $("form").attr("data-init","1");
            //     $("form").submit();
            // }

        // }
    }
    for(var k in clickHandlers){
        var handle = clickHandlers[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-id-edit").on("click",key,handle);
        }
    }
});
