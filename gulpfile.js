'use strict'

const gulp = require('gulp'),
  conact = require('gulp-concat'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass')(require('node-sass')),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  rimraf = require('rimraf'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload;

let path = {
  build: {
    html: './build',
    css: './build/styles/css/',
    img: './build/resources/',
    fonts: './build/fonts/'
  },
  src: {
    html: './src/*.html',
    style: './src/styles/main.scss',
    img: './src/resources/**/*.*',
    fonts: './src/fonts/**/*.*'
  },
  watch: {
    html: './src/*.html',
    style: './src/styles/scss/*.scss',
    img: './src/resources/**/*.*',
    fonts: './src/fonts/**/*.*'
  },
  clean: './build'
}

let config = {
  server: {
    baseDir: "./build",
    index: "frontpage.html"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000
}

function buildHtml() {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
}

function buildCss() {
  return gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin({
      inline: ['none']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
}

function buildImg() {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
}

function buildFonts() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
}

function serve() {
  return browserSync.init(config);
}

function watch() {
  gulp.watch(path.watch.html, buildHtml);
  gulp.watch(path.watch.style, buildCss);
  gulp.watch(path.watch.img, buildImg);
  gulp.watch(path.watch.fonts, buildFonts);
}

function clean() {
  return rimraf(path.clean);
}

exports.build = gulp.series(buildHtml, buildCss, buildImg, buildFonts);
exports.buildFonts = buildFonts;
exports.clean = clean;
exports.watch = watch;
exports.buildHtml = buildHtml;
exports.buildCss = buildCss;
exports.buildImg = buildImg;
exports.serve = serve;
exports.default = gulp.series(clean, gulp.series(buildHtml, buildCss, buildImg, buildFonts), serve, watch);