Mobile Packages
===============

This repository contains three simple Meteor packages that work on mobile and desktop. There are also three small example apps that demonstrate their usage.

These packages work with Meteor 0.9.2 and above.

## Packages

### Camera

The package `mdg:camera` allows you to take photos on desktop and mobile with a single function call.

[Read the full Camera documentation here.](https://github.com/meteor/mobile-packages/blob/master/packages/mdg:camera/README.md)

### Geolocation

The package `mdg:geolocation` provides a reactive interface to the device's GPS location.

[Read the full Geolocation documentation here.](https://github.com/meteor/mobile-packages/blob/master/packages/mdg:geolocation/README.md)

### reload-on-resume

The package `mdg:reload-on-resume` delays hot code push on mobile devices until the user has closed and re-opened the app, so that their experience is not interrupted by a reload.

[Read the full reload-on-resume documentation here.](https://github.com/meteor/mobile-packages/blob/master/packages/mdg:reload-on-resume/README.md)

## Example Apps

### simple-photo

This example app has one button that takes a photo and displays it on the screen. It demonstrates usage of the Camera package.

### simple-map

This example app uses the [Google Maps Static Maps API](https://developers.google.com/maps/documentation/staticmaps/) to show a map with a marker at your current location. It demonstrates usage of the Geolocation package.

### SoLoMo

This is the app that was first used to demonstrate Meteor Cordova functionality at the Meteor Devshop in August 2014. It uses the Camera, Geolocation, and reload-on-resume packages, in addition to local packages for [Ionic Framework CSS](http://ionicframework.com/) and a simple implementation of the [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/).

<img src="examples/solomo/screenshot.jpg" width="300" />
