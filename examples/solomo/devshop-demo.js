import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";

export const Photos = new Mongo.Collection("photos");

if (Meteor.isServer) {
  Meteor.methods({
    async "photos.insert"(imageData, latLng) {
      check(imageData, String);
      check(latLng, Match.ObjectIncluding({ lat: Number, lng: Number }));

      return Photos.insertAsync({
        image: imageData,
        createdAt: new Date(),
        marker: {
          lat: latLng.lat,
          lng: latLng.lng,
          infoWindowContent: "<img width='100' src='" + imageData + "' />"
        }
      });
    }
  });
}
