Template.Ring.onCreated(function() {
    var template = this;
    this.rings = new ReactiveVar([]);
    template.done = new ReactiveVar(false);
});

Template.Ring.onRendered(function() {
    var template = this;
    // differentiate x and y radius to make an oval

    var createRing = function(ringElement, options) {
        // helpers
        var randomBoolean = function() {
            return !(+new Date() % 2); // faux-randomness
        };
        var randomRange = function(minimum, maximum) {
            return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        };

        // options readout
        var items = options.items || [];
        var radius = options.radius || 100;
        var startAngle = options.startAngle || randomRange(0, 360);
        var skipAngle = options.skipAngle || false;
        var offset = options.offset || {};
        var offsetTop = offset.top || 0;
        var offsetLeft = offset.left || 0;

        // calculation constants
        var PI = Math.PI;
        var TAU = PI * 2;
        var totalItems = items.length;

        // x-axis calculations
        var ringXDiameter = ringElement.offsetWidth;
        var ringXDiameterPercentage = 100 / ringXDiameter;
        var ringXRadius = ringXDiameter / 2;
        var ringXRadiusPercentage = (ringXRadius / 100) * radius;

        // y-axis calculations
        var ringYDiameter = ringElement.offsetHeight;
        var ringYDiameterPercentage = 100 / ringYDiameter;
        var ringYRadius = ringYDiameter / 2;
        var ringYRadiusPercentage = (ringYRadius / 100) * radius;

        // calculate starting angle
        var angle = (TAU / 360) * startAngle;

        // randomly decide direction of circle (clockwise or counter-clockwise)
        var reverse = randomBoolean();

        // calculate item angle offset
        var angleIncrement = TAU / totalItems;

        var skipChunk = function() {
            var skip = (100 / 360) * skipAngle;
            var skipTotal = Math.round((totalItems / 100) * skip);
            angleIncrement = TAU / (totalItems + skipTotal);
            for (var i = 0; i < skipTotal; i++) {
                angle += angleIncrement;
            };
        };

        // skip a chunk if this is specified in options
        if (skipAngle) skipChunk();

        // loop through each item and calculate the position on ring
        items.forEach(function(item, i) {
            var x = ringXDiameterPercentage * (ringXRadiusPercentage * Math.cos(angle) + ringXRadius) + offsetLeft;
            var y = ringYDiameterPercentage * (ringYRadiusPercentage * Math.sin(angle) + ringYRadius) + offsetTop;
            if (reverse) x = 100 - x;
            var positioning = new ReactiveVar({x: x, y: y});
            item.positioning = positioning;
            angle += angleIncrement;
        });

        return items;
    };
    var container = document.querySelector('.pu-ring');
    var inner = createRing(container,{
        items: template.data.inner,
        radius: 20,
        offset: {top: -15}
    });
    var center = createRing(container,{
        items: template.data.center,
        radius: 45,
        offset: {top: -15}
    });
    var outer = createRing(container,{
        items: template.data.outer,
        radius: 80,
        offset: {top: -15},
        startAngle: -120,
        skipAngle: 90
    });

    var rings = [];
    rings = rings.concat(inner,center,outer);

    template.rings.set(rings);
    Meteor.defer(function() { template.done.set(true); });
});

Template.Ring.helpers({
    rings: function() {
        return Template.instance().rings.get();
    },
    style: function() {
        if (!this.positioning) return false;
        var positioning = this.positioning.get();
        var x = positioning.x;
        var y = positioning.y;
        return 'left:' + x + '%;top:' + y + '%;';
    },
    done: function() {
        return Template.instance().done.get();
    }
});
