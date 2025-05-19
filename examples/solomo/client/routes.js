import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Session } from 'meteor/session';
import '../devshop-demo';

FlowRouter.route('/', {
  name: 'map',
  waitOn: function () {
    return [Meteor.subscribe('photos')];
  },
  action: function () {
    this.render('layout', 'map')
  },
  data: function () {
    Session.set("currentPhoto", null);
  }
})
FlowRouter.route('/map/:_id', {
  name: 'mapWithPhoto',
  waitOn: function () {
    return [Meteor.subscribe('photos')];
  },
  action: function () {
    this.render('layout', 'map')
  },
  data: function (params) {
    Session.set("currentPhoto", params._id);
  }
})
FlowRouter.route('/camera-page', {
  name: 'camera-page',
  waitOn: function () {
    return [Meteor.subscribe('photos')];
  },
  action: function () {
    this.render('layout', 'camera-page')
  }
})
FlowRouter.route('/list', {
  name: 'list',
  waitOn: function () {
    return [Meteor.subscribe('photos')];
  },
  action: function () {
    this.render('layout', 'list')
  }
})

// Router.map(function() {
//   this.route('map', {
//     path: '/',
//     data: function () {
//       Session.set("currentPhoto", null);
//     }
//   });
//   this.route("mapWithPhoto", {
//     template: "map",
//     path: 'map/:_id',
//     data: function () {
//       Session.set("currentPhoto", this.params._id);
//     }
//   });
//   this.route('camera-page');
//   this.route("list");
// });
//
// Router.configure({
//   layoutTemplate: "layout"
// });
