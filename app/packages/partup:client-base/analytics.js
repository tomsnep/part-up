var SECOND_TRACKER_NAME = 'newPartupAnalyticsTracker';

Meteor.startup(function() {

    // Register second tracker
    analytics.ready(function() {
        var createOptions = {
            'name': SECOND_TRACKER_NAME
        };

        if (Meteor.settings.public.development) {
            createOptions.cookieDomain = 'none';
        }

        ga('create', Meteor.settings.public.secondGATracker, createOptions);

        // First page second tracker
        ga(SECOND_TRACKER_NAME + '.send', 'pageview', Router.current().route.path());
    });

    // Page switch events
    analytics.on('page', function(event, properties, options) {

        // Second tracker
        ga(SECOND_TRACKER_NAME + '.send', 'pageview', properties);

    });

    // Custom track events
    analytics.on('track', function(event, properties, options) {

        // Second tracker
        ga(SECOND_TRACKER_NAME + '.send', {
            hitType: 'event',
            eventCategory: properties.category || 'All',
            eventAction: event,
            eventLabel: properties.label || 'All'
        });

        // Track intercom event
        if (Intercom && Intercom.public_api && Intercom.public_api.trackEvent) {
            Intercom.public_api.trackEvent(event, properties);
        }

    });
});
