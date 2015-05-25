define(function(require, exports, module) {
    'use strict'; 
	
    var  Login = BBG.Login;

    var alert = BBG.alert;

    var dialog = require("dialogPlus");
    require("loginDialog");
     var _ = require('pub/plugins/min-bar');
        _ = require('pub/plugins/hd/category');
        _ = require('pub/plugins/site-nav');
        _ = require('pub/plugins/hd/auto-search');
        _ = require('app/plug/timeout');
        _ = require('app/plug/lazyLoadData');
        _ = require('app/plug/timeout');

    // 提示信息
    BBG.tips = function(content, callback, time) {
        var d = dialog({
            content : '<p class="tips-div">' + content + '</p>'
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
            callback && callback();
        }, time || 2000);
    }

    var sendVoteData = function(sid, callback) {
        if (sendVoteData.lock) return;
        sendVoteData.lock = 1;
        $.ajax({
            url: '/2014sale/Api/vote',
            data: {id: sid},
            method: 'POST',
            dataType: 'json',
            success: function(res) {
                if (+res.status === -100) {
                    Login.dialog(function() { location.reload(); });
                }
                else {
                    callback(res);
                }
            },
            error: function(e, xhr, message) {
               alert('接口请求失败: ' + message);
           }
        }).always(function() {
            sendVoteData.lock = 0;
        });
    };

    var handleVote = function(res, target) {
        if (+res.status === 200) {
            // update vote score
            $(target).parent().siblings('.com-txt').find('font').html(res.msg);
            BBG.tips(res.info, function() {

            }, 2000);
        } else {
            alert(res.info);
        }
    };

    /**
     * Vote module entry
     * @param {HTMLElement} moduleElement The wrap html element.
     * @param {Object} opts (Optianal) set the vote options.
     */
    var initVote = function(moduleElement, opts) {

        $(moduleElement).delegate('[action-type="vote"]', 'click', function(e) {
            e.preventDefault();
            var target = e.target, sid = $(target).attr('action-data');
            sendVoteData(sid, function(res) {
                handleVote(res, target);
            });
        });

        return {
            destroy: function() {
                nodeList = null;
            }
        };
    };

   return {
        init: initVote
    }; 
})