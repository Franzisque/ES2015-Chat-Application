var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    autoprefixer = require('gulp-autoprefixer');
    browserify = require('gulp-browserify');


var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function(cb) {
    var called = false;
    return nodemon({

            // nodemon our expressjs server
            script: 'out/node/index.js',

            // watch core server file(s) that require server restart on change
            watch: ['out/node/index.js']
        })
        .on('start', function onStart() {
            // ensure start only got called once
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false //
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});

gulp.task('browser-sync', ['nodemon', 'watchFiles'], function() {

    browserSync.init({
        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:3000',

        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000
    });
});

gulp.task('watchFiles', function() {
    gulp.watch('./app/js/**/*.js', ['babelFiles']);
    gulp.watch('./app/node/**/*.js', ['nodeBabelFiles']);
    gulp.watch('./app/styles/*.scss', ['sass']);
    gulp.watch('./app/html/index.html', ['index']);
});

gulp.task('recompile', ['sass', 'index', 'babelFiles', 'nodeBabelFiles']);

gulp.task('sass', function() {
    return gulp.src("app/styles/*.scss")
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest("./out/css/"))
        .pipe(browserSync.stream());
});

gulp.task('babelFiles', function() {
    return gulp.src('./app/js/app.js')
        .pipe(browserify({
            transform: ['babelify'],
            debug: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./out/js/'));
});

gulp.task('nodeBabelFiles', function() {
    return gulp.src('./app/node/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./out/node/'))
        .pipe(browserSync.stream());
});

gulp.task('index', function() {
    return gulp.src('./app/html/index.html')
        .pipe(gulp.dest('./out/'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['recompile', 'browser-sync']);

gulp.task('bablify', function() {
    return gulp.src('test/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('out/test/'))
});

gulp.task('test', ['bablify'], function(cb) {
    gulp.src(['./out/test/frontend/*.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(['./out/test/**/*.js'])
                .pipe(mocha())
                .pipe(istanbul.writeReports()) // Creating the reports after tests ran
                .on('end', cb);
        });
});
