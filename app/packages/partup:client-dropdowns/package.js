Package.describe({
    name: 'partup:client-dropdowns',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'tap:i18n',
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'templating',
        'partup:lib',
        'reactive-var'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',

        'dropdowns.js',

        'notifications/notifications.html',
        'notifications/notifications.js',
        'notifications/partials/notification.html',
        'notifications/partials/notification.js',

        'profile/profile.html',
        'profile/profile.js',

        'partials/partup/updates-actions.html',
        'partials/partup/updates-actions.js',
        'partials/partup/activities-actions.html',
        'partials/partup/activities-actions.js',

        'partials/network/network-actions.html',
        'partials/network/network-actions.js',

        'partials/profile/upper-actions.html',
        'partials/profile/upper-actions.js',
        'partials/profile/supporter-actions.html',
        'partials/profile/supporter-actions.js',

        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'server');
});
