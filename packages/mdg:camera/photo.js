MeteorCamera = (function() {
  if (!UI) throw new Meteor.Error('Missing UI package');

  var myStream,
    myView,
    myPhoto,
    myCallback;

  return {
    closeAndCallback: function () {
      var originalArgs = arguments;
      if (myView) UI.remove(myView);
      if (myPhoto) myPhoto.set(null);
      if (myCallback) myCallback.apply(null, originalArgs);

      this.stopStream();
    },

    setView: function (view) {
      myView = view;
      return this;
    },

    setPhoto: function (photo) {
      myPhoto = photo;
      return this;
    },

    getPhoto: function () {
      return myPhoto;
    },

    setCallback: function (cb) {
      myCallback = cb;
      return this;
    },

    setStream: function (stream) {
      myStream = stream;
      return this;
    },

    getStream: function () {
      return myStream;
    },

    stopStream: function() {
      if (!myStream) return;

      if(myStream.stop) {
        myStream.stop();
        return;
      }

      if(!myStream.getTracks) return;

      var tracks = myStream.getTracks();
      for(var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        if(track && track.stop) {
          track.stop();
        }
      }
    }
  }
})();