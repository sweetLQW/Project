var gulp = require("gulp");
var less = require("gulp-less");
// var  minify = require('gulp-minify-css'),//css压缩
// 	concat = require('gulp-concat'),//文件合并
// 	uglify = require('gulp-uglify'),//js压缩
// 	rename = require('gulp-rename'),//文件重命名
// 	imagemin = require('gulp-imagemin'); //压缩图片
gulp.task("less",function(){
    return gulp.src("public/styles/less/*.less")
        .pipe(less())
        .pipe(gulp.dest("public/styles/css"))
});
gulp.task("watch",function(){
    gulp.watch("public/styles/less/*.less",["less"])
});
gulp.task("default",["less","watch"]);


//与webpack搭配
// gulp.task("webpack", function(callback) {
//     // run webpack
//     webpack({
//         // configuration
//     }, function(err, stats) {
//         if(err) throw new gutil.PluginError("webpack", err);
//         gutil.log("[webpack]", stats.toString({
//             // output options
//         }));
//         callback();
//     });
// });


//压缩css
// gulp.task('minifyCss', function(){
// 	return gulp.src('public/css/*.css')
// 		.pipe(rename({suffix: '.min'}))
// 		.pipe(minify())
// 		.pipe(concat('main.css'))
// 		.pipe(gulp.dest('dist/css'));
// });
// //压缩js
// gulp.task('minifyJs', function(){
// 	return gulp.src('public/js/*.js')
// 		.pipe(uglify())
// 		.pipe(gulp.dest('dist/js'));
// });
// //压缩图片
// gulp.task('minifyImg', function(){
// 	return gulp.src('public/images/*')
// 		.pipe(imagemin())
// 		.pipe(gulp.dest('dist/images'));
// });