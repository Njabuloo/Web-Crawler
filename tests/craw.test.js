const { describe, test, expect } = require('@jest/globals');
const { normalizedURL } = require('../crawl');

describe('crawl module', () => {
	test('only return the section after the //', () => {
		const url = 'http://wagslane.dev/path';
		const expectedUrl = 'wagslane.dev/path';
		expect(normalizedURL(url)).to.equal(expectedUrl);
	});

	test('removes the / if it is follwed by nothing', () => {
		const url = 'https://wagslane.dev/path/';
		const expectedUrl = 'wagslane.dev/path';
		expect(normalizedURL(url)).to.equal(expectedUrl);
	});

	test('all letters are in small caps', () => {
		const url = 'https://wagsLane.Dev/path';
		const expectedUrl = 'wagslane.dev/path';
		expect(normalizedURL(url)).to.equal(expectedUrl);
	});
});
