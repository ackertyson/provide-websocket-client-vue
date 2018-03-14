'use strict'

const coffee = require('gulp-coffee')
const gulp = require('gulp')

gulp.task('clean', (done) => {
  const del = require('del')
  del.sync([ 'dist/*' ])
  done()
})

gulp.task('build:server', () => {
  const uglify = require('gulp-uglify-es').default
  const gutil = require('gulp-util')
  const rename = require('gulp-rename')
  return gulp.src('src/**/*.coffee')
    .pipe(coffee({ bare: true }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('build:minify', ['build:server'], () => {
  return gulp.src('dist/index.js')
    .pipe(gulp.dest('dist/'))
})

gulp.task('test:unit', [], () => {
  require('coffee-script/register');
  const mocha = require('gulp-mocha')
  return gulp.src(['test/**/*.coffee', '!test/*.coffee'], { read: false })
    .pipe(mocha())
    .once('error', (err) => {
      if (err.stack) {
        console.log(err.stack);
      } else {
        console.log(err);
      }
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    })
})

gulp.task('watch:server', [ 'build:server' ], () => {
  gulp.watch('src/**/*.coffee', { interval: 500 }, [ 'build:server' ])
})
gulp.task('build', [ 'clean', 'build:server' ])
gulp.task('test', [ 'test:unit' ])
gulp.task('watch', [ 'watch:server' ])
gulp.task('default', [ 'build', 'watch' ])
