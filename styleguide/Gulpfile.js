'use strict';

var gulp   = require('gulp');
var gutil  = require('gulp-util');
var config  = require('./config');

/**
 * Clean up the index file
 */
/*gulp.task('docs:index:clean', function(cb) {
    require('del')([
        './dist/*'
    ], cb);
});
*/

/**
 * Clean up the styleguide
 */
gulp.task('docs:styleguide:clean', function(cb) {
    require('del')([
        config.styleguide.assets.dest,
        config.styleguide.html.dest
    ], cb);
});

/**
 * Generate the styleguide
 */
gulp.task('docs:styleguide', [], function() {
    var deepFillIn = require('mout/object/deepFillIn');
    var fs         = require('fs');
    var path       = require('path');
    var sass       = require('gulp-sass');
    var swig       = require('gulp-swig');
    var swigHighlight    = require('swig-highlight');
    var properCase = require('mout/string/properCase');

    var getDirectoriesIn = function(fullDir) {
        return fs.readdirSync(fullDir)
            // Filter non-dirs and dotfiles
            .filter(function(dirName) {
                var dir = path.join(fullDir, dirName);
                var isDir = fs.lstatSync(dir).isDirectory();
                var isNoDotfile = dirName[0] !== '.';

                return isDir && isNoDotfile;
            });
    };

    var readComponentsFor = function(name) {
        var _fullDir = config.styleguide.components.src + '/' + name;

        return getDirectoriesIn(_fullDir).map(function(component) {
            var componentJson = path.resolve(path.join(_fullDir, component, component + '.json'));
            var componentHtml = path.resolve(path.join(_fullDir, component, component + '.html'));
            var componentMoreHtml = path.resolve(path.join(_fullDir, component, component + '-more.html'));

            var jsonContent = fs.readFileSync(componentJson, 'utf8');
            if (!jsonContent) {
                throw new Error('Gulp docs error: componentJson not found');
            }

            var json = JSON.parse(jsonContent);
            var type = json.type || 'component';
            var hasMoreHtml = type === 'component' && fs.existsSync(componentMoreHtml);

            return {
                title: json.title,
                description: json.description,
                type: type,
                path: componentHtml,
                morePath: hasMoreHtml ? componentMoreHtml : undefined
            };
        });
    };

    var compileHtml = function() {
        return gulp.src(config.styleguide.html.src)
        .pipe(swig(deepFillIn({
            setup: function(swig) {
                swigHighlight.apply(swig);
//                swig.setFilter('marked', markedSwigFilter);
            },
            data: {
                readComponentsFor: readComponentsFor
            }
        }, config.swig.options)))
        .pipe(gulp.dest(config.styleguide.html.dest));
    };

    var copyAssets = function() {
        return gulp.src(config.styleguide.assets.src)
        .pipe(gulp.dest(config.styleguide.assets.dest));
    };

    var copyFonts = function() {
        return gulp.src(config.styleguide.fonts.src)
        .pipe(gulp.dest(config.styleguide.fonts.dest));
    };

    return require('merge-stream')(
        compileHtml(),
        copyAssets(),
        copyFonts()
    );
});

/**
 * Clean up the styles
 */
/*gulp.task('docs:styles:clean', function(cb) {
    require('del')(config.styles.dest, cb);
});
*/

/**
 * Compile the project styles
 */
gulp.task('docs:projectstyles', [], function() {
    var sass = require('gulp-sass');

    return gulp.src(config.partupstyles.src)
        .pipe(sass({includePaths:['../app/']}))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('Sass compiler error: ' + err.message));
            gutil.beep();
        })
        .pipe(gulp.dest(config.partupstyles.dest))
        .on('finish', function() {
            gutil.log(gutil.colors.cyan('docs:partupstyles') + ': ' + gutil.colors.green('styles') + ' written');
        });
});

/**
 * Compile the styleguide styles
 */
gulp.task('docs:docstyles', [], function() {
    var sass = require('gulp-sass');

    return gulp.src(config.docstyles.src)
        .pipe(sass())
        .on('error', function(err) {
            gutil.log(gutil.colors.red('Sass compiler error: ' + err.message));
            gutil.beep();
        })
        .pipe(gulp.dest(config.docstyles.dest))
        .on('finish', function() {
            gutil.log(gutil.colors.cyan('docs:styles') + ': ' + gutil.colors.green('styles') + ' written');
        });
});

gulp.task('docs', ['docs:docstyles', 'docs:projectstyles', 'docs:styleguide']);
