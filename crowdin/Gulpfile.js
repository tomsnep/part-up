var gulp = require('gulp');
var chalk = require('chalk');
var exec = require('child_process').exec;
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));

var i18nFolders = require('./modules/i18n-folders');
var CrowdinApi = require('./modules/crowdin-api');

i18nFolders = new i18nFolders({
    glob: path.resolve(__dirname, '../app/**/*.i18n.json'),
    splitFolder: 'app'
});

var crowdinApi = new CrowdinApi({
    apiKey: 'b2c6e318159ca7ea007c043dd003a446',
    projectId: 'partup-test-project'
});

gulp.task('crowdin:upload-directories', function() {

    i18nFolders.getDirectoryPaths().then(function(filePaths) {
        var filePathsMatrix = i18nFolders.getDirectoriesMatrix(filePaths);
        var addDirectoryPaths =  i18nFolders.getAddDirectoryPaths(filePathsMatrix);

        crowdinApi.addDirectoriesInSequence(addDirectoryPaths)
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


gulp.task('crowdin:add-source-files', function() {
    i18nFolders.getAllFilePaths().then(function(filePaths) {
        crowdinApi.addSourceFiles(filePaths);
    });
});