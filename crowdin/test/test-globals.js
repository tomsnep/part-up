global.chai = require('chai');
global.expect = global.chai.expect;
global.Promise = require('bluebird');
global.path = require('path');
global._ = require('lodash');
global.exec = require('child_process').exec;
global.chai.use(require("chai-as-promised"));