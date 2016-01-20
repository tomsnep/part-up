/**
 @namespace partup.services.location
 @memberof Partup.services
 */
Partup.services.location = {
    /**
     * Transform a location object into a display string
     *
     * @memberof Partup.services.location
     * @param {Object} location
     */
    locationToLocationInput: function(location) {
        if (!location) return;
        return location.place_id;
    },

    /**
     * Transform a location input into location object
     *
     * @memberof services.location
     * @param {String} placeId
     */
    locationInputToLocation: function(placeId) {
        var result = Partup.server.services.google.getCity(placeId);

        if (!result) return false;

        var location = {};

        location.city = sanitizeHtml(result.name);
        location.lat = sanitizeHtml(mout.object.get(result, 'geometry.location.lat'));
        location.lng = sanitizeHtml(mout.object.get(result, 'geometry.location.lng'));
        location.place_id = sanitizeHtml(result.place_id);

        // Initialise country in case we can't find it
        location.country = null;

        // Find the country
        var addressComponents = result.address_components || [];
        addressComponents.forEach(function(component) {
            if (mout.array.contains(component.types, 'country')) {
                location.country = sanitizeHtml(component.long_name);
            }
        });

        return location;
    }
};
