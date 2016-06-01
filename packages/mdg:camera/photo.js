MeteorCamera = {};

MeteorCamera.getPicture = function (options, callback) {
  if (Meteor.isCordova || options.forceCordova) {
    MeteorCamera.getPictureCordova(options, callback);
  } else {
    MeteorCamera.getPictureBrowser(options, callback);
  }
}
