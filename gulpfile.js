const Promise = require('bluebird');
const { argv } = require('yargs');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const fs = Promise.promisifyAll(require('fs'));
const del = require('del');
const flowCopySource = require('flow-copy-source');

gulp.task('clean-js', () => del('lib/**/*.js'));
gulp.task('clean-flow', () => del('lib/**/*.flow'));

gulp.task('transpile', ['clean-js'], () =>
  gulp
    .src('src/**/*.js')
    .pipe(
      babel({
        presets: ['flow', 'es2015'],
      })
    )
    .pipe(gulp.dest('lib'))
);

gulp.task('flow-copy-source', ['clean-flow'], () =>
  flowCopySource(['src'], 'lib')
);

gulp.task('test', ['transpile', 'flow-copy-source'], () =>
  gulp
    .src(['lib/**/test/**/*.unit.js', 'lib/**/test/**/*.e2e.js'])
    .pipe(
      mocha({
        reporter: 'dot',
        timeout: 3000,
        grep: argv.grep,
      })
    )
    .once('error', err => {
      console.error(err.stack);
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    })
);

gulp.task('build', ['transpile', 'flow-copy-source']);
