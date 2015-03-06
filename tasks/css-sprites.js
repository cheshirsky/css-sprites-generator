var path = require('path');
var Parser = require('../lib/parse-helpers');
var SpriteGenerator = require('../lib/sprite-generator');
var Utils = require('../lib/utils');

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

	function collectDefinitions(files) {
		var definitions = {};
		files.forEach(function(file) {
			Utils.extend(true, definitions, Parser.extractDefinitions(file.data));
		});
		return definitions;
	}

	function collectReferences(definitions, files) {
		var refs = {};
		files.forEach(function(file) {
			Utils.extend(true, refs, Parser.extractReferenses(definitions, file));
		});
		return refs;
	}

	function createSpritesMap() {
		var definitions = collectDefinitions(files);
		return collectReferences(definitions, files);
	}

	function generateSprites(sprites, tasks, done) {
		Utils.sequentialCall(tasks, function() {
			grunt.log.ok(Object.keys(sprites).length, 'sprites were created');
			done();
		});
	}

	function getFileByPath(filePath) {
		var result;
		if (!files || !files.length || !filePath || !filePath.length) {
			return;
		}
		files.forEach(function(file) {
			if (filePath === file.path) {
				result = file;
				return false;
			}
		});
		return result;
	}

	function replaceSpriteReference(options, spriteObj) {
		spriteObj.files.forEach(function(file) {
			var processedCssFile = Parser.processCssFile(getFileByPath(file), spriteObj.css);
			Utils.writeFileSync(
				processedCssFile.path.replace(options.stylesSrc, options.stylesDest),
				processedCssFile.data
			);
		});
	}

	function spritesDebugInfo(sprites) {
		grunt.log.debug("Sprites data:");
		grunt.log.debug(JSON.stringify(sprites, null, 2));
	}

	function validateSpriteObject(sprite, name) {
		if (!sprite.files || !sprite.files.length) {
			return "Empty sprite: " + name;
		} else if (!sprite.spriteImage) {
			return "No refered image at sprite: " + name;
		}
		return;
	}

	function cretateSprites(sprites, options, done) {
		if (typeof sprites !== 'object') {
			grunt.log.errorlns("Incorrect sprites data.");
			return;
		}
		var tasks = [];
		Object.keys(sprites).forEach(function(name) {
			var validationError = validateSpriteObject(sprites[name], name);
			if (validationError) {
				grunt.log.errorlns(validationError);
				return true;
			}
			sprites[name].files = Utils.removeDuplicates(sprites[name].files);
			sprites[name].spritePath = path.join(options.imagesDest, sprites[name].spriteImage);
			tasks.push(function(next) {
				SpriteGenerator.createSprite(options, sprites[name], function(err, result) {
					if (err) {
						grunt.log.errorlns(err + " [" + name + "]\r\n");
					} else {
						replaceSpriteReference(options, result);
					}
					next();
				});
			});
		});
		spritesDebugInfo(sprites);
		generateSprites(sprites, tasks, done);
	}

	grunt.registerMultiTask('cssSprites', 'generates images sprites', function() {
		var done = this.async();
		var options = this.options(defaultOptions);
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
			cretateSprites(createSpritesMap(), options, done);
		});
	});
};