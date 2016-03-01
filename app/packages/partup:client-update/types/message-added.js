Template.update_partups_message_added.helpers({
    messageContent: function() {
        return Partup.client.strings.newlineToBreak(Partup.helpers.mentions.decode(Partup.client.sanitize(this.type_data.new_value)));
    },
    hasNoComments: function() {
        if (this.comments) {
            return this.comments.length <= 0;
        } else {
            return true;
        }
    }
});
