var CssSprites = require('../lib/index');

module.exports = function(grunt) {
	'use strict';

	var files = [];
	var defaultOptions = {
		'styleSrc': './css',
		'stylesDest': 'sprites-css',
		'imagesSrc': './img',
		'algorithm': 'top-down',
		'imagesDest': 'sprites'
	};

	function spritesDebugInfo(sprites) {
		grunt.log.debug("Sprites data:");
		grunt.log.debug(JSON.stringify(sprites, null, 2));
	}

	grunt.registerMultiTask('cssSprites', 'generates images sprites', function() {
		var done = this.async();
		var options = this.options(defaultOptions);
		var cssSprites = new CssSprites(options, done);

		this.files.forEach(function(file) {
			var cssFiles = file.src.filter(function(filepath) {
				return grunt.file.exists(filepath);
			});
			if(!cssFiles.length)  {
				grunt.log.errorlns("Nothing to process!");
				done();
			}
			cssFiles.map(function(cssFilePath) {
				files.push({'path': cssFilePath, 'data': grunt.file.read(cssFilePath)});
			});
			var map = cssSprites.createSpritesMap(files);
			spritesDebugInfo(map);
			cssSprites.cretateFromMap(map, function(err) {
				grunt.log.debug(err);
			});
		});
	});
};