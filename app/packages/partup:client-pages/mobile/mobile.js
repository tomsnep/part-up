Template.mobile.onCreated(function() {

});
Template.mobile.helpers({
    'click [data-logout]': function eventClickLogout (event, template) {
        event.preventDefault();
        Meteor.logout();
    },
})
