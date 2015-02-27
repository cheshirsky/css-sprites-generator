var spritesmith = require('spritesmith');
var Utils = require('../lib/utils');

module.exports = (function() {
	'use strict';

	var createSprite = function(options, spriteObj, callback) {
		options = options || {};
		spritesmith(Utils.extend(options, {
			'src': spriteObj.images
		}), function(err, result) {
			if (err || !spriteObj.spriteImage) {
				callback(err, undefined);
			} else {
				Utils.writeFileSync(spriteObj.spriteImage, result.image);
				callback(undefined, formatSpriteData(result, spriteObj));
			}
		});
	};

	var formatSpriteData = function(spritesmthResult, spriteData) {
		return {
			'files': spriteData.files,
			'spriteImage': spriteData.spriteImage,
			'css': createCssProperties(spritesmthResult, spriteData)
		};
	};

	var createCssProperties = function(spriteRes, spriteData) {
		var sizeMux = (spriteData.spriteScale && parseInt(spriteData.spriteScale) > 0) ? parseInt(spriteData.spriteScale) : 1;
		var result = {};

		var coords = spriteRes.coordinates || {};
		var props = spriteRes.properties ? {
			'width': spriteRes.properties.width / sizeMux,
			'height': spriteRes.properties.height / sizeMux
		} : undefined;

		Object.keys(coords).forEach(function(reference) {
			result[reference] = [
				'background-image: url(\''+ spriteData.spriteImage +'\');',
				'background-position: -'+ coords[reference].x +'px -'+ coords[reference].y +'px;',
				props ? 'background-size: '+ props.width +'px '+ props.height +'px;' : '',
			].join('\n');
		});
		return result;
	};

	return {
		'createSprite': createSprite
	};
})();