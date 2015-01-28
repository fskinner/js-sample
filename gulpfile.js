/**
 * Created by Felipe Skinner on 26/01/2015.
 */
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var jshint      = require('gulp-jshint');
var ngAnnotate  = require('gulp-ng-annotate');
var rename      = require("gulp-rename");
var minifycss   = require('gulp-minify-css')
var connect     = require('gulp-connect');
var wrap        = require("gulp-wrap");
var size        = require('gulp-size');

var paths = {
    main_js: ['src/js/**/*.js', '!src/js/**/*.min.js'],
    html: ['src/index.html'],
    styles: ['src/styles/*.css', '!src/styles/*.min.css'],
    libs: ['src/libs/angular/angular.js', 
        'src/libs/angular-route/angular-route.js',
        'src/libs/angular-sanitize/angular-sanitize.js']
};

gulp.task('lint', function() {
    return gulp.src(paths.main_js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src(paths.main_js)
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('all.js'))
        .pipe(ngAnnotate())
        .pipe(size({title: 'JS Pre-Minification'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(size({title: 'JS Post-Minification'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('libs', function() {
    return gulp.src(paths.libs)
        .pipe(concat('libs.js'))
        .pipe(size({title: 'Libs Pre-Minification'}))
        .pipe(gulp.dest('dist/libs'))
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(size({title: 'Libs Post-Minification'}))
        .pipe(gulp.dest('dist/libs'));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(minifycss())
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('htmls', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist'));
});

gulp.task('default',['scripts', 'libs', 'styles', 'htmls']);
gulp.task('build-dev', ['pre-build-libs', 'pre-build-scripts', 'pre-build-styles']);

gulp.task('watch', function() {
    gulp.watch(paths.main_js, ['pre-build-scripts']);
    gulp.watch(paths.styles, ['pre-build-styles']);
    gulp.watch(paths.libs, ['pre-build-libs']);
});

gulp.task('pre-build-libs', function() {
    return gulp.src(paths.libs)
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(gulp.dest('src/libs'));
});

gulp.task('pre-build-scripts', function() {
    return gulp.src(paths.main_js)
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('all.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(gulp.dest('src/js'));
});

gulp.task('pre-build-styles', function() {
    return gulp.src(paths.libs)
        .pipe(concat('styles.css'))
        .pipe(minifycss())
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest('src/styles'));
});

gulp.task('connect', function() {
  connect.server();
});