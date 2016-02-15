var _ = require('lodash');
var request = require('superagent');
var Promise = require('bluebird');
var retry = require('bluebird-retry');
var chalk = require('chalk');
var path = require('path');
var exec = require('child_process').exec;

var CrowdinApi = function(options) {
    this.apiBaseUrl = 'https://api.crowdin.com/api';
    this.options = _.extend({
        apiKey: '',
        projectId: '',
        maxFilesPerTransfer: 20,
        sourceLanguage: 'en'
    }, options);
};

CrowdinApi.prototype.getMethodUrl = function(methodName) {
  return this.apiBaseUrl + '/project/' + this.options.projectId + '/' + methodName + '?key=' + this.options.apiKey;
};

CrowdinApi.prototype.addDirectory = function(directoryPath) {
  return new Promise(function(resolve, reject) {
      request.post(this.getMethodUrl('add-directory'))
      .query('name='+directoryPath.replace(':', '-'))
      .end(function(err, res) {
          if(err) { reject(err); }
          resolve(res);
      })
  }.bind(this));
};

CrowdinApi.prototype.uploadTranslations = function(files, languageCode) {

    var curlParams = [],
        promises = [];

    files = files.filter(function(file) {
        return file.sourcePath.indexOf(languageCode+'.i18n.json') !== -1;
    }.bind(this));

    var chunkFiles = _.chunk(files, Math.ceil(files.length / this.options.maxFilesPerTransfer));


    chunkFiles.forEach(function(files) {
        var fileParams = '';
        files.forEach(function(file) {
            var fileName = file.destinationPath.replace(':', '-');
            fileName = fileName.replace(languageCode+'.i18n.json', this.options.sourceLanguage+'.i18n.json');
            fileParams += '-F files['+fileName+']=@'+file.sourcePath + ' -F auto_approve_imported=1 -F language='+languageCode + ' ';
        }.bind(this));
        curlParams.push(fileParams);
    }.bind(this));

    curlParams.forEach(function(fileParams) {
        promises.push(new Promise(function(resolve, reject) {
            exec('curl ' + fileParams + this.getMethodUrl('upload-translation'), function(err, stdout) {
                if(err) { reject(err); }
                var addFileMessage = chalk.yellow('\n\n ========= ' + fileParams + ' ========\n\n' + stdout);
                console.log(addFileMessage);
                resolve(addFileMessage);
            });
        }.bind(this)));
    }.bind(this));

    return Promise.all(promises);
};


CrowdinApi.prototype.addSourceFiles = function(files) {

    var curlParams = [],
        promises = [];

    files = files.filter(function(file) {
       return file.sourcePath.indexOf(this.options.sourceLanguage+'.i18n.json') !== -1;
    }.bind(this));

    var chunkFiles = _.chunk(files, Math.ceil(files.length / this.options.maxFilesPerTransfer));


    chunkFiles.forEach(function(files) {
        var fileParams = '';
        files.forEach(function(file) {
            fileParams += '-F files['+file.destinationPath.replace(':', '-')+']=@'+file.sourcePath + ' ';
        });
        curlParams.push(fileParams);
    });

    curlParams.forEach(function(fileParams) {
        promises.push(new Promise(function(resolve, reject) {
            exec('curl ' + fileParams + this.getMethodUrl('add-file'), function(err, stdout) {
                if(err) { reject(err); }
                var addFileMessage = chalk.yellow('\n\n ========= ' + fileParams + ' ========\n\n' + stdout);
                console.log(addFileMessage);
                resolve(addFileMessage);
            });
        }.bind(this)));
    }.bind(this));

    return Promise.all(promises);
};

CrowdinApi.prototype.deleteDirectory = function(directoryPath) {
    return new Promise(function(resolve, reject) {
        request.post(this.getMethodUrl('delete-directory'))
            .query('name='+directoryPath.replace(':', '-'))
            .end(function(err, res) {
                if(err) { reject(err); }
                resolve(res);
            })
    }.bind(this));
};

CrowdinApi.prototype.addDirectoriesInSequence = function(directoryPaths) {
    var self = this;
    var counter = 0;
    function retryAddCrowdinDirectory() {
        return new Promise(function(resolve, reject){

            self.addDirectory(directoryPaths[counter]).then(function(res) {

                console.log(chalk.yellow(counter +') directory: ' + directoryPaths[counter] + ' added'));

                if(counter >= directoryPaths.length - 1) {
                    var successMessage = '\nCrowdinApi folders:\n=================\n' + directoryPaths.join(',\n') + '\nare uploaded!';

                    console.log(chalk.green(successMessage));

                    resolve({
                        success: successMessage
                    });
                }
                reject(); counter++;

            }).catch(function(error) {

                console.log(chalk.red(JSON.stringify(error, null, 4)));

                resolve({
                    error: error
                });
            });
        })
    }

    return retry(retryAddCrowdinDirectory, {max_tries: directoryPaths.length});
};

module.exports = CrowdinApi;