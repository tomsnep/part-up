Template.modal_swarm_settings_quotes_form.onCreated(function() {
    this.authorSelection = new ReactiveVar();
    this.state = new ReactiveDict();
    this.state.set('submitting', false);
    this.charactersLeft = new ReactiveDict();
    this.charactersLeft.set('content', Partup.schemas.forms.swarmQuote._schema.max);

});

Template.modal_swarm_settings_quotes_form.events({
    'click [data-remove]': function(event, template) {
        console.log(template, this);
        Meteor.call('swarms.remove_quote', this.swarmId, this.quote._id);
    }
});

Template.modal_swarm_settings_quotes_form.helpers({
    data: function() {
        var template = Template.instance();
        var data = this;
        return {
            quote: function() {
                if (data.quote._id) return Partup.transformers.swarm.toFormQuote(data.quote);
                return {
                    author_id: null,
                    content: null
                }
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            submitting: function() {
                return template.state.get('submitting');
            },
            contentCharactersLeft: function() {
                return template.charactersLeft.get('content');
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
            authorFieldPlaceholder: __('modal-swarm-quotes-form-author-placeholder'),
            quoteFieldPlaceholder: __('modal-swarm-quotes-form-quote-placeholder')
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
            template.authorSelection.set(false);
            AutoForm.resetForm(self.formId);

            self.done();
        });

        return false;
    }
});
