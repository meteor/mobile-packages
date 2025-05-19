import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { WebAppLocalServer } from 'meteor/webapp';
import { MeteorCamera } from 'meteor/mdg:camera';

if (Meteor.isClient) {
  Template.body.helpers({
    photo: function () {
      return Session.get("photo");
    }
  });

  Template.body.events({
    'click button': function () {
      const cameraOptions = {
        width: 800,
        height: 800
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
