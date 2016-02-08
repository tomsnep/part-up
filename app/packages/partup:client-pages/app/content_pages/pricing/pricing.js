var UpperProduct = function(type) {
    this.name = __('pages-app-pricing-upper-' + type + '-name');
    this.summary = __('pages-app-pricing-upper-' + type + '-summary');
    this.price = __('pages-app-pricing-upper-' + type + '-price');
    this.price_info = __('pages-app-pricing-upper-' + type + '-price-info');
    this.features = [
        {
            name: __('pages-app-pricing-upper-' + type + '-feature'),
            value: __('pages-app-pricing-upper-' + type + '-feature-value')
        }
    ];
    this.type = type;
};

var TribeProduct = function(type, more) {
    this.name = __('pages-app-pricing-tribe-' + type + '-name');
    this.summary = __('pages-app-pricing-tribe-' + type + '-summary');
    this.price = __('pages-app-pricing-tribe-' + type + '-price');
    this.price_info = __('pages-app-pricing-tribe-' + type + '-price-info');
    this.features = [
        {
            name: __('pages-app-pricing-tribe-' + type + '-feature1'),
            value: __('pages-app-pricing-tribe-' + type + '-feature1-value'),
            more: more ? __('pages-app-pricing-tribe-' + type + '-feature1-more') : false
        }, {
            name: __('pages-app-pricing-tribe-' + type + '-feature2'),
            value: __('pages-app-pricing-tribe-' + type + '-feature2-value')
        }
    ];
    this.type = type;
};

Template.app_pricing.helpers({
    shrinkHeader: function() {
        return Partup.client.scroll.pos.get() > 40;
    },
    upper_products: function() {
        return [
            new UpperProduct('upper'),
            new UpperProduct('premiumupper')
        ];
    },
    tribe_products: function() {
        return [
            new TribeProduct('socialimpact'),
            new TribeProduct('starterskit', true),
            new TribeProduct('enterprise')
        ];
    }
});
