var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports = (function() {

	function trim(string) {
		if (!string || !string.length) {
			return string;
		}
		return string.split(' ').join('');
	}

	function capitalise(string, skipFirst) {
		if (!string || !string.length) {
			return string;
		}
		return string.replace(/\b[a-z]/g, function(match) {
			if (skipFirst) {
				skipFirst = false;
				return match;
			}
			return match.toUpperCase();
		});
	}

	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;

	function isPlainObject(obj) {
		if (!obj || toString.call(obj) !== '[object Object]') {
			return false;
		}

		var hasOwnConstructor = hasOwn.call(obj, 'constructor');
		var hasIsPropertyOfMethod = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !hasOwnConstructor && !hasIsPropertyOfMethod) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {}

		return key === undefined || hasOwn.call(obj, key);
	}

	function extend() {
		var options, name, src, copy, copyIsArray, clone;
		var target = arguments[0];
		var i = 1;
		var length = arguments.length;
		var deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || !target) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target !== copy) {
						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && Array.isArray(src) ? src : [];
							} else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = extend(deep, clone, copy);

						// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}


				}
			}
		}

		// Return the modified object
		return target;
	}

	function removeDuplicates(data) {
		return data.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		});
	}

	function sequentialCall(actions, callback) {
		if (!actions || !actions.length) {
			if (typeof callback === 'function') {
				callback();
			}
			return;
		}
		actions.shift()(function() {
			sequentialCall(actions, callback);
		});
	}

	function makePathSync(dirpath, mode) {
		dirpath = path.resolve(dirpath);

		if (typeof mode === 'undefined') {
			mode = 0777 & (~process.umask());
		}

		try {
			if (!fs.statSync(dirpath).isDirectory()) {
				throw new Error(dirpath + ' exists and is not a directory');
			}
		} catch (err) {
			if (err.code === 'ENOENT') {
				makePathSync(path.dirname(dirpath), mode);
				fs.mkdirSync(dirpath, mode);
			} else {
				throw err;
			}
		}
	}

    function checkFileNotExist(filePath, cb) {
        try {
            if (!fs.statSync(filePath).isFile()) {
                throw new Error(filePath + 'not exist');
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                cb();
            } else {
                throw err;
            }
        }
    }

	function writeFileSync(filePath, fileData, format) {
		makePathSync(path.dirname(filePath));
		return fs.writeFileSync(filePath, fileData, format);
	}

    function getHash(obj) {
        return crypto.createHash('md5').update(obj).digest('hex');
    }


	return {
		'trim': trim,
		'capitalise': capitalise,
		'extend': extend,
        'checkFileNotExist': checkFileNotExist,
		'makePathSync': makePathSync,
		'writeFileSync': writeFileSync,
		'sequentialCall': sequentialCall,
		'removeDuplicates': removeDuplicates,
        'getHash': getHash
	};
})();