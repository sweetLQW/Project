var gulp = require("gulp");
var less = require("gulp-less");
gulp.task("less",function(){
	return gulp.src("style/less/*.less")
		.pipe(less())
		.pipe(gulp.dest("style/css"))
})
gulp.task("watch",function(){
	gulp.watch("style/less/*.less",["less"])
})
gulp.task("default",["less","watch"])