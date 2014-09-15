Package.describe({
  summary: "Embed a reactive google map with markers and infowindows.",
  version: "1.0.0",
});

Package.onUse(function(api) {
  api.use(["templating", "mdg:geolocation"], "client");

  api.export('GoogleMaps', "client");

  api.addFiles(["maps.html", "maps.js", "icon.js"], "client");
});