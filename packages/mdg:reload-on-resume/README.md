# Meteor reload-on-resume Package

Add it to your [Meteor](http://meteor.com) app with `meteor add mdg:reload-on-resume`. There is no API - this package changes the behavior of Meteor's hot code push feature on mobile devices only.

Normally, your app will update on the user's device as soon as you push a new version. This process is always smooth in a desktop web browser, but might momentarily interrupt the user's experience if they are on a mobile device.

With this package, the app will only update itself to the newest version if the user closes and re-opens the app (hence, it "reloads on resume").