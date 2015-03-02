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
				console.log('Testing: ',  fixture.input);
				expect(Parser.extractDefinitions(fixture.input)).toEqual(fixture.expected);
			});
		},

		'extractReferences': function(fixtures) {
			expect(Parser.extractReferences).toBeDefined();
		},

		'extractURL': function(fixtures) {
			expect(Parser.extractURL).toBeDefined();
		},

		'isUrl': function(fixtures) {
			expect(Parser.isUrl).toBeDefined();
		},

		'processCssFile': function(fixtures) {
			expect(Parser.processCssFile).toBeDefined();
		}
	}
});