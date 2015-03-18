
angular.module('citizen-engagement.map', [])

.controller("MapController", function(mapboxMapId, mapboxAccessToken, $scope) {
              
              navigator.geolocation.getCurrentPosition(success, error, options);

              var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              };

              function success(pos) {
                var crd = pos.coords;
                  $scope.mapCenter = {
                  lat: crd.latitude,
                  lng: crd.longitude,
                  zoom: 14
                };
              };

              function error(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
              };
               
              var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;

              mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
              $scope.mapDefaults = {
                tileLayer: mapboxTileLayer
              };
              $scope.mapCenter = {
                lat: 51.48,
                lng: 0,
                zoom: 14
              };
              $scope.mapMarkers = [];
    })