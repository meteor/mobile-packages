// merge defaults settings with Meteor settings if exists
var settings = (function(defaults) {
  var settings =
  {
    camera: {
      type: "back",
      width: 640,
      height: 480
    },
    quality: 80,
    viewFinder: {
        width: 320,
        height: 240
    }
  };

  if (!defaults) return settings;

  if (defaults.camera) {
    settings.camera = _.extend(settings.camera, defaults.camera);
  }

  if (defaults.quality && check(defaults.quality, Number)) {
    settings.quality = defaults.quality;
  }

  if (defaults.viewFinder) {
    settings.viewFinder = _.extend(settings.viewFinder, defaults.viewFinder);
  }

  return settings;
})(Meteor.settings.public.MeteorCamera);

var photo = new ReactiveVar(null);
var error = new ReactiveVar(null);
var waitingForPermission = new ReactiveVar(null);

var canvasWidth = 0;
var canvasHeight = 0;

Template.viewfinder.onRendered(function() {
  var template = this;

  waitingForPermission.set(true);

  var video = template.find("video");

  // stream webcam video to the <video> element
  var success = function(newStream) {
    MeteorCamera.setStream(newStream);

    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = MeteorCamera.getStream();
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(MeteorCamera.getStream());
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

  if (! navigator.getUserMedia) {
    // no browser support, sorry
    failure("BROWSER_NOT_SUPPORTED");
    return;
  }

  /**
   * Hack to force Wished camera
   */
  var wishedCameraSource;
  var gotWishedCameraSource = function (sourceInfos) {
    for (var i = 0; i < sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      var option = document.createElement('option');
      option.value = sourceInfo.id;

      console.log("sourceInfo", i, sourceInfo, sourceInfo.kind);

      if (sourceInfo.kind == 'video') {
        wishedCameraSource = sourceInfo;
        var isWished = sourceInfo.label.match(settings.camera.type);
        console.log("source id", wishedCameraSource, isWished);

        if (isWished) {
          console.log("wished found, break loop", wishedCameraSource, isWished);
          i = sourceInfos.length;
          return;
        }
      }
    }

    if (!wishedCameraSource) {
      failure("VIDEO_NOT_SUPPORTED");
      return;
    }

    // initiate request for webcam
    var userMediaConfig = {
      video: {
        optional: [{
          sourceId: wishedCameraSource.id
        }]
      },
      audio: false
    };

    navigator.getUserMedia(userMediaConfig, success, failure);
  };

  // @TODO : be compliant with mobile IE/Safari/Other and not only Chrome
  if (MediaStreamTrack) {
    MediaStreamTrack.getSources(gotWishedCameraSource);
  } else {
    // initiate request for webcam
    navigator.getUserMedia({
      video: true,
      audio: false
    }, success, failure);
  }

  // resize viewfinder to a reasonable size, not necessarily photo size
  var resized = false;

  video.addEventListener('canplay', function() {
    if (! resized) {
      video.setAttribute('width', settings.viewFinder.width);
      video.setAttribute('height', (video.videoHeight / (video.videoWidth / settings.viewFinder.width)));
      resized = true;
    }
  }, false);
});

// is the current error a permission denied error?
var permissionDeniedError = function () {
  return error.get() && (
    error.get().name === "PermissionDeniedError" || // Chrome and Opera
    error.get() === "PERMISSION_DENIED" // Firefox
  );
};

// is the current error a browser not supported error?
var browserNotSupportedError = function () {
  return error.get() && error.get() === "BROWSER_NOT_SUPPORTED" ||
    error.get() === "VIDEO_NOT_SUPPORTED"; // HTML5 feature ok, but no camera available on device
};

Template.camera.helpers({
  photo: function () {
    return photo.get();
  },
  error: function () {
    return error.get();
  },
  permissionDeniedError: permissionDeniedError,
  browserNotSupportedError: browserNotSupportedError
});

Template.camera.events({
  "click .use-photo": function () {
    MeteorCamera.closeAndCallback(null, photo.get());
  },
  "click .new-photo": function () {
    photo.set(null);
  },
  "click .cancel": function () {
    if (permissionDeniedError()) {
      MeteorCamera.closeAndCallback(new Meteor.Error("permissionDenied", "Camera permissions were denied."));
    } else if (browserNotSupportedError()) {
      MeteorCamera.closeAndCallback(new Meteor.Error("browserNotSupported", "This browser isn't supported."));
    } else if (error.get()) {
      MeteorCamera.closeAndCallback(new Meteor.Error("unknownError", "There was an error while accessing the camera."));
    } else {
      MeteorCamera.closeAndCallback(new Meteor.Error("cancel", "Photo taking was cancelled."));
    }
  },

  // This part could be moved outside this package and each dev could add its own logic, because with MeteorCamera object he gets all he needs
  "change #videofallback": function(ev, tpl) {
    var files = ev.currentTarget.files; // FileList
    if(!files.length){
      error.set("Please, click on browse button to select a file.");
      return;
    }

    var reader  = new FileReader();
    reader.addEventListener("load", function () {
      MeteorCamera.getPhoto().set(reader.result);
    }, false);

    if (files[0]) {
      reader.readAsDataURL(files[0]);
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
    var data = canvas.toDataURL('image/jpeg', settings.quality);
    photo.set(data);
    MeteorCamera.stopStream();
  }
});

Template.viewfinder.helpers({
  "waitingForPermission": function () {
    return waitingForPermission.get();
  }
});

/**
 * @summary Get a picture from the device's default camera.
 * @param  {Object}   options  Options
 * @param {Number} options.height The minimum height of the image
 * @param {Number} options.width The minimum width of the image
 * @param {Number} options.quality [description]
 * @param  {Function} callback A callback that is called with two arguments:
 * 1. error, an object that contains error.message and possibly other properties
 * depending on platform
 * 2. data, a Data URI string with the image encoded in JPEG format, ready to
 * use as the `src` attribute on an `<img />` tag.
 */
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

  view = UI.renderWithData(Template.camera);
  UI.insert(view, document.body);
  MeteorCamera
    .setView(view)
    .setPhoto(photo)
    .setCallback(callback);
};
