'use strict';

var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

//var buffer = require('vinyl-buffer');
//var es = require('event-stream');

gulp.task('default', ['build'], function(cb) {
    runSequence('clean-dist', [
        'cssmin',
        'htmlmin',
        'uglify',
        'copy-deps'
    ],
        'create-package',
        cb);
});

gulp.task('serve', ['default'], function() {
    connect.server({
        root: 'dist',
        livereload: false
    });
});

gulp.task('clean-dist', function() {
    return gulp.src('dist/')
        .pipe(clean());
});

gulp.task('create-package', function() {
    return gulp.src('dist/**/*')
        .pipe(zip('json2csarray.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('cssmin', function() {
    var config = {
        advanced: true,
        aggresiveMerging: true,
        keepSpecialComments: 0
    };

    return gulp.src(['build/**/*.css'])
        .pipe(cleanCSS(config))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-deps', function() {
    var fonts = gulp.src('build/deps/fonts/*')
        .pipe(gulp.dest('dist/deps/fonts'));

    var ltIE9 = gulp.src('build/deps/js/*')
        .pipe(gulp.dest('dist/deps/js'));

    return merge(fonts, ltIE9);
});

gulp.task('htmlmin', function() {
    var config = {
        collapseWhitespace: true,
        removeComments: true
    };

    return gulp.src(['build/**/*.html'])
        .pipe(htmlmin(config))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    return gulp.src(['build/**/*.js', '!build/deps/**'])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
