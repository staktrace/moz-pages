/**
 * flying roasters js file
 */

/* global FR: true, FRl10n */
(function($) {

  'use strict';

  window.FR = window.FR || {

    init: function() {
      // Workaround for http://www.kadencethemes.com/support-forums/topic/click-on-reviews-jumps-to-input-field-instead-reviews-listing/
      $('.woocommerce-product-rating').localScroll({offset: -200});

      // Um Casousel mit Links zu Seiten vs. Links für Bild-Popup besser auseinander halten zu können
      // Tooltip für Carousel mit Links: 1. Startseite, 2. Generell für alle Seiten (nicht Blog-Post)
      $('#home-custom-carousel')
        .find('.custom_carousel_item')
        .attr('title', FRl10n.more);
      $('body.page-template')
        .find('.kad_customcarousel_item')
        .find('.carousel_item')
        .attr('title', FRl10n.more);

      // Tooltip für Carousel mit Bildern
      $('.kad-wp-gallery')
        .find('.gallery_item')
        .attr('title', FRl10n.showPicture);

      // Make empty individual links in Mobile Menu collapse/expand
      // Empty a links do not toggle the collapse/expand, so trigger it manually
      $('.kad-mobile-nav')
        .find('.sf-dropdown')
        .find('a:not([href]), a[href="#"]')
        .click(function (event) {
          event.preventDefault();
          var $a = $(this);
          var $toggle = $a.nextAll('.collapse-next');
          $toggle.click();
        });

      if (FR.Helpers.isEnglish()) {
        this.englishNewsletter();
      }

    },

    englishNewsletter: function () {
      var $newsletter = $('.mc4wp-form');
      $newsletter.find('#mc4wp_email').attr('placeholder', 'Your email address');
      $newsletter.find('.fiveroasters-newsletter-submit').val('Subscribe to newsletter');
    }

  };

  $(document).ready( function() {
    FR.init();
    FR.Faq.init();
    FR.Versand.init();
    FR.Waitlist.init();
    FR.WhereToBuyMap.init();
    FR.ShopFilter.init();
  });

})(jQuery);


/* global FR: true */
(function($) {

  'use strict';

  window.FR = window.FR || {};

  window.FR.Faq = window.FR.Faq || {
    init: function() {
      var $faq = $('body.faq');
      var isFaq = $faq.length;
      var isKooperationen = $('body.kooperationen, body.cooperation').length;
      var $abo = $('body.postid-4997, body.postid-7852');
      var isAbo = $abo.length;
      var $headers = null;

      if (isFaq || isAbo || isKooperationen) {
        if (isFaq) {
          $headers = $faq.find('.entry-content h5');
          FR.Faq.initFaq($headers, true);
        } else if (isAbo) {
          $headers = $abo.find('.woocommerce-Tabs-panel--kad_custom_tab_01 h5');
          FR.Faq.initFaq($headers, false);
        } else if (isKooperationen) {
          $('h4[id]').hover(
            function() {
              $(this).find('.fr-anchor').fadeIn();
            },
            function() {
              $(this).find('.fr-anchor').fadeOut();
            }
          );
        }

        // need 1s delay until shrinked header is there
        setTimeout(FR.Faq.scrollToHash, 1000);
        $('.fr-anchor').click(function() {
          // some delay after the browser has already jumped to hash
          setTimeout(FR.Faq.scrollToHash, 100);
        });

      }
    },

    initFaq: function($headers, hasAnchor) {
      $headers.each(function() {
        // initially hide all answers, also add class for CSS styling
        $(this).nextUntil(':header').hide().addClass('fr-faq-answer');

        $(this).click(function(e){
          // only react if click on h5, not on permalink anchor
          if (e.target === this) {
            // close
            if($(this).hasClass('fr-faq-opened')) {
              FR.Faq.closeFaqItem($(this), hasAnchor);
            // open
            } else {
              // first close all other open answers
              $headers.not(this).each(function() {
                if ($(this).hasClass('fr-faq-opened')) {
                  FR.Faq.closeFaqItem($(this), hasAnchor);
                }
              });
              // show this answer
              FR.Faq.openFaqItem($(this), hasAnchor);
            }
          }
        });
      });

    },

    openFaqItem: function ($question, hasAnchor) {
      $question.nextUntil(':header').slideDown();
      $question.addClass('fr-faq-opened');
      if (hasAnchor) {
        $question.find('.fr-anchor').fadeIn();
      }
    },

    closeFaqItem: function ($question, hasAnchor) {
      $question.nextUntil(':header').slideUp();
      $question.removeClass('fr-faq-opened');
      if (hasAnchor) {
        $question.find('.fr-anchor').fadeOut();
      }
    },

    // Scrolle zum Anchor falls vorhanden
    scrollToHash: function () {
      // :target does not work with Chrome, do not know why
      // var $target = $(':target');
      var $target = $(window.location.hash);
      if ($target.length) {
        FR.Helpers.scrollToTarget($target);
        if ($('body.faq').length) {
          FR.Faq.openFaqItem($target);
        }
      }
    }

  };

})(jQuery);


(function($) {

  'use strict';

  window.FR = window.FR || {};

  window.FR.Helpers = window.FR.Helpers || {

    isEnglish: function () {
      if ($('html').attr('lang') === 'en') {
        return true;
      }
      return false;
    },

    // Scrolle zum target, falls vorhanden
    scrollToTarget: function ($target, duration) {
      var $wpadminbar = null;
      var $kadShrinkheader = null;
      var offset = {top: 0, left: 0};
      var headerOffset = 0;

      if (! duration) {
        duration = 0;
      }

      if ($target.length) {
        $wpadminbar = $('#wpadminbar');
        $kadShrinkheader = $('header.header-scrolled');

        offset = $target.offset();

        if ($kadShrinkheader.length) {
          headerOffset = $kadShrinkheader.height() + ($target.height() / 2);
        }

        // var headerOffset = 34 + 50 + ($target.height() / 2);
        if ($wpadminbar.length) {
          headerOffset = headerOffset + $wpadminbar.height();
        }
        // console.log("headerOffset: " + headerOffset + " offset.top: " + offset.top);

        var scrollto = offset.top - headerOffset;
        $('html, body').animate({scrollTop: scrollto}, duration);
      }
    },

    // Break points are: 480, 992, 768, 1200
    isSmall: function() {
      var width = $(window).width();
      return (width < 992);
    }

  };

})(jQuery);


(function ($) {

  'use strict';

  window.FR = window.FR || {};

  window.FR.ShopFilter = window.FR.ShopFilter || {

    init: function () {
      var _this = this;
      var isShop = $('body.post-type-archive-product').length;

      if (isShop) {
        this.actOnHashFilter(false);

        $(window).on('hashchange', function () {
          _this.actOnHashFilter(true);
        });
      }
    },

    actOnHashFilter: function (comesFromUserAction) {
      var hashFilter;
      var $filters;
      var $filter;

      hashFilter = this.getHashFilter();

      if (!hashFilter) {
        return;
      }

      $filters = $('#filters');
      $filter = $filters.find('[data-filter=".' + hashFilter + '"]');

      if ($filter.length) {
        $filter.click();
        if (comesFromUserAction) {
          this.closeOpenMobMenu();
        }
      }
    },

    closeOpenMobMenu: function () {
      var $hamburger = $('.mh-nav-trigger-case');
      // $mob hamburger does only have .collapsed if not opened
      var $hamburgerIsOpen = !$hamburger.hasClass('collapsed');
      if ($hamburgerIsOpen) {
        // close menu manually
        $hamburger.click();
      }
    },

    getHashFilter: function () {
      // get filter=filterName
      var matches = location.hash.match(/filter=([-\w]+)/i);
      var hashFilter = matches && matches[1];
      return hashFilter && decodeURIComponent(hashFilter);
    }


  };

})(jQuery);


/* global FR: true, FRl10n */
(function($) {

  'use strict';

  window.FR = window.FR || {};

  window.FR.Versand = window.FR.Versand || {

    // Diese Werte sind anpassbar
    // kostenloser Versand ab x Euro
    threshold: 90,

    // Die Differenz zw. Versandkostenfrei-Limit (90) und Warenwert
    // Muss unter dieser Grenze sein
    // also hier erst anzeigen, wenn nur noch weniger als 50 Euro (0-49,99) zum Erreichen von Versandkostenfrei fehlen
    // Soll kein Hinweis erscheinen wie "Es fehlen nur noch 72 Euro..."
    diffThreshold: 50,

    init: function() {
      var isWarenkorb = $('body.woocommerce-cart').length;
      var isKasse = $('body.woocommerce-checkout').length;

      if (isWarenkorb) {
        FR.Versand.addHints();
        $('body').on('updated_cart_totals', this.addHints);
      } else if (isKasse) {
        FR.Versand.addHints();
        $('body').on('updated_checkout', this.addHints);
      }
    },

    addHints: function() {
      var haveVersandBoxAlready = $('.fr_versand_box').length;
      if (haveVersandBoxAlready) {
        return;
      }

      var $selbstInput = $('input[id*="local_pickup"]');
      var $selbstHint = $('<div class="fr_versand_box fr_versand_box_selbstabholung">' +
                            FRl10n.pickupHint +
                          '</div>');

      var diff = FR.Versand.getWarenwertDiff();
      var diffLocalized;
      var $pauschaleInput;
      var $pauschaleHint;

      if (FR.Helpers.isEnglish()) {
        diffLocalized = diff.toString();
      } else {
        diffLocalized = diff.toString().replace('.', ',');
      }
      $pauschaleInput = $('input[id*="flat_rate"]');
      $pauschaleHint = $('<div class="fr_versand_box fr_versand_box_pauschale">' +
                                FRl10n.pauschaleHint.replace('{{AMOUNT_MISSING}}', diffLocalized) +
                              '</div>');

      if ($selbstInput.is(':checked')) {
        $selbstInput.next('label').after($selbstHint);
        // console.log("Versand: Add selbst");
        $selbstHint.show();
      } else if ($pauschaleInput.is(':checked') && diff > 0 && diff < FR.Versand.diffThreshold) {
        $pauschaleInput.next('label').after($pauschaleHint);
        // console.log("Versand: Add pauschale");
        $pauschaleHint.show();
      }

    },

    getWarenwertDiff: function() {
      // only first subtotal, 2nd could be recurring
      var $amount = $('.shop_table')
                      .find('.cart-subtotal')
                      .first()
                      .find('.woocommerce-Price-amount');
      var currencySymbol = $amount.find('.woocommerce-Price-currencySymbol').text();
      var text = '';
      var diff = 0;
      var warenwert = null;

      if ($amount.length) {
        text = $amount.text();
        text = $.trim(text);
        if (FR.Helpers.isEnglish()) {
          // €99.99
          text = text.replace(currencySymbol, '');
        } else {
          // 99,99 €
          text = text.split(' ')[0];
          text = text.replace(',', '.');
        }
        warenwert = parseFloat(text);
        diff = FR.Versand.threshold - warenwert;
      }

      if (!FR.Versand.isWholeNumber(diff)) {
        return diff.toFixed(2);
      }
      return diff;
    },

    isWholeNumber: function(n){
      return Number(n) === n && n % 1 === 0;
    }

  };

})(jQuery);


/* global _: true */
(function($) {

  'use strict';

  window.FR = window.FR || {};

  window.FR.Waitlist = window.FR.Waitlist || {
    init: function() {
      var isProduct = $('body.single-product').length;
      var $summary;
      var $variationForm;
      var $waitlistForm;
      var $outOfStock;
      var $variantKey;
      var $variantVal;

      if (isProduct) {
        $summary = $('.summary');
        $variationForm = $summary.find('.variations_form');
        $waitlistForm = $summary.find('.fr-waitlist-form');
        $outOfStock = $summary.find('.out-of-stock');

        $variantKey = $waitlistForm.find('#fr_variant_key');
        $variantVal = $waitlistForm.find('#fr_variant_val');

        // by default hidden: When comes loaded with out-of-stock message, then show
        // Done for all products: simple and variable
        if ($outOfStock.length) {
          $waitlistForm.show();
        }

        // 'hide_variation' is not handle because a variation selection cannot be reset at FR
        $variationForm.on('show_variation', function(event, variation) {
          var kadName = '.single_variation_wrap';
          var outName = 'fr-variation-outofstock';
          if (variation.is_in_stock) {
            $waitlistForm.hide();
            $variationForm.find(kadName).removeClass(outName);
          } else {
            // update hidden input data about variation
            if (variation.attributes && _.isObject(variation.attributes)) {
              // Only handle first occurence, only one level of variations
              // Cannot break out of each loop, so we use counter
              var cnt = 0;
              _.each(variation.attributes, function(val, key) {
                if (cnt === 0) {
                  $variantKey.val(key);
                  $variantVal.val(val);
                }
                cnt = cnt + 1;
              });
            }
            $waitlistForm.show();
            $variationForm.find(kadName).addClass(outName);
          }
        });
      }
    }
  };
})(jQuery);


/* global FR: true */
/* global google: true */
/* global FRl10n */
(function($) {

  'use strict';

  window.FR = window.FR || {};

  window.FR.WhereToBuyMap = window.FR.WhereToBuyMap || {

    init: function() {
      var _this = this;

      var $window = $(window);
      var lastWidth = $window.width();

      var $container = $('.entry-content > .row');
      var $cols = $container.children('.col-md-6');

      var $left = $cols.first();
      var $right = $cols.last();

      var $map = $left.find('#fr-where-to-buy-map');

      var $locs = $right.find('.fr-location');

      if (($locs.length === 0)) {
        return;
      }

      $locs.find('img').attr('title', FRl10n.showPicture);

      // need delay until shrinked header is there
      setTimeout(function() {
        _this.checkPosition($map, $left);
      }, 4000);

      this.initMap($map, $locs);

      $window.scroll(function() {
        _this.checkPosition($map, $left);
      });

      // On Mobile the address bar is hidden and shown very often,
      // hence we only check for width here
      $window.resize(function() {
        var curW = $window.width();
        if (curW !== lastWidth) {
          _this.checkPosition($map, $left);
          lastWidth = curW;
        }
      });
    },

    getShrinkHeaderHeight: function() {
      var height = 0;
      var $wpadminbar = $('#wpadminbar');
      var $kadShrinkheader = $('header.header-scrolled');

      if ($kadShrinkheader.length) {
        height = $kadShrinkheader.height();
      }

      if ($wpadminbar.length) {
        height = height + $wpadminbar.height();
      }

      return height;
    },


    positionMode: '',

    checkPosition: function($map, $left) {
      var headerHeight;
      var mapTop;
      var threshold;
      var scrollTop;

      if (FR.Helpers.isSmall()) {
        $map.css('position', 'relative');
        $map.css('top', '');
        return;
      }

      headerHeight = this.getShrinkHeaderHeight();

      // distance map is the left container top plus margin-top of the map
      mapTop = $left.offset().top;
      scrollTop = $(window).scrollTop();

      threshold = mapTop - headerHeight;

      // console.log('scrollTop: ' + scrollTop + ' threshold: ' + threshold);

      if (scrollTop > threshold) {
        if (this.positionMode !== 'isFixed') {
          $map.css('position', 'fixed');
          $map.css('top', headerHeight + 'px');
          // if header not loaded yet, then do not exclude future loops yet
          if (headerHeight !== 0) {
            this.positionMode = 'isFixed';
          }
          // console.log('Set fixed: ' + headerHeight);
        }
      } else {
        if (this.positionMode !== 'isRelative') {
          $map.css('position', 'relative');
          $map.css('top', '');
          this.positionMode = 'isRelative';
          // console.log('Set relative');
        }
      }
    },


    initMap: function($map, $locs) {
      var map = new google.maps.Map($map[0], {streetViewControl: false});
      var bounds = new google.maps.LatLngBounds();
      var infowindow = new google.maps.InfoWindow();

      $locs.each(function (idx, loc) {
        var $loc = $(loc);
        var lat = parseFloat($loc.attr('data-lat'));
        var lon = parseFloat($loc.attr('data-lon'));
        var name = $loc.find('.fr-name').text();
        var $showOnMap = $loc.find('.fr-show-on-map');

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lon),
          title: name,
          map: map
        });

        bounds.extend(marker.position);

        google.maps.event.addListener(marker, 'click', (function(marker, $loc) {
          return function() {
            // deep cloning always opens the same image in magifier, hence we reinit here
            var $html = $loc.clone();
            $html.find('a[data-rel^=\'lightbox\']').magnificPopup({type:'image'});

            $loc.addClass('fr-active');
            infowindow.setContent($html[0]);
            infowindow.open(map, marker);
          };
        })(marker, $loc));

        google.maps.event.addListener(infowindow, 'closeclick', function(){
          $loc.removeClass('fr-active');
        });

        $showOnMap.click(function() {
          $locs.removeClass('fr-active');
          if (FR.Helpers.isSmall()) {
            FR.Helpers.scrollToTarget($map, 400);
          }
          google.maps.event.trigger(marker, 'click');
        });

        $loc.hover(
          function() {
            $(this).addClass('fr-hover');
          },
          function() {
            $(this).removeClass('fr-hover');
          }
        );

      });

      google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        var zoom = this.getZoom();
        this.setZoom(zoom - 1);
      });

      map.fitBounds(bounds);

    }

  };

})(jQuery);

