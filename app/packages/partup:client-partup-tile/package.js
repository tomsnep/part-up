Package.describe({
    name: 'partup:client-partup-tile',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib',
        'reactive-dict'
    ], 'client');

    api.addFiles([

        'helpers.js',

        'PartupTile.html',
        'PartupTile.js',

        'PartupTileFeatured.html',
        'PartupTileFeatured.js'

    ], 'client');
});
