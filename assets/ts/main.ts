import mermaid from 'mermaid';
mermaid.initialize({
	startOnLoad: false,
	securityLevel: 'loose',
	theme: 'dark',
	themeCSS: '.edgeLabel { background-color: #181818; }'
});

mermaid.run({
	querySelector: 'code.language-mermaid'
})

// clickable permalink icons for headers
const main = document.querySelector('main');
if (main) {
	document.querySelectorAll('h2, h3, h4, h5, h6')
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
