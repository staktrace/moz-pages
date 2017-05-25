// vypnute protoze to nejak zlobi
//$(document).ready(function() {
  hs.graphicsDir = '/CeskaPosta-theme/images/highslide/';
	hs.align = 'center';
	hs.transitions = ['expand', 'crossfade'];
	hs.outlineType = 'rounded-white';
	hs.fadeInOut = true;
	hs.headingEval = 'this.thumb.title';
	hs.dragByHeading = false;
	hs.showCredits = false;
	hs.lang.number = '%1/%2';
	hs.captionId = 'the-caption';

hs.onSetClickEvent = function ( sender, e ) {
  // set the onclick for the element
  if (e.type == 'image') {e.element.onclick = function () {
  	return hs.expand(this, { slideshowGroup: 'fotoslide', numberPosition: 'heading'} );
  	}
  }
  else if (e.type == 'swf') {e.element.onclick = function (){
         return hs.htmlExpand(this, {
         objectType: 'swf',
         slideshowGroup: 'videoslide',
         wrapperClassName: 'controls-in-heading',
         preserveContent: false,
         swfOptions: {
            version: '8',
            params: {allowscriptaccess: 'always', allowfullscreen: 'true', wmode: 'transparent'}
         },
		     width: 640,
         objectWidth: 640,
         objectHeight: 500,
         maincontentText: 'Pro zobrazení videa potřebujete Flash'} )
      }
  	}
  // return false to prevent the onclick being set once again
  return false;
};

	// Add the controlbar
	if (hs.addSlideshow) hs.addSlideshow({
		slideshowGroup: 'fotoslide',
		interval: 5000,
		repeat: false,
		useControls: true,
		fixedControls: 'fit',
		overlayOptions: {
			opacity: 1,
			position: 'bottom center',
			hideOnMouseOut: true
		}
	});

	if (hs.addSlideshow) hs.addSlideshow({
		slideshowGroup: 'videoslide',
		interval: 5000,
		repeat: false,
		useControls: true,
		fixedControls: false,
		overlayOptions: {
			opacity: 1,
			position: 'top right',
			hideOnMouseOut: false
		}
	});
//});
