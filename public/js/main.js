

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
		$topNavMenu 		= $( topNavSelector + ' .flownav-menu'),
		$bottomNav  		= $( bottomNavSelector);

	// consts
	var bottomNavPosInvisible	= -100,
		


		// flags
		nextArticleInTopNavVisible = false, // is the next article component is visible in the top navigation header
		topNavScrolledAwayOnce = false, // has the page scrolled away from the top navigation at least once

		// variables
		topNavTop		= 0,
		bottomNavBottom	= 0,
		$document		= $( document ),
		$window			= $( window ),
		wScrollCurrent	= 0,
		wScrollBefore	= 0,
		wScrollDiff		= 0,
		articleTop 		= $('.content').offset().top,
		articleBottom	= $('.comments').offset().top,
		articlePosition33 = Math.round(articleBottom * 0.33),

		dHeight				= $document.height(),
		wHeight				= $window.height(),
		topNavHeight		= $topNav.outerHeight() + 4, // +4 because of the shadow
		bottomNavHeight		= $bottomNav.outerHeight();

	$window.on( 'scroll', function()
	{
		wScrollCurrent		= $window.scrollTop();
		wScrollDiff			= wScrollBefore - wScrollCurrent;
		topNavTop			= parseInt( $topNav.css( 'top' ) ) + wScrollDiff;
		bottomNavBottom		= parseInt($bottomNav.css('bottom'));

		if( wScrollCurrent <= 50 ) {// scrolled to the very top; top nav sticks to the top
			$topNav.css( 'top', 0 );
			$bottomNav.css('bottom', bottomNavPosInvisible);

			if (topNavScrolledAwayOnce) { // open top nav menu if we reached to top
				displayTopNavMenuAndResetFlag();
			}
			hideNextArticleInTopNav();
		}
		else if( wScrollDiff > 0 ) { // scrolled up; top nav slides in

			if (wScrollDiff < 5 && topNavTop <= -topNavHeight + 1) { // slow scroll

				if (wScrollCurrent < articleTop || wScrollCurrent > (articleBottom - wHeight)) { // we don't want to interrupt the user with the top nav (he's reading)
					$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );
				}

			} else if (wScrollDiff < 10) { // medium scroll, top nav shows up by scrolling, bottom nav stays visible

				$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );

			} else { // fast scroll, top nav shows up fast, bottom nav disappers

				$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );
				$bottomNav.css('bottom', bottomNavPosInvisible);
			}

			if (wScrollCurrent < topNavHeight) { // open top nav menu if we are close to the top
				displayTopNavMenuAndResetFlag();
			}
		}
		else if( wScrollDiff < 0 ) { // scrolled down

			if( wScrollCurrent + wHeight >= dHeight - topNavHeight ) { // scrolled to the very bottom; top nav slides in
				$topNav.css('top', ( topNavTop = wScrollCurrent + wHeight - dHeight ) < 0 ? topNavTop : 0);
			}
			else { // scrolled down; element slides out
				$topNav.css( 'top', Math.abs( topNavTop ) > topNavHeight ? -topNavHeight : topNavTop );

				if (parseInt($topNav.css('top')) <= -topNavHeight && !topNavScrolledAwayOnce) { // set the flag and hide the top nav menu
					hideTopNavMenuAndSetFlag();
				}

				if (wScrollCurrent > topNavHeight) { // if we are over the top nav height, let's show the next article
					showNextArticleInTopNav();
				}
			}
		}

		if (wScrollCurrent > topNavHeight && wScrollDiff < 0 && bottomNavBottom < 0) { // bottom nav appears if top nav is not visible
			$bottomNav.css('bottom', 0);
		}

		if (wScrollCurrent > articlePosition33 &&
			$('.js_trending span').has('active').length === 0) { // highlight trending icon if we reach the bottom of the page
			highlightTrendingIcon();
		}

		wScrollBefore = wScrollCurrent;
	});

	function showNextArticleInTopNav() {
		if (!nextArticleInTopNavVisible) {
			$('.next-article-background').css('opacity', '1');
			$('.icon-hamburger').css('top', '55px');
			$('.flownav-next-article').css('top', '15px');
			$('.flownav-header .logo').addClass('next-article-displayed');
			nextArticleInTopNavVisible = true;
		}
	}

	function hideNextArticleInTopNav() {
		if (nextArticleInTopNavVisible) {
			$('.next-article-background').css('opacity', '0');
			$('.icon-hamburger').css('top', '15px');
			$('.flownav-next-article').css('top', '-30px');
			$('.flownav-header .logo').removeClass('next-article-displayed');
			nextArticleInTopNavVisible = false;
		}
	}

	function highlightTrendingIcon() {
		$('.menu-square').removeClass('active');
		$('.js_trending span').addClass('active');
	}

	function displayTopNavMenuAndResetFlag() {
		$topNavMenu.css('max-height', '60px');
		$topNavMenu.css('border', '');
		topNavScrolledAwayOnce = false;
	}

	function hideTopNavMenuAndSetFlag() {
		topNavScrolledAwayOnce = true;
		$topNavMenu.css('max-height', '0');
		$topNavMenu.css('border', 'none');
	}

	function scrollToTheTop() {
		$('html, body').animate({ scrollTop : 0 }, { duration: 600, easing: 'easeOutQuart' });
	}

	(function initMenus() {
		$('.js_move-top').click(function () {
			scrollToTheTop();
			highlightTrendingIcon();
		});

		$('.js_recommend').click(function () {
			console.log('Recommend clicked');
			console.log($('.js_recommend span'));
			$('.js_recommend span').toggleClass('active');
		});

		$('.js_search').click(function () {
			if ($('.js_search.opened').length === 1) {
				$('.js_search').parent().removeClass('highlighted');
				$('.js_search-container').css('max-height', 0);
			} else {
				$('.js_search').parent().addClass('highlighted');
				$('.js_search-container').css('max-height', '200px');
			}
			$('.js_search').toggleClass('opened');
		});

		$('.js_user-menu').click(function () {
			if ($('.js_user-menu.opened').length === 1) {
				$('.js_user-menu').parent().removeClass('highlighted');
				$('.js_user-menu-container').css('max-height', 0);
			} else {
				$('.js_user-menu').parent().addClass('highlighted');
				$('.js_user-menu-container').css('max-height', '600px');
			}
			$('.js_user-menu').toggleClass('opened');
		});

		$('.js_bottom-user-menu').click(function () {
			displayTopNavMenuAndResetFlag();
			scrollToTheTop();
			$('.js_user-menu').click();
		});

		if ($(window).width() > 640) {
			alert('This demo is optimized for mobile experience. Try to open it in mobile or resize the browser window');
		}
	})();

})( jQuery, window, document );
