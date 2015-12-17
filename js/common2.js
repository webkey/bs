
$(document).ready(function() {

	jQuery.fn.exists = function() {
		return $(this).length;
	};

	if ($('.tabs').exists()){
		$('.tabs').tabs();
	}

	var $header = $('.l-header');
	var $h_menu = $('.h-menu-container');


	if ($(window).width() > 480) {
		$(window).scroll(function () {
			if ($(window).scrollTop() >= $header.height() - 10) {
				$h_menu.addClass('fixed');

				$h_menu.css('left', - $(window).scrollLeft());

			} else {
				$h_menu.removeClass('fixed');
			}
		});
		$(window).scroll();
	}

	CSSGlobalOrder.process();

	$(window).on( 'debouncedresize' , function() {
		CSSGlobalOrder.process();
		$('.h-sidemenu').removeClass('close');
		$('.mobile-header').removeClass('show');
		$('body').removeClass('aside-is-visible');

		if ($('.search').is(':visible')) {
			$('.search-close').click();
		}

		inside__menuSet();

	});

	imagesLoaded( $('.promo') , function(){
		//$('.promo').addClass('show');
	});


	$('.user-username').on('click', function(e){
		e.stopPropagation();
	});

	$('.promo__slider').slick({
		autoplay: false,
		dots: false,
		infinite: true,
		arrows: true,
		speed: 450,
		touchThreshold: 50,
		slidesToShow: 5,
		slidesToScroll: 5,
		responsive: [
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4
				}
			},
			{
				breakpoint: 1280,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3
				}
			}
		]
	});

	var aside__slider = $('.aside__slider')

	$('.aside__slider').slick({
		autoplay: false,
		dots: true,
		infinite: true,
		arrows: false,
		touchThreshold: 50,
		speed: 150,
		slidesToShow: 1,
		slidesToScroll: 1
	});

	$('.s-slider').slick({
		//variableWidth: true,
		slidesToShow: 7,
		slideToScroll: 1,
		dots: false,
		infinite: false,
		touchThreshold: 50,
		speed: 150,
		customPaging: true,
		responsive: [
			{
				breakpoint: 1430,
				settings: {
					slidesToShow: 6
				}
			},
			{
				breakpoint: 1250,
				settings: {
					slidesToShow: 5
				}
			},
			{
				breakpoint: 1070,
				settings: {
					slidesToShow: 4
				}
			}
		]
	});


	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('.h-search').removeClass('show');
		}
	});

	/*hover menu*/

	var menu = $('.h-menu','.l-header');

	if (menu.length) {
		var md = new MobileDetect(window.navigator.userAgent);
		if(md.mobile()){
			menu.children('li').children('a').on('click', function(event) {
				event.stopPropagation();
				var $cur = $(this);
				var url = $cur.attr('href');
				if ($cur.parent().hasClass('hover')) {
					window.location = url;
				}
				menu.children('li').removeClass('hover');
				$cur.parent().addClass('hover');
				event.preventDefault();
			});
			menu.on('click', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function (e) {
				menu.children('li').removeClass('hover');
				$('.submenu-formed').removeClass('submenu-formed');
			});
		} else {
			menu.children('li').children('a').on('mouseenter', function () {
				menu.children('li').removeClass('hover');
				$(this).parent().addClass('hover');
			}
			).on('mouseleave', function () {
				$(this).removeClass('hover');
			}
			)
		}
	}
	/*hover menu end*/

	/*open drop menu*/
	function dropMenu (dropMinHeight, bottomSpace, maxColumnsLenght){
		var $submenuAll = $('.submenu','.l-header');
		if(!$submenuAll.length){return;}
		var subSubmenuWidth = function () {
			$submenuAll.children('ul').css('width',Math.round($('.h-menu','.l-header').outerWidth() * 0.20));
		};
		subSubmenuWidth();

		$('.h-menu','.l-header').children('li').on('mouseenter', function () {

			var $currentItem = $(this);
			if(!$currentItem.has('.submenu').length){return;}
			if($currentItem.hasClass('submenu-formed')){return;}
			$currentItem.addClass('submenu-formed');

			var $submenuContainer = $currentItem.find('.submenu-container');
			var $submenu = $currentItem.find('.submenu');

			var windowHeight = $(window).height();
			var bodyTop = $('body').scrollTop();
			var submenuContainerTop = $submenuContainer.offset().top;
			var _dropMaxHeight = windowHeight - submenuContainerTop + bodyTop - bottomSpace;
			if(_dropMaxHeight<dropMinHeight){
				_dropMaxHeight = dropMinHeight;
			}

			/*test boxes*/
			//var $testBlock = $('<div class="testBlock" />');
			//$('.testBlock').remove();
			//$($testBlock).prependTo('body').css({
			//	'position': 'fixed',
			//	'top': submenuContainerTop - bodyTop,
			//	'right': 0,
			//	'width': 50,
			//	'height': _dropMaxHeight,
			//	'background': 'red',
			//	'opacity': 0.5,
			//	'z-index': 999
			//}).text($testBlock.css('height'));
			//$(window).resize(function () {
			//	$('.testBlock').remove();
			//});
			/*test boxes end*/

			var $elementSubmenu = $currentItem.find('.submenu').children('ul');
			console.log('_dropMaxHeight1 ', _dropMaxHeight);
			var _heightCurrentElement,
				_sumHeightElementsSubmenu = 0,
				i = 0,
				_maxColumnHeight = 0,
				_dropMaxHeightNew = _dropMaxHeight;
			var _flagBiggestHeight = false;
			for(i;i<$elementSubmenu.length;i++){
				_heightCurrentElement = $elementSubmenu.eq(i).height();
				if(_heightCurrentElement > _dropMaxHeight){
					_flagBiggestHeight = true;
					if ( _heightCurrentElement > _maxColumnHeight ){
						_maxColumnHeight = _heightCurrentElement;
					}
					_dropMaxHeightNew = _maxColumnHeight;
				}
				_sumHeightElementsSubmenu += _heightCurrentElement;
			}

			var _mainMenuWidth = $currentItem.closest('.h-menu').outerWidth();
			var columnsLength = 1;
			if(_sumHeightElementsSubmenu>_dropMaxHeight){
				columnsLength = Math.ceil(_sumHeightElementsSubmenu/_dropMaxHeightNew);
				if(columnsLength>maxColumnsLenght){
					columnsLength = maxColumnsLenght;
				}
			}

			var _submenuContainerWidth = Math.round(_mainMenuWidth*0.2) * columnsLength;
			if(columnsLength<maxColumnsLenght && _mainMenuWidth < 1200){
				$elementSubmenu.css('width',Math.round(_mainMenuWidth*0.24));
				_submenuContainerWidth = Math.round(_mainMenuWidth*0.24) * columnsLength;
			}
			$submenuContainer.css('width',_submenuContainerWidth);

			/*remove style from submenu and submenu-container end*/
			$submenuContainer.css({
				'width':_submenuContainerWidth,
				'height':'auto',
				'padding-bottom':20,
				'overflow':'visible'
			});
			$submenu.css('height','auto');
			/*remove style from submenu and submenu-container*/

			/*isotope initial*/
			var submenuSet = function(){
				$submenu.isotope({
					itemSelector: '.submenu > ul',
					transitionDuration: 0
				});
			};
			submenuSet();
			/*isotope initial end*/

			var _submenuHeight = $submenu.outerHeight();
			if(_submenuHeight > (_dropMaxHeight+bottomSpace)){
				$submenuContainer.css({
					'width':_submenuContainerWidth + 20,
					'height':_dropMaxHeight<dropMinHeight ? _dropMaxHeight : _dropMaxHeight+bottomSpace,
					'padding-bottom':0,
					'overflow':'auto'
				});
			}

			/*drop menu position*/
			var _itemLeftCord = $currentItem.position().left;
			$currentItem.css('position','relative');
			$submenuContainer.css({
				'right':'auto',
				'left': '0'
			});

			if (_submenuContainerWidth > _mainMenuWidth - _itemLeftCord) {
				//$currentItem.css('position','static');
				$submenuContainer.css({
					'left':'auto',
					'right':'0'
				});
			}
			/*drop menu position end*/
		});

		$(window).resize(function () {
			subSubmenuWidth();
			$('.submenu-formed').removeClass('submenu-formed');
			$('.submenu-container').attr('style','');
		});
		$(window).scroll(function () {
			$('.submenu-formed').removeClass('submenu-formed');
		});
	}
	dropMenu(100, 100, 5);
	/*open drop menu end*/

	$('.h-sidemenu').on('click', function(event) {
		event.preventDefault();
		$('body').toggleClass('aside-is-visible');
		$(this).blur();
		$('.h-sidemenu').toggleClass('close');
		$('.mobile-header').toggleClass('show');
	});


	$('.h-menu > li > a').on('click', function(event) {
		//event.preventDefault();
	});


	if ($('.search').length) {
		var search = $('.search');
		var close  = $('.search-close');
		var toggle = $('.search-show');

		toggle.on('click', function(event) {
			event.preventDefault();
			toggle.hide();
			search.show();
		});

		close.on('click', function(event) {
			event.preventDefault();
			search.hide();
			toggle.show();

			$('.search > div > input').val('');
		});
	}


	$('input, textarea').placeholder();

	$('.graph').addClass('show');

	if ($('.catalogue').length) {
		var catalogueSet = function(){
			$('.catalogue').isotope({
				itemSelector: '.catalogue > ul',
				transitionDuration: 0
			});
		}
		catalogueSet();
	}


	var inside__menuSet = function(){
		if ($('.inside__menu').length) {
			$('.inside__menu').isotope({
				itemSelector: '.inside__menu > li',
				transitionDuration: 0
			});
		}
	}
	
	inside__menuSet();

	

	if ($('#b-map').length) {
		var b_map_current = 0;
		var related;

		var b_num;

		$('#b-map-img area')
		.on('mouseenter', function() {
			var num = $(this).index() + 1;

			b_map_current = "b-map" + num + "-hover";
			$('#b-map-in').addClass(b_map_current);

			related = $('#b-related' + num);
			related.addClass('hover');
		})

		.on('mouseleave', function() {
			$('#b-map-in').removeClass(b_map_current);
			related.removeClass('hover');
		});

		$('#b-map .b-map__star')
		.on('mouseenter', function(){
			$('#b-related7').addClass("hover");
		})
		.on('mouseleave', function(){
			$('#b-related7').removeClass("hover");
		});


		$('#b-related li')
		.on('mouseenter', function() {
			if ($(this).attr('id') !== undefined) {
				b_num = $(this).attr('id').slice(-1);
				$('#b-map-in').addClass("b-map" + b_num + "-hover");

				if (b_num == 7) {
					$('.b-map__star').addClass('hover');
				}
			}
		})

		.on('mouseleave', function() {
			$('#b-map-in').removeClass("b-map" + b_num + "-hover");
			$('.b-map__star').removeClass('hover');
		});

	}


	// var previousEvent = false;
	// $(document).mousemove(function(evt) {
	// 	evt.time = Date.now();
	// 	var res;
	// 	var h_menu = $('.h-menu');
	// 	res = makeVelocityCalculator( evt, previousEvent);
	// 	previousEvent = evt;
	// 	console.log("velocity:"+res);
	// });

	// function makeVelocityCalculator(e_init, e) {
	// 	var x = e_init.clientX, new_x,new_y,new_t,
	// 		x_dist, y_dist, interval,velocity,
	// 		y = e_init.clientY,
	// 		t;
	// 	if (e === false) {return 0;}
	// 	t = e.time;
	// 	new_x = e.clientX;
	// 	new_y = e.clientY;
	// 	new_t = Date.now();
	// 	x_dist = new_x - x;
	// 	y_dist = new_y - y;
	// 	interval = new_t - t;
	// 	// update values:
	// 	x = new_x;
	// 	y = new_y;
	// 	velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/interval;
	// 	return velocity;
	// }

});

// ios orientationchangefix
!function(t){function e(){m.setAttribute("content",l),f=!0}function n(){m.setAttribute("content",v),f=!1}function i(i){s=i.accelerationIncludingGravity,r=Math.abs(s.x),c=Math.abs(s.y),u=Math.abs(s.z),t.orientation&&180!==t.orientation||!(r>7||(u>6&&8>c||8>u&&c>6)&&r>5)?f||e():f&&n()}var a=navigator.userAgent;if(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(a)&&a.indexOf("AppleWebKit")>-1){var o=t.document;if(o.querySelector){var r,c,u,s,m=o.querySelector("meta[name=viewport]"),d=m&&m.getAttribute("content"),v=d+",maximum-scale=1",l=d+",maximum-scale=10",f=!0;m&&(t.addEventListener("orientationchange",e,!1),t.addEventListener("devicemotion",i,!1))}}}(this);