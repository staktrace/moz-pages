function showLoadingBar(){
	var readyStateTimer;
	readyStateTimer = setInterval(function(){
		var readyState = document.readyState;

		if(document.getElementById("met_page_loading_bar")!=null){
			var e = document.getElementById('met_page_loading_bar');
			switch(readyState){
				case 'uninitialized':
					if(!e.classList.contains('uninitialized')) e.className += ' uninitialized';
					break;
				case 'loading':
					if(!e.classList.contains('loading')) e.className += ' loading';
					break;
				case 'interactive':
					if(!e.classList.contains('interactive')) e.className += ' interactive';
					break;
				case 'complete':
					if(!e.classList.contains('complete')) e.className += ' complete';

					setTimeout(function(){
						e.className += ' loaded';
					},700);

					clearInterval(readyStateTimer);
					break;
				default:
				case 'uninitialized':
					if(!e.classList.contains('uninitialized')) e.className += ' uninitialized';
					break;
					clearTimeout(readyStateTimer);
			}
		}
	},100);
}
if( document.getElementById('LTEIE9') == null ) showLoadingBar();
