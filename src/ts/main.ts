// clickable permalink icons for headers
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
