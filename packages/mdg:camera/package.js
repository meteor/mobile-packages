Package.describe({
  name: "mdg:camera",
  summary: "Photos with one function call on desktop and mobile.",
  version: "2.0.0",
  git: "https://github.com/meteor/mobile-packages"
});

Cordova.depends({
  "cordova-plugin-camera": "4.0.3"
});

Package.onUse(function(api) {
  api.export('MeteorCamera');
  api.use(["templating", "session", "ui", "blaze", "less@1.0.0||2.0.0", "reactive-var"]);
  api.versionsFrom("METEOR@1.3");
  api.use("isobuild:cordova@5.2.0");

  api.addFiles('photo.html');
  api.addFiles('photo.js');
  api.addFiles("camera.less", ["web.browser"]);
  api.addFiles('photo-browser.js', ['web.browser']);
  api.addFiles('photo-cordova.js', ['web.cordova']);
});
