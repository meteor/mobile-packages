if (Meteor.isClient) {
  Template.body.helpers({
    photo: function () {
      return Session.get("photo");
    }
  });

  Template.body.events({
    'click button': function () {
      var cameraOptions = {
        width: 800,
        height: 600
      };
      if (Meteor.isCordova) {
        cameraOptions.destinationType = 'URI'
      }

      MeteorCamera.getPicture(cameraOptions, function (error, data) {
        if (Meteor.isCordova) {
          Session.set("photo", WebAppLocalServer.localFileSystemUrl(data))
        } else {
          Session.set("photo", data);
        }
      });
    }
  });
}
