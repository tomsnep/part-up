var _ = require('lodash');
var request = require('superagent');
var Promise = require('bluebird');
var retry = require('bluebird-retry');
var chalk = require('chalk');

var CrowdinApi = function(options) {
    this.apiBaseUrl = 'https://api.crowdin.com/api';
    this.options = _.extend({
        apiKey: '',
        projectId: ''
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