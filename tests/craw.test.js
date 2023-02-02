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
		const baseURL = 'http://wagslane.dev';
		const htmlBody =
			'<html><body><a href="http://wagslane.dev"><span>Boot.dev></span></a></body></html>';
		const expectedTags = ['http://wagslane.dev/'];
		expect(getURLsFromHTML(baseURL, htmlBody)).toEqual(expectedTags);
	});

	test('relative', () => {
		const baseURL = 'http://wagslane.dev';
		const htmlBody =
			'<html><body><a href="/path"><span>Boot.dev></span></a></body></html>';
		const expectedTags = ['http://wagslane.dev/path'];
		expect(getURLsFromHTML(baseURL, htmlBody)).toEqual(expectedTags);
	});

	test('both', () => {
		const baseURL = 'http://wagslane.dev';
		const htmlBody =
			'<html><body><a href="/path"><span>Boot.dev></span></a><a href="http://wagslane.dev/path"><span>Boot.dev></span></a></body></html>';
		const expectedTags = [
			'http://wagslane.dev/path',
			'http://wagslane.dev/path',
		];
		expect(getURLsFromHTML(baseURL, htmlBody)).toEqual(expectedTags);
	});

	test('error handling', () => {
		const baseURL = 'http://wagslane.dev';
		const htmlBody =
			'<html><body><a href="/path"><span>Boot.dev></span></a><a href="http://wagslane.dev"><span>Boot.dev></span></a></body></html>';
		const expectedTags = [];
		expect(getURLsFromHTML(baseURL, htmlBody)).toEqual(expectedTags);
	});
});
