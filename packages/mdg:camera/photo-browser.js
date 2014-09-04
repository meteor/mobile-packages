var stream;
var closeAndCallback;

var photo = new ReactiveVar(null);
var error = new ReactiveVar(null);
var waitingForPermission = new ReactiveVar(null);

var canvasWidth = 0;
var canvasHeight = 0;

var quality = 80;

Template.viewfinder.rendered = function() {
  var template = this;

  waitingForPermission.set(true);

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

    waitingForPermission.set(false);
  };

  // user declined or there was some other error
  var failure = function(err) {
    error.set(err);
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
  },
  error: function () {
    return error.get();
  },
  permissionDeniedError: function () {
    return error.get() && error.get().name === "PermissionDeniedError";
  }
});

Template.camera.events({
  "click .use-photo": function () {
    closeAndCallback(null, photo.get());
  },
  "click .new-photo": function () {
    photo.set(null);
  },
  "click .cancel": function () {
    closeAndCallback(new Meteor.Error("cancel", "Photo taking was cancelled."));
    
    if (stream) {
      stream.stop();
    }
  }
});

Template.viewfinder.events({
  'click .shutter': function (event, template) {
    var video = template.find("video");
    var canvas = template.find("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvasWidth, canvasHeight);
    var data = canvas.toDataURL('image/jpeg', quality);
    photo.set(data);
    stream.stop();
  }
});

Template.viewfinder.helpers({
  "waitingForPermission": function () {
    return waitingForPermission.get();
  }
});

MeteorCamera.getPicture = function (options, callback) {
  // if options are not passed
  if (! callback) {
    callback = options;
    options = {};
  }

  desiredHeight = options.height || 640;
  desiredWidth = options.width || 480;

  // Canvas#toDataURL takes the quality as a 0-1 value, not a percentage
  quality = (options.quality || 49) / 100;

  if (desiredHeight * 4 / 3 > desiredWidth) {
    canvasWidth = desiredHeight * 4 / 3;
    canvasHeight = desiredHeight;
  } else {
    canvasHeight = desiredWidth * 3 / 4;
    canvasWidth = desiredWidth;
  }

  canvasWidth = Math.round(canvasWidth);
  canvasHeight = Math.round(canvasHeight);

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
