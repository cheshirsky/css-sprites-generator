//TODO: check for situation referenced sprite not found
//TODO: normalize options

var path = require('path');
var Parser = require('../lib/parse-helpers');
var SpriteGenerator = require('../lib/sprite-generator');
var Utils = require('../lib/utils');

module.exports = function(grunt) {
	'use strict';

	grunt.file.defaultEncoding = 'utf8';
	var files = [];
	var defaultOptions = {
		'out': './sprites',
		'imagesBase': './',
		'algorithm': 'top-down'
	};

	var collectDefinitions = function(files) {
		var definitions = {};
		files.forEach(function(file) {
			Utils.extend(true, definitions, Parser.extractDefinitions(file.data));
		});
		return definitions;
	};

	var collectReferences = function(definitions, files) {
		var refs = {};
		files.forEach(function(file) {
			Utils.extend(true, refs, Parser.extractReferences(definitions, file));
		});
		return refs;
	};

	var cretateSprites = function(sprites, options, done) {
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
			normalizeImagesPath(sprites[name].images, options.imagesBase);
			sprites[name].spriteImage = path.join('./', sprites[name].spriteImage);
			tasks.push(function(next) {
				SpriteGenerator.createSprite(options, sprites[name], function(err, result) {
					if (err) {
						grunt.log.errorlns(err + " [" + name + "]\r\n");
					} else {
						replaceSpriteReference(result);
					}
					next();
				});
			});
		});
		spritesDebugInfo(sprites);
		generateSprites(sprites, tasks, done);
	};

	var createSpritesMap = function() {
		var definitions = collectDefinitions(files);
		return collectReferences(definitions, files);
	};

	var generateSprites = function(sprites, tasks, done) {
		Utils.sequentialCall(tasks, function() {
			grunt.log.ok(Object.keys(sprites).length, 'sprites were created');
			done();
		});
	};

	var getFileByPath = function(filePath) {
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
	};

	var normalizeImagesPath = function(data, basePath) {
		data.map(function(image, index, images) {
			images[index] = path.join(basePath, image);
		});
	};

	var replaceSpriteReference = function(spriteObj) {
		spriteObj.files.forEach(function(file) {
			var processedCssFile = Parser.processCssFile(getFileByPath(file), spriteObj.css);
			Utils.writeFileSync(processedCssFile.path, processedCssFile.data);
		});
	};

	var spritesDebugInfo = function(sprites) {
		grunt.log.debug("Sprites data:");
		grunt.log.debug(JSON.stringify(sprites, null, 2));
	};

	var validateSpriteObject = function(sprite, name) {
		if (!sprite.files || !sprite.files.length) {
			return "Empty sprite: " + name;
		} else if (!sprite.spriteImage) {
			return "No refered image at sprite: " + name;
		}
		return;
	};

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