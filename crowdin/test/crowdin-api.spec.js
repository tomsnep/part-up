var i18nFolders = require('../modules/i18n-folders');
var CrowdinApi = require('../modules/crowdin-api');

i18nFolders = new i18nFolders({
    glob: path.resolve(__dirname, '../mock-folders/app/**/*.i18n.json'),
    splitFolder: 'app'
});

var crowdinApi = new CrowdinApi({
    apiKey: 'b2c6e318159ca7ea007c043dd003a446',
    projectId: 'partup-test-project'
});

describe('crowdin real api', function() {

    before(function(done) {
        crowdinApi.deleteDirectory('app').then(function() {
            done();
        }).catch(function() {
            done();
        });
    });

    it('should add directory', function(done) {
        expect(crowdinApi.addDirectory('app')).to.be.fulfilled.and.notify(done);
    });

    it('should remove directory', function(done) {
        expect(crowdinApi.deleteDirectory('app')).to.be.fulfilled.and.notify(done);
    });

    it('should retry add folders in sequence until it finished without errors', function(done) {

        /*
         Mocking sequence folder structure
         [
         'app',
         'app/i18n',
         'app/packages',
         'app/packages/partup:client-footer',
         'app/packages/partup:client-footer/i18n',
         'app/packages/partup:client-pages',
         'app/packages/partup:client-pages/i18n',
         'app/packages/partup:client-pages/i18n/app',
         'app/packages/partup:client-pages/i18n/app/discover',
         'app/packages/partup:client-pages/i18n/app/discover/partials'
         ]
         */

        i18nFolders.getDirectoryPaths().then(function(filePaths) {
            var filePathsMatrix = i18nFolders.getDirectoriesMatrix(filePaths);
            var addDirectoryPaths =  i18nFolders.getAddDirectorySequencePaths(filePathsMatrix);
            crowdinApi.addDirectoriesInSequence(addDirectoryPaths).done(function(promise) {
                expect(promise.error).to.equal(undefined);
                done();
            });
        });
    });

    it('should add files in to the server directories', function(done) {
        i18nFolders.getAllFilePaths().then(function(files) {
            expect(crowdinApi.addSourceFiles(files)).to.be.fulfilled.and.notify(done);
        });
    });

    it('should upload translation langugages files', function(done) {
        i18nFolders.getAllFilePaths().then(function(files) {
            expect(crowdinApi.uploadTranslations(files, 'nl')).to.be.fulfilled.and.notify(done);
        });
    });
});

