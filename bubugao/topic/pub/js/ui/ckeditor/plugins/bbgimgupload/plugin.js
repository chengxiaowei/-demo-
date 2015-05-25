CKEDITOR.plugins.add('bbgimgupload', {
	icons : 'bbgimgupload',
	init : function(editor) {
		editor.ui.addButton('bbgimgupload', {
			label : '插入图片',
			command : 'insertBBGImgUpload',
			toolbar : 'insert'
		});

		editor.addCommand('insertBBGImgUpload', {
			exec : function(editor) {
				var defautls = {
					event : false,
					editConfig : [ {
						'name' : 'align',
						'text' : '图片自动居中',
						'default' : true
					} ],
					callback : function(data) {
						var str = '';
						for ( var i = 0; i < data.src.length; i++) {
							str += '<img class="jIntroImg img-error" src="' + data.src[i] + '" />';
						}
						if (str != '') {
							if (data.editConfig.align) {
								str = '<p style="text-align:center;font-size:0;line-height:0;" >' + str + '</p>';
							} else {
								str = '<p style="font-size:0" >' + str + '</p>';
							}
						}
						editor.insertHtml(str);
					}
				};
				var opt = $.extend({}, defautls, editor.config.bbgImgUploadConfig || {});
				$('.cke_button__bbgimgupload').eq(0).imgUpload(opt);
			}
		});
	}
});