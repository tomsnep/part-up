Template.Ring.onCreated(function() {
    var template = this;
    template.rings = new ReactiveVar([]);
    template.placeholder = new ReactiveVar([]);

    // helpers
    template.randomBoolean = function() {
        return !(+new Date() % 2); // faux-randomness
    };

    // preset the configuration
    // to prevent recalculation in autorun
    template.ringPresets = {
        inner: {
            radius: 20,
            offset: {top: -15},
            startAngle: lodash.random(0, 360),
            reverse: template.randomBoolean()
        },
        center: {
            radius: 45,
            offset: {top: -15},
            startAngle: lodash.random(0, 360),
            reverse: template.randomBoolean()
        },
        outer: {
            radius: 80,
            offset: {top: -15},
            skipAngle: 90,
            startAngle: -120,
            reverse: template.randomBoolean()
        }
    };
});

Template.Ring.onRendered(function() {
    var template = this;
    template.container = template.find('.pu-ring');
    template.mouseMoveHandler = function(e) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var xPercent = 100 / windowWidth * e.clientX;
        var yPercent = 100 / windowHeight * e.clientY;
        $(template.container).css({perspectiveOrigin: xPercent + '% ' + yPercent + '%'});
    };
    template.debouncedMouseMoveHandler = _.throttle(template.mouseMoveHandler, 100, true);
    $(document).on('mousemove', template.debouncedMouseMoveHandler);

    template.createRing = function(ringElement, options) {
        // options readout
        var items = options.items || [];
        var radius = options.radius || 100;
        var startAngle = typeof options.startAngle === 'number' ? options.startAngle : lodash.random(0, 360);
        var skipAngle = options.skipAngle || false;
        var offset = options.offset || {};
        var offsetTop = offset.top || 0;
        var offsetLeft = offset.left || 0;
        // randomly decide direction of circle (clockwise or counter-clockwise)
        var reverse = options.reverse || template.randomBoolean();

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
            // if (reverse) x = 100 - x;
            var positioning = new ReactiveVar({x: x, y: y});
            item.positioning = positioning;
            angle += angleIncrement;
        });

        return items;
    };

    template.autorun(function(c) {
        var data = Template.currentData();
        var rings = [];
        _.each(template.ringPresets, function(preset, key) {
            preset.items = data.rings[key] || [];
            rings = rings.concat(template.createRing(template.container, preset));
        });
        template.rings.set(rings);
    });

});

Template.Ring.onDestroyed(function() {
    var template = this;
    $(document).off('mousemove', template.debouncedMouseMoveHandler);
});

Template.Ring.helpers({
    data: function() {
        var template = Template.instance();
        return {
            rings: function() {
                return template.rings.get();
            },
            placeholder: function() {
                return template.placeholder.get();
            }
        };
    }
});
