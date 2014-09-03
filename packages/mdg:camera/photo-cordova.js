MeteorCamera.getPicture = function (callback) {
  var success = function (data) {
    callback(null, "data:image/jpeg;base64," + data);
  };

  var failure = function (error) {
    callback(error);
  };

  navigator.camera.getPicture(success, failure, {
    quality: 30,
    targetWidth: 640,
    targetHeight: 480,
    destinationType: Camera.DestinationType.DATA_URL
  });
};