# Meteor Camera Package

Add it to your [Meteor](http://meteor.com) app with `meteor add mdg:camera`. The api is super simple - there is only one function to call.

[check recent changes here](./CHANGELOG.md)

### MeteorCamera.getPicture([options], callback)

Prompt the user to take a photo with their device and get the picture as a Data URI in JPEG format.

#### options

`options` is an optional argument that is an Object with the following possible keys:

- `width` An integer that specifies the minimum width of the returned photo.
- `height` An integer that specifies the minimum height of the returned photo.
- `quality` A number from 0 to 100 specifying the desired quality of JPEG encoding.
- `destinationType` For Cordova ONLY. Pass in `URI` to get back file uri instead of base64 image (the default). If you want to display the photo taken see [Local Files section](https://guide.meteor.com/cordova.html#accessing-local-files) in the Guide and use the `WebAppLocalServer.localFileSystemUrl()` function for convert the `file://` url. 

You can use other options from [Cordova Camera Options](https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-camera/#module_Camera) on Cordova as they get passed on.

#### callback(error, data)

`callback` is a required argument that is a function that takes two arguments:

- `error` A [Meteor.Error](http://docs.meteor.com/#meteor_error) with a platform-specific error message.
- `data` A base64-encoded data URI for the image taken by the camera. This parameter can be used directly in the 'src' attribute of an image tag.


> Warning: In the iOS simulator, the device camera is not accessible, so you will get an error that says "source type 1 not available."
> I'm working on a fallback for iOS that will use the photo library when the camera is not available, but for now just test in your web browser, a physical device, or the Android simulator.

### Localize

Replace these fields before executing `MeteorCamera.getPicture()` like:

```javascript
MeteorCamera.locale.errorBrowserNotSupported = "Sorry, this browser is currently not supported for camera functionality.";
MeteorCamera.locale.errorAccesingCamera = "There was an error accessing the camera.";
MeteorCamera.locale.usePhoto = "Use Photo";
MeteorCamera.locale.takeNewPhoto = "Take New Photo";
MeteorCamera.locale.waitingPermissions = "Waiting for camera permissions...";
MeteorCamera.locale.takePhoto = "Take Photo";
MeteorCamera.locale.cancel = "Cancel";
MeteorCamera.locale.closePopup = "Close Popup";
MeteorCamera.locale.permissionsDenied = "Camera Permissions Denied";
MeteorCamera.locale.permissionsDeniedExp = "You have denied this app permission to use your camera. If you would like to allow permissions, follow the directions for your browser below.";
MeteorCamera.locale.howToChrome = 'Go to Settings > "Show advanced settings..." > "Content settings..." > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.';
MeteorCamera.locale.howToFirefox = "Reload the page and try again.";
MeteorCamera.locale.howToOpera = 'Go to Preferences > Websites > Media heading > "Manage exceptions...", then find this website in the list and allow video capture.';
```

with corresponding translations in your language.

### Runtime permissions

When using camera or any other native mobile phone features in Cordova it is necessary to request permissions at a runtime. In such a case you need to add the cordova diagnostic plugin which manages that.

You can add it with 

```bash
meteor add cordova:cordova.plugins.diagnostic@6.0.3
```

See [their documentations](https://github.com/dpa99c/cordova-diagnostic-plugin#readme) for more details.
