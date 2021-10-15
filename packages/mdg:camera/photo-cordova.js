MeteorCamera.getPicture = function (options, callback) {
  var URIMode = false
  // if options are not passed
  if (! callback) {
    callback = options;
    options = {};
  } else if (options.destinationType === 'URI') {
    URIMode = true
  }

  var success = function (data) {
    if (URIMode) {
      callback(null, data);
    } else {
      callback(null, "data:image/jpeg;base64," + data);
    }
  };

  var failure = function (error) {
    callback(new Meteor.Error("cordovaError", error));
  };

  navigator.camera.getPicture(success, failure,
    Object.assign(options, {
      quality: options.quality || 49,
      targetWidth: options.width || 640,
      targetHeight: options.height || 480,
      destinationType: URIMode ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL
    })
  );
};
