
angular.module('citizen-engagement.map', ['citizen.issues'])

.controller("MapController", function(mapboxMapId, mapboxAccessToken, IssueService, $http, apiUrl, $state, $scope) {
            
            var issueList;
            var top = false;
              
            $scope.allMarkers = function() {

              if (top == true) {
                top = false;
              }else{  
                top = true;
              };
              if (top == true) {
              // récupère toutes les issues dans un objet
              IssueService.getIssues().success(function(data){
                issueList = data;
                angular.forEach(issueList, function(value, key){ 
                  $scope.mapMarkers.push({
                    lat: value.lat,
                    lng: value.lng
                  })
                }); 
              });
              }else{
                pos = $scope.pos; 
                $scope.mapMarkers = []; 
                mypos(pos);
              };  
            };



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
                  zoom: 14,
                };
                $scope.pos = pos;
                mypos(pos);
                
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

            function mypos(pos) {
              var crd = pos.coords;
              $scope.mapMarkers.push({
              lat: crd.latitude,
              lng: crd.longitude,
              icon : {
                iconUrl : "../img/avatar.png",
                iconSize : [20, 20],
                


              }
              });
            };
         
    })