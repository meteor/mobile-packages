Package.describe({
  name: "mdg:reload-on-resume",
  summary: "On Cordova, only allow the app to reload when the app is resumed.",
  version: '1.0.4',
  git: "https://github.com/meteor/mobile-packages"
});

Package.on_use(function (api) {
  api.versionsFrom("0.9.2");
  api.use(['reactive-var', 'reload'], 'web');

  // Imply so that we can access the Reload export from an app
  api.imply(['reload'], 'web');

  api.add_files("reload-on-resume.js", 'web.cordova');
  api.add_files("browser.js", 'web.browser');
});