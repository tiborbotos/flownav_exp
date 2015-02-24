( function( $, window, document, undefined )
{
	'use strict';

	var topNavSelector		= '.flownav-top',
		bottomNavSelector 	= '.flownav-bottom',
		$topNav				= $( topNavSelector),
		$topNavMenu 		= $( topNavSelector + ' .flownav-menu'),
		$bottomNav  		= $( bottomNavSelector),

		// flags
		nextArticleInTopNavVisible		= false, // is the next article component is visible in the top navigation header
		topNavScrolledAwayOnce			= false, // has the page scrolled away from the top navigation at least once
		menuContentVisible				= false,
		nextArticleAnimationEnabled		= true,

		// variables
		topNavTop		= 0,
		bottomNavBottom	= 0,
		$document		= $( document ),
		$window			= $( window ),
		wScrollCurrent	= 0,
		wScrollBefore	= 0,
		wScrollDiff		= 0,
		articleTop 		= $('.content').offset().top,
		articleBottom	= $('.content').outerHeight() + $('.content').offset().top,
		articlePosition33 = Math.round(articleBottom * 0.20),

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
		else if( wScrollDiff > 0 && !menuContentVisible) { // scrolled up; top nav slides in

			if (wScrollDiff < 5 && topNavTop <= -topNavHeight + 1) { // slow scroll
				if (wScrollCurrent < articleTop || wScrollCurrent > (articleBottom - wHeight)) { // we don't want to interrupt the user with the top nav (he's reading)
					showTopNavByScrolling();
				}
			} else if (wScrollDiff < 10) { // medium scroll, top nav shows up by scrolling, bottom nav stays visible
				showTopNavByScrolling();
			} else { // fast scroll, top nav shows up fast, bottom nav disappears
				showTopNavByScrolling();
				hideBottomNav();
			}

			if (wScrollCurrent < topNavHeight) { // open top nav menu if we are close to the top
				displayTopNavMenuAndResetFlag();
			}
		}
		else if( wScrollDiff < 0  && !menuContentVisible) { // scrolled down

			if( wScrollCurrent + wHeight >= dHeight - topNavHeight ) { // scrolled to the very bottom; top nav slides in
				showNextArticleInTopNav();
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

			if (wScrollCurrent > articlePosition33) { // highlight trending icon if we reach the bottom of the page
				highlightTrendingIcon();
			}

			//wScrollDiff < 0 && $bottomNav.is('.hidden')  &&
			if (wScrollCurrent > topNavHeight && !menuContentVisible) { // bottom nav appears if top nav is not visible
				showBottomNav();
			}
		}


		wScrollBefore = wScrollCurrent;
	});





	function showTopNavByScrolling() {
		$topNav.css( 'top', topNavTop > 0 ? 0 : topNavTop );
	}

	function showTopNavBySlideIn() {
		topNavTop = wScrollCurrent + wHeight - dHeight;
		$topNav.css('top', topNavTop < 0 ? topNavTop : 0);
	}

	function hideTopNavBySlideOut() {
		$topNav.css( 'top', Math.abs( topNavTop ) > topNavHeight ? -topNavHeight : topNavTop );
	}

	function showNextArticleInTopNav() {
		if (!nextArticleInTopNavVisible) {
			hideTopNavMenu();
			$('.next-article-background').addClass('visible');
			$('.icon-hamburger').addClass('hidden');
			$('.flownav-next-article').addClass('visible');
			$('.flownav-header .logo').addClass('next-article-displayed');
			if (nextArticleAnimationEnabled) {
				$('.js_next-article > .icon').addClass('anima');
			}
			nextArticleInTopNavVisible = true;
		}
	}

	function hideNextArticleInTopNav() {
		if (nextArticleInTopNavVisible) {
			$('.next-article-background').removeClass('visible');
			$('.icon-hamburger').removeClass('hidden');
			$('.flownav-next-article').removeClass('visible');
			$('.flownav-header .logo').removeClass('next-article-displayed');
			if (nextArticleAnimationEnabled) {
				$('.js_next-article > .icon').removeClass('anima');
			}
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
		var $trending = $('.js_trending span');
		if (!$trending.is('active')) {
			$('.menu-square').removeClass('active');
			$trending.addClass('active');
		}
	}

	function showTopNavMenu() {
		$topNavMenu.removeClass('hidden');
	}

	function displayTopNavMenuAndResetFlag() {
		showTopNavMenu();
		topNavScrolledAwayOnce = false;
	}

	function hideTopNavMenu() {
		$topNavMenu.addClass('hidden');
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
				$search.removeClass('highlighted');
				$('.js_search-container').css('max-height', 0);
				menuContentVisible = false;
			} else {
				$search.addClass('highlighted');
				$('.js_search-container').css('max-height', '200px');
				menuContentVisible = true;
			}
			$search.toggleClass('opened');
		});

		$('.js_user-menu').click(function () {
			var $userMenu = $('.js_user-menu');
			if ($('.js_user-menu.opened').length === 1) {
				$userMenu.removeClass('highlighted');
				$('.js_user-menu-container').css('max-height', 0);
				menuContentVisible = false;
			} else {
				$userMenu.addClass('highlighted');
				$('.js_user-menu-container').css('max-height', '600px');
				menuContentVisible = true;
			}
			$userMenu.toggleClass('opened');
		});

		$('.js_write-post').click(function () {
			var $writePostMenu = $('.js_write-post');
			if ($('.js_write-post.opened').length === 1) {
				$writePostMenu.removeClass('highlighted');
				$('.js_write-post-container').css('max-height', 0);
				menuContentVisible = false;
			} else {
				$writePostMenu.addClass('highlighted');
				$('.js_write-post-container').css('max-height', '1000px');
				menuContentVisible = true;
			}
			$writePostMenu.toggleClass('opened');
		});

		$('.js_bottom-user-menu').click(function () {
			displayTopNavMenuAndResetFlag();
			scrollToTheTop();
			$('.js_user-menu').click();
		});

		$('.js_next-article').click(function () {
			document.getElementById('click').play();

			window.setTimeout(function () {
				if (window.location.pathname === '/article1.html') {
					window.location.href = 'article2.html';
				} else if (window.location.pathname === '/article2.html') {
					window.location.href = 'article1.html';
				}
			}, 300);
		});

		// ANIMATIONS
		function onOff(evt, clazz) {
			var $el = $(clazz);
			if ($el.is('.transition-enabled')) {
				$el.removeClass('transition-enabled');
				evt.currentTarget.textContent = evt.currentTarget.textContent.replace('on', 'off');
			} else {
				$el.addClass('transition-enabled');
				evt.currentTarget.textContent = evt.currentTarget.textContent.replace('off', 'on');
			}
		}

		$('.js_anim_bottom').click(function (e) {
			onOff(e, '.flownav-bottom');
		});
		$('.js_anim_hamburger').click(function (e) {
			onOff(e, '.icon-hamburger');
		});
		$('.js_anim_nextart').click(function (e) {
			onOff(e, '.flownav-next-article');
		});
		$('.js_anim_nextartbg').click(function (e) {
			onOff(e, '.next-article-background');
		});
		$('.js_anim_menu').click(function (e) {
			onOff(e, '.flownav-menu');
		});
		$('.js_anim_logo').click(function (e) {
			onOff(e, '.logo');
		});
		$('.js_nextarticle_anima').click(function (e) {
			onOff(e, '.__________________');
			nextArticleAnimationEnabled = !nextArticleAnimationEnabled;
		});

		// EOF ANIMATIONS



		if ($(window).width() > 640) {
			alert('This demo is optimized for mobile experience. Try to open it in mobile or resize the browser window');
		}
	})();

})( jQuery, window, document );
