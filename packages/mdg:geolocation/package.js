Package.describe({
  name: "mdg:geolocation",
  summary: "Provides reactive geolocation on desktop and mobile.",
  version: "1.2.0",
  git: "https://github.com/meteor/mobile-packages"
});

Cordova.depends({
  "cordova-plugin-geolocation": "2.0.0"
});

Package.on_use(function (api) {
  api.use(["reactive-var"]);
  api.versionsFrom("METEOR@1.2");
  api.use("isobuild:cordova@5.4.0");
  api.add_files(["geolocation.js"], "client");
  api.export("Geolocation", "client");
});
