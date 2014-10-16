MeteorDialogs.alert = function(message, callback) {
  window.alert(message);
  if (callback && typeof callback == 'function')
    callback();
};

MeteorDialogs.confirm = function(message, callback) {
  if (callback && typeof callback == 'function')
    callback( window.confirm(message)? 1 : 2 );
};

MeteorDialogs.prompt = function(message, callback, title, buttonName, defaultText) {
  if (callback && typeof callback == 'function')
    callback( window.prompt(message) );
};