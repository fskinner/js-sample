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
    main_js: ['./src/js/**/*.js'],
    html: ['./src/index.html'],
    styles: ['./src/styles/*.css'],
    libs: ['./src/libs/angular/angular.js', 
        './src/libs/angular-route/angular-route.js',
        './src/libs/angular-sanitize/angular-sanitize.js']
};

gulp.task('scripts', function() {
    return gulp.src(paths.main_js)
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(size({title: 'JS Pre-Minification'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(size({title: 'JS Post-Minification'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('test', function() {
    return gulp.src(paths.main_js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
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

gulp.task('watch', function() {
    gulp.watch('src/js/*.*', ['default']);
    gulp.watch('src/index.html', ['default']);

    gulp.watch('src/libs/**/*.js', ['build-libs']);
});

gulp.task('build-libs', function() {
    return gulp.src(paths.libs)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./src/libs'))
})

gulp.task('connect', function() {
  connect.server();
});