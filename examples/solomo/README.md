Devshop Demo for Meteor Mobile: SoLoMo
======================================

> Making Social, Local, Mobile Easier than Ever Before!

<img src="screenshot.jpg" width="300" />

The developers at [Meteor](https://www.meteor.com/) have been hard at work building mobile support into the framework. Our goal is to make Meteor the easiest, fastest, and best way to build a great cross-platform application. This is an app we showed at Meteor Devshop August 2014 to demonstrate some of the features of the initial preview release of mobile support for Meteor.

To learn more about making Meteor mobile apps with Cordova, check out [this Hackpad](https://meteor.hackpad.com/Getting-Started-With-Cordova-Z5n6zkVB1xq)!

## Running the App

First install the [Meteor Web Framework](https://www.meteor.com/), then pick a platform and run the appropriate commands!

### Web Browser

`meteor`, then go to the indicated URL in your preferred web browser.

### Android Simulator

`meteor run android`, the simulator should open automatically. The simulator is currently quite slow, we are working on improving the installation process to configure faster simulation.

### iOS Simulator (Mac Only)

`meteor run ios`, the simulator should open automatically. You may be prompted to install Xcode to get the simulator if you don't have it.

### Android Device

1. [enable USB Debug Mode](http://developer.android.com/tools/device.html#developer-device-options) on your Android Device.
2. Make sure your Android device is connected to the same WiFi network as your computer.
3. Find out your computer's IP address - the device needs this to be able to connect to your development server.
4. `meteor run android-device -p <ip address>:3000`

### iOS Device (Mac Only, Need to be Member of iOS Developer Program)

1. Make sure your iOS device is connected to the same WiFi network as your computer.
2. Find out your computer's IP address - the device needs this to be able to connect to your development server.
3. `meteor run ios-device -p <ip address>:3000`, this command will open Xcode with the relevant project.
4. Use Xcode to run the app on your device.