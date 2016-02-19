Package.describe({
    name: 'partup:client-admin-createswarm',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'tap:i18n',
        'partup:lib'
    ], ['client', 'server']);

    api.use([
        'templating',
        'aldeed:autoform',
        'reactive-dict'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',

        'AdminCreateSwarm.html',
        'AdminCreateSwarm.js',

        'templates/_EditSwarm.html',
        'templates/_EditSwarm.js',

        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'server');
});
