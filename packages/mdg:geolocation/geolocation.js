// is location refreshing currently on?
var watchingPosition = false;

// current location variable and dependency
var location = new ReactiveVar(null);

// error variable and dependency
var error = new ReactiveVar(null);

// options for watchPosition
var options = new ReactiveVar({
  enableHighAccuracy: true,
  maximumAge: 0
}, function(a, b) {
  // Reject attempts to set this to a non-object.
  if (a == null || b == null || typeof a !== 'object' || typeof b !=='object') {
    return true;
  }
  return (
    a.enableHighAccuracy === b.enableHighAccuracy &&
    a.maximumAge === b.maximumAge &&
    a.timeout === b.timeout
  );
});

// pause geolocation updates
var paused = new ReactiveVar(false);

var onError = function (newError) {
  error.set(newError);
  Tracker.afterFlush(checkDependents);
};

var onPosition = function (newLocation) {
  location.set(newLocation);
  error.set(null);
  Tracker.afterFlush(checkDependents);
};

var checkDependents = function() {
  if (location.dep.hasDependents() || error.dep.hasDependents()) {
    return;
  }
  watchingPosition.stop();
  watchingPosition = false;
};

var startWatchingPosition = function () {
  if (watchingPosition === false && navigator.geolocation) {
    watchingPosition = Tracker.autorun(function() {
      if (paused.get()) { return; }
      var watchId =
        navigator.geolocation.watchPosition(onPosition, onError, options.get());
      Tracker.onInvalidate(function() {
        navigator.geolocation.clearWatch(watchId);
      });
    });
  }
};

// exports

/**
 * @summary The namespace for all geolocation functions.
 * @namespace
 */
Geolocation = {
  /**
   * @summary Get the current geolocation error
   * @return {PositionError} The
   * [position error](https://developer.mozilla.org/en-US/docs/Web/API/PositionError)
   * that is currently preventing position updates.
   */
  error: function () {
    Tracker.nonreactive(startWatchingPosition);
    return error.get();
  },

  /**
   * @summary Get the current location
   * @param {PositionOptions} options Optional geolocation options
   * @param {Boolean} options.enableHighAccuracy
   * @param {Number} options.maximumAge
   * @param {Number} options.timeout
   * @return {Position | null} The
   * [position](https://developer.mozilla.org/en-US/docs/Web/API/Position)
   * that is reported by the device, or null if no position is available.
   */
  currentLocation: function (_options) {
    if (_options != null) {
      Geolocation.setOptions(_options);
    }
    Tracker.nonreactive(startWatchingPosition);
    return location.get();
  },

  // simple version of location; just lat and lng

  /**
   * @summary Get the current latitude and longitude
   * @return {Object | null} An object with `lat` and `lng` properties,
   * or null if no position is available.
   */
  latLng: function (options) {
    var loc = Geolocation.currentLocation(options);

    if (loc) {
      return {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      };
    }

    return null;
  },

  /**
   * @summary Set the PositionOptions used for geolocation.
   */
  setOptions: function(_options) {
    options.set(_options);
  },

  /**
   * @summary Allow temporarily halting reactive updates to position.
   */
  setPaused: function(_paused) {
    paused.set(_paused);
  }

};
