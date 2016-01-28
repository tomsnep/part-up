Template.Bubble.onCreated(function() {

});

Template.Bubble.helpers({
    random: function() {
        return Math.floor(Math.random() * (24 - 0 + 1) + 0);
    }
});

Template.Bubble.events({
    'click [data-bubble]': function(event, template) {
        $(event.currentTarget).addClass('pu-bubble-active');

    }
});
