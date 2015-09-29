// https://developer.mozilla.org/en-US/docs/Web/API/PositionError
var PERMISSION_DENIED = 1;

// is location refreshing currently on?
var watchingPosition = false;

// current location variable and dependency
var location = new ReactiveVar(null);

// error variable and dependency
var error = new ReactiveVar(null);

// options for watchPosition
var options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000
};

var polling = false;
var currentWatch = null;

// calling watchPosition checks to see whether you now have gps permissions
var checkForPermissionChanges = function () {
  navigator.geolocation.clearWatch(currentWatch);
  currentWatch = navigator.geolocation.watchPosition(onPosition, onError, options);

  Meteor.setTimeout(function () {
    if (polling) {
      checkForPermissionChanges();
    }
  }, 10000);
};

var onError = function (newError) {
  error.set(newError);

  if (newError.code === PERMISSION_DENIED && ! polling) {
    polling = true;
    checkForPermissionChanges();
  }
};

var onPosition = function (newLocation) {
  location.set(newLocation);
  error.set(null);
  polling = false;
};

var startWatchingPosition = function () {
  if (! watchingPosition && navigator.geolocation) {
    currentWatch = navigator.geolocation.watchPosition(onPosition, onError, options);
    watchingPosition = true;
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
    startWatchingPosition();
    return error.get();
  },

  /**
   * @summary Get the current location
   * @return {Position | null} The
   * [position](https://developer.mozilla.org/en-US/docs/Web/API/Position)
   * that is reported by the device, or null if no position is available.
   */
  currentLocation: function () {
    startWatchingPosition();
    return location.get();
  },
  // simple version of location; just lat and lng

  /**
   * @summary Get the current latitude and longitude
   * @return {Object | null} An object with `lat` and `lng` properties,
   * or null if no position is available.
   */
  latLng: function () {
    var loc = Geolocation.currentLocation();

    if (loc) {
      return {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      };
    }

    return null;
  }
};
