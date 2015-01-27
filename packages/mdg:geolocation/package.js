Package.describe({
  name: "mdg:geolocation",
  summary: "Provides reactive geolocation on desktop and mobile.",
  version: "1.0.3",
  git: "https://github.com/meteor/mobile-packages"
});

Cordova.depends({
  "org.apache.cordova.geolocation": "0.3.10"
});

Package.on_use(function (api) {
  api.use(["reactive-var"]);
  api.versionsFrom("METEOR@0.9.2");
  api.add_files(["geolocation.js"], "client");
  api.export("Geolocation", "client");
});
