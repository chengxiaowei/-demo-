/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights
 *          reserved. For licensing, see LICENSE.html or
 *          http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) { 

	config.toolbar = 'Define';	// 启动自定义配置，如不需要自定义配置可设置为'Full'
	config.toolbar_Define = [{
		name: 'document',
		items: ['Source', '-', 'DocProps', 'Preview', 'Print', '-']
	}, {
		name: 'clipboard',
		items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
	}, {
		name: 'editing',
		items: ['Find', 'Replace', '-', 'SelectAll', '-']
	}, {
		name: 'basicstyles',
		items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat']
	},  {
		name: 'paragraph',
		items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']
	}, {
		name: 'links',
		items: ['Link', 'Unlink', 'Anchor']
	}, {
		name: 'insert',
		items: ['Flash', 'Table', 'HorizontalRule', 'Smiley']	// BBGImgUpload为自定义添加插件
	}, {
		name: 'styles',
		items: ['Styles', 'Format', 'Font', 'FontSize']
	}, {
		name: 'colors',
		items: ['TextColor', 'BGColor']
	}, {
		name: 'screen',
		items: ['Maximize']
	}];
	config.toolbar_Basic = [['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-', 'About']]; 


	//工具栏所有选项
	// config.toolbar = 'Full';   
	// config.toolbar_Full  =   [     { 
	// 	name:  'document',
	// 	 items :  [ 'Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates' ] 
	// },       { 
	// 	name:  'clipboard',
	// 	 items :  [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] 
	// },       { 
	// 	name:  'editing',
	// 	 items :  [ 'Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker',  'Scayt' ] 
	// },       { 
	// 	name:  'forms',
	// 	 items :  [ 'Form',  'Checkbox',  'Radio',  'TextField',  'Textarea',  'Select',  'Button',  'ImageButton',           'HiddenField' ] 
	// },      '/',       { 
	// 	name:  'basicstyles',
	// 	 items :  [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] 
	// },       { 
	// 	name:  'paragraph',
	// 	 items :  [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',      
	// 		'-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' 
	// 	] 
	// },       { 
	// 	name:  'links',
	// 	 items :  [ 'Link', 'Unlink', 'Anchor' ] 
	// },       { 
	// 	name:  'insert',
	// 	 items :  [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] 
	// },      '/',       { 
	// 	name:  'styles',
	// 	 items :  [ 'Styles', 'Format', 'Font', 'FontSize' ] 
	// },       { 
	// 	name:  'colors',
	// 	 items :  [ 'TextColor', 'BGColor' ] 
	// },       { 
	// 	name:  'tools',
	// 	 items :  [ 'Maximize',  'ShowBlocks', '-', 'About' ] 
	// } ];   
	// config.toolbar_Basic  =   [     
	// 	['Bold',  'Italic',  '-',  'NumberedList',  'BulletedList',  '-',  'Link',  'Unlink', '-', 'About'] 
	// ];

};
