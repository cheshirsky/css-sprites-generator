var JasmineHelpers = require('../jasmine-helpers');
var assert = require('assert');
var Parser = require('../../lib/parse-helpers');

JasmineHelpers.createDescription({
	'name': "parser",
	'description': "Parser tests",
	'suites': {
		'common': function() {
			expect(Parser).toBeDefined();
			expect(Parser).toEqual(jasmine.any(Object));
		},

		'extractDefinitions': function(fixtures) {
			expect(Parser.extractDefinitions).toBeDefined();
			if (!fixtures || !fixtures.length) {
				assert(false, "Incorrect fixtures. Please check it.");
			}
			fixtures.forEach(function(fixture) {
				expect(Parser.extractDefinitions(fixture.input)).toEqual(fixture.expected);
			});
		},

		'extractReferenses': function(fixtures) {
			expect(Parser.extractReferenses).toBeDefined();
			expect(Parser.extractReferenses(null, null)).toBeNull();
			// checking empty definition
			var error;
			var emptyFixture = fixtures.shift();
			try {
				Parser.extractReferenses({}, emptyFixture.input);
			} catch(e) {
				error = e;
			}
			expect(error).toBeDefined();
			// checking regular refs
			fixtures.forEach(function(fixture) {
				expect(Parser.extractReferenses(fixture.defs, fixture.input)).toEqual(fixture.expected);
			});
		},

		'extractURL': function(fixtures) {
			expect(Parser.extractURL).toBeDefined();
			fixtures.forEach(function(fixture) {
				expect(Parser.extractURL(fixture.input)).toEqual(fixture.expected);
			});
		},

		'isUrl': function(fixtures) {
			expect(Parser.extractURL).toBeDefined();
			expect(Parser.isUrl).toBeDefined();

			fixtures.extractURL.forEach(function(fixture) {
				expect(Parser.isUrl(fixture.input)).toEqual(fixture.isUrl);
			});
		}
	}
});