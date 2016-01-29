Template.swarm_explorer.onCreated(function() {
    // var template = this;
    // this.total = new ReactiveVar(24);
    // var bubbles = template.data.networks;
    // console.log(template);
    // var randomRange = function(minimum, maximum) {
    //     return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    // };
    // for (var i = 0; i < randomRange(5, 25) ; i++) {
    //     bubbles.push({
    //         id: _.uniqueId()
    //     });
    // };
    // this.bubbles = new ReactiveVar([]);
});

Template.swarm_explorer.helpers({
    rings: function() {
        var data = Template.currentData();
        if (!data.networks.length) return false;
        var bubbles = data.networks;

        // determine total number of bubbles
        var total = bubbles.length;

        // total bubbles in inner circle
        // 1/2 of 1/3 of total number of bubbles
        var innerLength = (total / 3) / 2.1;

        // total bubbles in center circle
        // 1/3 of total number of bubbles
        var centerLength = (total / 3);

        // total bubbles in outer circle
        // total of center circle bubbles (1/3 of total number of bubbles)
        // plus total of inner circle bubbles (1/2 of 1/3 of total number of bubbles)
        var outerLength = (centerLength + innerLength);

        // all values add up to total number of bubbles or total plus one
        // it does not matter that there is a possibility if +1

        return {
            inner: function() {
                return _.filter(bubbles, function(item, index) {
                    return index <= innerLength;
                });
            },
            center: function() {
                return _.filter(bubbles, function(item, index) {
                    return index > innerLength && index <= (centerLength + innerLength);
                });
            },
            outer: function() {
                return _.filter(bubbles, function(item, index) {
                    return index > (centerLength + innerLength) && index <= (centerLength + innerLength + outerLength);
                });
            }
        };
    }
});

Template.swarm_explorer.events({
    'click [data-findout]': function(event, template) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: window.innerHeight - 90
        }, 500);
    }
});
