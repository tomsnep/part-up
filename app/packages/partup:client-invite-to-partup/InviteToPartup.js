Template.InviteToPartup.onCreated(function() {
    var template = this;
    template.submitting = new ReactiveVar(false);
    template.invites = new ReactiveVar([{
        name: 'name',
        email: 'email'
    }]);
});

Template.InviteToPartup.helpers({
    data: function() {
        var template = Template.instance();
        return {
            invites: function() {
                return template.invites.get();
            }
        };
    },
    form: function() {
        var template = Template.instance();
        var partup = Partups.findOne(template.data.partupId);
        var user = Meteor.user();
        return {
            schema: Partup.schemas.forms.inviteUpper,
            doc: function() {
                return {
                    message: TAPi18n.__('invite-to-partup-popup-message-prefill', {
                        partupName: partup.name,
                        inviterName: user.profile.name
                    })
                };
            },
            invites: function() {
                return template.invites.get();
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            submitting: function() {
                return template.submitting.get();
            },
        };
    }
});

Template.InviteToPartup.events({
    'keyup [data-add]': function(event, template) {
        event.preventDefault();
        var inputs = template.$('input');
        var allHaveValues = true;
        _.each(inputs, function(item) {
            if (!$(item).val()) allHaveValues = false;
        });
        var last = $(event.currentTarget).data('add');
        if (allHaveValues && last) AutoForm.addArrayItem('inviteToPartupForm', 'invitees');
        $(event.currentTarget).removeClass('pu-state-selectable');
    },
    'click [data-remove]': function(event, template) {
        event.preventDefault();
        AutoForm.removeArrayItem('inviteToPartupForm', 'invitees', this.index);
    }
});

AutoForm.hooks({
    inviteToPartupForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            console.log(insertDoc);
            return false;
            var self = this;
            var template = self.template.parent();

            var parent = Template.instance().parent();
            parent.submitting.set(true);

            var partupId = template.data.partupId;

            Meteor.call('partups.invite_by_email', partupId, insertDoc,
                function(error, result) {
                    parent.submitting.set(false);
                    if (error) {
                        return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
                    }
                    Partup.client.notify.success(TAPi18n.__('invite-to-partup-popup-success'));
                    Partup.client.popup.close();
                });

            return false;
        }
    }
});
