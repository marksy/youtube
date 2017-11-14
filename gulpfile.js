(function(){
  'use strict';

  const gulp = require('gulp');

  const util = require('gulp-util');

  const babelify = require('babelify'); //es2015
  const browserify = require('browserify'); // Bundles JS
  const buffer = require('vinyl-buffer');
  const connect = require('gulp-connect'); //Runs a local dev server

  const jshint = require('gulp-jshint'); //Lint JS files

  const open = require('gulp-open'); //Open a URL in a web browser
  const os = require('os');// node extension to get OS methods
  const source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
  const sass = require('gulp-sass'); //build Sass
  const sourcemaps = require('gulp-sourcemaps'); //adds sourcemaps to files

  const templateCache = require('gulp-angular-templatecache');

  var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
      html: './src/*.html',
      entry: './src/app.js',
      views: './src/views/**/*.html',
      js: './src/js/**/*.js',
      // js: './src/app.js',
      vendor: [
        './node_modules/angular/angular.min.js',
        './node_modules/angular-ui-router/release/angular-ui-router.min.js',
        './node_modules/angular-video/js/anguvideo.js'
      ],
      images: [
        './src/images/**/*.gif',
        './src/images/**/*.jpg',
        './src/images/**/*.png'
      ],
      sass: './src/scss/**/*.scss',
      dist: './dist',
      mainJs: './src/app.js'
    },
    prd: !!util.env.prd
};

  // create server
  gulp.task('connect', () => {
    connect.server({
      root: config.paths.dist,
      port: config.port,
      base: config.devBaseUrl,
      livereload: true
    });
  });

  // open entry point
  gulp.task('open', ['connect'], () => {
    gulp.src(config.paths.dist + '/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
  });

  // jshint
gulp.task('jshint', () => {
  return gulp.src(config.paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// JS: babelify > bundle > copy to dist
gulp.task('js', () => {
  let bundler = browserify({
      entries: config.paths.entry,
      debug: true
  });

  bundler.transform(babelify);
  bundler.bundle()
    .on('error', (err) => { console.error(err); })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(config.prd ? util.noop() : sourcemaps.init({ loadMaps: true }))
    .pipe(config.prd ? uglify() : util.noop()) // Use any gulp plugins you want now
    .pipe(config.prd ? util.noop() : sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.dist + '/assets/scripts'))
    .pipe(connect.reload());
});

gulp.task('html', () => {
    return gulp.src(config.paths.html)
      .pipe(gulp.dest(config.paths.dist + ''))
      .pipe(connect.reload());
  });

  gulp.task('views', function () {
    return gulp.src(config.paths.views)
      .pipe(gulp.dest(config.paths.dist + '/assets/views'))
      .pipe(connect.reload());
});

  gulp.task('sass', function() {
      gulp.src(config.paths.sass)
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(config.paths.dist + '/assets/css/'))
          .pipe(connect.reload());
      console.log('sass processed');
  });

  gulp.task('watch', () => {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.views, ['views']);
    gulp.watch(config.paths.sass, ['sass']);
    gulp.watch(config.paths.js, ['js', 'jshint']);
  });

  gulp.task('default', [
    'views',
    'js',
    'html',
    'sass',
    'open',
    'watch'
  ]);

})();
