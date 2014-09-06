Package.describe({
  name: "mdg:reload-on-resume",
  summary: "On Cordova, only allow the app to reload when the app is resumed.",
  version: '1.0.0'
});

Package.on_use(function (api) {
  api.use(['reload', 'reactive-var'], 'web.cordova');
  api.add_files("reload-on-resume.js", 'web.cordova');
  api.add_files("browser.js", 'web.browser');
});