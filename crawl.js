const { JSDOM } = require('jsdom');

async function crawlerPage(baseURL, currentURL, pages) {
	if (!isSameDomain(baseURL, currentURL)) {
		return pages;
	}

	const normalizedCurrentURL = normalizeURL(currentURL);

	if (pages?.normalizedCurrentURL !== undefined) {
		return { ...pages, normalizedCurrentURL: pages.normalizedCurrentURL + 1 };
	}

	console.log(`crawling ${normalizedCurrentURL}`);
	let data = '';
	try {
		const response = await fetch(`https://${normalizedCurrentURL}`);

		if (response.status >= 400) {
			console.log(`An error occurred, status code: ${response.status}`);
			return pages;
		}

		if (!response.headers.get('content-type').includes('text/html')) {
			console.log('An error occured');
			return pages;
		}

		data = await response.text();
	} catch (error) {
		console.log(error.message);
	}

	const URLs = getURLsFromHTML(data, baseURL);
	pages = URLs.forEach((url) => crawlerPage(baseURL, url, pages));
	return pages;
}

function isSameDomain(baseURL, currentURL) {
	try {
		const baseURLObj = new URL(baseURL);
		const currentURLObj = new URL(currentURL);
		return baseURLObj.hostname === currentURLObj.hostname;
	} catch (error) {
		return false;
	}
}

function getURLsFromHTML(htmlBody, baseURL) {
	const dom = new JSDOM(htmlBody, { url: 'http://localhost/' });
	const aTags = dom.window.document.querySelectorAll('a');
	const hrefs = extractHrefs(aTags);
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
