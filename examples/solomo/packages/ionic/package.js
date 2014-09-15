Package.describe({
  summary: "Ionic css framework",
  version: "1.0.0",
});

Package.onUse(function(api) {
  api.addFiles('css/ionic.css', 'client');
  api.addFiles('fonts/ionicons.eot', 'client');
  api.addFiles('fonts/ionicons.svg', 'client');
  api.addFiles('fonts/ionicons.ttf', 'client');
  api.addFiles('fonts/ionicons.woff', 'client');
});