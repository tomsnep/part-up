var glob = require('glob');
var Promise = require('bluebird');
var _ = require('lodash');
var path = require('path');

var i18nFolders = function(options) {
    this.options = _.extend({
        glob: '',
        splitFolder: ''
    }, options);
};

i18nFolders.prototype.getAllFilePaths = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        glob(self.options.glob, function (error, filePaths) {
            if(error) {
                reject(error);
            }
            filePaths = filePaths.map(function(filePath) {
                var dir = filePath;
                var splitPath = dir.substring(dir.indexOf(self.options.splitFolder), dir.length);
                return {
                    destinationPath: splitPath,
                    sourcePath: filePath
                };
            });
            resolve(_.uniq(filePaths));
        });
    });
};

i18nFolders.prototype.getDirectoryPaths = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        glob(self.options.glob, function (error, filePaths) {
            if(error) {
                reject(error);
            }
            filePaths = filePaths.map(function(filePath) {
                var dir = path.parse(filePath).dir;
                var splitPath = dir.substring(dir.indexOf(self.options.splitFolder), dir.length);
                return splitPath;
            });
            resolve(_.uniq(filePaths));
        });
    });
};

i18nFolders.prototype.getDirectoriesMatrix = function(directoryPaths) {
    var output = [];
    directoryPaths.forEach(function(directoryPath) {
        output.push(directoryPath.split(path.sep));
    });
    return output;
};

i18nFolders.prototype.getAddDirectoryPaths = function(directoryMatrix) {
    var output = [];
    for(var i = 0; i < directoryMatrix.length; i++) {
        var outputPath = '';
        for(var j = 0; j < directoryMatrix[i].length; j++){
            var directoryName = directoryMatrix[i][j];
            outputPath += '/' + directoryName;
            outputPath = outputPath.replace(/^\//, '');
            output.push(outputPath);
        }
    }
    return _.uniq(output);
};


module.exports = i18nFolders;