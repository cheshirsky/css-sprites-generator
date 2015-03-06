var spritesmith = require('spritesmith');
var Utils = require('../lib/utils');
var path = require('path');

module.exports = (function() {
	'use strict';

	function createCssProperties(spriteRes, spriteData, normalizedPaths, options) {
		var scale = (spriteData.spriteScale) ? parseFloat(spriteData.spriteScale) : 1;
		var result = {};

		var coords = spriteRes.coordinates || {};
		// we are to scale image size due to spriteScale value (for retina)
		var props = spriteRes.properties ? {
			'width': Math.round(spriteRes.properties.width / scale),
			'height': Math.round(spriteRes.properties.height / scale)
		} : undefined;

		Object.keys(coords).forEach(function(reference) {
			// result coords also depend on scale (for retina)
			var position = coords[reference] ? {
				'x': '-' + Math.round(coords[reference].x / scale) + 'px',
				'y': '-' + Math.round(coords[reference].y / scale) + 'px'
			} : undefined;

			result[reference] = [];
			var imageData = spriteData.images[normalizedPaths[reference]];
			result[reference].push('background-image: url(\''+ spriteData.spriteImage +'\');');
			if (position) {
				var alignment = {'key': 'alignment', 'value':spriteData.spriteAlignment};
				for (var i = 0, len = imageData.length; i < len; i++) {
					if (imageData[i].key === 'alignment') {
						// we have to process alignment separatelly
						// in different ways, depending of algorithm
						alignment = imageData[i];
					}
				}
				if (alignment && alignment.value) {
					// alignment takes place only for top-down or left-right
					switch (options.algorithm) {
						case 'top-down': { position.x = alignment.value; break; }
						case 'left-right': { position.y = alignment.value; break; }
					}
				}
				result[reference].push('background-position: '+ position.x + ' '+ position.y +';');
			}
			if (props) {
				result[reference].push('background-size: '+ props.width +'px '+ props.height +'px;');
			}
			result[reference] = result[reference].join('\n');
		});
		return result;
	}

	// this metod creates result data for writing (css, images and processed files)
	function formatSpriteData(spritesmthResult, spriteData, normalizedPaths, options) {
		return {
			'files': spriteData.files,
			'spriteImage': spriteData.spriteImage,
			'css': createCssProperties(spritesmthResult, spriteData, normalizedPaths, options)
		};
	}

	// it creates hash of kv urls representations, which looks like this:
	// {"realImagePath": "imageUrlFromCss", ...}
	function normalizeImagesPaths(data, basePath) {
		var result = {};
		data.forEach(function(imagePath) {
			result[path.join(basePath, imagePath)] = imagePath;
		});
		return result;
	}

	function createSprite(options, spriteObj, callback) {
		options = options || {};
		// we have to use kv representation here to match sprite result and urls from css
		var normalizedPaths = normalizeImagesPaths(Object.keys(spriteObj.images), options.imagesSrc);
		var spritesmithConf = Utils.extend({}, options, {
			'src': Object.keys(normalizedPaths)
		});
		// algorithm can be selected both in options and in sprite definition
		spritesmithConf.algorithm = spriteObj.spriteAlgorithm && spriteObj.spriteAlgorithm.length
			? spriteObj.spriteAlgorithm
			: options.algorithm;

		spritesmith(spritesmithConf, function(err, result) {
			if (err || !spriteObj.spriteImage) {
				callback(err);
			} else {
				// writing images
				Utils.writeFileSync(spriteObj.spritePath, result.image, "binary");
				// handling css properties
				callback(null, formatSpriteData(result, spriteObj, normalizedPaths, options));
			}
		});
	}

	return {
		'createSprite': createSprite
	};
})();