Package.describe({
  summary: "Embed a reactive google map with markers and infowindows.",
  version: "1.0.0",
});

Package.onUse(function(api) {
  api.use(["templating", "mdg:geolocation", "mdg:components@1.0.0-pre.3"], "client");

  api.export('GoogleMaps', "client");

  api.addFiles(["maps.html", "maps.js", "icon.js"], "client");
});