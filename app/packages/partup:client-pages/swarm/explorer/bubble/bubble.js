Template.Bubble.onCreated(function() {
});
Template.Bubble.onRendered(function() {
    var template = this;
});

Template.Bubble.helpers({
    random: function() {
        return Math.floor(Math.random() * (24 - 0 + 1) + 0);
    },

    networkLogo: function() {
        var network = this;

        if (network.logoObject) {
            return Partup.helpers.url.getImageUrl(network.logoObject, '360x360');
        } else if (network.imageObject) {
            return Partup.helpers.url.getImageUrl(network.imageObject, '360x360');
        }

        return '';
    }
});

