Template.mobile_notifications.onCreated(function() {
    var self = this;
    self.subscribe('notifications.for_upper', {
        onReady: function() {
            console.log('aaa?');
        }
    })
})
