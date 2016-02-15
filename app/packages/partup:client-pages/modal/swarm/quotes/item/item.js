Template.QuoteItem.onCreated(function() {
    this.form = new ReactiveVar(this.data.state === 'form');
});

Template.QuoteItem.helpers({
    state: function() {
        var template = Template.instance();
        return {
            form: function() {
                return template.form.get();
            }
        };
    }
});

Template.QuoteItem.events({
    'click [data-edit]': function(event, template) {
        template.form.set(true);
    },
    'click [data-close]': function(event, template) {
        template.form.set(false);
    }
})
