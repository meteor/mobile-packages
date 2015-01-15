if (Meteor.isClient) {
  Template.body.events({
    "change .high-accuracy input": function (event) {
      Session.set("highAccuracy", event.target.checked);
    }
  });
  Template.body.helpers({
    loc: function () {
      // options is *optional*.  We're including it in this demo
      // to show how it is reactive.
      var options = {
        enableHighAccuracy: !!Session.get("highAccuracy")
      };
      // return 0, 0 if the location isn't ready
      return Geolocation.latLng(options) || { lat: 0, lng: 0 };
    },
    error: Geolocation.error,
    highAccuracy: function() {
      return Session.get("highAccuracy");
    }
  });
}
