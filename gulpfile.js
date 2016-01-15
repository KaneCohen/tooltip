var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    fs = require('fs');

gulp.task('uglify', function() {
  try {
    fs.unlinkSync('./tip.min.js');
  } catch(err) { }

  gulp.src('./tip.js')
    .pipe(uglify({output: {comments: /^!|@preserve|@license|@cc_on/i}}))
    .pipe(rename('tip.min.js'))
    .pipe(gulp.dest('./'));
});
