const { describe, test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('../crawl.js');

describe('crawl module', () => {
	test('only return the section after the //', () => {
		const url = 'http://wagslane.dev/path';
		const expectedUrl = 'wagslane.dev/path';
		expect(normalizeURL(url)).toEqual(expectedUrl);
	});

	test('removes the / if it is follwed by nothing', () => {
		const url = 'https://wagslane.dev/path/';
		const expectedUrl = 'wagslane.dev/path';
		expect(normalizeURL(url)).toEqual(expectedUrl);
	});

	test('all letters are in small caps', () => {
		const url = 'https://wagsLane.Dev/path';
		const expectedUrl = 'wagslane.dev/path';
		expect(normalizeURL(url)).toEqual(expectedUrl);
	});
});

describe('get urls from HTLM method', () => {
	test('absolute', () => {
		const inputBaseURL = 'http://wagslane.dev';
		const inputHTMLBody =
			'<html><body><a href="http://wagslane.dev"><span>Boot.dev></span></a></body></html>';
		const expectedTags = ['http://wagslane.dev/'];
		const actualTags = getURLsFromHTML(inputHTMLBody, inputBaseURL);
		expect(actualTags).toEqual(expectedTags);
	});

	test('relative', () => {
		const inputBaseURL = 'http://wagslane.dev';
		const inputHTMLBody =
			'<html><body><a href="/path"><span>Boot.dev></span></a></body></html>';
		const expectedTags = ['http://wagslane.dev/path'];
		const actualTags = getURLsFromHTML(inputHTMLBody, inputBaseURL);
		expect(actualTags).toEqual(expectedTags);
	});

	test('both', () => {
		const inputBaseURL = 'http://wagslane.dev';
		const inputHTMLBody =
			'<html><body><a href="/path"><span>Boot.dev></span></a><a href="http://wagslane.dev/path"><span>Boot.dev></span></a></body></html>';
		const expectedTags = [
			'http://wagslane.dev/path',
			'http://wagslane.dev/path',
		];
		const actualTags = getURLsFromHTML(inputHTMLBody, inputBaseURL);
		expect(actualTags).toEqual(expectedTags);
	});

	test('error handling', () => {
		const inputBaseURL = 'http://wagslane.dev';
		const inputHTMLBody =
			'<html><body><a href="path/a"><span>Boot.dev></span></a></body></html>';
		const expectedTags = [];
		const actualTags = getURLsFromHTML(inputHTMLBody, inputBaseURL);
		expect(actualTags).toEqual(expectedTags);
	});
});
