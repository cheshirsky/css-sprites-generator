var gulp = require('gulp');
var karma = require('karma').server;
var runSequence = require('gulp-run-sequence');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('default', ['lint', 'test']);

gulp.task('lint', function() {
  return gulp.src(['./lib/*.js', './tasks/*.js', './tests/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', function () {
    return gulp.src('tests/*.js')
        .pipe(jasmine({
            reporter: new reporters.JUnitXmlReporter()
        }));
});

gulp.task('test', function (done) {});
