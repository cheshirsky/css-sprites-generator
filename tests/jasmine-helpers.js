/**
 * breafly created tests helper.
 * it is created to avoid extra code whilte tests writing.
 */

var fs = require('fs');
var path = require('path');

module.exports = (function() {
	'use strict';

	var defaults = {
		"title": "Test title",
		"fixturesBaseDir": path.join(__dirname, "fixtures")
	};

	function getFixtures(path) {
		var result = {};
		try {
			result = JSON.parse(fs.readFileSync(path));
		} catch (e) {
			console.log("Error while fixtures parsing:", e);
		}
		return result;
	}

	function getFixturesPath(name) {
		return path.join(defaults.fixturesBaseDir, name + ".js");
	}

	/*
	 * @function createDescription
	 * It returns Jasmine description based on passed manifest
	 *
	 * @param {Object} manifest - set of parameters for test initialization
	 *
	 * @param {String} manifest.name (required) - manifest name which is used to creating
	 *
	 * @param {String} manifest.title - string which is used to be a test base name
	 *
	 * @param {String} manifest.fixturesFilePath - path to get fixtures file, default path
	 * is used to be created from manifest.name
	 * 
	 * @param {Object} manifest.suites - set of sync test functions (via jasmine it). Each
	 * of them has 1 parameter - {Object} fixtures.
	 *
	 * @example
	 * manifest.suites = {
	 *		'test1': function(fixtures) {
	 *			expect(myProcessing(fixture)).toBe(fixtures.out);
	 *		}	
	 * }
	 *
	 * @returns result of Jasmine.describe function call.
	 */
	function createDescription(manifest) {
		if (!manifest.name || !manifest.name.length) {
			throw "Error: manifest name is empty";
		}

		var suites = manifest.suites || {};
		var title = manifest.title || title;
		var fixturesPath = manifest.fixturesFilePath ? manifest.fixturesFilePath : getFixturesPath(manifest.name);

		return describe(title, function() {
			var fixtures = getFixtures(fixturesPath);
			Object.keys(suites).forEach(function(name) {
				it(name, function(done) {
					suites[name](fixtures[name] ? fixtures[name] : fixtures);
					done();
				});
			});
		});
	}

	return {
		'createDescription': createDescription
	};
})();
