Package.describe({
  name: "mdg:reload-on-resume",
  summary: "On Cordova, only allow the app to reload when the app is resumed.",
  version: '1.0.5',
  git: "https://github.com/meteor/mobile-packages"
});

Package.onUse(function (api) {
  api.versionsFrom("0.9.2");
  api.use(['reactive-var', 'reload'], 'web');

  // Imply so that we can access the Reload export from an app
  api.imply(['reload'], 'web');

  api.addFiles("reload-on-resume.js", 'web.cordova');
  api.addFiles("browser.js", 'web.browser');
});
