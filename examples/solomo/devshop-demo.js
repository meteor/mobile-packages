import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { MeteorCamera } from 'meteor/mdg:camera';
import { Reload } from 'meteor/reload';
import { Geolocation } from 'meteor/mdg:geolocation';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from "meteor/reactive-var";
import { Template } from "meteor/templating";
import { Mongo } from "meteor/mongo";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

const Photos = new Mongo.Collection("photos");

if (Meteor.isClient) {
  const selectedMarkerId = new ReactiveVar(null);

  Tracker.autorun(function () {
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

  const onSuccess = function (imageData) {
    const latLng = Geolocation.latLng();

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

    FlowRouter.go("/list");
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
      return FlowRouter.current().route.name === pageName;
    }
  });

  Template.list.helpers({
    photos: function () {
      return Photos.find({}, {sort: {"createdAt": -1}});
    }
  });
}
