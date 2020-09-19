$(document).ready( function (){

	if($(window).width() < 767){
		$('.mobile-slider').slick({
			dots: false,
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			adaptiveHeight: true,
			autoplay: false
		});
	}

});
