var i18nFolders = require('../modules/i18n-folders');
i18nFolders = new i18nFolders({
    glob: path.resolve(__dirname, '../mock-folders/app/**/*.i18n.json'),
    splitFolder: 'app'
});

describe('i18nFolder', function() {
    var filePaths;

    before(function(done) {
        i18nFolders.getDirectoryPaths().then(function(paths) {
            filePaths = paths;
            done();
        });
    });
    /*
       example expected output
     [
        'app/i18n',
        'app/packages/partup:client-footer/i18n',
        'app/packages/partup:client-pages/i18n/app/discover',
        'app/packages/partup:client-pages/i18n/app/discover/partials'
     ]
     */
    it('should get all the paths without duplication', function() {
        expect(filePaths.length).to.equal(4);
        expect(filePaths[0]).to.equal('app/i18n');
        expect(filePaths[1]).to.equal('app/packages/partup:client-footer/i18n');
        expect(filePaths[2]).to.equal('app/packages/partup:client-pages/i18n/app/discover');
        expect(filePaths[3]).to.be.equal('app/packages/partup:client-pages/i18n/app/discover/partials');
    });

    it('should get directory matrix', function() {
        expect(i18nFolders.getDirectoriesMatrix(filePaths)).to.eql([
            ['app', 'i18n'],
            ['app', 'packages', 'partup:client-footer', 'i18n'],
            ['app', 'packages', 'partup:client-pages', 'i18n', 'app', 'discover'],
            ['app', 'packages', 'partup:client-pages', 'i18n', 'app', 'discover', 'partials']
        ]);
    });

    it('should return the incremental add folder steps filepaths', function() {

        var matrix =i18nFolders.getDirectoriesMatrix(filePaths);

        expect(i18nFolders.getAddDirectoryPaths(matrix)).to.eql(
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
        );

    });
});