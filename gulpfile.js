/**
 * Created by Felipe Skinner on 26/01/2015.
 */
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var jshint      = require('gulp-jshint');
var ngAnnotate  = require('gulp-ng-annotate');
var rename      = require('gulp-rename');
var minifycss   = require('gulp-minify-css')
var connect     = require('gulp-connect');
var wrap        = require('gulp-wrap');
var size        = require('gulp-size');
var sass        = require('gulp-sass');

var paths = {
    main_js: ['src/js/**/*.js', '!src/js/**/*.min.js'],
    html: ['src/index.html'],
    sass_styles: ['src/styles/global.scss'],
    compiled_styles: ['src/styles/*.css', '!src/styles/*.min.css'],
    libs: ['src/libs/angular/angular.js', 
        'src/libs/angular-route/angular-route.js',
        'src/libs/angular-sanitize/angular-sanitize.js'],
    ready_styles: ['src/styles/*.min.css'],
    ready_js: ['src/js/**/*.min.js'],
    ready_libs: ['src/libs/*.min.js']
};

gulp.task('lint', function() {
    return gulp.src(paths.main_js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('styles', ['sass'], function() {
    return gulp.src(paths.ready_styles)
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.ready_js)
        .pipe(gulp.dest('dist/js'));
});

gulp.task('libs', function() {
    return gulp.src(paths.ready_libs)
        .pipe(gulp.dest('dist/libs'));
});

gulp.task('sass', function () {
    return gulp.src(paths.sass_styles)
        .pipe(sass())
        .pipe(rename({basename: "styles"}))
        .pipe(gulp.dest('src/styles'));
});

gulp.task('htmls', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist'));
});

gulp.task('default',['scripts', 'libs', 'styles', 'htmls']);
gulp.task('build-dev', ['pre-build-libs', 'pre-build-scripts', 'pre-build-styles']);

gulp.task('watch', function() {
    gulp.watch(paths.main_js, ['pre-build-scripts']);
    gulp.watch(paths.sass_styles, ['pre-build-styles']);
    gulp.watch(paths.libs, ['pre-build-libs']);
});

gulp.task('pre-build-libs', function() {
    return gulp.src(paths.libs)
        .pipe(concat('libs.js'))
        .pipe(size({title: 'Libs Pre-Minification'}))
        .pipe(gulp.dest('src/libs'))
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(size({title: 'Libs Post-Minification'}))
        .pipe(gulp.dest('src/libs'));
});

gulp.task('pre-build-scripts', ['lint'], function() {
    return gulp.src(paths.main_js)
        .pipe(concat('all.js'))
        .pipe(ngAnnotate())
        .pipe(size({title: 'JS Pre-Minification'}))
        .pipe(gulp.dest('src/js'))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(size({title: 'JS Post-Minification'}))
        .pipe(gulp.dest('src/js'));
});

gulp.task('pre-build-styles', ['sass'], function() {
    return gulp.src(paths.compiled_styles)
        .pipe(minifycss())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('src/styles'));
});

gulp.task('connect', function() {
  connect.server();
});