window.addEvent("domready", function() {
	var aElement = $('jMap');
	var flag = true;
	var mFlag = true;
	function closeTime() {
		var timer = setTimeout(function() {
			hide();
		}, 10000);

		aElement.addEvent('mouseover',function(){
			clearInterval(timer);
		});

		aElement.addEvent('mouseleave',function(){
			if(mFlag == true){
				timer = setTimeout(function() {
					hide();
				}, 10000);
			}
		});
		jImgLoading();
	}


	$('jOnline').addEvent('click',function(){
		mFlag = false;
		if(aElement.getCoordinates().height == '1072'){
			hide();
		}else{
			show();
		}
	});

	function init(){
		setTimeout(function() {
			var myFx = new Fx.Morph(aElement, {
				duration : '800',
				link : 'ignore'
			});
			myFx.start({
				'height' : 1072
			}).chain(function() {
				$('down').setStyle('display','block');
		        $('up').setStyle('display','none');
				jImgLoading();
				closeTime();
			});
		}, 300);
	}

	function show(){
		var myFx = new Fx.Morph(aElement, {
			duration : '800',
			link : 'ignore'
		});
		myFx.start({
			'height' : 1072
		}).chain(function() {
			$('down').setStyle('display','block');
	        $('up').setStyle('display','none');
		});
	}

	function hide(){
		var myFx = new Fx.Morph(aElement, {
			duration : '800',
			link : 'ignore'
		});
		myFx.start({
			'height' : 0
		}).chain(function() {
			$('down').setStyle('display','none');
            $('up').setStyle('display','block');
		});
	}
	
	window.addEvent('scroll', function(){
		if(flag == true){
			init();
		}
		flag = false;
	});

	function jImgLoading() {
		setTimeout(function() {
			var options = {
				range : 0,
				selector : '.jImg'
			};
			var allImg = new ImgLazy(options);
		}, 1);
	}
	

	//加入收藏
	function AddFavorite(sURL, sTitle)
	{
	    try
	    {
	        window.external.addFavorite(sURL, sTitle);
	    }
	    catch (e)
	    {
	        try
	        {
	            window.sidebar.addPanel(sTitle, sURL, "");
	        }
	        catch (e)
	        {
	            alert("您的浏览器不支持此功能，Windows系统请按Ctrl+D，Mac系统请按Cmd+D来加入收藏夹！");
	        }
	    }
	}

	$('jCollect').addEvent('click',function(){
		AddFavorite(window.location,document.title);
	});
});