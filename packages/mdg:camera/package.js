Package.describe({
  name: "mdg:camera",
  summary: "Photos with one function call on desktop and mobile.",
  version: "1.6.0",
  git: "https://github.com/meteor/mobile-packages"
});

Cordova.depends({
  "cordova-plugin-camera": "2.4.1"
});

Package.onUse(function(api) {
  api.export('MeteorCamera');
  api.use(["templating", "session", "ui", "blaze", "less", "reactive-var"]);
  api.versionsFrom("METEOR@2.3");
  api.use("isobuild:cordova@5.2.0");

  api.addFiles('photo.html');
  api.addFiles('photo.js');
  api.addFiles("camera.less", ["web.browser"]);
  api.addFiles('photo-browser.js', ['web.browser']);
  api.addFiles('photo-cordova.js', ['web.cordova']);
});
