Template.modal_network_invite.onCreated(function() {
    var template = this;
    var userId = Meteor.userId();
    var networkSlug = template.data.networkSlug;
    template.subscribe('networks.one', networkSlug, function() {
        var network = Networks.findOne({slug: networkSlug});
        if (!network || network.isClosedForUpper(userId)) {
            Router.pageNotFound();
        }
    });
    template.userIds = new ReactiveVar([]);
    template.searchQuery = new ReactiveVar('');

    template.loading = new ReactiveVar();

    // Submit filter form
    template.submitFilterForm = function() {
        Meteor.defer(function() {
            var form = template.find('form#suggestionsQuery');
            $(form).submit();
        });
    };

    template.autorun(function() {
        template.loading.set(true);
        var query = template.searchQuery.get();

        var options = {
            query: query
        };

        Meteor.call('networks.user_suggestions', networkSlug, options, function(err, userIds) {
            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }

            template.userIds.set(userIds);

            template.loading.set(false);
        });
    });
});

Template.modal_network_invite.helpers({
    data: function() {
        var template = Template.instance();
        return {
            suggestionIds: function() {
                return template.userIds.get();
            },
            textsearch: function() {
                return template.searchQuery.get() || '';
            },
            networkSlug: function() {
                return template.data.networkSlug;
            },
            network: function() {
                return Networks.findOne({slug: template.data.networkSlug});
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            loading: function() {
                return template.loading.get();
            }
        };
    }
});

Template.modal_network_invite.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();

        var network = Networks.findOne({slug: template.data.networkSlug});

        Intent.return('network', {
            fallback_route: {
                name: 'network',
                params: {
                    slug: network.slug
                }
            }
        });
    },

    'submit form#suggestionsQuery': function(event, template) {
        event.preventDefault();

        template.loading.set(true);

        var form = event.currentTarget;

        template.searchQuery.set(form.elements.search_query.value);
    },
    'click [data-reset-search-query-input]': function(event, template) {
        event.preventDefault();
        $('[data-search-query-input]').val('');
        template.submitFilterForm();
    },
    'keyup [data-search-query-input]': function(e, template) {
        template.submitFilterForm();
    },

    // Location selector events
    'click [data-open-locationselector]': function(event, template) {
        event.preventDefault();
        var current = template.location.selectorState.get();
        template.location.selectorState.set(!current);
    },
    'click [data-reset-selected-location]': function(event, template) {
        event.preventDefault();
        template.location.value.set('');
        template.submitFilterForm();
    }
});
