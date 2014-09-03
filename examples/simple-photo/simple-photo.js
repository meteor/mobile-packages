if (Meteor.isClient) {
  Template.body.helpers({
    photo: function () {
      return Session.get("photo");
    }
  });

  Template.body.events({
    'click button': function () {
      var cameraOptions = {
        width: 640,
        height: 480
      };

      MeteorCamera.getPicture(cameraOptions, function (error, data) {
        Session.set("photo", data);
      });
    }
  });
}