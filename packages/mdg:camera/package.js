Package.describe({
  summary: "Photos with one function call on desktop and mobile.",
  version: "1.0.0",
});

Cordova.depends({
  "org.apache.cordova.camera":"0.3.0"
});

Package.onUse(function(api) {
  api.export('MeteorCamera');
  api.use(["templating", "session", "ui", "blaze", "less"]);
  api.versionsFrom("METEOR@0.9.2-rc0");

  api.addFiles('photo.html');
  api.addFiles('photo.js');
  api.addFiles("camera.less", ["web.browser"]);
  api.addFiles('photo-browser.js', ['web.browser']);
  api.addFiles('photo-cordova.js', ['web.cordova']);
});