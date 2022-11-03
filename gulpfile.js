const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('node-sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const groupcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

const { SRC_PATH, DOCS_PATH, STYLE_LIBS, JS_LIBS } = require('./gulp.config');

task('clean', () => {
  return src(`${DOCS_PATH}/**/*`, { read: false })
    .pipe(rm())
});

task('cleanDist', () => {
  return src("./dist/**/*", { read: false })
    .pipe(rm())
});

task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DOCS_PATH))
    .pipe(dest("./dist"))
    .pipe(reload({ stream: true }))
});

task('copy:img', () => {
  return src(`${SRC_PATH}/images/**/*`)
    .pipe(dest(`${DOCS_PATH}/images`))
    .pipe(dest("./dist/images"))
    .pipe(reload({ stream: true }));
})

task('icons', () => {
  return src(`${SRC_PATH}/images/**/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            //  attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(`${DOCS_PATH}/images/icons`))
    .pipe(dest("./dist/images/icons"));
});

task('styles', () => {
  return src([...STYLE_LIBS, './src/styles/main.scss'])
    .pipe(gulpif(env == 'dev', sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    //  .pipe(px2rem())
    .pipe(gulpif(env == 'dev',
      autoprefixer({
        browsers: ['defaults'],
        cascade: false
      })))

    .pipe(gulpif(env == 'prod', groupcmq()))
    .pipe(gulpif(env == 'prod', cleanCSS()))
    .pipe(gulpif(env == 'dev', sourcemaps.write()))
    .pipe(dest(DOCS_PATH))
    .pipe(dest("./dist"))
    .pipe(reload({ stream: true }));
});

task('scripts', () => {
  return src([...JS_LIBS, './src/scripts/*.js'])
    .pipe(gulpif(env == 'dev', sourcemaps.init()))
    .pipe(concat('main.min.js', { newLine: ';' }))
    .pipe(gulpif(env == 'prod', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env == 'prod', uglify()))
    .pipe(gulpif(env == 'dev', sourcemaps.write()))
    .pipe(dest(DOCS_PATH))
    .pipe(dest("./dist"))
    .pipe(reload({ stream: true }));
});


task('server', () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    open: false
  });
});

task("watch", () => {
  watch('./src/styles/**/*.scss', series('styles'));
  watch('./src/*.html', series('copy:html'));
  watch('./src/images/**/*', series('copy:img'));
  watch('./src/scripts/*.js', series('scripts'));
  watch('./src/images/**/*.svg', series('icons'));
});


task('default', series('clean', "cleanDist",
  parallel('copy:html', 'copy:img', 'icons', 'styles', 'scripts'),
  parallel("watch", 'server')
));

task('build', series('clean', "cleanDist",
  parallel('copy:html', 'copy:img', 'icons', 'styles', 'scripts'),
));