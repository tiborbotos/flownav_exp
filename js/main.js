

/*
 By Osvaldas Valutis, www.osvaldas.info
 Available for use under the MIT License
 */

 // JQUERY VERSION:

( function( $, window, document, undefined )
{
	'use strict';

	var topNavSelector	= '.flownav-top',
		bottomNavSelector = '',
		$topNav		= $( topNavSelector),
		$bottomNav  = $( topNavSelector);

	if( !$topNav.length ) return true;

	var elHeight		= 0,
		elTop			= 0,
		$document		= $( document ),
		dHeight			= 0,
		$window			= $( window ),
		wHeight			= 0,
		wScrollCurrent	= 0,
		wScrollBefore	= 0,
		wScrollDiff		= 0;

	$window.on( 'scroll', function()
	{
		elHeight		= $topNav.outerHeight();
		dHeight			= $document.height();
		wHeight			= $window.height();
		wScrollCurrent	= $window.scrollTop();
		wScrollDiff		= wScrollBefore - wScrollCurrent;
		elTop			= parseInt( $topNav.css( 'top' ) ) + wScrollDiff;

		if( wScrollCurrent <= 0 ) {// scrolled to the very top; element sticks to the top
			$topNav.css( 'top', 0 );
		}
		else if( wScrollDiff > 0 ) { // scrolled up; element slides in
			$topNav.css( 'top', elTop > 0 ? 0 : elTop );
		}
		else if( wScrollDiff < 0 ) {// scrolled down

			if( wScrollCurrent + wHeight >= dHeight - elHeight )  // scrolled to the very bottom; element slides in
				$topNav.css( 'top', ( elTop = wScrollCurrent + wHeight - dHeight ) < 0 ? elTop : 0 );

			else // scrolled down; element slides out
				$topNav.css( 'top', Math.abs( elTop ) > elHeight ? -elHeight : elTop );
		}

		wScrollBefore = wScrollCurrent;
	});

})( jQuery, window, document );

