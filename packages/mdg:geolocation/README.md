# Meteor Geolocation Package

Add it to your [Meteor](http://meteor.com) app with `meteor add mdg:geolocation`.

## API Documentation

There are currently no options to set. Every method is reactive using [Tracker](http://docs.meteor.com/#tracker), and will automatically update with new location data from the device.

### Geolocation.error()

Returns the [position error](https://developer.mozilla.org/en-US/docs/Web/API/PositionError) that is currently preventing position updates.

### Geolocation.currentLocation()

Returns the [position](https://developer.mozilla.org/en-US/docs/Web/API/Position) that is reported by the device, or null if no position is available.

### Geolocation.latLng()

A simple shorthand for currentLocation() when all you need is the latitude and longitude. Returns an object that has `lat` and `lng` keys.