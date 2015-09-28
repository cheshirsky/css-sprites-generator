var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');

gulp.task('default', function (callback) {
	runSequence(
        'lint',
        'test'
    );
});

gulp.task('lint', function() {
	gulp.src(['lib/*.js', 'tasks/*.js', 'tests/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('test', function () {
	gulp.src('tests/suites/*.js').pipe(jasmine());
});
