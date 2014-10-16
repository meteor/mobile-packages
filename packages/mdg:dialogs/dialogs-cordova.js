MeteorDialogs.alert = function(message, callback, title, buttonName) {
  navigator.notification.alert(message, callback, title, buttonName)
};

MeteorDialogs.confirm = function(message, callback, title, buttonName) {
  navigator.notification.confirm(message, callback, title, buttonName)
};

MeteorDialogs.prompt = function(message, callback, title, buttonName, defaultText) {
  navigator.notification.prompt(message, callback, title, buttonName, defaultText)
};