# Meteor Geolocation Package

Add it to your [Meteor](http://meteor.com) app with `meteor add mdg:geolocation`.

## API Documentation

There are currently no options to set. Every method is reactive using [Tracker](http://docs.meteor.com/#tracker), and will automatically update with new location data from the device.

### Geolocation.error()

Returns the [position error](https://developer.mozilla.org/en-US/docs/Web/API/PositionError) that is currently preventing position updates.

### Geolocation.currentLocation(options)

Returns the [position](https://developer.mozilla.org/en-US/docs/Web/API/Position) that is reported by the device, or null if no position is available.

The `options` parameter is optional; if provided it as if `Geolocation.setOptions` was called before returning the position.

### Geolocation.latLng(options)

A simple shorthand for currentLocation() when all you need is the latitude and longitude. Returns an object that has `lat` and `lng` keys.

The `options` parameter is optional; if provided it as if `Geolocation.setOptions` was called before returning the position.

### Geolocation.setOptions(options)

Provide [PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) to manage power consumption on mobile devices.  The options can be reactive.

### Geolocation.setPaused(boolean)

If the parameter is `true`, temporarily halts reactive position updates to reduce power consumption.
