var path = require('path');
var Utils = require(path.join(__dirname, '../lib/utils'));

module.exports = (function() {
	'use strict';

	var config = {
		'spriteDefinitionPattern': /\/\*+\s+(sprite:[^*]*)\*+\//g,
		'urlPattern': /[uU][rR][lL]\(['"]?([^'"\)]+)['"]?\)/g,
		'spriteRefPattern': /\*+\s*sprite-ref:\s*([^;*]+);?\s*.*\*+\//g,
		'definitionProps': ['sprite', 'sprite-image', 'sprite-scale']
	};

	var emptyDefinition = {
		'files': [],
		'images': []
	};

	var extractDefinitionURL = function(str) {
		return Utils.processMD5(extractURL(str));
	};

	var extractDefinitions = function(data) {
		var spriteDefs = [];
		var result = {};
		config.spriteDefinitionPattern.lastIndex = 0;
		while ((spriteDefs = config.spriteDefinitionPattern.exec(data)) !== null) {
			var definition = parseDefinition(spriteDefs[1]);
			if (definition && definition.sprite) {
				result[definition.sprite] = definition;
			}
		}
		return result;
	};

	var extractReferences = function(definitions, file) {
		config.spriteRefPattern.lastIndex = 0;
		var fileRows = file.data.split(/(\r\n|\n|\r)/);
		while (fileRows.length) {
			var row = fileRows.shift();
			if (config.spriteRefPattern.test(row)) {
				var reference = parseReference(row);
				if (reference && reference.sprite && reference.image) {
					definitions[reference.sprite] = definitions[reference.sprite] || emptyDefinition;
					definitions[reference.sprite].images.push(reference.image);
					definitions[reference.sprite].files.push(file.path);
				}
			}
		}
		return definitions;
	};

	var extractURL = function(str) {
		config.urlPattern.lastIndex = 0;
		var result = config.urlPattern.exec(str);
		return result && result.length >= 2 ? result[1] : str;
	};

	var isUrl = function(str) {
		config.urlPattern.lastIndex = 0;
		return config.urlPattern.test(str);
	};

	var isAllowedProperty = function(prop) {
		var result = false;
		config.definitionProps.forEach(function(definition) {
			result = result || prop === definition;
		});
		return result;
	};

	var parseDefinition = function(str) {
		if (!str || !str.length) {
			return;
		}
		var result = emptyDefinition;

		var chunks = Utils.trim(str).split(';');
		chunks.forEach(function(rule) {
			var prop = rule.split(':');
			if (prop && prop.length === 2 && isAllowedProperty(prop[0])) {
				var name = Utils.capitalise(prop[0], true).split('-').join('');
				result[name] = isUrl(prop[1]) ? extractDefinitionURL(prop[1]) : prop[1];
			}
		});
		return result;
	};

	var parseReference = function(str) {
		if (!str || !str.length) {
			return;
		}
		str = Utils.trim(str);
		var url = extractURL(str);
		
		config.spriteRefPattern.lastIndex = 0;
		var regexResult = config.spriteRefPattern.exec(str);
		if (!regexResult || regexResult.length < 2 || !url || !url.length) {
			return;
		}		
		return {'sprite': regexResult[1], 'image': url};
	};

	var processCssFile = function(file, css) {
		Object.keys(css).forEach(function(imageURL) {
			file.data = file.data.replace(new RegExp('^.*' + imageURL + '.*$', 'm'), css[imageURL]);
		});
		return file;
	};

	return {
		'extractDefinitions': extractDefinitions,
		'extractReferences': extractReferences,
		'extractURL': extractURL,
		'isUrl': isUrl,
		'processCssFile': processCssFile
	};

})();