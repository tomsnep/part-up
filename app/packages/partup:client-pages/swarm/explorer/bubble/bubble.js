Template.Bubble.onCreated(function() {
});
Template.Bubble.onRendered(function() {
    var template = this;
});

Template.Bubble.helpers({
    random: function() {
        return Math.floor(Math.random() * (24 - 0 + 1) + 0);
    },

    image: function() {
        return this.image;
    }
});

