Template.modal_invite_to_partup.onCreated(function() {
    var template = this;
    var partupId = template.data.partupId;
    template.userIds = new ReactiveVar([]);
    template.searchQuery = new ReactiveVar('');

    template.loading = new ReactiveVar();

    template.subscribe('partups.one', template.data.partupId);

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

        // this meteor call still needs to be created
        Meteor.call('partups.user_suggestions', partupId, options, function(error, userIds) {
            if (error) {
                return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
            }

            template.userIds.set(userIds);

            template.loading.set(false);
        });
    });
});

Template.modal_invite_to_partup.helpers({
    data: function() {
        var template = Template.instance();
        return {
            suggestionIds: function() {
                return template.userIds.get();
            },
            textsearch: function() {
                return template.searchQuery.get() || '';
            },
            partupId: function() {
                return template.data.partupId;
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

/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_invite_to_partup.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        var partupId = template.data.partupId;
        var partup = Partups.findOne({_id: partupId});

        Intent.return('partup', {
            fallback_route: {
                name: 'partup',
                params: {
                    slug: partup.slug
                }
            }
        });
    },
    'submit form#suggestionsQuery': function(event, template) {
        event.preventDefault();
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
    }
});
