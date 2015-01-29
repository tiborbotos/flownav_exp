

/*
 By Osvaldas Valutis, www.osvaldas.info
 Available for use under the MIT License
 */

 // JQUERY VERSION:

( function( $, window, document, undefined )
{
	'use strict';

	var topNavSelector		= '.flownav-top',
		bottomNavSelector 	= '.flownav-bottom',
		$topNav				= $( topNavSelector),
		$topNavMenu 		= $( topNavSelector + ' .menu'),
		$bottomNav  		= $( bottomNavSelector);

	if( !$topNav.length ) return true;

	var bottomPosInvisible = -100;

	var topNavHeight	= 0,
		topNavTop		= 0,
		$document		= $( document ),
		dHeight			= 0,
		$window			= $( window ),
		wHeight			= 0,
		wScrollCurrent	= 0,
		wScrollBefore	= 0,
		wScrollDiff		= 0,
		bottomNavHeight = 0,
		bottomNavBottom = -100,
		articleTop 		= $('.content').offset().top,
		articleBottom	= $('.comments').offset().top,
		topNavScrolledAwayOnce = false;

	$window.on( 'scroll', function()
	{
		topNavHeight		= $topNav.outerHeight() + 10;
		dHeight				= $document.height();
		wHeight				= $window.height();
		wScrollCurrent		= $window.scrollTop();
		wScrollDiff			= wScrollBefore - wScrollCurrent;
		topNavTop			= parseInt( $topNav.css( 'top' ) ) + wScrollDiff;
		bottomNavHeight		= $bottomNav.outerHeight(),
		bottomNavBottom		= parseInt($bottomNav.css('bottom'));

		if( wScrollCurrent <= 0 ) {// scrolled to the very top; top nav sticks to the top
			$topNav.css( 'top', 0 );
			$bottomNav.css('bottom', bottomPosInvisible);

			if (topNavScrolledAwayOnce) {
				$topNavMenu.slideDown(200);
				topNavScrolledAwayOnce = false;
			}
		}
		else if( wScrollDiff > 0 ) { // scrolled up; top nav slides in

			if (wScrollDiff < 3 && topNavTop <= -topNavHeight) { // slow scroll

				if (wScrollCurrent < articleTop || wScrollCurrent > articleBottom) { // we don't want to interrupt the user with the top nav (he's reading)
					$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );
				}

			} else if (wScrollDiff < 7) { // medium scroll, top nav shows up by scrolling, bottom nav stays visible

				$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );

			} else { // fast scroll, top nav shows up fast, bottom nav disappers

				$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );
				$bottomNav.css('bottom', bottomPosInvisible);
			}

		}
		else if( wScrollDiff < 0 ) { // scrolled down

			if( wScrollCurrent + wHeight >= dHeight - topNavHeight ) { // scrolled to the very bottom; top nav slides in
				$topNav.css('top', ( topNavTop = wScrollCurrent + wHeight - dHeight ) < 0 ? topNavTop : 0);
			}
			else { // scrolled down; element slides out
				$topNav.css( 'top', Math.abs( topNavTop ) > topNavHeight ? -topNavHeight : topNavTop );

				if (parseInt($topNav.css('top')) <= -topNavHeight && !topNavScrolledAwayOnce) { // set the flag and hide the top nav menu
					topNavScrolledAwayOnce = true;
					$topNavMenu.hide();
				}
			}
		}

		if (wScrollCurrent > topNavHeight && wScrollDiff < 0 && bottomNavBottom < 0) { // bottom nav appears if top nav is not visible
			$bottomNav.css('bottom', 0);
			scrolledToTop();
		}

		wScrollBefore = wScrollCurrent;
	});

})( jQuery, window, document );


function scrolledToTop() {
	$('.js_trending span').addClass('active');
}


// ACTIONS
( function ($) {

	$('.js_move-top').click(function () {
		$('html, body').animate({ scrollTop : 0 }, { duration: 600, easing: 'easeOutQuart' });
	});

	$('.js_recommend').click(function () {
		$('.js_recommend span').toggleClass('active');
	});

})(jQuery);