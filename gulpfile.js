const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');

gulp.task('default', () => 
    gulp.src('assets/*')
            .pipe(imagemin(
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({plugins: [{removeViewBox: true}]})
            ))
            .pipe(gulp.dest('dist/images'))
);
gulp.task('compress-css', function() {
    gulp.src('public/css/*.css')
            .pipe(minify({
                ext: {
                    src: '-debug.css',
                    min:'.css'
                },
                exclude: ['tasks'],
                ignoreFiles: ['-min.css']
            }))
            .pipe(gulp.dest('dist/css'))
});