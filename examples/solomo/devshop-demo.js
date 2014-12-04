var Photos = new Meteor.Collection("photos");

if (Meteor.isClient) {
  var selectedMarkerId = new Blaze.ReactiveVar(null);

  Deps.autorun(function () {
    selectedMarkerId.set(Session.get("currentPhoto"));
  });

  Tracker.autorun(function () {
    if (Reload.isWaitingForResume()) {
      alert("Close and reopen this app to get the new version!");
    }
  });

  Template.map.helpers({
    markers: Photos.find(),
    selectedMarkerId: selectedMarkerId
  });

  var onSuccess = function (imageData) {
    var latLng = Geolocation.latLng();

    if (! latLng) {
      return;
    }

    Photos.insert({
      image: imageData,
      createdAt: new Date(),
      marker: {
        lat: latLng.lat,
        lng: latLng.lng,
        infoWindowContent: "<img width='100' src='" + imageData + "' />"
      }
    });

    Router.go("/list");
  };

  Template.layout.events({
    "click .photo-link": function () {
      MeteorCamera.getPicture(function (error, data) {
        // we have a picture
        if (! error) {
          onSuccess(data);
        }
      });
    }
  });

  Template.layout.helpers({
    onPage: function (pageName) {
      return Router.current().route.name === pageName;
    }
  });

  Template.list.helpers({
    photos: function () {
      return Photos.find({}, {sort: {"createdAt": -1}});
    }
  });
}
