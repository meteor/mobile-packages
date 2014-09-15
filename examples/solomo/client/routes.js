Router.map(function() {
  this.route('map', {
    path: '/',
    data: function () {
      Session.set("currentPhoto", null);
    }
  });
  this.route("mapWithPhoto", {
    template: "map",
    path: 'map/:_id',
    data: function () {
      Session.set("currentPhoto", this.params._id);
    }
  });
  this.route('camera-page');
  this.route("list");
});

Router.configure({
  layoutTemplate: "layout"
});