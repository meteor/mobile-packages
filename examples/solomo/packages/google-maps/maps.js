import { Template } from 'meteor/templating';
import { Geolocation } from 'meteor/mdg:geolocation';
import { Tracker } from 'meteor/tracker';

const GoogleMap = function (element) {
  const self = this;

  self.element = element;
  self.markers = {};
  self.selectedMarkerId = null;

  self.infowindow = new google.maps.InfoWindow({ content: "" });
  google.maps.event.addListener(self.infowindow, "closeclick", function () {
    if (self.selectedMarkerId) {
      self.selectedMarkerId.set(null);
    }
  });

  let lat = 0, lng = 0;
  const mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 17
  };
  self.gmap = new google.maps.Map(element, mapOptions);
};

// accepts reactive function that returns {lat: Number, lng: Number}
GoogleMap.prototype.setCenter = function (centerFunc) {
  const self = this;

  if (self.centerComputation) {
    self.centerComputation.stop();
  }

  self.centerComputation = Tracker.autorun(function () {
    const center = centerFunc();

    if (self.selectedMarkerId && self.selectedMarkerId.get()) {
      // marker is currently selected, don't update the center until it's closed
      const markerId = self.selectedMarkerId.get();
      if (self.markers[markerId]) {
        const marker = self.markers[markerId];
        self.gmap.setCenter(marker.getPosition());
      }
      return;
    }

    if (center) {
      const latLng = new google.maps.LatLng(center.lat, center.lng);
      self.gmap.setCenter(latLng);
    }
  });
};

// accepts minimongo cursor
// documents must have field marker: {lat: Number, lng: Number, infoWindowContent: String}
GoogleMap.prototype.setMarkers = function (cursor) {
  const self = this;

  if (self.liveQuery) {
    self.liveQuery.stop();
  }

  self.liveQuery = cursor.observe({
    added: function (doc) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(doc.marker.lat, doc.marker.lng),
        map: self.gmap
      });

      self.markers[doc._id] = marker;

      if (doc.marker.infoWindowContent) {
        marker.infoWindowContent = doc.marker.infoWindowContent;

        google.maps.event.addListener(marker, "click", function () {
          self.selectMarker(doc._id);
        });
      }

      if (self.selectedMarkerId && self.selectedMarkerId.get() === doc._id) {
        self.syncWithSelectedMarkerId(doc._id);
      }
    },
    removed: function (doc) {
      self.markers[doc._id].setMap(null);
      delete markers[doc._id];
    },
    changed: function (doc) {
      self.markers[doc._id].setPosition(
        new google.maps.LatLng(doc.marker.lat, doc.marker.lng));
      marker.infoWindowContent = doc.marker.infoWindowContent;
    }
  });
};

GoogleMap.prototype.showCurrLocationMarker = function () {
  const self = this;

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(0, 0),
    map: self.gmap,
    icon: new google.maps.MarkerImage(icon, null, null, null,
      new google.maps.Size(20, 20))
  });

  Tracker.autorun(function () {
    var latLng = Geolocation.latLng();

    if (latLng) {
      marker.setMap(self.gmap);
      marker.setPosition(new google.maps.LatLng(latLng.lat, latLng.lng));
    }
  });
};

// accepts reactive var
GoogleMap.prototype.bindToSelectedMarkerId = function (selectedMarkerId) {
  const self = this;

  self.selectedMarkerId = selectedMarkerId;

  if (self.selectedMarkerIdComputation) {
    self.selectedMarkerIdComputation.stop();
  }

  self.selectedMarkerIdComputation = Tracker.autorun(function () {
    const markerId = self.selectedMarkerId.get();

    if (markerId) {
      self.syncWithSelectedMarkerId(markerId);
    }
  });
};

GoogleMap.prototype.selectMarker = function (markerId) {
  const self = this;

  if (self.selectedMarkerId) {
    self.selectedMarkerId.set(markerId);
  }
};

GoogleMap.prototype.syncWithSelectedMarkerId = function (markerId) {
  const self = this;

  const marker = self.markers[markerId];
  if (marker) {
    self.infowindow.setContent(marker.infoWindowContent);
    self.infowindow.open(self.gmap, marker);
  }
};

Template.googleMap.rendered = function () {
  var template = this;

  var map = new GoogleMap(template.firstNode);
  var options = template.data;

  if (options.center) {
    map.setCenter(options.center);
  } else if (options.geolocate) {
    map.showCurrLocationMarker();
    map.setCenter(Geolocation.latLng);
  }

  if (options.selectedMarkerId) {
    map.bindToSelectedMarkerId(options.selectedMarkerId);
  }

  map.setMarkers(options.markers);
};
