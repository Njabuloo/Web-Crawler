const normalizeURL = (url) => {
	if (url[url.length - 1] === '/') {
		url = url.slice(0, -1);
	}
	const urlObj = new URL(url);
	const normalizedUrl = `${urlObj.host}${urlObj.pathname}`.toLowerCase();
	return normalizedUrl;
};

module.exports = {
	normalizeURL,
};
