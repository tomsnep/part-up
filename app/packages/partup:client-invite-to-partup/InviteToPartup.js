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
    'click [data-add]': function(event, template) {
        event.preventDefault();
        AutoForm.addArrayItem('inviteToPartupForm', 'invitees');
    },
    'click [data-remove]': function(event, template){
        event.preventDefault();
        var self = this;
        var index = self.index;
        Autoform.removeArrayItem('inviteToPartupForm', 'invitees', index);
    }
});

AutoForm.hooks({
    inviteToPartupForm: {
        onSuccess: function(formType, result) {},
        onError: function(formType, error) {
            console.log(formType,error)
        },
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            console.log(insertDoc)
            return
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
