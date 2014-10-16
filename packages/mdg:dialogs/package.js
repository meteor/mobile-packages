Package.describe({
  name: "mdg:dialogs",
  summary: "Dialogs with one function call on desktop and mobile.",
  version: "1.0.0",
  git: "https://github.com/meteor/mobile-packages"
});

Cordova.depends({
  "org.apache.cordova.dialogs":"0.2.8"
});

Package.onUse(function(api) {
  api.export('MeteorDialogs');
  api.versionsFrom("METEOR@0.9.2");

  api.addFiles('dialogs.js');
  api.addFiles('dialogs-browser.js', ['web.browser']);
  api.addFiles('dialogs-cordova.js', ['web.cordova']);
});
