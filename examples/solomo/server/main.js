import { Meteor } from 'meteor/meteor';
import { Photos } from '../devshop-demo'
import '../devshop-demo';

Meteor.publish('photos', function () {
  return Photos.find({}, {sort: {"createdAt": -1}});
})

