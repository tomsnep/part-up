Package.describe({
    name: 'partup:client-update',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib',
        'tracker',
        'reactive-dict',
        'aldeed:autoform'
    ], 'client');

    api.addFiles([

        'Update.html',
        'Update.js'

    ], 'client');

});
