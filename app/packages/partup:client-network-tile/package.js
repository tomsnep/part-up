Package.describe({
    name: 'partup:client-network-tile',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'tap:i18n'
    ], ['client', 'server']);

    api.use([
        'templating',
        'partup:lib'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',

        'NetworkTile.html',
        'NetworkTile.js',

        '../../i18n/phraseapp.en.i18n.json',
        '../../i18n/phraseapp.nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        '../../i18n/phraseapp.en.i18n.json',
        '../../i18n/phraseapp.nl.i18n.json'
    ], 'server');
});
