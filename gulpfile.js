var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


// Image Optimalisation 
gulp.task('imgopt', function() {
	gulp.src('./app/public/images/*')
		.pipe(imagemin({
			progressive: true,
			//quality stands instructs pngquant to use the least amount of colors needed to meet or the maximum quality. If the result is below the given quality, the image won't be saved
			use: [pngquant({quality: '65-80'})]
		}))
		.pipe(gulp.dest('./app/public/images'));
});
 
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./app/public/images/*', ['imgopt']);
});

// Default Task
gulp.task('default', ['imgopt']);
