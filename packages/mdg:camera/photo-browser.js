var stream;
var closeAndCallback;

var photo = new ReactiveVar(null);
var error = new ReactiveVar(null);
var waitingForPermission = new ReactiveVar(null);

var canvasWidth = 0;
var canvasHeight = 0;

var quality = 80;

MeteorCamera.locale = {
    errorBrowserNotSupported: "Sorry, this browser is currently not supported for camera functionality.",
    errorAccesingCamera: "There was an error accessing the camera.",
    usePhoto: "Use Photo",
    takeNewPhoto: "Take New Photo",
    waitingPermissions: "Waiting for camera permissions...",
    takePhoto: "Take Photo",
    cancel: "Cancel",
    closePopup: "Close Popup",
    permissionsDenied: "Camera Permissions Denied",
    permissionsDeniedExp: "You have denied this app permission to use your camera. If you would like to allow permissions, follow the directions for your browser below.",
    howToChrome: 'Go to Settings > "Show advanced settings..." > "Content settings..." > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.',
    howToFirefox: "Reload the page and try again.",
    howToOpera: 'Go to Preferences > Websites > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.'
}

Template.viewfinder.rendered = function() {
  var template = this;

  waitingForPermission.set(true);

  var video = template.find("video");

  // stream webcam video to the <video> element
  var success = function(newStream) {
    stream = newStream;
      
    // Older browsers may not have srcObject
    if ("srcObject" in video) {
        video.srcObject = stream;
    } else {
      // begin of legacy api
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        try {
          video.src = vendorURL.createObjectURL(stream);
        } catch (e) {
          //workaround based on https://bugzilla.mozilla.org/show_bug.cgi?id=1334564
          video.srcObject = stream;
        }
      }
      // end of legacy api
    }
      
    if ("onloadedmetadata" in video) {
      video.onloadedmetadata = function (e) {
        video.play();
      };
    } else {
      video.play();
    }

    waitingForPermission.set(false);
  };

  // user declined or there was some other error
  var failure = function(err) {
    error.set(err);
  };

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // initiate request for webcam
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      },
      audio: false,
    }).then(success).catch(failure)
  } else {
    // begin of legacy api
    // tons of different browser prefixes
    navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );

    if (!navigator.getUserMedia) {
      // no browser support, sorry
      failure("BROWSER_NOT_SUPPORTED");
      return;
    }

    // initiate request for webcam
    navigator.getUserMedia({
      video: true,
      audio: false
    }, success, failure);
    // end of legacy api
  }

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

// is the current error a permission denied error?
var permissionDeniedError = function () {
  return error.get() && (
    error.get().name === "PermissionDeniedError" || // Chrome and Opera
    error.get() === "PERMISSION_DENIED" // Firefox
  );
};

// is the current error a browser not supported error?
var browserNotSupportedError = function () {
  return error.get() && error.get() === "BROWSER_NOT_SUPPORTED";
};

var stopStream = function(st) {
  if(!st) {
    return;
  }

  if(st.stop) {
    st.stop();
    return;
  }

  if(st.getTracks) {
    var tracks = st.getTracks();
    for(var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      if(track && track.stop) {
        track.stop();
      }
    }
  }
};


Template.camera.helpers({
  photo: function () {
    return photo.get();
  },
  error: function () {
    return error.get();
  },
  translate: function (string) {
    return MeteorCamera.locale[string];
  },
  permissionDeniedError: permissionDeniedError,
  browserNotSupportedError: browserNotSupportedError
});

Template.camera.events({
  "click .use-photo": function () {
    closeAndCallback(null, photo.get());
  },
  "click .new-photo": function () {
    photo.set(null);
  },
  "click .cancel": function () {
    if (permissionDeniedError()) {
      closeAndCallback(new Meteor.Error("permissionDenied", "Camera permissions were denied."));
    } else if (browserNotSupportedError()) {
      closeAndCallback(new Meteor.Error("browserNotSupported", "This browser isn't supported."));
    } else if (error.get()) {
      closeAndCallback(new Meteor.Error("unknownError", "There was an error while accessing the camera."));
    } else {
      closeAndCallback(new Meteor.Error("cancel", "Photo taking was cancelled."));
    }

    if (stream) {
      stopStream(stream);
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
    stopStream(stream);
  }
});

Template.viewfinder.helpers({
  "waitingForPermission": function () {
    return waitingForPermission.get();
  },
  translate: function (string) {
    return MeteorCamera.locale[string];
  }
});

Template.genericError.helpers({
  translate: function (string) {
    return MeteorCamera.locale[string];
  }
});

Template.permissionDenied.helpers({
  translate: function (string) {
    return MeteorCamera.locale[string];
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

  closeAndCallback = function () {
    var originalArgs = arguments;
    UI.remove(view);
    photo.set(null);
    callback.apply(null, originalArgs);
  };

  view = UI.renderWithData(Template.camera);
  UI.insert(view, document.body);
};
