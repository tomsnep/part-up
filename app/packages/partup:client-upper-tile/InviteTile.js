Template.InviteTile.onCreated(function() {
    var template = this;
    template.inviting = new ReactiveVar(false);
    template.loading = new ReactiveVar(true);
    template.subscribe('users.one', template.data.userId, {
        onReady: function() {
            template.loading.set(false);
        }
    });
});

Template.InviteTile.helpers({
    data: function() {
        var template = Template.instance();
        var data = Template.currentData();
        var user = Meteor.users.findOne({_id: template.data.userId});
        var currentUser = Meteor.user();
        var self = this;
        return {
            user: function() {
                return user;
            },
            participationScore: function() {
                return User(user).getReadableScore();
            },
            highlightText: function() {
                var highlight = Partup.client.sanitize(data.highlight);
                var description = user.profile.description || '';
                var text = description.length ? description.split(highlight).join('<span>' + highlight + '</span>') : '';
                return text;
            },
            relevance: function() {
                var userPartups = user.upperOf || [];
                var userSupporter = user.supporterOf || [];
                var userNetworks = user.networks || [];
                var currentUserPartups = currentUser.upperOf || [];
                var currentUserNetworks = currentUser.networks || [];
                return {
                    partnerInSamePartupsCount: function() {
                        return _.intersection(userPartups, currentUserPartups).length;
                    },
                    memberOfSameNetworkCount: function() {
                        return _.intersection(userNetworks, currentUserNetworks).length;
                    },
                    supporterOfPartupsCurrentUserIsPartnerOfCount: function() {
                        return _.intersection(userSupporter, currentUserPartups).length;
                    }
                };
            }
        };
    },
    state: function() {
        var template = Template.instance();
        var partup = Partups.findOne(template.data.partupId);
        var user = Meteor.users.findOne({_id: template.data.userId});
        return {
            inviteSent: function() {
                return partup.hasInvitedUpper(user._id);
            },
            alreadyPartner: function() {
                return User(user).isPartnerInPartup(partup._id);
            },
            inviteLoadingForUser: function() {
                return template.inviting.get();
            },
            loading: function() {
                return template.loading.get();
            }
        };
    }
});

Template.InviteTile.events({
    'click [data-partup-invite]': function(event, template) {
        var partupId = template.data.partupId;
        var partup = Partups.findOne(partupId);

        var invitingUserId = $(event.currentTarget).data('partup-invite');
        var invitingUser = Meteor.users.findOne({_id: template.data.userId});

        if (User(invitingUser).isPartnerInPartup(partupId) || partup.hasInvitedUpper(invitingUserId)) return;

        template.inviting.set(true);

        Meteor.call('partups.invite_existing_upper', partupId, invitingUserId, function(err) {
            template.inviting.set(false);

            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }
        });
    }
});
