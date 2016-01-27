/**
 * Base Swarm schema
 * @name swarmBaseSchema
 * @memberof Partup.schemas
 * @private
 */
var swarmBaseSchema = new SimpleSchema({
    title: {
        type: String,
        max: 50,
        optional: true
    },
    introduction: {
        type: String,
        max: 350,
        optional: true
    },
    description: {
        type: String,
        max: 500,
        optional: true
    },
    image: {
        type: String,
        optional: true
    }
});

/**
 * Swarm entity schema
 * @name swarmEntity
 * @memberof Partup.schemas.entities
 */
Partup.schemas.entities.swarm = new SimpleSchema([swarmBaseSchema, {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    activity_count: {
        type: Number,
        defaultValue: 0
    },
    admin_id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    created_at: {
        type: Date,
        defaultValue: new Date()
    },
    name: {
        type: String,
        max: 50
    },
    networks: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id
    },
    partup_count: {
        type: Number,
        defaultValue: 0
    },
    quotes: {
        type: [Object],
        regEx: SimpleSchema.RegEx.Id
    },
    'quotes._id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    'quotes.upper_id': {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    'quotes.content': {
        type: String,
        max: 500
    },
    slug: {
        type: String
    },
    updated_at: {
        type: Date,
        defaultValue: new Date()
    },
    upper_count: {
        type: Number,
        defaultValue: 0
    }
}]);

/**
 * Swarm create form schema
 * @name swarmCreate
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.swarmCreate = new SimpleSchema({
    name: {
        type: String,
        max: 50
    }
});

/**
 * Swarm edit form schema
 * @name swarmEditAdmin
 * @memberof Partup.schemas.forms
 */
Partup.schemas.forms.swarmEditAdmin = new SimpleSchema({
    admin_id: {
        type: String
    }
});