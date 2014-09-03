var stream;
var photo = new Blaze.ReactiveVar(null);
var closeAndCallback;

Template.viewfinder.rendered = function() {
  var template = this;

  var video = template.find("video");

  // stream webcam video to the <video> element
  var success = function(newStream) {
    stream = newStream;

    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
    }
    video.play();
  };

  // user declined or there was some other error
  var failure = function(err) {
    // XXX return the error
    console.log("An error occured! " + err);
  };

  // tons of different browser prefixes
  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  // initiate request for webcam
  navigator.getUserMedia({
      video: true,
      audio: false
  }, success, failure);

  // resize viewfinder to a reasonable size, not necessarily photo size
  var viewfinderWidth = 320;
  var viewfinderHeight = 240;
  var resized = false;
  video.addEventListener('canplay', function() {
    if (! resized) {
      viewfinderHeight = video.videoHeight / (video.videoWidth / viewfinderWidth);
      video.setAttribute('width', viewfinderWidth);
      video.setAttribute('height', viewfinderHeight);
      resized = true;
    }
  }, false);
};

Template.camera.helpers({
  photo: function () {
    return photo.get();
  }
});

Template.camera.events({
  "click .use-photo": function () {
    closeAndCallback(null, photo.get());
  },
  "click .new-photo": function () {
    photo.set(null);
  }
});

Template.viewfinder.events({
  'click .shutter': function (event, template) {
    var video = template.find("video");
    var canvas = template.find("canvas");
    var width = 640;
    var height = 480;

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    var data = canvas.toDataURL('image/png');
    photo.set(data);
    stream.stop();
  },
  "click .cancel": function () {
    closeAndCallback(new Meteor.Error("cancel", "Photo taking was cancelled."));
    stream.stop();
  }
});

MeteorCamera.getPicture = function (options, callback) {
  if (! callback) {
    callback = options;
    options = null;
  }

  var view;
  
  closeAndCallback = function () {
    var originalArgs = arguments;
    UI.remove(view);
    photo.set(null);
    callback.apply(null, originalArgs);
  };
  
  view = UI.renderWithData(Template.camera);
  UI.insert(view, document.body);
};
