Template.modal_swarm_settings.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();

        var return_route = 'swarm-settings-details';

        if (Intent.exists('swarm-settings-tribes')) {
            return_route = 'swarm-settings-tribes';
        } else if (Intent.exists('swarm-settings-testimonials')) {
            return_route = 'swarm-settings-testimonials';
        }

        Intent.return(return_route, {
            fallback_route: {
                name: 'swarm',
                params: {
                    slug: template.data.slug
                }
            }
        });
    }
})
