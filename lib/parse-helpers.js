var path = require('path');
var Utils = require(path.join(__dirname, '../lib/utils'));

module.exports = (function() {
	'use strict';

	var config = {
		'spriteDefinitionPattern': /\/\*+\s+(sprite\s*:[^*]*)\*+\//g,
		'urlPattern': /[uU][rR][lL]\(['"]?([^'"\)]+)['"]?\)/g,
		'spriteRefPattern': /\*+\s*sprite-ref:\s*([^;*]+);?\s*.*\*+\//g,
		'definitionProps': ['sprite', 'sprite-image', 'sprite-scale', 'sprite-algorithm', 'sprite-alignment'],
		'layoutProps': ['alignment']
	};

	config.layoutPropsRegex = (function() {
		return new RegExp('sprite-(' + config.layoutProps.join('|') + ")\\s*:\\s*([^;]+)\\s*;", 'g');
	})();


	var emptyDefinition = {
		'files': [],
		'images': {}
	};

	function extractDefinitionURL(str) {
		return Utils.processMD5(extractURL(str));
	}

	function extractDefinitions(data) {
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
	}

	function extractLayoutProps(str) {
		var result = [];
		var layoutProps = [];
		if (!str || !str.length) {
			return result;
		}
		config.layoutPropsRegex.lastIndex = 0;
		if (config.layoutPropsRegex.test(str)) {
			layoutProps = str.match(config.layoutPropsRegex);
			layoutProps.forEach(function(property) {
				property = property.replace('sprite-', '').replace(';', '');
				var chunks = Utils.trim(property).split(':');
				if (chunks && chunks.length === 2) {
					result.push({'key': chunks[0], 'value': chunks[1]});
				}
			});
		}
		return result;
	}

	function extractReferences(definitions, file) {
		config.spriteRefPattern.lastIndex = 0;
		var fileRows = file.data.split(/(\r\n|\n|\r)/);
		while (fileRows.length) {
			var row = fileRows.shift();
			if (config.spriteRefPattern.test(row)) {
				var reference = parseReference(row);
				var spriteName = reference.sprite;
				if (reference && spriteName && reference.image) {
					definitions[spriteName] = definitions[spriteName] || emptyDefinition;
					definitions[spriteName].images[reference.image] = extractLayoutProps(row);
					definitions[spriteName].files.push(file.path);
				}
			}
		}
		return definitions;
	}

	function extractURL(str) {
		config.urlPattern.lastIndex = 0;
		var result = config.urlPattern.exec(str);
		return result && result.length >= 2 ? result[1] : str;
	}

	function isUrl(str) {
		config.urlPattern.lastIndex = 0;
		return config.urlPattern.test(str);
	}

	function isAllowedProperty(prop) {
		var result = false;
		config.definitionProps.forEach(function(definition) {
			result = result || prop === definition;
		});
		return result;
	}

	function parseDefinition(str) {
		if (!str || !str.length) {
			return;
		}
		var result = Utils.extend({}, emptyDefinition);

		var chunks = Utils.trim(str).split(';');
		chunks.forEach(function(rule) {
			var prop = rule.split(':');
			if (prop && prop.length === 2 && isAllowedProperty(prop[0])) {
				var name = Utils.capitalise(prop[0], true).split('-').join('');
				result[name] = isUrl(prop[1]) ? extractDefinitionURL(prop[1]) : prop[1];
			}
		});
		return result;
	}

	function parseReference(str) {
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
	}

	function processCssFile(file, css) {
		Object.keys(css).forEach(function(imageURL) {
			file.data = file.data.replace(new RegExp('^.*' + imageURL + '.*$', 'gm'), css[imageURL]);
		});
		return file;
	}

	return {
		'extractDefinitions': extractDefinitions,
		'extractReferences': extractReferences,
		'extractURL': extractURL,
		'isUrl': isUrl,
		'processCssFile': processCssFile
	};

})();