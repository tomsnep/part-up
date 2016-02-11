Template.Bubble.onCreated(function() {
    this.randomInt = lodash.random(0, 24);
    this.show = new ReactiveVar(false);
});
Template.Bubble.onRendered(function() {
    var template = this;
    Meteor.defer(function() { template.show.set(true); });
});

Template.Bubble.helpers({
    data: function() {
        var template = Template.instance();
        return {
            randomInt: function() {
                return template.randomInt;
            },
            image: function() {
                return this.image;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            show: function() {
                return template.show.get();
            },
            type: function() {
                return template.data.type;
            }
        };
    }
});

