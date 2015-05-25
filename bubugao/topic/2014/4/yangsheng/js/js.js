window.addEvent("domready", function() {
	function closeTime() {
		setTimeout(function() {
				var aElement = $('jBnShare');
				aElement.set('morph', {
					duration : 500,
					link : 'ignore'
				}).morph({
					'height' : 144
				});
				setTimeout(function() {
					var myFx = new Fx.Morph(aElement, {
						duration : '500',
						link : 'ignore'
					});
					myFx.start({
						'height' : 0
					});
				}, 8000);
		}, 300);

		$('jSee').addEvent('mouseover',function(){
			$('jSeeDetails').fade('1');
		});
		
		$('jSee').addEvent('mouseleave',function(){
			$('jSeeDetails').fade('0');
		});

		$('jTopShare').addEvent('click',function(){
			$('jBnShare').set('morph', {
					duration : 500,
					link : 'ignore'
				}).morph({
					'height' : 144
				});
				slideDown();
		});
	}

	function slideDown(){
		$(document).addEvent('click',function(e){
			if(e.target.id!=='jTopShare'){
				jMorph();
			}
		});

		window.addEvent('scroll', jMorph);

		function jMorph(){
		$('jBnShare').set('morph', {
					duration : 500,
					link : 'ignore'
				}).morph({
					'height' : 0
				});
		}
	}
	closeTime();
});