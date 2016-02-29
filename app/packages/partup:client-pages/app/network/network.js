var Subs = new SubsManager({
    cacheLimit: 1,
    expireIn: 10
});

Template.app_network.onCreated(function() {
    var tpl = this;

    tpl.networkId = new ReactiveVar();

    var network_sub;

    tpl.autorun(function() {
        var slug = Template.currentData().networkSlug;

        network_sub = Subs.subscribe('networks.one', slug, {
            onReady: function() {
                var network = Networks.findOne({slug: tpl.data.networkSlug});
                if (!network) Router.pageNotFound('network');
                tpl.networkId.set(network._id);
            }
        });
    });
    tpl.expanded = false;
    tpl.autorun(function() {
        var scrolled = Partup.client.scroll.pos.get() > 100;
        if (scrolled && tpl.expanded) {
            if (tpl.view.isRendered) {
                tpl.expandText(false);
            }
        }
    });
    tpl.expandText = function(expand) {
        var clickedElement = $('[data-expand]');
        if (!clickedElement || !clickedElement[0]) return;
        var parentElement = $(clickedElement[0].parentElement);

        var collapsedText = TAPi18n.__(clickedElement.data('collapsed-key')) || false;
        var expandedText = TAPi18n.__(clickedElement.data('expanded-key')) || false;

        if (expand) {
            if (expandedText) clickedElement.html(expandedText);
            parentElement.addClass('pu-state-open');
            clickedElement.parents('.pu-sub-pageheader').addClass('pu-state-descriptionexpanded');
        } else {
            if (collapsedText) clickedElement.html(collapsedText);
            parentElement.removeClass('pu-state-open');
            clickedElement.parents('.pu-sub-pageheader').removeClass('pu-state-descriptionexpanded');
        }
        tpl.expanded = expand;
    };
});

/*************************************************************/
/* Page helpers */
/*************************************************************/
Template.app_network.helpers({
    network: function() {
        return Networks.findOne({slug: this.networkSlug});
    },

    isInvitePending: function() {
        var user = Meteor.user();
        if (!user || !user.pending_networks) return false;
        return mout.array.contains(user.pending_networks, this.networkId);
    },

    shrinkHeader: function() {
        return Partup.client.scroll.pos.get() > 100;
    },
    textHasOverflown: function() {
        var template = Template.instance();
        var rendered = template.partupTemplateIsRendered.get();
        if (!rendered) return;
        var expander = $(template.find('[data-expander-parent]'));
        if (expander.length && expander[0].scrollHeight > expander.innerHeight()) return true;
        return false;
    },

    accessToken: function() {
        return Template.instance().data.accessToken;
    }
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.app_network.events({
    'click [data-expand]': function(event, template) {
        event.preventDefault();
        template.expandText(!template.expanded);
    },
    'click [data-open-networksettings]': function(event, template) {
        event.preventDefault();
        Intent.go({
            route: 'network-settings',
            params: {
                slug: template.data.networkSlug
            }
        });
    },
    'click [data-location]': function(event, template) {
        event.preventDefault();
        var location = Networks.findOne({slug: template.data.networkSlug}).location;
        Partup.client.discover.setPrefill('locationId', location.place_id);
        Partup.client.discover.setCustomPrefill('locationLabel', location.city);
        Router.go('discover');
    },
    'click [data-blank]': function(event, template) {
        event.preventDefault();
    }
});
