const { JSDOM } = require('jsdom');

async function crawlerPage(baseURL) {
	try {
		const response = await fetch(baseURL);
		if (response.status >= 400) {
			console.log(`An error occurred, status code: ${response.status}`);
			return;
		}

		if (!response.headers.get('content-type').includes('text/html')) {
			console.log('An error occured');
			return;
		}
		const data = await response.text();
		console.log(await data);
	} catch (error) {
		console.log(error.message);
	}
}

function getURLsFromHTML(htmlBody, baseURL) {
	const dom = new JSDOM(htmlBody, { url: 'http://localhost/' });
	const tags = dom.window.document.querySelectorAll('a');
	const hrefs = extractHrefs(tags);
	return hrefs.map((href) => {
		if (href.includes(baseURL)) {
			return baseURL.length === href.length ? `${href}/` : href;
		}
		if (href[0] !== '/') {
			return;
		}
		return `${baseURL}${href}`;
	});
}

function normalizeURL(url) {
	if (url === undefined) {
		throw new Error('Invalid URL');
	}

	if (url[url.length - 1] === '/') {
		url = url.slice(0, -1);
	}
	const urlObj = new URL(url);
	const normalizedUrl = `${urlObj.host}${urlObj.pathname}`.toLowerCase();
	return normalizedUrl;
}

function extractHrefs(nodeListTTags) {
	return Array.from(nodeListTTags)?.map((tag) => tag.getAttribute('href'));
}

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlerPage,
};
