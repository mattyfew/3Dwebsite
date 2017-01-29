$(document).ready(function () {

	wow = new WOW({
		boxClass: 'wow', // default
		animateClass: 'animated', // default
		offset: 0, // default
		mobile: false,
		live: true // default
	})
	wow.init();

	$('#fullpage').fullpage({
		navigation: true,
		navigationPosition: 'left',
		navigationTooltips: ['Home', 'About Me', 'Skills', 'Portfolio', 'Contact', 'Hire Me'],
		resize: false,
		scrollBar: true,
		scrollOverflow: false,

		//RESPONSIVE
		responsiveWidth: 800,
		afterResize: function () {
			if ($(window).width() < 800) {
				var verticalNav = document.getElementById("fp-nav");
				$(verticalNav).hide();
			}
		}
	});

	if ($(window).width() <= 719) {
		$(".wow").removeClass("wow");
	}
});
