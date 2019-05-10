// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp')
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
let replace = require('gulp-replace')

// File paths
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js'
}

// Sass task: compiles the style.scss file into style.css
const scssTask = () => {
  return src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('dist')) // put final CSS in dist folder
}

// js
const jsTask = () => {
  return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist'))
}

//Cachebusting
const cbString = new Date().getTime()
const cacheBustTask = () => {
  return src(['index.html'])
    .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
    .pipe(dest('.'))
}

//Watch
const watchTask = () => {
  watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask))
}

exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask)
