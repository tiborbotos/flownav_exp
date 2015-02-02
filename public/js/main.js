

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
	var hamburgerMenuHiddenPos 	= '55px',
		hamburgerMenuVisiblePos	= '15px',
		nextArticleVisiblePos	= '15px',
		nextArticleHiddenPos	= '-30px',


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
		topNavHeight		= $topNav.outerHeight() + 4; // +4 because of the shadow's blur

	$window.on( 'scroll', function()
	{
		wScrollCurrent		= $window.scrollTop();
		wScrollDiff			= wScrollBefore - wScrollCurrent;
		topNavTop			= parseInt( $topNav.css( 'top' ) ) + wScrollDiff;
		bottomNavBottom		= parseInt($bottomNav.css('bottom'));

		if( wScrollCurrent <= 50 ) {// scrolled to the very top; top nav sticks to the top
			$topNav.css( 'top', 0 );
			hideBottomNav();

			if (topNavScrolledAwayOnce) { // open top nav menu if we reached to top
				displayTopNavMenuAndResetFlag();
			}
			hideNextArticleInTopNav();
		}
		else if( wScrollDiff > 0 ) { // scrolled up; top nav slides in

			if (wScrollDiff < 5 && topNavTop <= -topNavHeight + 1) { // slow scroll
				if (wScrollCurrent < articleTop || wScrollCurrent > (articleBottom - wHeight)) { // we don't want to interrupt the user with the top nav (he's reading)
					showTopNavByScrolling();
				}
			} else if (wScrollDiff < 10) { // medium scroll, top nav shows up by scrolling, bottom nav stays visible
				showTopNavByScrolling();
			} else { // fast scroll, top nav shows up fast, bottom nav disappers
				showTopNavByScrolling();
				hideBottomNav();
			}

			if (wScrollCurrent < topNavHeight) { // open top nav menu if we are close to the top
				displayTopNavMenuAndResetFlag();
			}
		}
		else if( wScrollDiff < 0 ) { // scrolled down

			if( wScrollCurrent + wHeight >= dHeight - topNavHeight ) { // scrolled to the very bottom; top nav slides in
				displayTopNavMenu();
				hideNextArticleInTopNav();
				showTopNavBySlideIn();
				showBottomNav();
			}
			else { // scrolled down; element slides out
				hideTopNavBySlideOut();

				if (parseInt($topNav.css('top')) <= -topNavHeight && !topNavScrolledAwayOnce) { // set the flag and hide the top nav menu
					hideTopNavMenuAndSetFlag();
				}

				if (wScrollCurrent > topNavHeight) { // if we are over the top nav height, let's show the next article
					showNextArticleInTopNav();
				}
			}

			if (wScrollCurrent > articlePosition33 && $('.js_trending span').is('active')) { // highlight trending icon if we reach the bottom of the page
				highlightTrendingIcon();
			}
		}

		if (wScrollCurrent > topNavHeight && wScrollDiff < 0 && $bottomNav.is('hidden')) { // bottom nav appears if top nav is not visible
			showBottomNav();
		}

		wScrollBefore = wScrollCurrent;
	});





	function showTopNavByScrolling() {
		$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );
	}

	function showTopNavBySlideIn() {
		$topNav.css('top', ( topNavTop = wScrollCurrent + wHeight - dHeight ) < 0 ? topNavTop : 0);
	}

	function hideTopNavBySlideOut() {
		$topNav.css( 'top', Math.abs( topNavTop ) > topNavHeight ? -topNavHeight : topNavTop );
	}

	function showNextArticleInTopNav() {
		if (!nextArticleInTopNavVisible) {
			hideTopNavMenu();
			$('.next-article-background').css('opacity', '1');
			$('.icon-hamburger').css('top',  hamburgerMenuHiddenPos);
			$('.flownav-next-article').css('top', nextArticleVisiblePos);
			$('.flownav-header .logo').addClass('next-article-displayed');
			nextArticleInTopNavVisible = true;
		}
	}

	function hideNextArticleInTopNav() {
		if (nextArticleInTopNavVisible) {
			$('.next-article-background').css('opacity', '0');
			$('.icon-hamburger').css('top', hamburgerMenuVisiblePos);
			$('.flownav-next-article').css('top', nextArticleHiddenPos);
			$('.flownav-header .logo').removeClass('next-article-displayed');
			nextArticleInTopNavVisible = false;
		}
	}

	function hideBottomNav() {
		$bottomNav.addClass('hidden');
	}

	function showBottomNav() {
		$bottomNav.removeClass('hidden');
	}

	function highlightTrendingIcon() {
		$('.menu-square').removeClass('active');
		$('.js_trending span').addClass('active');
	}

	function displayTopNavMenu() {
		$topNavMenu.css('max-height', '60px');
		$topNavMenu.css('border', '');
	}

	function displayTopNavMenuAndResetFlag() {
		displayTopNavMenu();
		topNavScrolledAwayOnce = false;
	}

	function hideTopNavMenu() {
		$topNavMenu.css('max-height', '0');
		$topNavMenu.css('border', 'none');
	}

	function hideTopNavMenuAndSetFlag() {
		topNavScrolledAwayOnce = true;
		hideTopNavMenu();
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
			$('.js_recommend span').toggleClass('active');
		});

		$('.js_search').click(function () {
			var $search = $('.js_search');
			if ($('.js_search.opened').length === 1) {
				$search.parent().removeClass('highlighted');
				$('.js_search-container').css('max-height', 0);
			} else {
				$search.parent().addClass('highlighted');
				$('.js_search-container').css('max-height', '200px');
			}
			$search.toggleClass('opened');
		});

		$('.js_user-menu').click(function () {
			var $userMenu = $('.js_user-menu');
			if ($('.js_user-menu.opened').length === 1) {
				$userMenu.parent().removeClass('highlighted');
				$('.js_user-menu-container').css('max-height', 0);
			} else {
				$userMenu.parent().addClass('highlighted');
				$('.js_user-menu-container').css('max-height', '600px');
			}
			$userMenu.toggleClass('opened');
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
