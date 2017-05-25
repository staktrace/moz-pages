$.datepicker.regional['cs'] = {
	closeText: 'Zavřít',
	prevText: '&#x3c;Dříve',
	nextText: 'Později&#x3e;',
	currentText: 'Dnes',
	monthNames: ['Leden','Únor','Březen','Duben','Květen','Červen',
	'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
	monthNamesShort: ['led','úno','bře','dub','kvě','čer',
	'čvc','srp','zář','říj','lis','pro'],
	dayNames: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
	dayNamesShort: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
	dayNamesMin: ['Ne','Po','Út','St','Čt','Pá','So'],
	weekHeader: 'Týd',
	dateFormat: 'dd.mm.yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''
};
$.datepicker.setDefaults($.datepicker.regional['cs']);
$.datepicker.setDefaults({ showOtherMonths: true,firstDay:1,showButtonPanel:true });

$(document).ready(function(){


	$( ".datepicker" ).datepicker({
		showOn: "button",
		buttonImage: "/CeskaPosta-theme/images/cp/calendar.png",
		buttonImageOnly: true,
		buttonText: "Zvolte datum",
		dateFormat: 'dd. mm. yy'
	});



	/* nastylovany selectbox */
	$("select").selectBox({
		menuTransition:"slide",
		menuSpeed:"fast"
	});

	$("input:checkbox, input:radio, #page input:submit, #page input:text,  textarea").filter(function(index) {
    // Skip ones with the uniform-ignore class
    return ! $(this).hasClass('uniform-ignore');
    }).uniform();


	
	
	/* nastaveni slideru a nahodny prvni obrazek */
	if ($("#slider").size()) {
   var pocetBanneru=$('#slides > div').length;
  
		$('#slides')
		.after('<div id="slider-pager">');
		$('#slides')
		.cycle({
      speed:  'fast',
		  pager:  '#slider-pager',
			fx: "scrollHorz",
			duration: 800,
			timeout: 5000,
      startingSlide: Math.floor(Math.random()*pocetBanneru)

		});
	}


	$(".category a:last-child, .alphabet li:last-child a").addClass("last-child");
	$("h2.bckg,h2.bckg-alt").wrapInner("<span/>");

	/*	$(".tabs a").click(function(){         */
	/*		$(this).parents("ul").children("li").removeClass("active");         */
	/*		$(this).closest("li").addClass("active");           */
	/*		return false;             */
		/* });              */

	$(".print a").click(function(){
		window.print();
		return false;
	});

	$(".plus .toggle").hide();

	$(".plus h3").click(function(){
		$(this).next(".toggle").slideToggle();
		$(this).closest("li").toggleClass("minus");
	});

	$("#sidebar").append("<span class='sidebar-first'></span><span class='sidebar-last'></span>")
	$("#sidebar > ul > li:first-child").addClass("first");

  /*uprava obalovace pro img*/
  $('div.articleThumb').each(function() {
    var el_float = $(this).find('img').css('float');
    if ( el_float == 'left' ) {
      $(this).removeClass('rgt').addClass('lft');
    }
  });

});
