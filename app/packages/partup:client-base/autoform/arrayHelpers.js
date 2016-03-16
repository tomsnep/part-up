Meteor.startup(function() {
    Autoform.removeArrayItem = function(formId, name, index) {
        var schema = AutoForm.getFormSchema(formId);
        AutoForm.arrayTracker.removeFromFieldAtIndex(formId, name, index, schema);
    };
    Autoform.addArrayItem = function(formId, name, index) {
        var schema = AutoForm.getFormSchema(formId);
        AutoForm.arrayTracker.addOneToField(formId, name, schema);
    };
});
