Package.describe({
    name: 'partup:client-dropdowns',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'templating',
        'partup:lib',
        'reactive-var'
    ], 'client');

    api.addFiles([

        'dropdowns.js',

        'notifications/notifications.html',
        'notifications/notifications.js',
        'notifications/partials/notification.html',
        'notifications/partials/notification.js',

        'profile/profile.html',
        'profile/profile.js',

        'partials/updates-actions/updates-actions.html',
        'partials/updates-actions/updates-actions.js',
        'partials/activities-actions/activities-actions.html',
        'partials/activities-actions/activities-actions.js'

    ], 'client');

});
