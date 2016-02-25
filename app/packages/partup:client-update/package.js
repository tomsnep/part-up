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
        'Update.js',

        'types/budget-changed.html',
        'types/description-changed.html',
        'types/end-date-changed.html',
        'types/image-changed.html',
        'types/invited.html',
        'types/location-changed.html',
        'types/message-added.html',
        'types/name-changed.html',
        'types/tags-added.html',
        'types/tags-changed.html',
        'types/tags-removed.html',
        'types/archived.html',
        'types/unarchived.html'
    ], 'client');

});
