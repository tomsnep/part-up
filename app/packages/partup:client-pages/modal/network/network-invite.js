Template.modal_network_invite.onCreated(function() {
    var template = this;
    var userId = Meteor.userId();
    template.subscribe('networks.one', template.data.networkSlug, function() {
        var network = Networks.findOne({slug: template.data.networkSlug});
        if (!network || network.isClosedForUpper(userId)) {
            Router.pageNotFound();
        }
    });
    template.userIds = new ReactiveVar([]);
    template.subscription = new ReactiveVar();
    template.suggestionsOptions = new ReactiveVar({});

    template.inviting = new ReactiveDict(); // loading boolean for each individual invite button

    template.loading = new ReactiveVar();

    // Submit filter form
    template.submitFilterForm = function() {
        Meteor.defer(function() {
            var form = template.find('form#suggestionsQuery');
            $(form).submit();
        });
    };

    // Location filter datamodel
    template.location = {
        value: new ReactiveVar(),
        selectorState: new ReactiveVar(false, function(a, b) {
            if (!b) return;

            // Focus the searchfield
            Meteor.defer(function() {
                var searchfield = template.find('form#locationSelector').elements.search;
                if (searchfield) searchfield.focus();
            });
        }),
        selectorData: function() {
            var DROPDOWN_ANIMATION_DURATION = 200;

            return {
                onSelect: function(location) {
                    template.location.selectorState.set(false);

                    Meteor.setTimeout(function() {
                        template.location.value.set(location);
                        template.submitFilterForm();
                    }, DROPDOWN_ANIMATION_DURATION);
                }
            };
        }
    };

    template.autorun(function() {
        template.loading.set(true);
        var network = Networks.findOne({slug: template.data.networkSlug});
        if (!network) return;
        var options = template.suggestionsOptions.get();

        Meteor.call('networks.user_suggestions', network._id, options, function(err, userIds) {
            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }

            // Sort users by invited first
            userIds.sort(function(userId) {
                return network.isUpperInvited(userId) ? 1 : -1;
            });

            template.userIds.set(userIds);
            template.subscription.set(template.subscribe('users.by_ids', userIds));

            template.loading.set(false);
        });
    });
});

Template.modal_network_invite.helpers({
    network: function() {
        return Networks.findOne({slug: this.networkSlug});
    },
    inviteLoadingForUser: function(userId) {
        return Template.instance().inviting.get(userId);
    },
    loading: function() {
        return Template.instance().loading.get();
    },
    suggestions: function() {
        var sub = Template.instance().subscription.get();
        if (!sub || !sub.ready()) return;

        var suggestions = [];
        var userIds = Template.instance().userIds.get();
        for (var i = 0; i < userIds.length; i++) {
            suggestions.push(Meteor.users.findOne({_id: userIds[i]}));
        }

        return suggestions;
    },
    inviteSent: function() {
        var networkSlug = Template.instance().data.networkSlug;
        var network = Networks.findOne({slug: networkSlug});
        if (!network) return;

        return network.isUpperInvited(this._id);
    },
    alreadyMember: function() {
        var networkSlug = Template.instance().data.networkSlug;
        var network = Networks.findOne({slug: networkSlug});

        return network.hasMember(this._id);
    },

    // Location
    locationValue: function() {
        return Template.instance().location.value.get();
    },
    locationSelectorState: function() {
        return Template.instance().location.selectorState;
    },
    locationSelectorData: function() {
        return Template.instance().location.selectorData;
    },
    // Query
    textsearchData: function() {
        return Template.instance().suggestionsOptions.get().query || '';
    },
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
    'click [data-invite-id]': function(event, template) {
        var userId = $(event.currentTarget).data('invite-id');
        var network = Networks.findOne({slug: template.data.networkSlug});

        if (network.hasMember(userId) || network.isUpperInvited(userId)) return;

        template.inviting.set(userId, true);
        Meteor.call('networks.invite_existing_upper', network._id, userId, function(err) {
            template.inviting.set(userId, false);

            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }
        });
    },

    'submit form#suggestionsQuery': function(event, template) {
        event.preventDefault();

        template.loading.set(true);

        var form = event.currentTarget;

        template.suggestionsOptions.set({
            query: form.elements.search_query.value || undefined,
            locationId: form.elements.location_id.value || undefined
        });

        window.scrollTo(0, 0);
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
