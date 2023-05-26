// document.querySelectorAll('.has-sub-menu > a span.mark').forEach(e => {
// 	e.addEventListener('click', (e) => {
// 		$( this ).parent().siblings( 'ul' ).slideToggle( 'fast', 'swing', function() {
// 			var text = '';
// 			if ( $( this ).is(':visible') ) {
// 				text = '-';
// 			}
// 			else {
// 				text = '+';
// 			}
// 			$( this ).siblings('a').children( 'span.mark' ).text( text );
// 		});
// 		e.preventDefault();
// 	});
// });

const main = document.querySelector('main');
if (main) {
	document.querySelectorAll('h1, h2, h3, h4, h5, h6')
		.forEach((element: Element): void => {
			if (element.id) {
				const headerlink = document.createElement('a');
				headerlink.setAttribute('class', 'headerlink');
				headerlink.setAttribute('href', '#' + element.id);
				headerlink.setAttribute('title', 'Permalink');

				const icon = document.createElement('i');
				icon.setAttribute('class', 'fas fa-hashtag');
				icon.setAttribute('aria-hidden', 'true');

				headerlink.append(icon);

				element.append(headerlink);
			}
	});
}
