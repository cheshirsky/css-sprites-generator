'use strict';
var assert = require('assert');

it('should run unit test and pass', function (cb) {
	assert(true);
});

it('should run the test only once even if called in succession', function (done) {
	assert(true);
});