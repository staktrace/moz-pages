var CoreJS;

(function($) {
	"use strict";

	CoreJS = {

		initialized: false,

		initialize: function() {

			if (this.initialized) return;
			this.initialized = true;

			this.build();

			this.events(); },

		build: function() {

			this.lightbox();

			this.retina(); },

		events: function() {

			$(function(){
				// Check for ThumbnailGird Element and Run Function
				if( $('.og-grid-link').get(0) )	CoreJS.thumbnailGrid();

				// Menu
				$(".met_primary_nav").superfish({
					delay: 700,
					speed: 'fast',
					speedOut: 'fast',
					animation:{opacity:'show'}
				});

				// Tags Toggler
				var $tags = $('.met_tags_trigger');
				if( $tags.get(0) ){
					$tags.on('click', function(){
						var $this = $(this),
							$next = $this.nextAll('.met_blog_block_tag_list');
						if( $this.is(':contains("+")') ){
							$next.stop().slideDown();
							$this.html($this.html().replace(' \+',' -'));
						}else{
							$next.stop().slideUp();
							$this.html($this.html().replace(' \-',' +'));
						}
						return false;
					});
				}

				// Calculate Fullwidthes
				CoreJS.fullWidthCalc();
				$(window).on('debouncedresize', CoreJS.fullWidthCalc);

				// If Any Animation Element Exists Then Run Which Has to be Run
				if( $('.met_run_animations').get(0) && !$('.dslca-enabled').get(0) && !$('#met_page_pl_overlay').get(0) ){
					$(window).load(function(){
						CoreJS.wowAnimate('met_run_animations');
					});
				}


				// MC Mega Menu - Sidebar Width Fix
				$('.mmm-sidebar').each(function(){
					$(this).parent('.mmm-column-0').css('width', $(this).css('width'));
				});

				// Align Sub Menus
				$('.met_header_menu').imagesLoaded(CoreJS.subMenuAlign);

				// Tabbed Mega Posts Menu
				if($('.met_megamenu_tabbed_posts_wrapper').get(0)){

					$('.met_megamenu_tabbed_post_cats + .met_megamenu_tabbed_posts').addClass('on');
					var timeout;

					$('.met_megamenu_tabbed_post_cats li').live('hover', function(){
						clearTimeout(timeout);
						var $this = $(this);

						timeout = setTimeout(setNew,150);

						function setNew(){
							var theParent = $this.parents('li.clearfix'),
								hovered = theParent.find('.met_megamenu_tabbed_posts[data-cat="'+$this.data('cat')+'"]');
							if(!hovered.hasClass('on')){
								theParent.find('.on').removeClass('on');
								hovered.addClass('on');
							}
						}
					});
				}

				// WordPress Comment Form Styling Hacks -muratkaracam
				$('#commentform input[type="submit"]').addClass('btn btn-xs btn-primary');
				$('.met_content_box .comment-respond #reply-title').css('display','none');
				$('.comment-reply-link').click(function(){
					$('.met_comment_box .comment-respond #reply-title').css('display','block');
				});

				$('#cancel-comment-reply-link').live('click',function(){
					$('.met_content_box .comment-respond #reply-title').css('display','none');
				});

				CoreJS.parallaxInit();
			});

			// Check If Any Navigation Item Has Hashtag Link and Apply One Page Navigation
			$(window).load(function(){
				if( $('.met_header_wrap [href^="#"]').filter(function(){return $(this).attr('href').length > 1}).get(0) ){
					$('.met_primary_nav, #met_mobile_menu').onePageNav({
						currentClass: 'current-menu-item',
						changeHash: false,
						scrollSpeed: 750,
						scrollThreshold: 0.1,
						filter: '',
						easing: 'swing',
						offsetElements: '.met_sticky_header,#wpadminbar'
					});
				}
				setTimeout(function(){
					if(!$('#LTEIE9').get(0))CoreJS.fitColumnHeight();
				}, 500)
			});

		},

		parallaxInit: function(){

			var uA = window.navigator.userAgent,
				safari = /Safari/i.test(uA),
				chrome = /Chrome/i.test(uA);
			//Parallax replace for front-end ( dslc -> met )
			if( !$('body').hasClass('dslca-enabled') && !$('#LTEIE9').get(0) && ( (safari && chrome) || (!safari && chrome) || (!safari && !chrome) ) ){

				// Check if there are any background parallaxes and build a transform parallax
				var $bg_parallaxes = $('.dslc-init-parallax').filter(
					function(){
						var bgimg = $(this).css('background-image');
						return bgimg != 'none' && bgimg.replace(/^url|'|"|[\(\)]/g, '') != ''
					}
				);
				if( $bg_parallaxes.get(0) ){
					$bg_parallaxes.attr({
						'data-met-parallax': 'true',
						'data-parallax-isbg': 'true'
					}).addClass('met_parallax_line').removeClass('dslc-init-parallax');

					if( window['dslc_parallax'] != undefined ){
						window['dslc_parallax'] = function(){return}
					}

					$bg_parallaxes.each(function(){
						var $this = $(this);

						// Overlay
						var pOverlay = $(this).find('.dslc-bg-video-overlay'),
							pOpacity = parseFloat(pOverlay.css('opacity')),
							pBgColor = pOverlay.css('background-color').replace(/^rgb|a|[\(\)]/g, '').split(', '),
							pAlpha 	 = pOpacity != 0 ? ( pBgColor.length > 3 ? parseFloat(pBgColor[3]) : 1 ) : 0,
							newAlpha = pOpacity * pAlpha,
							newColor = pBgColor[0] + ', ' + pBgColor[1] + ', ' + pBgColor[2] + ', ' + newAlpha,
							newColor = 'rgba('+ newColor +')';

						$(this).addClass('met-parallax-overlay').css('color', newColor);
					});
					$.fn.parallax();
				}
			}

			if( $(window).width() > 768 ){
				//init stellar
				$('body').stellar({
					responsive: true,
					horizontalScrolling: false,
					positionProperty: 'transform',
					scrollProperty: 'scroll',
					parallaxBackgrounds: false,
					parallaxElements: true,
					hideDistantElements: false
				});

				CoreJS.updateParallaxModules();

				//Update all parallax layer wrappers
				if( $('.met_parallax_layer_item' ).get(0) ){
					$('.met_parallax_layer_item').each(function(){
						CoreJS.updateParallaxLayers( $(this).parents('.dslc-module-front' ).attr('id') );
					});
				}

				//Re-build parallax layers on "dslc option change"
				$(document).on( 'change', '.dslca-module-edit-field', function(){
					var dslcModule = $('.dslca-module-being-edited').attr('id');

					if( $('#'+dslcModule).find('.met_parallax_layer_data').get(0) ){
						setTimeout(function(){
							CoreJS.updateParallaxLayers(dslcModule);
						}, 2000);
					}

					if( $('#'+dslcModule).find('[data-met-core-parallax-element]').get(0) ){
						setTimeout(function(){
							CoreJS.updateParallaxModules();
						}, 2000);
					}

				});

				//Re-build parallax layers on "dslc new module drop"
				jQuery( '.dslc-modules-area' ).on("drop", function( event, ui ) {
					if( $('.met_parallax_layer_item' ).get(0) ){
						setTimeout(function(){
							$('.met_parallax_layer_item').each(function(){
								CoreJS.updateParallaxLayers( $(this).parents('.dslc-module-front' ).attr('id') );
							});
						}, 2000);
					}

					setTimeout(function(){
						CoreJS.updateParallaxModules();
					}, 2000);
				});

				//Re-build parallax layers on "dslc module save"
				$(document).on( 'click', '.dslca-module-edit-save', function(){
					if( $('.met_parallax_layer_item' ).get(0) ){
						setTimeout(function(){
							$('.met_parallax_layer_item').each(function(){
								CoreJS.updateParallaxLayers( $(this).parents('.dslc-module-front' ).attr('id') );
							});
						}, 2000);
					}

					setTimeout(function(){
						CoreJS.updateParallaxModules();
					}, 2000);

				});

				//Move parallax layer to front on hover ( for lower z-indexed layers )
				$('.dslca-enabled').find('[data-stellar-element]').hover( function() {
						$( this ).attr( 'data-old-z-index', $( this ).css('z-index') );
						$( this ).css( 'z-index', '999' );
					}, function() {
						$( this ).css( 'z-index', $( this ).attr( 'data-old-z-index') );
						$( this ).removeAttr('data-old-z-index');
					}
				);

				setTimeout(function(){
					CoreJS.updateParallaxModules();
				}, 2000);
			}
		},

		updateParallaxLayers: function(layer_item){
			var destination = $('#'+layer_item);

			if( destination.find('.met_parallax_layer_data' ).get(0) ){
				//console.log(layer_item);

				var source = destination.find('.met_parallax_layer_data')[0];

				for ( var i = 0; i < source.attributes.length; i++ ){
					var a = source.attributes[i];
					if( a.name != 'class'){
						var data_name = a.name.replace('metparallax','stellar');
						destination.attr(data_name, a.value);
					}
				}

				destination.attr('data-dslc-module-size','1');
				var $parallaxImg = destination.find('img');
				var $img;
				$img = $('<img>').attr('src', $parallaxImg.attr('src')).on('load', function () {
					$img.remove();
					$img = null;
					destination.css('width', destination.find('img').outerWidth() );
				});

				destination.removeAttr( 'data-dslc-anim data-dslc-anim-delay data-dslc-anim-easing data-dslc-anim-easing' );
				destination.removeClass( 'dslc-first-col dslc-last-col dslc-in-viewport-check dslc-in-viewport-anim-none dslc-in-viewport' );

				if( $('body').hasClass('dslca-enabled') ){
					destination.parents( '.dslc-modules-area' ).find( '.dslca-no-content' ).css( {'display': 'block'} ).find( '.dslca-no-content-primary' ).css( {
						'color'     : '#fff',
						'background': '#000',
						'font-size' : '25px'
					} ).find( '.dslc-icon-download-alt' ).removeAttr( 'class' ).addClass( 'fa fa-crosshairs' ).next( '.dslca-no-content-help-text' ).html( ' Drop new layers here!' );
				}

				//console.log('update parallax layers');
				CoreJS.updateStellar();
			}
		},

		updateParallaxModules: function(){

			if( $('body').hasClass('dslca-enabled' ) ){

				$( '.dslc-modules-area' ).each(function(){
					var $dslc_modules_area = $(this);

					if( $dslc_modules_area.find('[data-met-core-parallax-element]').get(0) ){
						$dslc_modules_area.find( '.dslca-no-content' ).css( {'display': 'block'} ).find( '.dslca-no-content-primary' ).css( {
							'color'     : '#fff',
							'background': '#000',
							'font-size' : '25px'
						} ).find( '.dslc-icon-download-alt' ).removeAttr( 'class' ).addClass( 'fa fa-crosshairs' ).next( '.dslca-no-content-help-text' ).html( ' Drop new layers here!' );
					}

					CoreJS.updateStellar();
				});

			}

			var $parallaxContainer = $( '.dslc-modules-area').filter(function(){ return $(this).find('[data-stellar-element]').get(0) });
			$parallaxContainer.each(function(){

				var $_parallaxContainer = $(this),
					$parallaxImg = $_parallaxContainer.find('img'),
					$count = $parallaxImg.length,
					$highestImgHeight = 0,
					$currentImgHeight = 0;

				if( $parallaxImg.get(0) ){
					$_parallaxContainer.imagesLoaded(function(){
						$parallaxImg.each(function(index,el){

							$currentImgHeight = $(this).height();

							if( $highestImgHeight == 0 )
								$highestImgHeight = $currentImgHeight;
							else if( $currentImgHeight > $highestImgHeight )
								$highestImgHeight = $currentImgHeight;

							if (index == $count - 1 && $highestImgHeight) {
								$_parallaxContainer.css('height', $highestImgHeight);
								CoreJS.updateStellar();
							}
						});
					});
				}else{
					$_parallaxContainer.css('min-height', $('[data-stellar-element]', this).outerHeight());
					CoreJS.updateStellar();
				}
			});

			if( $('[data-met-core-parallax-element]').get(0) ){
				//console.log('update parallax modules [checked]');

				$('[data-met-core-parallax-element]').each(function(){
					var $core_el = $(this);
					var $parent_el = $core_el.parents('.dslc-module-front');

					var s_ratio = $core_el.attr('data-stellar-ratio');
					var s_voffset = $core_el.attr('data-stellar-vertical-offset');

					$core_el.removeAttr('data-stellar-element').removeAttr('data-stellar-ratio data-stellar-vertical-offset');

					$parent_el.attr('data-stellar-element','' )
						.attr('data-stellar-ratio', s_ratio )
						.attr('data-stellar-vertical-offset',s_voffset )

						.css('left', $core_el.attr('data-pos-x')+'%' )
						.css('top', $core_el.attr('data-pos-y')+'%' )
						.css('z-index', $core_el.attr('data-pos-z') );

					CoreJS.updateStellar();
				});
			}

			//console.log('update parallax modules');
			CoreJS.updateStellar();
		},

		updateStellar: function(){
			$('body').stellar('refresh');
			//console.log('refresh stellar');
		},

		thumbnailGrid: function(){

			var $allowAnimation = 350,
				$adminbar 		= $('#wpadminbar'),
				$stickyHeader 	= $('.met_sticky_header'),
				$offsetMinus 	= 0;

			if( $adminbar.get(0) ) 		$offsetMinus -= $adminbar.height();
			if( $stickyHeader.get(0) ) 	$offsetMinus -= $stickyHeader.height();

			function setHeight($container){
				var $windowWidth = $(window).width(),
					$maxWidth 	 = 1905,
					$maxHeight 	 = 500,
					$newHeight 	 = ($windowWidth * $maxHeight) / $maxWidth,
					$imageLi 	 = $container.parents('li'),
					$imageHeight = $container.parents('li').find('.met_hover_effect_preview_caption a').height(),
					$addition 	 = 0;

				$addition += parseInt($container.find('.og-expander-inner').css('padding-top')),
					$addition += parseInt($container.find('.og-expander-inner').css('padding-bottom')),
					$addition += $container.find('.og-details > h3').outerHeight(true),
					$addition += $container.find('.og-details > p').outerHeight(true),
					$addition += $container.find('.og-details > a').outerHeight(true);

				if( $newHeight < $addition ) $newHeight = $addition;

				$imageLi.animate({
					height: ($newHeight + $imageHeight + 10)+'px'
				}, $allowAnimation, 'easeInOutExpo' );
				$container.css('height', $newHeight );
			}

			function createLoadImg($src, $imgContainer){
				$( '<img/>' ).load(function(){
					var $img 	  = $( this ),
						$largeImg = $img.fadeIn( 350 );

					$imgContainer.children('.og-loading').hide();
					$imgContainer.append( $largeImg );
				}).attr( 'src', $src );
			}

			function builder($into, $data){
				// Create/Append the Container Area

				var $imgBox = '';
				if( $data.largeSRC != '' ) $imgBox = '<div class="og-fullimg"><div class="og-loading" style="display: block;"></div></div>';


				$into.append('<div class="og-expander" style="transition: height '+$allowAnimation+'ms ease; -webkit-transition: height '+$allowAnimation+'ms ease; height: 0;"><div class="og-expander-inner"><span class="og-close"></span>'+ $imgBox +'<div class="og-details"><h3></h3><p></p><a target="'+ $data.buttontarget +'" href="'+ $data.buttonsrc +'">'+ $data.buttontext +'</a></div></div></div>').addClass('og-expanded');

				// Set Datas into Indivisual Areas
				$into.find('.og-details > h3').text($data.title);
				$into.find('.og-details > p').text($data.description);
				//$into.find('.og-details > a').attr('href', $data.href);

				$into.find('.og-close').on('click', function(){
					$allowAnimation = 350;
					destroyer($(this).parents('li'));
					return false;
				});

				// Set the First Height for the Expanded Area
				setHeight($into.children('.og-expander'));
				$(window).on('debouncedresize', function(){setHeight($into.children('.og-expander'),true)});

				// Create Img Tag and Load the Image
				if( $data.largeSRC != '' ) createLoadImg($data.largeSRC, $into.find('.og-fullimg'));
			}

			function destroyer($into){
				$into.animate({
					height: $into.children('figure').height()+'px'
				}, $allowAnimation,'easeInOutExpo',function(){
					$into.css('height', 'auto');
				}).removeClass('og-expanded');

				$into.find('.og-expander').fadeOut($allowAnimation,function(){$(this).remove()});
			}

			$('.met_thumbnail_grid:not(.disable_expand) figure .og-grid-link').on('click touch', function(){

				if( $(window).width() < 700 ){
					return window.location.href = $(this).data('buttonsrc');
				}

				$allowAnimation = 350;
				var $this 		= $(this).parents('figure'),
					$link 		= $this.find('.met_hover_effect_preview_caption a'),
					$buildData 	= {},
					$expanded	= $('.og-expander'),
					$offsetTop 	= $this.offset().top,
					$scrollTop 	= $offsetTop + $this.find('.met_hover_effect_preview_caption a').height() * 0.7,
					$openedOffsetTop;

				if( $this.parent().find('.og-expander').get(0) ){
					destroyer($this.parent('li'));
					return;
				}else if( $expanded.get(0) ){
					$openedOffsetTop = $expanded.parent('li').offset().top;

					if( $openedOffsetTop == $offsetTop ){
						$allowAnimation = 0;
					}else{
						if( $scrollTop > $openedOffsetTop ) $scrollTop -= $expanded.height();
						$allowAnimation = 350;
					}

					destroyer($expanded.parent('li'));
				}

				$buildData.largeSRC 	= $link.data('largesrc'),
					$buildData.title 		= $link.data('title'),
					$buildData.href 		= $link.attr('href'),
					$buildData.description 	= $link.data('description'),
					$buildData.buttonsrc 	= $link.data('buttonsrc'),
					$buildData.buttontarget	= $link.parents('ul').data('buttonopenin'),
					$buildData.buttontext 	= $link.parents('ul').data('buttontext');

				builder($this.parent('li'), $buildData);

				setTimeout(function(){
					$('html, body').animate({
						scrollTop: $scrollTop + $offsetMinus
					}, 350,'easeInOutExpo');
				}, 10);
				return false;
			});

			$('.met_thumbnail_grid:not(.disable_expand) figure .met_hover_effect_icon.second').on('click', function () {
				$(this).parents('figure').find('.og-grid-link').trigger('click');
				return false;
			});

		},

		headerSearch: function(){
			$('.met_header_wrap .met_header_search').click(function(){
				$('.met_header_wrap .met_header_search_wrap').addClass('on');

				setTimeout(function(){
					$('.met_header_wrap .met_header_search_term').focus();
				}, 100);
			});

			$('.met_sticky_header .met_header_search').live('click', function(){
				$(this).parents('.met_sticky_header').find('.met_header_search_wrap').addClass('on');
				var theinput = $(this).parents('.met_sticky_header').find('.met_header_search_wrap input');

				setTimeout(function(){
					theinput.focus();
				}, 100);
			});

			$('.met_header_search_wrap .closer').live('click',function(){
				$(this).parents('.met_header_search_wrap').removeClass('on');
			});
		},

		responsiveUtilities: function(){
			function responsiveMenuButton(){
				if( $(window).scrollTop() > $('.met_header_wrap').height() ) {
					$('#met_mobile_bar_bottom_button').css('transform', 'translateX(20px) translateZ(0)');
				} else {
					$('#met_mobile_bar_bottom_button').css('transform', 'translateX(-100%) translateZ(0)');
				}
			}



			$('.met_mobile_bar_trigger').on('click', function(e){
				e.preventDefault();
				CoreJS.toggleMobileBar();
			});
			$('#met_mobile_bar_bottom_button,#met_mobile_bar_closer').on('click touchstart', function(e){
				e.preventDefault();
				CoreJS.toggleMobileBar();
			});

			$('#met_mobile_bar .menu-item-has-children > a').filter(function(){return $(this).html() === "&nbsp;"}).hide();
			$('#met_mobile_bar .menu-item-has-children > a').on('click', function(e){
				e.preventDefault();
				var child = $(this).next('ul');

				if(child.hasClass('on')){
					child.removeClass('on');
					child.slideUp();
					$(this).removeClass('met_mobile_menu_on');

					var empties = child.parent().nextAll().children('a').filter(function(){return $(this).html() === "&nbsp;"}),
						emptiesUl = empties.next('ul');

					emptiesUl.removeClass('on');
					emptiesUl.slideUp();
					empties.removeClass('met_mobile_menu_on');
				}else{
					child.addClass('on');
					child.slideDown();
					$(this).addClass('met_mobile_menu_on');

					var empties = child.parent().nextAll().children('a').filter(function(){return $(this).html() === "&nbsp;"}),
						emptiesUl = empties.next('ul');
					emptiesUl.addClass('on');

					emptiesUl.slideDown();
					empties.addClass('met_mobile_menu_on');
				}
			});

			var onePageResponsiveLinks = $('#met_mobile_bar a[href^="#"]').filter(function(){ return $(this).attr('href').length > 1 && $($(this).attr('href')).get(0) });
			if( onePageResponsiveLinks.get(0) ){
				onePageResponsiveLinks.on('click', function(e){
					if( !$(this).parent('.current-menu-item').get(0) ){
						CoreJS.toggleMobileBar();
					}
					e.preventDefault();
				});
			}

			if( $(window).width() > 1024 ) return;
			optimizedScroll.add(responsiveMenuButton);
		},

		toggleMobileBar: function(){
			if($('#met_mobile_bar').css('display') == 'block'){
				$('.met_wrapper').removeClass('menu_open');
				$('#met_mobile_bar_bottom_button').removeClass('hide');
				$('#met_mobile_bar_closer').removeClass('show');

				$('#met_mobile_bar').fadeOut();
				$('html,body').css('overflow-x', 'visible');
			}else{
				$('#met_mobile_bar_bottom_button').addClass('hide');
				$('.met_wrapper').addClass('menu_open');
				$('#met_mobile_bar_closer').addClass('show');

				$('#met_mobile_bar').show();
				$('html,body').css('overflow-x', 'hidden');
			}
		},

		responsiveTab: function(elID){
			$('#'+elID).each(function(){
				var lis = $(this).find('ul > li > a'),
					divs = $(this).children('div'),
					ids = new Array(),
					iqw = 0,
					qwe = 0;

				lis.each(function(){
					ids[iqw] = $(this).attr('href').replace('#','');
					iqw++;
				});

				divs.each(function(){
					$(this).attr('id',ids[qwe]);
					qwe++;
				});

				$(this).responsiveTabs({
					startCollapsed: 'accordion',
					collapsible: false,
					rotate: false,
					animation: 'slide',
					duration: 300,
					active: 0
				});
			});
		},

		scrollUp: function(){
			function pos(){
				if($(window).scrollTop() != 0) {
					$('#met_scroll_up').css('transform', 'translateX(-20px) translateZ(0)');
				} else {
					$('#met_scroll_up').css('transform', 'translateX(100%) translateZ(0)');
				}
			}

			optimizedScroll.add(pos);

			$('#met_scroll_up').on('click touchstart', function(e) {
				e.preventDefault();
				$('body,html').animate({scrollTop:0},800);
			});
		},

		googleMapToggler: function(elID){
			$('#'+elID).on('click touchstart', function(e){
				e.preventDefault();

				var wrapper = $(this).next('.map_wrapper');

				if(wrapper.hasClass('map_hidden')){
					wrapper.slideDown(500);
					wrapper.removeClass('map_hidden');
				}else{
					wrapper.slideUp(500);
					wrapper.addClass('map_hidden');
				}
			});
		},

		stickyHeader: function(){
			var fixed_header = $('.met_fixed_header'),
				body = $('body'),
				LTE_IE_9 = $('#LTEIE9'),
				sizing,
				sticky_header,
				status = {'on': {},'off': {}};

			if( !LTE_IE_9.get(0) ){
				status['on'] = {'transform': 'translateY(0) translateZ(0)'};
				status['off'] = {'transform': 'translateY(-100%) translateZ(0)'};
			}else{
				status['on'] = {'top': '0'};
				status['off'] = {'top': '-100px'};
			}

			function stickyHeaderPos(){
				if( $(window).scrollTop() > parseInt(sticky_header.data('visibleat')) ){
					sticky_header.css(status['on']);
				}else{
					sticky_header.css(status['off']);

					sticky_header.find('.met_header_search_wrap.on').toggleClass( 'on', false );
				}
			}

			function sizing(sticky_header){
				var pageWrapper = $('.met_page_wrapper'),
					maxW = pageWrapper.outerWidth(),
					left = pageWrapper.offset().left;

				sticky_header.css({
					'max-width': maxW+'px',
					'left': left+'px',
					'padding': '0px'
				});
			}

			if(fixed_header.get(0) && body.width() > 1024){
				var theLogo     = $('.met_header_wrap .met_logo').clone(),
					menu        = $('.met_header_wrap nav').clone(),
					search      = $('.met_header_wrap .met_header_search').clone(),
					searchWrap  = $('.met_header_wrap .met_header_search_wrap').clone(),
					socials     = $('.met_header_wrap .met_header_socials').clone(),
					links       = $('.met_header_wrap .met_header_links').clone(),
					wpadminbar  = $('#wpadminbar'),
					stickyLogoSrc = theLogo.data('sticky-src'),
					stickyLogoText = theLogo.data('sticky-text'),
					adminbarheight = wpadminbar.get(0) ? wpadminbar.height() : 0;

				if( !$('.met_header_wrap').hasClass('met_fixed_wide_header') || $('body').hasClass('met_boxed_layout') ){
					var inthis = '.met_sticky_header > .met_content';
					var inContent = '<div class="met_content clearfix"></div>';
				}else{
					var inthis = '.met_sticky_header';
					var inContent = '';
				}

				body.append('<div class="met_sticky_header off hidden-1024">'+ inContent +'</div>');

				sticky_header = $('.met_sticky_header');

				sticky_header.css('top', adminbarheight+'px');
				sticky_header.css('height', fixed_header.data('stickyheight'));
				if( $('.met_header_wrap').hasClass('met_fixed_wide_header') ){
					sticky_header.find(' > div').addClass('met_sticky_header_color_apply');
				}

				menu.children('ul').removeAttr('id');

				theLogo.appendTo(inthis);
				menu.appendTo(inthis);
				search.appendTo(inthis);
				searchWrap.appendTo('.met_sticky_header');
				socials.appendTo(inthis);

				var stickyLogo = sticky_header.find('.met_logo');
				stickyLogo.addClass('met_vcenter');

				if( stickyLogoSrc != '' ){ stickyLogo.find('img').attr('src', stickyLogoSrc); }
				if( stickyLogoText != '' ){ stickyLogo.find('span').html(stickyLogoText); }

				var logo = $('header .met_logo');

				logo.imagesLoaded(function(){
					var logoWidth = stickyLogo.outerWidth() + stickyLogo.position().left,
						padLeft = parseInt(sticky_header.css('padding-left'));
					sticky_header.find('.met_primary_nav').css('padding-left', logoWidth +'px').show();
				});

				sticky_header.find('nav .met_header_search').remove();
				sticky_header.attr('data-visibleat', (fixed_header.position().top + fixed_header.height() - 60));

				optimizedScroll.add(stickyHeaderPos);

				if($('.met_side_navbar_wrap').get(0)){
					sizing(sticky_header);
					$(window).on('debouncedresize', sizing(sticky_header));
				}
			}
		},

		subMenuAlign: function(){

			function calc(){
				var subMenu = $('.met_header_menu .main-menu-item.met_primary_nav_mega > ul[class*="mmm-sub-menu-align-"]:not(.mmm-sub-menu-is-full-width),.met_header_menu .main-menu-item.met_primary_nav_posts > ul[class*="mmm-sub-menu-align-"]:not(.mmm-sub-menu-is-full-width),.met_header_menu .main-menu-item.met_primary_nav_mega_posts > ul[class*="mmm-sub-menu-align-"]:not(.met_megamenu_tabbed_posts_wrapper):not(.mmm-sub-menu-is-full-width)');

				subMenu.each(function(){
					var $this = $(this),
						wrapper = !$('.met_header_id_4').get(0) ? $this.parents('.met_primary_nav') : $this.parents('nav.met_content'),
						li      = $this.parents('.main-menu-item'),
						dim = {};

					if( !wrapper.get(0) ) wrapper = $this.parents('.met_sticky_header');

					dim.width   = $this.outerWidth();
					dim.wrapper = wrapper.outerWidth();
					dim.li      = li.outerWidth();

					dim.wrapperOffsetX = parseFloat(wrapper.offset().left);

					dim.offsetX = parseFloat($this.offset().left) - dim.wrapperOffsetX;
					dim.liOffsetX = parseFloat(li.offset().left) - dim.wrapperOffsetX;

					if( $this.hasClass('mmm-sub-menu-align-left') ){
						dim.pos = Math.max( 0, dim.liOffsetX - Math.max(0, ( ( dim.liOffsetX + dim.width ) - dim.wrapper )) );

					}else if( $this.hasClass('mmm-sub-menu-align-right') ){
						dim.pos = Math.max( 0, ( dim.liOffsetX + dim.li - dim.width ) );

					}else if( $this.hasClass('mmm-sub-menu-align-center') ){
						dim.pos = ( dim.liOffsetX + ( dim.li / 2 ) ) - ( dim.width / 2 );
						dim.pos = dim.pos > 0 ? dim.pos : 0;

						if( dim.pos + dim.width > dim.wrapper ){
							dim.pos = dim.wrapper - dim.width;
						}

					}

					$this.css({'left': dim.pos, 'right': 'auto'});
				});
			}

			setTimeout(calc,550);
			$(window).on('debouncedresize', calc);
		},

		fitColumnHeight: function(){

			// Make sure only query with containers containing more than 1 column
			var $containerBoxes = $('nav li[class*="met_primary_nav_"] .sub-menu[class*="mmm-"]');

			$containerBoxes.each(function(){
				var $box = $(this),
					$columns = $box.children('.menu-item-has-children');

				$box.show();
				var h = $box.height();
				$box.hide();
				$columns.css('height', h )
			});

			/*$containerBoxes.each(function(){
				var $box = $(this),
					$children = $box.children(),
					$rows = {}, $rowsColumns = {};

				$children.each(function(){
					var $column = $(this);

					if( $column.is('.menu-item-has-children') ){
						$rowsColumns[$rowsColumns.length + 1] = $column;
					}

					if( $column.is('.menu-item-is-divider') && $rowsColumns.length > 1 ){
						$rows[$rows.length + 1] = $rowsColumns;
						$rowsColumns = {};
					}
				});

				$.each($rows, function(k, o){
					var $currentHighest = Math.max.apply( null, $.map(o, function(el, index){ return $(el).height() }) );
					o.map( function(){ return $(this).height($currentHighest) });

					//o.height($currentHighest);
				});
			});*/


		},

		stickySideNav: function(){
			$(".met_side_navbar_sticky").sticky({
				topSpacing: $('.met_side_navbar_sticky').offset().top,
				className: 'sidenav-is-sticky',
				wrapperClassName: 'sidenav-sticky-wrapper',
				getWidthFrom: '.met_side_navbar_wrap'
			});
		},

		loadStylesheet: function(styleSheets){
			$.each(styleSheets, function(key, value){

				var info = value.split('|');
				if( info.length < 1 || info[0] == '' ) return;

				var fileUrl = info[0],
					fileID  = info.length > 1 ? info[1] : null;

				if( fileID != null ){
					if( $('#' + fileID).get(0) ) return;
				}else fileID = '';

				$.ajax({
					url: fileUrl,
					cache: true,
					success: function(data){
						$('head').append('<style id="' + fileID + '" type="text/css">' + data + '</style>');
					},
					error: function(data){
						console.log('Tried to load: ' + fileUrl + ' file but couldn\'t find it! Make sure file exists or contact the developer!');
					},
				});
			});
		},

		loadAsync: function(scripts,callBacks,dataArray){
			if(scripts.length == 0)
				CoreJS.loadAsync_callBacks(callBacks,dataArray);
			else
				CoreJS.loadAsync_ajaxCalls(scripts,callBacks,dataArray);
		},

		loadAsync_ajaxCalls: function(scripts,callBacks,dataArray){
			var options = {dataType: "script",cache: true},
				completedCounter = 0;
			for(var i = 0; i < scripts.length; i++){
				options.url = scripts[i];
				options.complete = function(){
					completedCounter++;
					if(completedCounter == scripts.length){
						CoreJS.loadAsync_callBacks(callBacks,dataArray);
					}
				};
				$.ajax( options );
			}
		},

		loadAsync_callBacks: function(callBacks,dataArray){
			if(callBacks.length > 0){
				var callBackFunction = [];
				for(var i = 0; i < callBacks.length; i++){
					callBackFunction = callBacks[i].split('|');
					window["CoreJS"][callBackFunction[0]](callBackFunction[1],dataArray);
				}
			}
		},

		fittingVids: function(elID){
			var el = $('#' + elID);

			if( el.get(0) ){
				el.fitVids();

				if( el.hasClass('met_isotope_item') && !el.parents('.row.grid').hasClass('window_load_isotope_layout_trigger') ){
					el.parents('.row.grid').addClass('window_load_isotope_layout_trigger');
					$(window).load(function(){
						setTimeout(function(){el.isotope('layout');},200);
					});
				}
			}
		},

		header_1_nav_padding: function(){
			var logo = $('header .met_logo');

			logo.imagesLoaded(function(){
				var logoWidth = logo.outerWidth() + parseInt($('.met_header_wrap > header').css('padding-left')) - 1;
				$('.met_primary_nav').css('padding-left', logoWidth).show();
			});

		},

		fullscreenScrolling: function(opts,videoPlaying){
			if( $(window).width() <= 1024 ){
				setTimeout(function(){
					$('body').removeClass('met_page_loading_padding');
					$(window).resize();
					$('.met_page_loading_overlay').addClass('met_page_loading_loaded');
					setTimeout(function(){$('.met_page_loading_overlay').remove()},400);
				},300);
				return;
			}

			var sections = $('#dslc-content .dslc-modules-section'),
				container = $('#dslc-content');

			if(sections.get(0) && container.get(0)){
				$('body,html').animate({scrollTop:0},0);
				sections.addClass('section');

				if(opts.fixedElements != ''){
					opts.paddingTop = $('.met_header_wrap').height()+'px';
					opts.paddingBottom = $('.footer_wrap').height()+'px';
				}

				opts.afterRender = function(){

					setTimeout(function(){
						$('body').removeClass('met_page_loading_padding');
						$(window).resize();
						$('.met_page_loading_overlay').addClass('met_page_loading_loaded');
						setTimeout(function(){$('.met_page_loading_overlay').remove()},400);
					},300);

					$('.met_header_wrap').addClass('met_fullpage_effect_header');
				}
				opts.afterLoad = function(anchorLink,index){

					var $stickyHeader = $('.met_sticky_header'),
						$fullPageEffectHeader = $('.met_fullpage_effect_header');
					if( $stickyHeader.get(0) ){
						if( index === 1 ){
							$fullPageEffectHeader.unbind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');

							$stickyHeader.css('transform', 'translateY(-100%) translateZ(0)');
							$stickyHeader.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
								$fullPageEffectHeader.removeClass('off');
							});
						}else{
							$stickyHeader.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');

							$fullPageEffectHeader.addClass('off');
							$fullPageEffectHeader.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
								$stickyHeader.css('transform', 'translateY(0) translateZ(0)');
							});

						}
					}else{
						if( index === 1 ){
							$fullPageEffectHeader.removeClass('off');
						}else{
							$fullPageEffectHeader.addClass('off');
						}
					}


					if(videoPlaying === false){
						var v = $(".section").eq(index-1).find("video");
						if(v.get(0)) v[0].play();
					}else{
						$(".section").find("video").each(function(){
							var v = $(this);
							v[0].play();
						});
					}
					var $currentSection = $(".section:eq("+(index-1)+")"),
						animations = $currentSection.find("[data-wow-animation]").not('.effect-none').not('.animated'),
						countTos = $currentSection.find(".countTo").not('.counted'),
						delayIncrease = 0;

					countTos.each(function(){
						var $this = $(this);
						$this.addClass('counted').countTo();

					});

					animations.each(function(){

						var $this = $(this),
							wowAnimation = $this.data('wow-animation'),
							wowDuration = $this.data('wow-duration'),
							wowIteration = $this.data('wow-iteration'),
							wowDelay = $this.data('wow-delay');

						setTimeout(function(){
							$this.css({
								'-webkit-animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
								'-moz-animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
								'-ms-animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
								'animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
								'visibility': 'visible'
							});
							$this.addClass('animated');
						}, parseFloat(wowDelay) * 1000 + delayIncrease);
						if( $this.parent().hasClass('grid') ) delayIncrease += 150;
					});
				}
				container.fullpage(opts);
			}else{
				$('body').removeClass('met_page_loading_padding');
				$('.met_page_loading_overlay').remove();
			}
		},

		theGrid: function( elID ){
			var caption 	= $('#' + elID),
				$window 	= $(window),
				uniqueClass = caption.data('unique-class'),
				$items		= caption.find('.met_isotope_item');

			if( caption.get(0) ){

				caption.imagesLoaded(function(){
					var isotoped = caption.isotope({
						itemSelector: '.met_isotope_item',
						isInitLayout: false,
						transitionDuration: 0,
						layoutMode: 'masonry',
						isResizeBound: true,
						masonry: {columnWidth: $items[0], gutter: 0}
					});

					isotoped.isotope( 'once', 'layoutComplete', function(){
						/*$('html, body').animate({
							scrollTop: $window.scrollTop() + 1
						}, 1, function(){
							$('html, body').animate({
								scrollTop: $window.scrollTop() - 1
							}, 1);
						});*/
						if( !caption.hasClass('effect-none') )
							CoreJS.wowAnimate(uniqueClass);

						if( caption.hasClass('no_gap') )
							setTimeout(function(){ isotoped.isotope('layout') }, 100);
					});
					isotoped.isotope('layout');
					/*$window.on('load', CoreJS.gridOverlayRemover(caption,uniqueClass,isotoped));*/

					$('.' + elID + '_filters a').live('click', function(){
						var selector = $(this).attr('data-filter');
						if( $(this).parents('.met_page_head').get(0) ){
							$('.' + elID + '_filters').find('span').html( $(this).html() );
						}else{
							if(!$(this).hasClass('activePortfolio')){
								$(this).parents('ul').find('.activePortfolio').removeClass('activePortfolio');
								$(this).addClass('activePortfolio');
							}
						}
						if( !caption.hasClass('effect-none') ){
							if( $('.dslc-modules-section.section.table').get(0) ){
								$items.each(function(key, val){

									var $this = $(this),
										wowAnimation = $this.data('wow-animation'),
										wowDuration = $this.data('wow-duration'),
										wowIteration = $this.data('wow-iteration'),
										wowDelay = $this.data('wow-delay');

									setTimeout(function(){
										$this.css({
											'-webkit-animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
											'-moz-animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
											'-ms-animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
											'animation': wowAnimation + ' ' + wowDuration + ' 0s ' + wowIteration,
											'visibility': 'visible'
										});
										$this.addClass('animated');
									}, parseFloat(wowDelay) * 1000 + (key * 150));
								});
							}else{
								CoreJS.wowAnimate(uniqueClass);
							}
						}
						isotoped.isotope({ filter: selector });
						isotoped.isotope('layout');
						return false;
					});
				});
			}
		},

		wowAnimate: function(elClass){
			if( $('#LTEIE9').get(0) ) return;
			var wow = new WOW({
				boxClass: elClass,
				animateClass: 'animated',
				mobile: true,
				live: false
			});
			return wow.init();
		},

		// Full Width Calculator
		fullWidthCalc: function(){
			var fullWidth = $('.met_page_wrapper').outerWidth();
			$('.met_fullwidth_item').each(function(){
				$(this).css({
					width: fullWidth + 'px',
					'margin-left': -((fullWidth - $('.met_page_wrapper div.met_content').width()) / 2) + 'px'
				}).animate({opacity: 1},400);
			});
		},

		header_1_heights: function(){
			$('.met_header_box_right').css('height', $('.met_logo').outerHeight()+'px');
		},

		// Lightbox Controls
		lightbox: function(){
			if(typeof jQuery().magnificPopup == "undefined") return false;
			var rel_lb = $('[rel^="lb"]'),
				$dslcLbImage = $('.dslc-lightbox-image'),
				$smallScreen = $(window).width() < 700,
				$imgObj = {
					type: 'image',
					mainClass: 'mfp-zoom-in',
					tLoading: '',
					removalDelay: 500, //delay removal by X to allow out-animation
					callbacks: {
						imageLoadComplete: function() {
							var self = this,
								$img = self.wrap.find('.mfp-img'),
								$isNatural = $smallScreen || $img.width() != $img[0].naturalWidth || $img.height() != $img[0].naturalHeight ? false : true;

							setTimeout(function() {
								self.wrap.addClass('mfp-image-loaded');
								if( $isNatural ) {
									self.wrap.off('click.pinhandler');
									self.wrap.removeClass('mfp-force-scrollbars');

									if( self.items.length > 1 ){
										$img.addClass('mfp-natural');
										self.wrap.on('click.pinhandler', 'img', function() {
											self.next();
										});
									}else{
										$img.addClass('mfp-nothing-to-do-here');
										self.wrap.on('click.pinhandler', 'img', function() {
											self.close();
										});
									}
								}
							}, 16);
						},
						close: function() { this.wrap.removeClass('mfp-image-loaded'); },
						open: function() {

							if( $smallScreen ) return;
							var self = this;

							self.wrap.on('click.pinhandler', 'img', function() {
								self.wrap.toggleClass('mfp-force-scrollbars')
							});
						},
						beforeClose: function() {
							this.wrap.off('click.pinhandler');
							this.wrap.removeClass('mfp-force-scrollbars');
						}
					},
					image: {
						verticalFit: true,
						tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
						titleSrc: function(item) {
							var title_string;

							if( item.el.data('caption') !== undefined && item.el.data('desc') !== undefined ){
								title_string = item.el.data('caption') + '<small>'+item.el.data('desc')+'</small>';
							}else if( item.el.data('caption') !== undefined && item.el.data('desc') == undefined ){
								title_string = item.el.data('caption');
							}

							return title_string;
						}
					}
				},
				$galObj = {
					enabled: true,
					navigateByImgClick: $smallScreen ? true : false,
					arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

					tPrev: 'Previous (Left arrow key)', // title for left button
					tNext: 'Next (Right arrow key)' // title for right button
				},
				$afterOpenIEfix;

			$dslcLbImage.each(function(){
				$(this).unbind();
				window['dslc_init_lightbox'] = function(){return}
				$(this).magnificPopup($imgObj);
			});


			$imgObj.gallery = $galObj;
			rel_lb.magnificPopup($imgObj);
			$(window).load(function(){
				$('[rel^="lb"].bx-clone').on('click', function(){
					$('a[href="'+ $(this).attr('href') +'"]').not('.bx-clone').click();
					return false;
				});
			});

			if( $('#LTEIE9').get(0) ){
				$afterOpenIEfix = {
					open: function() {
						$(window).resize();
					}
				};
			}

			var rel_video_lb = $('[rel^="video_lb"]');
			rel_video_lb.each(function(){
				$(this).magnificPopup({
					disableOn: 700,
					type: 'iframe',
					mainClass: 'mfp-3d',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: false,
					callbacks: $afterOpenIEfix
				});
			});
			var rel_iframe_lb = $('[rel^="iframe_lb"]');
			rel_iframe_lb.each(function(){
				$(this).magnificPopup({
					disableOn: 700,
					type: 'iframe',
					mainClass: 'mfp-3d',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: false,
					callbacks: $afterOpenIEfix
				});
			});
			var inline_lb = $('[rel^="inline_lb"]');
			inline_lb.each(function(){
				$(this).magnificPopup({
					disableOn: 700,
					type: 'inline',
					mainClass: 'mfp-3d',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: false,
					callbacks: $afterOpenIEfix
				});
			});

			$( '.dslc-lightbox-gallery' ).each(function(){
				$(this).magnificPopup({ delegate : 'a', type:'image', gallery:{ enabled: true } });
			});

			// Touch Bindings
			if( $('html').hasClass('touch') ){
				var touchTimeout;

				rel_lb.on('touchstart', function(){ clearTimeout(touchTimeout); var $this = $(this); touchTimeout = setTimeout(function(){$this.trigger('click');}, 250)});
				rel_video_lb.on('touchstart', function(){ clearTimeout(touchTimeout); var $this = $(this); touchTimeout = setTimeout(function(){$this.trigger('click');}, 250)});
				rel_iframe_lb.on('touchstart', function(){ clearTimeout(touchTimeout); var $this = $(this); touchTimeout = setTimeout(function(){$this.trigger('click');}, 250)});
				inline_lb.on('touchstart', function(){ clearTimeout(touchTimeout); var $this = $(this); touchTimeout = setTimeout(function(){$this.trigger('click');}, 250)});
			}


		},

		// Recent Portfolio Works
		recentPortfolioWorks: function(){
			var met_recent_portfolio = $('.met_recent_portfolio');
			met_recent_portfolio.each(function(){
				var e = $(this);
				e.bxSlider({
					mode: 'horizontal',
					slideMargin: 30,
					slideWidth: 370,
					speed: 500,
					pager: false,
					controls: true,
					auto: true,
					pause: 2000,
					autoHover: true,
					minSlides: 1,
					maxSlides: 3,
					moveSlides: 1,
					nextSelector: e.parent('.met_recent_portfolio_wrap').prev('.met_recent_portfolio_nav'),
					prevSelector: e.parent('.met_recent_portfolio_wrap').prev('.met_recent_portfolio_nav'),
					nextText: '<i class="fa fa-angle-right"></i>',
					prevText: '<i class="fa fa-angle-left"></i>'
				});
			});
		},

		// Carousel Plugin for Blog Page items
		upcomingEventsSlider: function(elementID){
			var met_upcoming_events_wrapper = $('#'+elementID),
				met_upcoming_events = met_upcoming_events_wrapper.find('.met_upcoming_events');

			met_upcoming_events.each(function(){
				var e = $(this);
				var s = e.bxSlider({
					mode: 'fade',
					slideMargin: 0,
					speed: 500,
					pager: false,
					controls: false,
					auto: true,
					pause: 5000,
					autoHover: true,
					minSlides: 1,
					maxSlides: 1,
					moveSlides: 1,
					adaptiveHeight: 1
				});
				met_upcoming_events_wrapper.find('.met_upcoming_events_prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				met_upcoming_events_wrapper.find('.met_upcoming_events_next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		// Carousel Plugin for Blog Page items
		postsCarousel: function(elementID){
			var met_posts_carousel_wrapper = $('#'+elementID),
				met_posts_carousel = met_posts_carousel_wrapper.find('.met_posts_carousel');

			met_posts_carousel.each(function(){
				var e = $(this);
				var s = e.bxSlider({
					slideMargin: 0,
					speed: 500,
					pager: false,
					controls: false,
					auto: true,
					pause: 5000,
					autoHover: true,
					slideWidth: 380,
					responsive: true,
					minSlides: 1,
					maxSlides: 3,
					moveSlides: 1,
					adaptiveHeight: 0
				});
				met_posts_carousel_wrapper.find('.met_upcoming_events_prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				met_posts_carousel_wrapper.find('.met_upcoming_events_next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		// Carousel Plugin for Blog Page items
		postsCarousel2: function(elementID){
			var met_portfolio_carousel_wrapper = $('#'+elementID),
				met_portfolio_carousel = met_portfolio_carousel_wrapper.find('.met_portfolio_carousel');

			if(!met_portfolio_carousel.get(0)) met_portfolio_carousel = met_portfolio_carousel_wrapper.find('.met_gallery_carousel_2');

			met_portfolio_carousel.each(function(){
				var e = $(this);
				var s = e.bxSlider({
					slideMargin: 0,
					speed: parseInt(met_portfolio_carousel_wrapper.data('speed')),
					pager: false,
					controls: false,
					auto: true,
					adaptiveHeight: false,
					slideWidth: 350,
					pause: parseInt(met_portfolio_carousel_wrapper.data('pause')),
					autoHover: true,
					responsive: true,
					minSlides: 1,
					maxSlides: parseInt(met_portfolio_carousel_wrapper.data('columns')),
					moveSlides: 1
				});
				met_portfolio_carousel_wrapper.find('.prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				met_portfolio_carousel_wrapper.find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		// Box Carousel - Upcoming Events - Testimonials
		boxCarousel: function(elID){
			var e = $('#'+ elID +' .met_box_carousel');
			var s = e.bxSlider({
				mode: e.data('carousel-mode'),
				slideMargin: 0,
				speed: 700,
				pager: false,
				controls: false,
				auto: true,
				pause: 5000,
				autoHover: true,
				minSlides: e.data('carousel-min'),
				maxSlides: e.data('carousel-max'),
				moveSlides: 1,
				adaptiveHeight: 1
			});
			e.parents('.met_content_box').find('.met_upcoming_events_prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
			e.parents('.met_content_box').find('.met_upcoming_events_next').click(function(e){e.preventDefault();s.goToNextSlide()});
		},

		// Box Testimonials
		boxTestimonials: function(elID){
			var e = $('#'+ elID +' .met_content_box_slider');
			var s = e.bxSlider({
				mode: 'fade',
				slideMargin: 0,
				speed: e.data('speed'),
				pager: false,
				controls: false,
				auto: true,
				pause: e.data('pause'),
				autoHover: true,
				minSlides: 1,
				maxSlides: 1,
				moveSlides: 1,
				adaptiveHeight: 1
			});
			e.parents('.met_content_box').find('.met_upcoming_events_prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
			e.parents('.met_content_box').find('.met_upcoming_events_next').click(function(e){e.preventDefault();s.goToNextSlide()});
		},

		// Blog List Slider
		blogBlockSlider: function(elID){
			var met_blog_block_slider = $('#' + elID);
			met_blog_block_slider.each(function(){
				var e = $(this);
				var s = e.bxSlider({
					mode: e.data('mode'),
					slideMargin: 0,
					speed: e.data('speed'),
					pager: false,
					controls: false,
					auto: e.data('auto'),
					pause: e.data('sliderpause'),
					autoHover: e.data('sliderautohover'),
					randomStart: e.data('randomstart'),
					infiniteLoop: e.data('infiniteloop'),
					adaptiveHeight: true,
					minSlides: 1,
					maxSlides: 1,
					moveSlides: 1
				});
				e.parents('.met_blog_block_slider_container').find('.met_blog_block_slider_prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				e.parents('.met_blog_block_slider_container').find('.met_blog_block_slider_next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		// Link Rotator
		linkRotator: function(elID){
			var el = $('#'+ elID),
				wrap = el.find('.met_title_rotator_el_wrap'),
				title = el.children('.met_title_rotator_title'),
				met_title_rotator = el.find('.met_title_rotator_el'),
				inheader = $('.met_header_wrap #'+ elID),
				plusVal = 20;

			if(inheader.get(0)){plusVal = 5}

			function setRotatorMargin(){ if(title.get(0)) wrap.css('margin-left', (title.outerWidth() + plusVal) + 'px'); }
			setRotatorMargin();
			$(window).resize(function(){setRotatorMargin();});

			if(met_title_rotator.get(0)){
				met_title_rotator.bxSlider({
					mode: 'fade',
					slideMargin: 0,
					speed: el.data('speed'),
					pager: false,
					controls: false,
					auto: true,
					pause: el.data('pausetime'),
					autoHover: true,
					minSlides: 1,
					maxSlides: 1,
					moveSlides: 1
				});
			}

		},

		// Twitter Feed
		twitter_feed: function(elID){
			var el = $('#'+elID),
				nav = $('#'+elID+'_nav');
			el.each(function(){
				var e = $(this),
					s = e.bxSlider({
						mode: 'fade',
						slideMargin: 0,
						speed: 1000,
						pager: false,
						controls: false,
						auto: true,
						pause: 6000,
						autoHover: true,
						minSlides: 1,
						maxSlides: 1,
						moveSlides: 1
					});
				nav.find('.prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				nav.find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		// Twitter Feed
		twitter_box_feed: function(elID){
			var el = $('#'+elID);
			el.find('section').each(function(){
				var e = $(this),
					s = e.bxSlider({
						mode: 'vertical',
						slideMargin: 0,
						speed: el.data('speed'),
						pager: false,
						controls: false,
						auto: el.data('autoplay'),
						pause: el.data('pause'),
						autoHover: true,
						minSlides: el.data('visible'),
						maxSlides: el.data('visible'),
						moveSlides: 1
					});
				el.find('.prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				el.find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		// Quote Testimonials
		quote_testimonials: function(elID){
			var el = $('#'+elID),
				met_quote_testimonials = el.find('.met_quote_testimonials_wrapper');

			met_quote_testimonials.each(function(){
				var e = $(this),
					s = e.bxSlider({
						mode: 'fade',
						slideMargin: 0,
						speed: 1000,
						pager: false,
						controls: false,
						auto: true,
						pause: 6000,
						autoHover: true,
						minSlides: 1,
						maxSlides: 1,
						moveSlides: 1
					});
				el.next('.prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				el.next('.prev').next('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});
		},

		gallery_grid: function(elID){
			var wrap        = $('#'+elID),
				cols        = parseInt(wrap.data('cols')),
				slides      = wrap.find('.met_gallery_grid_first_row .met_gallery_grid_item'),
				firstRow    = wrap.find('.met_gallery_grid_first_row'),
				secondRow   = (cols * 2 <= slides.length),
				secondRowItems = secondRow ? wrap.find('.met_gallery_grid_item:gt('+ (cols-2) +')') : false,
				secondRowItemz = secondRow ? wrap.find('.met_gallery_grid_item:lt('+ (cols-1) +')') : false,
				secondBx    = false;

			if(secondRow){
				wrap.append('<div class="met_gallery_grid_row"><div class="met_gallery_grid_second_row_wrap"><div class="met_gallery_grid_second_row clearfix"></div></div></div>');
				secondRowItems.each(function(){
					wrap.find('.met_gallery_grid_second_row').append($(this).clone());
				});
				secondRowItemz.each(function(){
					wrap.find('.met_gallery_grid_second_row').append($(this).clone());
				});

				wrap.find('.met_gallery_grid_second_row').each(function(){
					var e = $(this);
					secondBx = e.bxSlider({
						slideMargin: 0,
						speed: wrap.data('speed'),
						pager: false,
						controls: false,
						auto: false,
						pause: wrap.data('pause'),
						infiniteLoop: true,
						autoHover: true,
						slideWidth: wrap.find('.met_gallery_grid_item:first-child').width(),
						responsive: true,
						minSlides: cols,
						maxSlides: cols,
						moveSlides: 1,
						adaptiveHeight: 0
					});
				});
			}

			firstRow.each(function(){
				var e = $(this);
				var s = e.bxSlider({
					slideMargin: 0,
					speed: wrap.data('speed'),
					pager: false,
					controls: false,
					auto: wrap.data('auto'),
					pause: wrap.data('pause'),
					infiniteLoop: true,
					autoHover: true,
					slideWidth: wrap.find('.met_gallery_grid_item:first-child').width(),
					responsive: true,
					minSlides: cols - 1,
					maxSlides: cols - 1,
					moveSlides: 1,
					adaptiveHeight: 0,
					onSlideNext: function(){
						if(secondBx){
							secondBx.goToNextSlide();
						}
					},
					onSlidePrev: function(){
						if(secondBx){
							secondBx.goToPrevSlide();
						}
					}
				});
				e.parents('.met_gallery_grid').find('.prev').click(function(e){e.preventDefault();s.goToPrevSlide()});
				e.parents('.met_gallery_grid').find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
			});

			slides.magnificPopup({
				type: 'image',
				gallery:{
					enabled: true
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						var title_string;

						if( item.el.data('caption') !== undefined && item.el.data('desc') !== undefined ){
							title_string = item.el.data('caption') + '<small>'+item.el.data('desc')+'</small>';
						}else if( item.el.data('caption') !== undefined && item.el.data('desc') == undefined ){
							title_string = item.el.data('caption');
						}

						return title_string;
					}
				}
			});

			/*
			secondRowItems.magnificPopup({
				type: 'image',
				gallery:{
					enabled: true
				}
			});

			secondRowItems.on('click',function(){
				return false;
				alert('annen');
			});
			*/

			wrap.find('.met_gallery_grid_first_row .met_gallery_grid_item.bx-clone, .met_gallery_grid_second_row .met_gallery_grid_item').click(function(){
				wrap.find(".met_gallery_grid_first_row .met_gallery_grid_item[data-lightboxid='"+$(this).data('lightboxid')+"']:not(.bx-clone)").click();
				return false;
			});
		},

		gallery_slider: function(elID){
			var sliderElement = $('#'+elID+' .theSlider');
			var carouselElement = $('#'+elID+' .theCarousel');
			var syncSelector = '';

			if(carouselElement.get(0)){ // thumbnails nav can be disabled -mrtkrcm
				carouselElement.flexslider({
					animation: "slide",
					controlNav: false,
					animationLoop: false,
					slideshow: false,
					itemWidth: sliderElement.data('itemwidth'),
					itemMargin: 0,
					asNavFor: '#'+elID+' .theSlider'
				});

				syncSelector = '#'+elID+' .theCarousel';
			}

			sliderElement.flexslider({
				animation: "slide",
				controlNav: false,
				animationLoop: sliderElement.data('animationloop'),
				slideshow: sliderElement.data('slideshow'),
				smoothHeight: sliderElement.data('smoothheight'),
				slideshowSpeed: sliderElement.data('slideshowspeed'),
				pauseOnHover: sliderElement.data('pauseonhover'),
				sync: syncSelector
			});
		},

		gallery_thumb_lb: function(elID){
			var els = $('#'+elID+' a');
			els.magnificPopup({
				type: 'image',
				gallery:{
					enabled: true
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						var title_string;

						if( item.el.data('caption') !== undefined && item.el.data('desc') !== undefined ){
							title_string = item.el.data('caption') + '<small>'+item.el.data('desc')+'</small>';
						}else if( item.el.data('caption') !== undefined && item.el.data('desc') == undefined ){
							title_string = item.el.data('caption');
						}

						return title_string;
					}
				}
			});
		},

		gallery_thumb_grid_2: function(elID){
			var el = $('#'+elID),
				bigs = el.find('.big_caption'),
				smalls = el.find('.met_gallery_thumb_grid'),
				autoInterval,
				slideshow = el.data('slideshow'),
				pauseTime = el.data('pause'),
				speedTime = el.data('speed');

			bigs.find('a').magnificPopup({
				type: 'image',
				gallery:{
					enabled: true
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						var title_string;

						if( item.el.data('caption') !== undefined && item.el.data('desc') !== undefined ){
							title_string = item.el.data('caption') + '<small>'+item.el.data('desc')+'</small>';
						}else if( item.el.data('caption') !== undefined && item.el.data('desc') == undefined ){
							title_string = item.el.data('caption');
						}

						return title_string;
					}
				}
			});


			// Set First Items as Active
			el.find('li:first-child').addClass('activeItem');

			function setActiveImage(id){
				var currentBigItem = bigs.find('.activeItem'),
					currentSmallItem = smalls.find('.activeItem'),

					nextBigItem = id == undefined ? (!currentBigItem.next().get(0) ? bigs.find('li').eq(0) : currentBigItem.next()) : bigs.find('li').eq(id),
					nextSmallItem = id == undefined ? (!currentSmallItem.next().get(0) ? smalls.find('li').eq(0) : currentSmallItem.next()) : smalls.find('li').eq(id);

				currentBigItem.removeClass('activeItem').hide();
				nextBigItem.addClass('activeItem').fadeIn(speedTime);

				currentSmallItem.removeClass('activeItem');
				nextSmallItem.addClass('activeItem');
			}

			function setTimer(){autoInterval = setInterval(function(){setActiveImage()},pauseTime);}

			smalls.find('li').click(function(){
				if(!$(this).hasClass('activeItem')){
					clearInterval(autoInterval);
					setActiveImage($(this).index());
				}
			});

			if(slideshow){
				el.mouseenter(function(){clearInterval(autoInterval)});
				el.mouseleave(function(){setTimer()});

				setTimer();
			}
		},

		imageCarousel: function(elemID){
			var met_image_carousel = $('#'+elemID),
				maxSlides = met_image_carousel.data('mode') == 'fade' ? 1 : met_image_carousel.data('maximumvisible');
			met_image_carousel.each(function(){
				var e = $(this);
				var s = e.bxSlider({
					mode: met_image_carousel.data('mode'),
					slideMargin: 0,
					slideWidth: met_image_carousel.data('width'),
					speed: met_image_carousel.data('speed'),
					startSlide: met_image_carousel.data('startslide'),
					randomStart: met_image_carousel.data('randomstart'),
					infiniteLoop: met_image_carousel.data('infiniteloop'),
					pager: false,
					controls: false,
					auto: met_image_carousel.data('autoslide'),
					pause: met_image_carousel.data('pause'),
					autoDirection: met_image_carousel.data('slidedirection'),
					autoHover: met_image_carousel.data('hoveroverstop'),
					minSlides: met_image_carousel.data('minimumvisible'),
					maxSlides: maxSlides,
					moveSlides: met_image_carousel.data('moveslides')
				});
				if(e.parents('.met_image_carousel_wrap').get(0)){
					e.parents('.met_image_carousel_wrap').find('.previous').click(function(e){e.preventDefault();s.goToPrevSlide()});
					e.parents('.met_image_carousel_wrap').find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
				}else if(e.parents('.met_image_carousel_wrap_2').get(0)){
					e.parents('.met_image_carousel_wrap_2').find('.previous').click(function(e){e.preventDefault();s.goToPrevSlide()});
					e.parents('.met_image_carousel_wrap_2').find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
				}else if(e.parents('.met_image_carousel_wrap_3').get(0)){
					e.parents('.met_image_carousel_wrap_3').find('.previous').click(function(e){e.preventDefault();s.goToPrevSlide()});
					e.parents('.met_image_carousel_wrap_3').find('.next').click(function(e){e.preventDefault();s.goToNextSlide()});
				}

			});
		},

		teamlistHoverControls: function(elID){
			var member = $('#'+elID+' .met_teamlist_member');
			if(member.get(0)){
				var timeOut;
				var firstIndex = member.parent().find('.on').index() + 1;
				member.parent().next().children(':nth-child('+firstIndex+')').show();

				member.hover(function(){
					clearTimeout(timeOut);
					var $this = $(this);
					var parent = $this.parent();
					if(!$this.hasClass('on')){
						timeOut = setTimeout(function(){
							var oldIndex = parent.find('.on').index() + 1;
							parent.next().children(':nth-child('+oldIndex+')').hide();
							parent.find('.on').removeClass('on');

							var newIndex = $this.index() + 1;
							parent.next().children(':nth-child('+newIndex+')').fadeIn(300);
							$this.addClass('on');
						},300);
					}
				});
			}
		},

		testimonialHoverControls: function(){
			var testimonialInterval;
			if($('.met_testimonial_photos').get(0)){
				$('.met_testimonial_photos > div').hover(function(){
					var e = $(this);
					testimonialInterval = setInterval(function(){CoreJS.testimonialHoverOver(e)},600);
				},function(){
					var e = $(this);
					testimonialInterval = clearInterval(testimonialInterval);
					CoreJS.testimonialHoverOut(e);
				});
			}
		},

		testimonialHoverOver: function(i){
			var id = i.index() + 1;
			i.parents('.met_testimonial_photos').next().children('div:nth-child('+id+')').slideDown();
		},

		testimonialHoverOut: function(e){
			var id = e.index() + 1;
			e.parents('.met_testimonial_photos').next().children('div:nth-child('+id+')').slideUp();
		},

		// Flickr Feed Controls
		flickrfeed: function(id) {
			var flickr_feed = jQuery('#'+id);
			if(flickr_feed.get(0)){
				flickr_feed.jflickrfeed({
					limit: flickr_feed.data('limit'),
					qstrings: {
						id: flickr_feed.data('id')
					},
					itemTemplate: '<li><a href="{{image_b}}" rel="lb_flickr" target="_blank"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
				}, function(){
					flickr_feed.find('a').magnificPopup({
						type: 'image',
						gallery:{
							enabled: true
						}
					});
				});
			}
		},

		// Testimonials
		testimonialsRotator: function(elID){
			var met_parallax_testimonials = $("#"+elID);
			if(met_parallax_testimonials.get(0)){
				met_parallax_testimonials.each(function(){
					var e = $(this);
					var s = e.bxSlider({
						mode: 'fade',
						slideMargin: 0,
						speed: 500,
						pager: false,
						controls: false,
						auto: true,
						pause: 4000,
						autoHover: true,
						minSlides: 1,
						maxSlides: 1,
						moveSlides: 1
					});
					e.parents('.dslc-modules-section').find('.met_testimonials_controls a:first-child').click(function(e){e.preventDefault();s.goToPrevSlide()});
					e.parents('.dslc-modules-section').find('.met_testimonials_controls a:last-child').click(function(e){e.preventDefault();s.goToNextSlide()});
				});
			}
		},

		// Retina
		retina: function(){
			if (window.devicePixelRatio > 1) {
				jQuery('[data-retina]').each(function(){
					if(jQuery(this).attr('data-retina') != ''){
						jQuery(this).attr('src', jQuery(this).attr('data-retina'));
					}
				});
			}
		},

		// Windmill Carousel Trigger
		windmillCarouselTrigger: function(elemID, textBox, autoPlay, autoPlayDirection){
			var entrance = 'BLL',
				exit     = 'TRU',
				head     = 'TR',
				body     = 'TL',
				foot     = 'BL';

			switch(textBox){
				case 'BR':break;
				case 'TL':
					entrance = 'BLL',
						exit     = 'TRR',
						head     = 'TR',
						body     = 'BR',
						foot     = 'BL';
					break;
				case 'TR':
					entrance = 'TLL',
						exit     = 'BRD',
						head     = 'BR',
						body     = 'BL',
						foot     = 'TL';
					break;
				case 'BL':
					entrance = 'TLL',
						exit     = 'BRD',
						head     = 'BR',
						body     = 'TR',
						foot     = 'TL';
					break;
			}

			var el = $('#'+elemID);
			el.imagesLoaded(function(){
				el.windmillCarousel({
					textBox: el.data('textcontentposition'),
					entrance: entrance,
					exit: exit,
					head: head,
					body: body,
					foot: foot,
					autoPlay: el.data('autoplaytime'),
					autoPlayDirection: el.data('autoplaydirection')
				});
			});
		},

		filterInBreadcrumb: function(isotopeID){
			var met_portfolio_filters_wrap = $('.'+isotopeID+'_filters_bind');
			if(met_portfolio_filters_wrap.get(0)){
				met_portfolio_filters_wrap.hover(function(){
					met_portfolio_filters_wrap.children('ul').hide().stop(true).slideDown();
				},function(){
					met_portfolio_filters_wrap.children('ul').stop(true).slideUp();
				});
			}
		},

		insertFilterInBreadcrumb: function(isotopeID, categories, place){
			var stack = categories.split('(split)'),
				parts = new Array(),
				html;

			for (var i = 0; i < stack.length; ++i) {
				parts[i] = stack[i].split('//');
			}

			if(place == 'on_breadcrumb'){
				html = '<div class="'+isotopeID+'_filters_bind '+isotopeID+'_filters met_portfolio_filters_wrap met_bgcolor"><span>'+parts[0][0]+'</span><i class="fa fa-caret-down"></i><ul class="met_clean_list met_bgcolor filters"><li><a href="#" class="activePortfolio" data-filter="'+parts[0][1]+'">'+parts[0][0]+'</a></li>';
				for (var i = 1; i < parts.length-1; ++i) {
					html += '<li><a href="#" data-filter=".'+parts[i][1]+'">'+parts[i][0]+'</a></li>';
				}
				html += '</ul></div>';
			}else{
				html = '<ul class="'+isotopeID+'_filters_bind '+isotopeID+'_filters met_filters clearfix"><li><a href="#" class="activePortfolio" data-filter="'+parts[0][1]+'">'+parts[0][0]+'</a></li>';
				for (var i = 1; i < parts.length-1; ++i) {
					html += '<li><a href="#" data-filter=".'+parts[i][1]+'">'+parts[i][0]+'</a></li>';
				}
				html += '</ul>';
			}

			var filterOnBreadCrumb = $('[class*="_filters_bind"]:not(.met_filters)');
			if(filterOnBreadCrumb.get(0)) filterOnBreadCrumb.remove();
			if(place == 'on_breadcrumb'){
				if($('.met_page_head').get(0)){
					$('.met_page_head h1').after(html);
					CoreJS.filterInBreadcrumb(isotopeID);
				}
			}else{
				$('#'+isotopeID).before(html);
			}

		},

		met_accordion: function(elID){
			$('#' + elID + ' .on .met_accordion_content').slideDown(400);
			$('#' + elID + ' .met_accordion_title').bind('click', function(e){
				e.preventDefault();
				var group = $(this).parents('.met_accordion_group'),
					accordion = $(this).parent(),
					active;

				if(!accordion.hasClass('on')){
					active = group.find('.on');
					active.removeClass('on');
					active.find('.met_accordion_content').slideUp(400);

					accordion.addClass('on');
					accordion.find('.met_accordion_content').slideDown(400);
				}else{
					accordion.removeClass('on');
					accordion.find('.met_accordion_content').slideUp(400);
				}
			});
		},

		avatar_testimonials: function(elID){
			var el = $('#'+elID),
				hovers = el.find('.met_testimonial_3_photos > div');

			testimonialHoverOver(hovers.first());

			hovers.hover(function(){
				var newHover = jQuery(this);
				if( !newHover.hasClass('hovered') ){
					var oldHover = el.find('.hovered');
					testimonialHoverOut(oldHover);
					testimonialHoverOver(newHover);
				}
			});

			function testimonialHoverOver(i){
				var id = i.index() + 1;

				i.addClass('hovered');
				i.parents('.met_testimonial_3_photos').next().children('div:nth-child('+id+')').stop().fadeIn(400);
			}

			function testimonialHoverOut(e){
				var id = e.index() + 1;

				e.removeClass('hovered');
				e.parents('.met_testimonial_3_photos').next().children('div:nth-child('+id+')').hide();
			}
		},

		setCountDown: function(elID,arr){
			var el = $("#"+elID);
			if(arr == null){
				var arr = new Array();
				arr['day']      = el.data('day'),
					arr['month']    = el.data('month'),
					arr['year']     = el.data('year'),
					arr['hour']     = el.data('hour'),
					arr['minute']   = el.data('minute'),
					arr['second']   = el.data('second');
			}
			el.countEverest({
				day: arr['day'],
				month: arr['month'],
				year: arr['year'],
				hour: arr['hour'],
				minute: arr['minute'],
				second: arr['second'],
				daysLabel: el.data('dayslabel'),
				dayLabel: el.data('daylabel'),
				hoursLabel: el.data('hourslabel'),
				hourLabel: el.data('hourlabel'),
				minutesLabel: el.data('minuteslabel'),
				minuteLabel: el.data('minutelabel'),
				secondsLabel: el.data('secondslabel'),
				secondLabel: el.data('secondlabel')

			});
		},

		pieChart: function(elID){
			var el = $('#'+elID);

			el.easyPieChart({
				lineWidth: el.data('linewidth'),
				size: el.data('size'),
				barColor: el.data('barcolor'),
				trackColor: el.data('trackcolor'),
				scaleColor: 'transparent',
				lineCap: 'square'
			});

			el.appear(function(){
				if(!el.hasClass('animated')){
					el.addClass('animated');
					el.data('easyPieChart').update(el.data('animatepercent'));

					if(el.find('.countTo').get(0)){
						el.find('.countTo').countTo();
					}
				}
			});
		},

		countTo: function(elID){
			var el = $('#' + elID);

			el.appear(function(){
				if(!el.hasClass('counted')){
					el.addClass('counted');
					el.find('.countTo').countTo();
				}
			});
		},

		appearThis: function(elID){
			var el = $('#'+elID);

			el.appear(function(){
				if(!el.hasClass('animated')){
					el.addClass('animated');
				}
			});
		},

		contactMap: function(elID, latLng, hiddenFirst,style_js_array){
			function HomeControl(controlDiv, map, center) {

				// Zoom Controls
				google.maps.event.addDomListener(zoomout, 'click', function() {
					var currentZoomLevel = map.getZoom();
					if(currentZoomLevel != 0){
						map.setZoom(currentZoomLevel - 1);}
				});

				google.maps.event.addDomListener(zoomin, 'click', function() {
					var currentZoomLevel = map.getZoom();
					if(currentZoomLevel != 21){
						map.setZoom(currentZoomLevel + 1);}
				});

				// Pan Controls
				google.maps.event.addDomListener(panup, 'click', function() {
					map.panBy(0,-150);
				});

				google.maps.event.addDomListener(panright, 'click', function() {
					map.panBy(150,0);
				});

				google.maps.event.addDomListener(panbottom, 'click', function() {
					map.panBy(0,150);
				});

				google.maps.event.addDomListener(panleft, 'click', function() {
					map.panBy(-150,0);
				});

				google.maps.event.addDomListener(pancenter, 'click', function() {
					map.panTo(center);
				});

			}
			function initialize() {

				var mapDiv = document.getElementById(elID);
				var myLatlng = markerLocations[0];
				var mapOptions = {
					zoom: $('#'+elID).data('zoom'),
					center: myLatlng,
					Marker: true,
					panControl: false,
					zoomControl: false,
					streetViewControl: false,
					overviewMapControl: false,
					mapTypeControl: false,
					scrollwheel: false,
					draggable: false,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					styles: style_js_array
				}

				map = new google.maps.Map(mapDiv, mapOptions);
				var homeControlDiv = document.createElement('div');
				var homeControl = new HomeControl(homeControlDiv, map, myLatlng);

				if(hiddenFirst != ''){
					google.maps.event.addListenerOnce(map, 'idle', function() {
						$('#'+elID).parent().slideUp(0);
					});
				}

				drop();

			}

			function drop() {
				for (var i = 1; i <= markerLocations.length; i++) {
					setTimeout(function() {
						addMarker();
					}, i * 500);
				}
			}

			function addMarker() {
				markers.push(new google.maps.Marker({
					position: markerLocations[iterator],
					map: map,
					draggable: false,
					//icon: 'img/map-marker.png',
					animation: google.maps.Animation.DROP
				}));
				iterator++;
			}

			if($('#'+elID).get(0)){
				var map;
				var markers = latLng.split(',');
				var iterator = 0;

				var markerLocations = [
					new google.maps.LatLng(markers[0], markers[1])
				];

				google.maps.event.addDomListener(window, 'load', initialize);

			}
		},

		sideNavbar: function(){
			function setSideNavbarHeight(){
				if($(window).width() < 1025) return false;
				var sideNavbarWrap = $('.met_side_navbar_wrap'),
					bodyHeight = $('body').height(),
					windowHeight = $(window).height();


				if(parseInt(sideNavbarWrap.attr('data-height')) != bodyHeight){
					var adminBar = $('#wpadminbar'),
						adminBarH = !adminBar.get(0) ? 0 : adminBar.height();

					bodyHeight = bodyHeight < windowHeight ? windowHeight - adminBarH : bodyHeight;

					sideNavbarWrap.attr('data-height', bodyHeight);
					sideNavbarWrap.css({
						top: adminBarH + 'px',
						height: bodyHeight + 'px'
					});
				}
			}


			$('.met_side_navbar .met_primary_nav li.menu-item.met_primary_nav_mega').each(function(){
				var ul = $(this).children('ul'),
					max_width = parseInt(ul.css('max-width')),
					calculated = ul.children('li').length * ul.children('li').outerWidth(),
					wrapWidth = calculated > max_width || ul.hasClass('mmm-sub-menu-is-full-width') ? max_width : calculated;

				ul.css('width', wrapWidth + 'px');
			});

			$('.met_side_navbar .met_primary_nav li.menu-item.met_primary_nav_posts').each(function(){
				var ul = $(this).children('ul'),
					max_width = parseInt(ul.css('max-width')),
					calculated = ul.children('li').length * ul.children('li').outerWidth(true) + parseInt( ul.children('li').css('margin-left') ),
					wrapWidth = calculated > max_width ? max_width : calculated;

				ul.css('width', wrapWidth + 'px');
			});

			$('.met_side_navbar .met_primary_nav li.menu-item.met_primary_nav_mega_posts').each(function(){
				var ul = $(this).children('ul'),
					max_width = parseInt(ul.css('max-width'));

				ul.css('width', max_width + 'px');
			});

			$(window).on('load', function(){setTimeout(setSideNavbarHeight, 250)});
			$(window).on('debouncedresize', setSideNavbarHeight);
		},

		// Internet Explorer Version Checker
		ie: function(){
			var undef,
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');

			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
					all[0]
				);

			return v > 4 ? v : undef;
		}



	};

	CoreJS.initialize();

})(jQuery);