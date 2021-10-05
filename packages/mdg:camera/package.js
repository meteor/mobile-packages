Package.describe({
  name: "mdg:camera",
  summary: "Photos with one function call on desktop and mobile.",
  version: "1.7.0",
  git: "https://github.com/meteor/mobile-packages"
});

Cordova.depends({
  "cordova-plugin-camera": "6.0.0"
});

Package.onUse(function(api) {

  api.versionsFrom("2.5");
  api.export('MeteorCamera');
  api.use(["templating@1.4.1", "session@1.2.0", "blaze@2.5.0", "less@4.0.0", "reactive-var@1.0.11"]);
  api.use("isobuild:cordova@5.2.0");

  api.addFiles('photo.html');
  api.addFiles('photo.js');
  api.addFiles("camera.less", ["web.browser"]);
  api.addFiles('photo-browser.js', ['web.browser']);
  api.addFiles('photo-cordova.js', ['web.cordova']);
});
