var gulp = require('gulp');
var chalk = require('chalk');
var exec = require('child_process').exec;
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var i18nFolders = require('./modules/i18n-folders');
var CrowdinApi = require('./modules/crowdin-api');

gulp.task('crowdin:upload-directories', function() {

    var folders = new i18nFolders({
        glob: path.resolve(__dirname, '../app/**/*.i18n.json'),
        splitFolder: 'app'
    });

    var crowdin = new CrowdinApi({
        apiKey: argv.apiKey,
        projectId: argv.projectId
    });


    folders.getDirectoryPaths().then(function(filePaths) {
        var filePathsMatrix = folders.getDirectoriesMatrix(filePaths);
        var addDirectoryPaths =  folders.getAddDirectoryPaths(filePathsMatrix);

        crowdin.addDirectoriesInSequence(addDirectoryPaths)
        .done(function(promise) {
           if(promise.error) {
               var errorMessage = JSON.stringify(chalk.red(promise.error.response), null, 4);
               console.log(errorMessage);
           } else {
               var successMessage = chalk.green(promise.success);
               console.log(successMessage);
           }
        });
    });
});