var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	sass2 = require('gulp-ruby-sass'),
	sass = require('gulp-sass'),
	combineMq = require('gulp-combine-mq'),
	imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
	browserify = require('gulp-browserify'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create();


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});


gulp.task('sass', () =>
    sass2('src/scss/*.scss', {sourcemap: true})
        .on('error', sass.logError)
        // for inline sourcemaps
        // .pipe(sourcemaps.write())
        // // for file sourcemaps
        .pipe(sourcemaps.write('maps', {
            includeContent: false,
            sourceRoot: 'source'
        }))
        .pipe(gulp.dest('dist/css')) 
        .pipe(browserSync.stream())
);
     
// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        // .pipe(browserify({minify: false})) 
        .pipe(babel({ 
                presets: ['@babel/env']
            }))
        // .pipe(concat('bundle.min.js'))
        // .pipe(uglify({mangle: {toplevel: true}}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'));
        browserSync.reload();
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['js'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/js/**/*.js", ['js-watch']);
});



// // Static server
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./"
//         }
//     });
// });


// 	// zip = require('gulp-zip');

// var path = {
// 	scripts:"src/js",
// 	styles:"src/scss",
// 	images:"src/img"
// };

// //scripts task 
// gulp.task('img', function () {
//     return gulp.src('src/images/**/*')
//         .pipe(imagemin({
//             // progressive: true,
//             // svgoPlugins: [{removeViewBox: false}],
//            // use: [pngquant()]
//         }))
//         .pipe(gulp.dest('images'));
// });

// gulp.task('scripts', function () {	
// 	gulp.src('src/js/*.js')
// 	.pipe(sourcemaps.init())
//         .pipe(babel({
//             // presets: ['@babel/env']
//         }))
// 	// .pipe(concat('bundle.min.js'))
// 	.pipe(uglify())
// 	.pipe(sourcemaps.write('.'))
// 	.pipe(gulp.dest('js/bundle.min.js'));
// });

// //styles
// gulp.task('style', function () {
	
// 	 return sass('src/scss/', ({style: 'compressed'}))
//     .on('error', function (err) {
//       console.error('Error!', err.message);
//    })
//     .pipe(combineMq({ beautify: false }))
// 	.pipe(gulp.dest('css/'));
// });

// gulp.task('new', function () {
	
// 	gulp.watch('src/scss/*.scss', ['style']);
// 	// gulp.watch('bower_components/bootstrap-sass/assets/**/*.scss', ['style']);
   
// });



// gulp.task('zip', function () {	
// 		return gulp.src('js/*')
//         .pipe(zip('archive.zip'))
//         .pipe(gulp.dest('minjs'));

// });

// gulp.task('default', ['scripts', 'style']);