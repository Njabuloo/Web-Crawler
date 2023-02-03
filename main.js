const { crawlerPage } = require('./crawl');

const main = () => {
	if (process.argv.length !== 3) {
		console.log('Expected one argument!');
		process.exit(1);
	}

	const baseURL = process.argv[2];
	console.log(`The crawler is starting at ${baseURL}`);
	crawlerPage(baseURL, baseURL, {});
};

main();
