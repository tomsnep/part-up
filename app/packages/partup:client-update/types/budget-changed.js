Template.update_partups_budget_changed.helpers({
    oldBudget: function() {
        return budgetDisplay(this.old_type, this.old_value, this.old_currency);
    },

    newBudget: function() {
        return budgetDisplay(this.new_type, this.new_value, this.new_currency);
    }
});
