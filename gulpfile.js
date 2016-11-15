const gulp = require('gulp');
const del = require('del');
const Builder = require('systemjs-builder');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const concat = require('gulp-concat');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
// const minify = require('gulp-minify');
const reload = browserSync.reload;
const rename = require('gulp-rename'); //for dev
const uglify = require('gulp-uglify');
const embedTemp = require('gulp-angular-embed-templates');
const connect = require('gulp-connect');


// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', function () {
    return gulp
    .src(['app/**/*.ts', '!app/**/*spec.ts'])
    // .src(['app/**/*.ts', '!app/**/*spec.ts']).pipe(embedTemp({sourceType: 'ts', basePath: './'}))
        .pipe(typescript(tscConfig.compilerOptions)).pipe(uglify())
        .pipe(gulp.dest('dist/app'))

});

gulp.task('less', ['clean'], function () {
    return gulp.src(['./app/**/*.less'])
        .pipe(concat('master.css'))
        .pipe(less())
        .pipe(gulp.dest('dist/app/global/stylesheets'));
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function () {
    return gulp.src([
      'node_modules/core-js/client/core.min.js',
      'node_modules/core-js/client/core.min.js.map',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/reflect-metadata/Reflect.js.map',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/moment/moment.js',
      'node_modules/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/fuse.js/src/fuse.min.js',
      'node_modules/hammerjs/hammer.min.js',
      'node_modules/hammerjs/hammer.min.js.map',
      'node_modules/@angular/core/bundles/core.umd.js',
      'node_modules/@angular/common/bundles/common.umd.js',
      'node_modules/@angular/compiler/bundles/compiler.umd.js',
      'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
      'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      'node_modules/@angular/http/bundles/http.umd.js',
      'node_modules/@angular/router/bundles/router.umd.js',
      'node_modules/@angular/forms/bundles/forms.umd.js',
      'node_modules/rxjs/**/*.js',
      'node_modules/rxjs/**/*.map',
      'node_modules/symbol-observable/*.js',
      'node_modules/symbol-observable/*.map',
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system-polyfills.js.map',
      'node_modules/@angular/**/*.js',
      'node_modules/@angular/**/*.map',
      'node_modules/node-uuid/uuid.js',
      'node_modules/immutable/dist/immutable.js',
      'node_modules/highcharts/highcharts.js',
      'node_modules/moment-timezone/moment-timezone.js',//load only one moment timezone otherwise problems will occur
      'system.config.js'
        ])
        .pipe(gulp.dest('dist/lib'));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function () {
    return gulp.src(['app/**/*', 'index.html', 'systemjs.config.js', 'BingSiteAuth.xml', 'master.css', '!app/**/*.ts', '!app/**/*.less'], {base: './'})
  // return gulp.src(['app/**/*', 'index.html', 'BingSiteAuth.xml', 'master.css', '!app/**/*.ts', '!app/**/*.less', '!app/fe-core/components/**/*.html', '!app/fe-core/modules/**/*.html', '!app/fe-core/webpages/**/*.html'], {base: './'})
    .pipe(gulp.dest('dist'));
});

//minify the css
gulp.task('minify-css', ['less'], function () {
    return gulp.src('dist/app/global/stylesheets/*.css')
        .pipe(cleanCSS({debug: true, processImport: false}, function (details) {
            // console.log(details.name + ': ' + details.stats.originalSize);
            // console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/app/global/stylesheets'));
});

// gulp task to build all of the files to be able to serve in index.html also have a task to watch those files and rebuild when modified
gulp.task('build', ['compile', 'less', 'minify-css', 'copy:libs', 'copy:assets']);
gulp.task('buildAndReload', ['build'], reload);

/*
 * MAIN GULP COMMAND TO SERVE CONTENT -> gulp serve
 */
 gulp.task('serve', ['build'], function () {
  connect.server({
    root: 'dist',
    port: 3000,
    livereload: true,
    middleware: function(connect, opt) { return [ historyApiFallback({}) ] }
  });

  gulp.watch(['app/**/*', 'index.html', 'master.css'], ['buildAndReload']);
 });

/**
 *
 *BELOW ARE ALL FOR DEV BUILD TO RUN FOR DEVELOPMENT
 *
 */
// Run browsersync for development
gulp.task('dev', ['dev-build'], function () {
    browserSync({
        server: {
            baseDir: 'dist',
            middleware: [historyApiFallback()]
        }
    });
    gulp.watch(['app/**/*', 'dev-index.html', 'master.css'], ['dev-buildAndReload']);
});

//special compile function for dev not to minify js
// TypeScript compile
gulp.task('dev-compile', function () {
    return gulp
        .src(['app/**/*.ts', '!app/**/*spec.ts']).pipe(embedTemp({sourceType: 'ts', basePath: './'}))
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist/app'))

});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:dev-assets', ['clean'], function () {
    gulp.src('dev-index.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist'));

    return gulp.src(['app/**/*', 'master.css', '!app/**/*.ts', '!app/**/*.less', '!app/fe-core/components/**/*.html', '!app/fe-core/modules/**/*.html', '!app/fe-core/webpages/**/*.html'], {base: './'})
    .pipe(gulp.dest('dist'));
});

gulp.task('dev-build', ['dev-compile', 'less', 'copy:libs', 'copy:dev-assets', 'minify-css']);
gulp.task('dev-buildAndReload', ['dev-build'], reload);

gulp.task('default', ['build']);

//GULP TASKS for TESTING
gulp.task('compile-tests', ['clean'], function () {
    return gulp
        .src(['app/main.ts', 'app/**/*.spec.ts'])
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist'));
});
