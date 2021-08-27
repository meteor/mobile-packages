Package.describe({
  summary: "Ionic css framework",
  version: "1.0.0",
});

Package.onUse(function(api) {
  api.addFiles('css/ionic.css', 'client');
  api.addAssets('fonts/ionicons.eot', 'client');
  api.addAssets('fonts/ionicons.svg', 'client');
  api.addAssets('fonts/ionicons.ttf', 'client');
  api.addAssets('fonts/ionicons.woff', 'client');
});
