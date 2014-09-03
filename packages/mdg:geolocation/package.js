Package.describe({
  name: "mdg:geolocation",
  summary: "Provides reactive geolocation on desktop and mobile.",
  version: "1.0.0"
});

Cordova.depends({
  "org.apache.cordova.geolocation": "0.3.9"
});

Package.on_use(function (api) {
  api.use(["tracker"]);
  api.versionsFrom("METEOR@0.9.2-rc0");
  api.add_files(["geolocation.js"], "client");
  api.export("Geolocation", "client");
});