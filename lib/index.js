//TODO: check for situation referenced sprite not found
//TODO: normalize options

var path = require('path');
var Parser = require('./parse-helpers');
var SpriteGenerator = require('./sprite-generator');
var Utils = require('./utils');

module.exports = (function() {
	'use strict';

	var defaultOptions = {
		'styleSrc': './css',
		'stylesDest': 'sprites-css',
		'imagesSrc': './img',
		'algorithm': 'top-down',
		'imagesDest': 'sprites'
	};

	var CssSprites = function(options, cb) {
		this.options = Utils.extend(true, {}, defaultOptions, options);
		this.onComplete = cb || function() {};
		this.files = [];
	};

	CssSprites.prototype.createSpritesMap = function(files) {
		this.files = files && files.length ? files : [];
		this.collectDefinitions();
		return this.collectReferences();
	};

	CssSprites.prototype.createFromMap = function(sprites, printError) {
		var options = this.options;
		var done = this.onComplete;
		var self = this;
		var tasks = [];
		printError = typeof printError === "function" ? printError : function(e) {
			console.log(e);
		};

		if (typeof sprites !== 'object') {
			printError("Incorrect sprites data.");
			return;
		}
		
		Object.keys(sprites).forEach(function(name) {
			var validationError = self.validateSpriteObject(sprites[name], name);
			if (validationError) {
				printError(validationError);
				return true;
			}
			sprites[name].files = Utils.removeDuplicates(sprites[name].files);
			sprites[name].spritePath = path.join(options.imagesDest, sprites[name].spriteImage);
			tasks.push(function(next) {
				SpriteGenerator.createSprite(options, sprites[name], function(err, result) {
					if (err) {
						printError(err + " [" + name + "]\r\n");
					} else {
						self.replaceSpriteReference(result);
					}
					next();
				});
			});
		});
		this.generateSprites(tasks, done);
	};

	// private

	CssSprites.prototype.collectDefinitions = function() {
		var definitions = {};
		this.files.forEach(function(file) {
			Utils.extend(true, definitions, Parser.extractDefinitions(file.data));
		});
		return this.definitions = definitions;
	};

	CssSprites.prototype.collectReferences = function() {
		var result = {};
		var self = this;

		self.files.forEach(function(file) {
			Utils.extend(true, result, Parser.extractReferences(self.definitions, file));
		});
		this.definitions = result;
		return this.definitions;
	};

	CssSprites.prototype.generateSprites = function(tasks, done) {
		Utils.sequentialCall(tasks, function() {
			done();
		});
	};

	CssSprites.prototype.getFileByPath = function(filePath) {
		var result;
		var files = this.files;
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

	CssSprites.prototype.replaceSpriteReference = function(spriteObj) {
		var options = this.options;
		var self = this;
		spriteObj.files.forEach(function(file) {
			var processedCssFile = Parser.processCssFile(self.getFileByPath(file), spriteObj.css);
			Utils.writeFileSync(
				processedCssFile.path.replace(options.stylesSrc, options.stylesDest),
				processedCssFile.data
			);
		});
	};

	CssSprites.prototype.validateSpriteObject = function(sprite, name) {
		if (!sprite.files || !sprite.files.length) {
			return "Empty sprite: " + name;
		} else if (!sprite.spriteImage) {
			return "No refered image at sprite: " + name;
		}
		return;
	};

	return CssSprites;
})();