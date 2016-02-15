Template.modal_swarm_settings_quotes_form.onCreated(function() {
    this.authorSelection = new ReactiveVar();
    this.state = new ReactiveDict();
    this.state.set('submitting', false);
});

Template.modal_swarm_settings_quotes_form.events({
    'click [data-remove]': function(event, template) {
        console.log(template, this);
        Meteor.call('swarms.remove_quote', this.swarmId, this.quote._id);
    }
});

Template.modal_swarm_settings_quotes_form.helpers({
    data: function() {
        return {

        };
    },
    state: function() {
        var template = Template.instance();
        return {
            submitting: function() {
                return template.state.get('submitting');
            }
        };
    },
    form: function() {
        var template = Template.instance();
        return {
            schema: Partup.schemas.forms.swarmQuote,
            authorSelectionReactiveVar: function() {
                return template.authorSelection;
            },
            authorLabel: function() {
                return function(author) {
                    return author.name;
                };
            },
            authorQuery: function() {
                return function(query, sync, async) {
                    Meteor.call('users.upper_autocomplete', query, '', true, function(error, authors) {
                        lodash.each(authors, function(p) {
                            p.value = p.name; // what to show in the autocomplete list
                        });
                        async(authors);
                    });
                };
            },
            authorFormvalue: function() {
                return function(author) {
                    return author._id;
                };
            },
        };
    },
    static: function() {
        return {
            authorFieldPlaceholder: __('pages-modal-admin-featured-partups-form-partup-placeholder')
        };
    }
});

AutoForm.addHooks('quoteForm', {
    onSubmit: function(doc) {
        var self = this;
        self.event.preventDefault();

        var template = self.template.parent();
        template.state.set('submitting', true);
        doc.author_id = template.authorSelection.curValue._id;
        Meteor.call('swarms.add_quote', template.data.swarmId, doc, function(error) {
            if (error) return console.error(error);
            template.state.set('submitting', false);

            AutoForm.resetForm(self.formId);

            self.done();
        });

        return false;
    }
});
